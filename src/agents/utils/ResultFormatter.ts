
export class ResultFormatter {
  static formatSection(data: any, fallbackMessage: string): string {
    if (!data || !data.analysis) {
      return `No data available for ${fallbackMessage}`;
    }

    let output = '';
    Object.entries(data.analysis).forEach(([key, value]: [string, any]) => {
      if (Array.isArray(value)) {
        output += `• ${key}:\n${this.formatArrayData(value)}\n`;
      } else if (typeof value === 'object' && value !== null) {
        output += `• ${key}:\n${this.formatObjectData(value)}\n`;
      } else if (value !== undefined && value !== null) {
        output += `• ${key}: ${value}\n`;
      }
    });

    return output || `No detailed data available for ${fallbackMessage}`;
  }

  static formatArrayData(arr: any[]): string {
    if (!arr.length) return '  No data available';
    return arr.map(item => {
      if (typeof item === 'object') {
        return Object.entries(item)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => `  - ${k}: ${v}`)
          .join('\n');
      }
      return `  - ${item}`;
    }).join('\n');
  }

  static formatObjectData(obj: Record<string, any>): string {
    return Object.entries(obj)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `  - ${k}: ${v}`)
      .join('\n');
  }
}
