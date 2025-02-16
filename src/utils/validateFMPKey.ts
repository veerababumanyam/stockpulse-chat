
export const validateFMPKey = (apiKey: string) => {
  if (!apiKey) {
    throw new Error('FMP API key not found. Please set up your API key in the API Keys page');
  }
  
  if (apiKey.startsWith('hf_')) {
    throw new Error('Invalid API key format. Please provide a valid Financial Modeling Prep (FMP) API key, not a Hugging Face key.');
  }
  
  return true;
};

export const handleFMPError = async (response: Response) => {
  if (!response.ok) {
    const data = await response.json();
    if (response.status === 403 && data?.["Error Message"]?.includes("Exclusive Endpoint")) {
      throw new Error('This feature requires a premium FMP subscription. Please upgrade your plan at financialmodelingprep.com');
    }
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your Financial Modeling Prep API key.');
    }
    throw new Error('Failed to fetch data. Please check your API key status.');
  }
  return response;
};
