
interface LLMResponse {
  content: string;
}

export const getProviderFromModel = (model: string): string => {
  if (model.includes("gpt")) return "openai";
  if (model.includes("claude")) return "anthropic";
  if (model.includes("gemini")) return "gemini";
  if (model.includes("deepseek")) return "deepseek";
  if (model.includes("llama") || model.includes("mistral")) return "ollama";
  return "openrouter";
};

export const getProviderEndpoint = (provider: string, baseUrl?: string): string => {
  switch (provider) {
    case "openai":
      return "https://api.openai.com/v1/chat/completions";
    case "anthropic":
      return "https://api.anthropic.com/v1/messages";
    case "gemini":
      return "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
    case "ollama":
      return baseUrl ? `${baseUrl}/api/chat` : "http://localhost:11434/api/chat";
    default:
      return `https://api.${provider}.com/v1/chat/completions`;
  }
};

export const getRequestHeaders = (provider: string, apiKey: string): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (provider === "anthropic") {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
  } else if (provider === "ollama" && apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  } else if (provider !== "ollama") {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
};

export const getRequestBody = (provider: string, model: string, systemPrompt: string, input: string, temperature: number) => {
  if (provider === "anthropic") {
    return {
      model,
      messages: [{ role: "user", content: input }],
      system: systemPrompt,
      max_tokens: 1000,
    };
  } else if (provider === "ollama") {
    return {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      stream: false,
      options: {
        temperature
      }
    };
  } else {
    return {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      temperature,
    };
  }
};

export const callLLMAPI = async (
  agent: { model: string; systemPrompt: string; temperature: number },
  input: string
): Promise<LLMResponse> => {
  const provider = getProviderFromModel(agent.model);
  
  const savedKeys = localStorage.getItem('apiKeys');
  if (!savedKeys) {
    throw new Error("API keys not found. Please set up your API keys in the API Keys page");
  }

  const apiKeys = JSON.parse(savedKeys);
  let apiKey = apiKeys[provider];
  let baseUrl = localStorage.getItem('ollamaBaseUrl') || 'http://localhost:11434';

  if (provider === 'ollama' && !apiKey) {
    // For Ollama, API key is optional
    console.log('Using Ollama without API key');
  } else if (!apiKey && provider !== 'ollama') {
    throw new Error(`${provider.toUpperCase()} API key not found. Please set up your API key in the API Keys page`);
  }

  const endpoint = getProviderEndpoint(provider, baseUrl);
  const headers = getRequestHeaders(provider, apiKey);
  const body = getRequestBody(provider, agent.model, agent.systemPrompt, input, agent.temperature);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    
    if (provider === "ollama") {
      return { content: data.message?.content || data.response || "No response content" };
    }
    
    const content = provider === "anthropic" 
      ? data.content[0].text 
      : data.choices[0].message.content;

    return { content };
  } catch (error) {
    if (provider === 'ollama') {
      console.error('Ollama error:', error);
      throw new Error(`Failed to connect to Ollama at ${baseUrl}. Please check if Ollama is running and the URL is correct.`);
    }
    throw error;
  }
};

