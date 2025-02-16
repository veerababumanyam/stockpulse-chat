
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    // Get API keys
    const { data: apiKeys, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('service, api_key')
      .eq('user_id', user.id);

    if (apiKeyError) {
      throw new Error('Error fetching API keys');
    }

    const apiKeyMap = apiKeys?.reduce((acc: Record<string, string>, curr) => {
      acc[curr.service] = curr.api_key;
      return acc;
    }, {});

    const fmpKey = apiKeyMap?.['fmp'];
    const openaiKey = apiKeyMap?.['openai'];

    if (!fmpKey) {
      throw new Error('FMP API key not found. Please add your API key in the API Keys page.');
    }

    if (!openaiKey) {
      throw new Error('OpenAI API key not found. Please add your API key in the API Keys page.');
    }

    const { message } = await req.json();

    // Fetch stock data from FMP
    const fmpResponse = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${fmpKey}`);
    
    if (!fmpResponse.ok) {
      const errorData = await fmpResponse.json();
      if (errorData?.["Error Message"]?.includes("Invalid API KEY")) {
        throw new Error('Invalid FMP API key. Please check your API key in the API Keys page.');
      }
      throw new Error('Error fetching stock data');
    }

    const stockData = await fmpResponse.json();

    // Process with OpenAI
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
          {
            role: 'user',
            content: `Context: ${JSON.stringify(stockData.slice(0, 10))}. Question: ${message}`
          }
        ],
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error('Error processing with OpenAI. Please check your OpenAI API key.');
    }

    const aiResponse = await openAIResponse.json();
    const answer = aiResponse.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
