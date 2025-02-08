
export const getRegion = (country: string): string => {
  const regionMap: Record<string, string> = {
    'United States': 'North America',
    'Canada': 'North America',
    'United Kingdom': 'Europe',
    'Germany': 'Europe',
    'France': 'Europe',
    'Japan': 'Asia',
    'China': 'Asia',
    'Australia': 'Asia Pacific'
  };
  return regionMap[country] || 'Other';
};

export const getGeographicBreakdown = (countries: string[]): Record<string, number> => {
  const regions: Record<string, number> = {};
  countries.forEach(country => {
    const region = getRegion(country);
    regions[region] = (regions[region] || 0) + 1;
  });
  return regions;
};

