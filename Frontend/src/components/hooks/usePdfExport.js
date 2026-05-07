// hooks/usePdfExport.js
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';

export const usePdfExport = () => {
  const componentRef = useRef(null);

  const handlePrint = async () => {
    if (!componentRef.current) return;
    
    const element = componentRef.current;
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${element.querySelector('h1')?.innerText.replace(/\s/g, '_') || 'report'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    
    // Direct download without print dialog
    html2pdf().set(opt).from(element).save();
  };

  return { componentRef, handlePrint };
};