// components/PrintableReport.jsx
import React, { forwardRef } from 'react';

const PrintableReport = forwardRef(({ title, subtitle, data, columns, summaryStats }, ref) => {
  const reportDate = new Date().toLocaleString();
  
  return (
    <div ref={ref} style={{
      padding: '30px',
      fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
      background: 'white',
      width: '1100px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '5px' }}>{title}</h1>
        <p style={{ fontSize: '12px', color: '#64748b' }}>{subtitle}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px', fontSize: '10px', color: '#94a3b8' }}>
          <span>Generated: {reportDate}</span>
          <span>Total Records: {data.length}</span>
        </div>
      </div>

      {/* Summary Stats Cards */}
      {summaryStats && Object.keys(summaryStats).length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(Object.keys(summaryStats).length, 5)}, 1fr)`,
          gap: '12px',
          marginBottom: '25px'
        }}>
          {Object.entries(summaryStats).map(([key, value]) => (
            <div key={key} style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', marginBottom: '5px' }}>
                {key}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Data Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '10px'
      }}>
        <thead>
          <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{
                padding: '10px 8px',
                textAlign: col.align || 'left',
                fontWeight: 'bold',
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
              {columns.map((col, colIdx) => (
                <td key={colIdx} style={{
                  padding: '8px',
                  textAlign: col.align || 'left',
                  color: '#334155'
                }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div style={{
        marginTop: '25px',
        paddingTop: '12px',
        borderTop: '1px solid #e2e8f0',
        textAlign: 'center',
        fontSize: '8px',
        color: '#94a3b8'
      }}>
        <p>This is an official system generated report</p>
        <p>© {new Date().getFullYear()} Water Management System - All Rights Reserved</p>
      </div>
    </div>
  );
});

PrintableReport.displayName = 'PrintableReport';

export default PrintableReport;