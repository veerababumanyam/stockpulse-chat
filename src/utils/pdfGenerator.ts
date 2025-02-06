
import html2pdf from 'html2pdf.js';

export const generateAnalysisPDF = async (analysisData: any): Promise<boolean> => {
  if (!analysisData) {
    throw new Error('No analysis data provided');
  }

  console.log('Generating PDF with data:', analysisData);
  
  const content = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #2c3e50; margin-bottom: 20px;">Stock Analysis Report</h1>
      <h2 style="color: #34495e; margin-bottom: 30px;">${analysisData.symbol} - ${analysisData.companyName}</h2>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">Executive Summary</h3>
        <p style="margin-bottom: 10px;"><strong>Recommendation:</strong> ${analysisData.recommendation}</p>
        <p><strong>Confidence Score:</strong> ${analysisData.confidenceScore}%</p>
      </div>

      <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">Price Projections</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #e9ecef;">
            <th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Timeframe</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Projected Price</th>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">3 Months</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">$${analysisData.priceProjections.threeMonths}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">6 Months</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">$${analysisData.priceProjections.sixMonths}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">12 Months</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">$${analysisData.priceProjections.twelveMonths}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">24 Months</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">$${analysisData.priceProjections.twentyFourMonths}</td>
          </tr>
        </table>
      </div>

      ${Object.entries(analysisData.results || {}).map(([key, value]: [string, any]) => {
        if (!value || !value.data) return '';
        return `
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
            <h3 style="color: #2c3e50; margin-bottom: 15px;">${key.charAt(0).toUpperCase() + key.slice(1)} Analysis</h3>
            <div style="white-space: pre-wrap; font-family: monospace; font-size: 14px;">
              ${value.data.analysis ? JSON.stringify(value.data.analysis, null, 2) : 'No analysis data available'}
            </div>
          </div>
        `;
      }).join('')}

      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; font-size: 12px; color: #6c757d;">
        <p>Generated on: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;

  // Create a temporary container
  const container = document.createElement('div');
  container.innerHTML = content;
  document.body.appendChild(container);

  try {
    const worker = html2pdf()
      .from(container)
      .set({
        margin: 10,
        filename: `${analysisData.symbol}_analysis_report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          logging: true,
          useCORS: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      });

    await worker.save();
    console.log('PDF generated successfully');
    document.body.removeChild(container);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    document.body.removeChild(container);
    throw error;
  }
};
