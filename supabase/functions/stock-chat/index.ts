
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
    // Get messages from request
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages format');
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content) {
      throw new Error('Invalid message content');
    }

    // Set up OpenAI request
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a stock market expert assistant. Provide concise and accurate responses to user questions about stocks and trading.',
          },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    // Set up stream
    const reader = openaiResponse.body!.getReader();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Process the stream
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            await writer.close();
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Stream processing error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
        await writer.close();
      }
    })();

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
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
