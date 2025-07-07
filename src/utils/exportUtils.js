import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { Packer } from 'docx';
import { generateDocument } from './docxGenerator.js';

export const exportToPDF = async (resumeData) => {
  const doc = new jsPDF();
  
  // Add content to PDF
  doc.setFontSize(22);
  doc.text(resumeData.personalInfo.name, 105, 30, { align: 'center' });
  doc.setFontSize(16);
  doc.text(resumeData.personalInfo.title, 105, 40, { align: 'center' });
  
  // Add more content based on resume sections...
  
  doc.save(`${resumeData.personalInfo.name}_Resume.pdf`);
};

export const exportToDocx = async (resumeData) => {
  const doc = generateDocument(resumeData);
  const buffer = await Packer.toBuffer(doc);
  saveAs(
    new Blob([buffer]), 
    `${resumeData.personalInfo.name}_Resume.docx`
  );
};

export const exportToJSON = (resumeData) => {
  const json = JSON.stringify(resumeData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, `${resumeData.personalInfo.name}_Resume.json`);
};