
interface LLMResponse {
  content: string;
}

export const getProviderFromModel = (model: string): string => {
  if (model.includes("gpt")) return "openai";
  if (model.includes("claude")) return "anthropic";
  if (model.includes("gemini")) return "gemini";
  if (model.includes("deepseek")) return "deepseek";
  return "openrouter";
};

export const getProviderEndpoint = (provider: string): string => {
  switch (provider) {
    case "openai":
      return "https://api.openai.com/v1/chat/completions";
    case "anthropic":
      return "https://api.anthropic.com/v1/messages";
    case "gemini":
      return "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
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
  } else {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
};

export const getRequestBody = (provider: string, model: string, systemPrompt: string, input: string, temperature: number) => {
  return provider === "anthropic"
    ? {
        model,
        messages: [{ role: "user", content: input }],
        system: systemPrompt,
        max_tokens: 1000,
      }
    : {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input },
        ],
        temperature,
      };
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
  const apiKey = apiKeys[provider];

  if (!apiKey) {
    throw new Error(`${provider.toUpperCase()} API key not found. Please set up your API key in the API Keys page`);
  }

  const endpoint = getProviderEndpoint(provider);
  const headers = getRequestHeaders(provider, apiKey);
  const body = getRequestBody(provider, agent.model, agent.systemPrompt, input, agent.temperature);

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = provider === "anthropic" 
    ? data.content[0].text 
    : data.choices[0].message.content;

  return { content };
};
