
export const fetchOpenAIModels = async (apiKey: string) => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.data
      .map((model: any) => model.id)
      .filter((modelId: string) => (
        !modelId.includes('instruct') &&
        !modelId.includes('davinci') &&
        !modelId.includes('curie') &&
        !modelId.includes('babbage') &&
        !modelId.includes('ada') &&
        !modelId.includes('embedding') &&
        !modelId.includes('similarity') &&
        !modelId.includes('search') &&
        !modelId.includes('edit') &&
        !modelId.includes('2020') &&
        !modelId.includes('2021') &&
        !modelId.includes('2022')
      ))
      .sort((a: string, b: string) => a.localeCompare(b));
  } catch (error) {
    console.error('Error fetching OpenAI models:', error);
    throw error;
  }
};

export const fetchAnthropicModels = async (apiKey: string) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.models.map((model: any) => model.id).sort();
  } catch (error) {
    console.error('Error fetching Anthropic models:', error);
    throw error;
  }
};

export const fetchOpenRouterModels = async (apiKey: string) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.map((model: any) => model.id).sort();
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    throw error;
  }
};

export const fetchDeepseekModels = async (apiKey: string) => {
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.data.map((model: any) => model.id);
  } catch (error) {
    console.error('Error fetching Deepseek models:', error);
    throw error;
  }
};
