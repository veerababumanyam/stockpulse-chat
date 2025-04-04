
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

    // Get API keys with detailed error handling
    const { data: apiKeys, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('service, api_key')
      .eq('user_id', user.id);

    if (apiKeyError) {
      console.error('API key fetch error:', apiKeyError);
      throw new Error('Error fetching API keys: ' + apiKeyError.message);
    }

    if (!apiKeys || apiKeys.length === 0) {
      throw new Error('No API keys found. Please add your API keys in the API Keys page.');
    }

    const apiKeyMap = apiKeys.reduce((acc: Record<string, string>, curr) => {
      acc[curr.service] = curr.api_key;
      return acc;
    }, {});

    const fmpKey = apiKeyMap['fmp'];
    const openaiKey = apiKeyMap['openai'];

    if (!fmpKey) {
      throw new Error('FMP API key not found. Please add your API key in the API Keys page.');
    }

    if (fmpKey.startsWith('hf_')) {
      throw new Error('Invalid FMP API key format. Please provide a valid Financial Modeling Prep (FMP) API key, not a Hugging Face key.');
    }

    if (!openaiKey) {
      throw new Error('OpenAI API key not found. Please add your API key in the API Keys page.');
    }

    const body = await req.json();
    if (!body.messages || !Array.isArray(body.messages)) {
      throw new Error('Invalid request format: messages array is required');
    }

    const lastMessage = body.messages[body.messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
      throw new Error('No message content found in the request');
    }

    // Test the FMP API key first
    console.log('Testing FMP API key...');
    const testResponse = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${fmpKey}`);
    const testData = await testResponse.json();

    if (testResponse.status === 401 || testResponse.status === 403) {
      if (testData?.["Error Message"]?.includes("Invalid API KEY")) {
        throw new Error('Invalid FMP API key. Please get a valid key from https://site.financialmodelingprep.com/developer');
      }
      if (testData?.["Error Message"]?.includes("suspended")) {
        throw new Error('Your FMP API key is suspended. Please check your account status at financialmodelingprep.com');
      }
      throw new Error('API key validation failed. Please check your FMP API key.');
    }

    // Fetch stock data from FMP with improved error handling
    console.log('Fetching stock data from FMP...');
    const fmpResponse = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${fmpKey}`);
    
    if (!fmpResponse.ok) {
      const errorData = await fmpResponse.json();
      console.error('FMP API error:', errorData);
      if (errorData?.["Error Message"]?.includes("Exclusive Endpoint")) {
        throw new Error('This endpoint requires a higher FMP subscription tier. Please upgrade your plan at financialmodelingprep.com');
      }
      throw new Error(`Error fetching stock data: ${fmpResponse.status} ${fmpResponse.statusText}`);
    }

    const stockData = await fmpResponse.json();
    console.log('Successfully fetched stock data');

    // Process with OpenAI with improved error handling
    console.log('Sending request to OpenAI...');
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
            content: `Context: ${JSON.stringify(stockData.slice(0, 10))}. Question: ${lastMessage.content}`
          }
        ],
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error('Error processing with OpenAI: ' + (errorData.error?.message || 'Please check your OpenAI API key.'));
    }

    const aiResponse = await openAIResponse.json();
    console.log('Successfully received OpenAI response');
    
    return new Response(JSON.stringify({ role: "assistant", content: aiResponse.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in stock-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
