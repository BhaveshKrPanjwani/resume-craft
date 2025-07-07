import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useState, useEffect, useCallback } from "react";

const PDFGenerator = ({ targetElementId = "resume-preview", fileName = "resume.pdf" }) => {
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const findResumeElement = useCallback(() => {
    return (
      document.getElementById(targetElementId) ||
      document.querySelector(".preview-content") ||
      document.querySelector(".modern-template") ||
      document.querySelector(".ats-resume") ||
      document.querySelector("#printable-content")
    );
  }, [targetElementId]);

  const generatePDF = useCallback(async () => {
    if (!isMounted) return;

    setLoading(true);
    message.loading({ content: "Generating PDF...", key: "pdf", duration: 0 });

    try {
      const element = findResumeElement();
      if (!element) {
        throw new Error("Resume content not found. Please ensure preview is open.");
      }

      // Store and apply print styles
      const originalStyles = {
        position: element.style.position,
        overflow: element.style.overflow,
        width: element.style.width,
        height: element.style.height,
        display: element.style.display,
        visibility: element.style.visibility,
      };

      Object.assign(element.style, {
        position: "absolute",
        left: "0",
        top: "0",
        width: "210mm",
        height: "auto",
        overflow: "visible",
        display: "block",
        visibility: "visible",
        zIndex: 9999,
      });

      // Wait for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capture canvas with higher quality
      const canvas = await html2canvas(element, {
        scale: 2, // Increased for better resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFFFF",
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        logging: true, // Enable logs for debugging
      });

      // Restore original styles
      Object.assign(element.style, originalStyles);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297; // A4 height in mm

      if (imgHeight <= pageHeight) {
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        const totalPages = Math.ceil(imgHeight / pageHeight);
        for (let i = 0; i < totalPages; i++) {
          const srcY = (i * pageHeight) / 2; // Adjust for scale
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            -srcY,
            imgWidth,
            imgHeight,
            undefined,
            "FAST"
          );
          if (i < totalPages - 1) pdf.addPage();
        }
      }

      pdf.save(fileName);
      message.success({ content: "PDF downloaded successfully!", key: "pdf" });
    } catch (error) {
      console.error("PDF generation error:", error);
      message.error({
        content:
          error.message ||
          "Failed to generate PDF. Please try in Chrome or ensure content is visible.",
        key: "pdf",
        duration: 5,
      });
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }, [findResumeElement, fileName, isMounted]);

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={generatePDF}
      loading={loading}
      disabled={loading}
    >
      Download PDF
    </Button>
  );
};

export default PDFGenerator;