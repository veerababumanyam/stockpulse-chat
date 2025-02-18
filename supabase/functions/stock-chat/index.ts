
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user ID from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Invalid authentication');
    }

    // Get API keys from database
    const { data: apiKeys, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('service, api_key')
      .in('service', ['openai', 'fmp'])
      .eq('user_id', user.id);

    if (apiKeyError) {
      throw new Error('Error fetching API keys: ' + apiKeyError.message);
    }

    const apiKeyMap = apiKeys?.reduce((acc: Record<string, string>, curr) => {
      acc[curr.service] = curr.api_key;
      return acc;
    }, {}) || {};

    const openaiKey = apiKeyMap['openai'];
    const fmpKey = apiKeyMap['fmp'];

    if (!openaiKey) {
      throw new Error('OpenAI API key not found. Please add your API key in the API Keys page');
    }

    if (!fmpKey) {
      throw new Error('FMP API key not found. Please add your API key in the API Keys page');
    }

    // Get the request body
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // Fetch some basic stock data for context
    const stockData = await fetch(
      `https://financialmodelingprep.com/api/v3/stock/list?apikey=${fmpKey}`
    ).then(res => res.json());

    // Create stream transformer
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start OpenAI streaming request
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a stock market expert assistant. Use the provided stock data to answer user questions accurately and concisely.'
          },
          ...messages.slice(0, -1),
          {
            role: 'user',
            content: `Context: ${JSON.stringify(stockData.slice(0, 10))}. Question: ${lastMessage.content}`
          }
        ],
        stream: true,
      }),
    });

    // Handle streaming response
    const reader = openAIResponse.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            await writer.close();
            break;
          }

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                continue;
              }

              try {
                const json = JSON.parse(data);
                const token = json.choices[0]?.delta?.content || '';
                if (token) {
                  await writer.write(encoder.encode(`data: ${JSON.stringify({ content: token })}\n\n`));
                }
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing stream:', error);
        const errorMessage = error instanceof Error ? error.message : 'Stream processing error';
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
        await writer.close();
      }
    };

    // Start processing the stream
    processStream();

    // Return the stream response
    return new Response(stream.readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in stock-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
