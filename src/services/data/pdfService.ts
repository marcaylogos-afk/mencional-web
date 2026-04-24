/**
 * 📄 MENCIONAL | PDF_SERVICE v2026.12
 * Ubicación: /src/services/data/pdfService.ts
 * Función: Generación de minutas técnicas y resúmenes de sesión.
 * Protocolo: Se activa al finalizar la sesión para evitar eco con audio sintetizado.
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { logger } from '../../utils/logger'; // ✅ Ruta verificada

// Interfaz para el registro de logs de la sesión
interface LogEntry {
  original: string;
  translated: string;
  timestamp?: string;
}

/**
 * 🛠️ LÓGICA DE EXPORTACIÓN NOMBRADA
 * Soluciona errores de importación en componentes como InterpreterMode.tsx
 */
export const pdfService = {
  /**
   * 📑 generateSessionSummary
   * Crea un documento PDF con jerarquía visual para conferencias.
   */
  generateSessionSummary: async (logs: LogEntry[], sessionType: string): Promise<boolean> => {
    try {
      if (!logs || logs.length === 0) {
        logger.warn("PDF_SERVICE_EMPTY_LOGS", { sessionType });
        return false;
      }

      const doc = new jsPDF();
      const generationTime = new Date().toLocaleString('es-MX', { 
        timeZone: 'America/Mexico_City' 
      });

      // --- CONFIGURACIÓN DE MARCA MENCIONAL ---
      doc.setFontSize(22);
      doc.setTextColor(0, 251, 255); // Cyan Mencional (#00FBFF)
      doc.setFont('helvetica', 'bold');
      doc.text('MENCIONAL | NEURAL_MINUTA', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'normal');
      doc.text(`PROTOCOLO: ${sessionType.toUpperCase()}`, 14, 30);
      doc.text(`SINCRO_DATA: ${generationTime}`, 14, 35);
      
      doc.setDrawColor(0, 251, 255);
      doc.setLineWidth(0.5);
      doc.line(14, 38, 196, 38);

      // --- GENERACIÓN DE TABLA DE VALIDACIÓN DUAL ---
      autoTable(doc, {
        startY: 45,
        head: [['SOURCE_AUDIO (ORIGINAL)', 'TECHNICAL_REFERENCE (TRADUCCIÓN)']],
        body: logs.map(log => [
          log.original || '---', 
          log.translated || '---'
        ]),
        
        headStyles: { 
          fillColor: [15, 15, 15], 
          textColor: [0, 251, 255], 
          fontStyle: 'bold',
          halign: 'left',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 6,
          valign: 'top',
          textColor: [40, 40, 40]
        },
        alternateRowStyles: { 
          fillColor: [248, 252, 255] 
        },
        columnStyles: {
          0: { cellWidth: 91, fontStyle: 'bold' },
          1: { cellWidth: 91 }
        },
        margin: { top: 45, bottom: 20 },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.setTextColor(150);
          const str = `Página ${data.pageNumber} | MENCIONAL v2026.12 - Entorno Seguro`;
          doc.text(str, 14, doc.internal.pageSize.height - 10);
        }
      });

      // --- CIERRE Y DESCARGA ---
      const fileName = `Mencional_Report_${sessionType}_${Date.now()}.pdf`;
      doc.save(fileName);
      
      logger.info("PDF_REPORT_SAVED", { fileName, entries: logs.length });
      return true;

    } catch (error) {
      logger.error("PDF_SERVICE_ERROR", error);
      throw new Error("No se pudo generar la minuta de la sesión.");
    }
  }
};

// ✅ Exportación por defecto para compatibilidad total con InterpreterMode.tsx
export default pdfService;