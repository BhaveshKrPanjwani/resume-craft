import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useState, useEffect, useCallback } from "react";

const PDFGenerator = ({ targetRef, fileName = "resume.pdf" }) => {
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const generatePDF = useCallback(async () => {
    if (!isMounted || !targetRef?.current) return;

    setLoading(true);
    message.loading({ content: "Generating PDF...", key: "pdf", duration: 0 });

    try {
      const element = targetRef.current;

      // Clone and prepare for canvas
      const clone = element.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.top = "0";
      clone.style.left = "0";
      clone.style.width = "794px"; // A4 width at 96 DPI
      clone.style.zIndex = "-999";
      document.body.appendChild(clone);

      await new Promise((res) => setTimeout(res, 300));

      const cloneRect = clone.getBoundingClientRect();
      const links = clone.querySelectorAll("a");

      const linkPositions = Array.from(links).map((link) => {
        const rect = link.getBoundingClientRect();
        return {
          url: link.href,
          x: rect.left - cloneRect.left,
          y: rect.top - cloneRect.top,
          width: rect.width,
          height: rect.height
        };
      });

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      document.body.removeChild(clone);

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, 0, imgWidth, imgHeight);

      // Add clickable links
      const scaleX = imgWidth / canvas.width;
      const scaleY = imgHeight / canvas.height;

      linkPositions.forEach(link => {
        if (!link.url) return;

        const x = link.x * scaleX;
        const y = link.y * scaleY;
        const w = link.width * scaleX;
        const h = link.height * scaleY;

        // Optional: Red box for debugging
        // pdf.setDrawColor(255, 0, 0);
        // pdf.rect(x, y, w, h);

        pdf.link(x, y, w, h, { url: link.url });
      });

      pdf.save(fileName);
      message.success({ content: "PDF downloaded!", key: "pdf" });
    } catch (err) {
      console.error("PDF generation failed", err);
      message.error({ content: "PDF generation failed", key: "pdf" });
    } finally {
      setLoading(false);
    }
  }, [targetRef, fileName, isMounted]);

  return (
    <Button
      className="custom-download-button"
      icon={<DownloadOutlined />}
      onClick={generatePDF}
      loading={loading}
      disabled={!targetRef?.current || loading}
    >
      Download PDF
    </Button>
  );
};

export default PDFGenerator;
