
import html2pdf from 'html2pdf.js';

export const generateAnalysisPDF = async (analysisData: any) => {
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #2c3e50;">Stock Analysis Report</h1>
      <h2 style="color: #34495e;">${analysisData.symbol} - ${analysisData.companyName}</h2>
      
      <div style="margin: 20px 0;">
        <h3>Executive Summary</h3>
        <p><strong>Recommendation:</strong> ${analysisData.recommendation}</p>
        <p><strong>Confidence Score:</strong> ${analysisData.confidenceScore}%</p>
      </div>

      <div style="margin: 20px 0;">
        <h3>Price Projections</h3>
        <ul>
          <li>3 Months: $${analysisData.priceProjections.threeMonths}</li>
          <li>6 Months: $${analysisData.priceProjections.sixMonths}</li>
          <li>12 Months: $${analysisData.priceProjections.twelveMonths}</li>
          <li>24 Months: $${analysisData.priceProjections.twentyFourMonths}</li>
        </ul>
      </div>

      ${Object.entries(analysisData.results).map(([key, value]: [string, any]) => `
        <div style="margin: 20px 0; border-top: 1px solid #eee; padding-top: 10px;">
          <h3>${key.charAt(0).toUpperCase() + key.slice(1)} Analysis</h3>
          <pre style="white-space: pre-wrap;">${JSON.stringify(value, null, 2)}</pre>
        </div>
      `).join('')}
    </div>
  `;

  const options = {
    margin: 10,
    filename: `${analysisData.symbol}_analysis_report.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  return html2pdf().from(element).set(options).save();
};
