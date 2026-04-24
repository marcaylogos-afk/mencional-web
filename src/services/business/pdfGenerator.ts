/**
 * 📄 MENCIONAL | PDF_GENERATION_ENGINE v2026.PROD
 * Ubicación: /src/services/business/pdfGenerator.ts
 * Función: Generación de reportes de sesión con branding Mencional y soporte multi-formato.
 */

import { jsPDF } from 'jspdf';
import { logger } from '../../utils/logger';

export interface TranslationToken {
  original: string;
  translated: string;
  timestamp: string;
  isNewTerm?: boolean; // Identifica si generó burbuja visual
}

/**
 * ✅ Motor de Generación de Reportes
 */
export const generatePDF = async (
  data: TranslationToken[], 
  sessionTitle: string = "MENCIONAL_MASTER_REPORT",
  userName: string = "USUARIO_MENCIONAL"
): Promise<boolean> => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('es-MX', { 
      hour: '2-digit', minute: '2-digit' 
    });

    // --- 🎨 ESTILO DE MARCA (MENCIONAL OLED STYLE PARA IMPRESIÓN) ---
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 45, 'F');

    // Título Principal (Turquesa Mencional)
    doc.setTextColor(0, 251, 255); 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("MENCIONAL", 15, 25);

    // Subtítulo de Protocolo
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("ULTRA INTERPRETER REPORT | SELECTIVE_LEARNING_v2.6", 15, 33);

    // Metadata (Lado derecho)
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    const sessionId = Math.random().toString(36).toUpperCase().substring(2, 10);
    doc.text(`ID_SESSION: ${sessionId}`, 150, 20);
    doc.text(`ALUMNO: ${userName.toUpperCase()}`, 150, 25);
    doc.text(`FECHA: ${dateStr}`, 150, 30);
    doc.text(`HORA: ${timeStr}`, 150, 35);

    // --- 📝 CONTENIDO PRINCIPAL: TRANSCRIPCIÓN ---
    let yOffset = 60;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const contentWidth = 180;

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TRANSCRIPCIÓN COMPLETA DE LA SESIÓN", margin, yOffset);
    yOffset += 10;

    data.forEach((item, index) => {
      const header = `[${item.timestamp}] BLOQUE ${(index + 1).toString().padStart(3, '0')}:`;
      const bodyContent = `ORIGINAL: ${item.original}\nTRADUCCIÓN: ${item.translated}`;
      const bodyLines = doc.splitTextToSize(bodyContent, contentWidth);

      const blockHeight = (bodyLines.length * 5) + 12;

      // Salto de página inteligente
      if (yOffset + blockHeight > pageHeight - 30) { 
        doc.addPage(); 
        yOffset = 25; 
      }

      // Dibujar bloque
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(header, margin, yOffset);
      
      yOffset += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(bodyLines, margin, yOffset);

      yOffset += (bodyLines.length * 5) + 5;
      
      // Línea divisoria muy tenue
      doc.setDrawColor(240, 240, 240);
      doc.line(margin, yOffset, 195, yOffset);
      yOffset += 8;
    });

    // --- 🎓 SECCIÓN ESPECIAL: GLOSARIO DE TÉRMINOS NUEVOS ---
    const newTerms = data.filter(item => item.isNewTerm);
    
    if (newTerms.length > 0) {
      doc.addPage();
      yOffset = 25;
      
      doc.setFillColor(245, 255, 255); // Fondo cian muy claro para glosario
      doc.rect(margin - 2, yOffset - 8, 184, 15, 'F');
      
      doc.setTextColor(0, 100, 110);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("GLOSARIO: VOCABULARIO NUEVO ADQUIRIDO", margin, yOffset);
      yOffset += 15;

      newTerms.forEach((term) => {
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(`• ${term.original}:`, margin, yOffset);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        doc.text(` ${term.translated}`, margin + 40, yOffset);
        
        yOffset += 7;
        
        if (yOffset > pageHeight - 20) {
          doc.addPage();
          yOffset = 25;
        }
      });
    }

    // --- 🛡️ PIE DE PÁGINA ---
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(180, 180, 180);
      doc.text(
        `Mencional Protocol v2.6 | Este reporte es una herramienta de estudio personal. Pág. ${i} de ${totalPages}`,
        105, 287, { align: 'center' }
      );
    }

    // Ejecutar descarga
    const fileName = `Mencional_${sessionTitle.replace(/\s+/g, '_')}_${now.getTime()}.pdf`;
    doc.save(fileName);
    
    logger.info("PDF_EXPORT_SUCCESS", `Reporte ${fileName} generado con glosario.`);
    return true;

  } catch (error) {
    logger.error("PDF_EXPORT_FAILURE", "Fallo en motor PDF", error);
    return false;
  }
};

export const pdfGenerator = {
  generateSessionReport: generatePDF
};

export default pdfGenerator;