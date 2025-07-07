import { Button, Space, Dropdown, App, Modal } from "antd";
import { DownloadOutlined, SaveOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import useResumeStore from "../../stores/useResumeStore";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Toolbar = ({ onPreview, onSave, onReset }) => {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const resumeRef = useRef(null);
  const { personalInfo } = useResumeStore();

  const handlePreviewWithValidation = () => {
    if (!personalInfo.name) {
      message.warning("Please fill in your personal information first");
      return;
    }
    onPreview();
  };

  const generatePDF = async (canvas) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, imgWidth, imgHeight, 'F');
    pdf.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${personalInfo?.name || 'resume'}.pdf`);
  };

  const getResumeElement = () => {
    return document.querySelector('.resume-preview') || 
           document.querySelector('.preview-content') ||
           document.querySelector('.ats-resume, .modern-template');
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    message.loading({ content: 'Generating PDF...', key: 'pdf', duration: 0 });

    try {
      const element = getResumeElement();
      
      if (!element) throw new Error('No resume content found');

      const clone = element.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '210mm';
      clone.style.height = 'auto';
      clone.style.background = '#fff';
      document.body.appendChild(clone);

      clone.classList.remove('dark-mode');
      clone.style.color = '#000';

      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: true,
        allowTaint: true,
        removeContainer: true
      });

      document.body.removeChild(clone);
      await generatePDF(canvas);
      message.success({ content: 'PDF downloaded!', key: 'pdf' });
    } catch (error) {
      console.error('PDF generation error:', error);
      message.error({
        content: 'Failed to generate PDF: ' + (error.message || 'Please try again.'),
        key: 'pdf',
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  const exportAsJSON = () => {
    const resumeData = useResumeStore.getState();
    const { past, future, ...persistentData } = resumeData;
    const json = JSON.stringify(persistentData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo?.name || 'resume'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('Resume exported as JSON');
  };

  const importResume = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            try { resolve(JSON.parse(event.target.result)); }
            catch (error) { reject(new Error('Invalid JSON file')); }
          };
          reader.onerror = () => reject(new Error('Error reading file'));
          reader.readAsText(file);
        });

        useResumeStore.setState(data);
        message.success('Resume imported successfully');
      } catch (error) {
        message.error(error.message || 'Failed to import resume');
      }
    };
    input.click();
  };

  const menuItems = [
    { key: "export-json", label: "Export as JSON", onClick: exportAsJSON },
    { key: "import", label: "Import Resume", onClick: importResume },
    { type: "divider" },
    {
      key: "reset",
      label: "Reset All",
      danger: true,
      onClick: () => Modal.confirm({
        title: 'Confirm Reset',
        content: 'Are you sure you want to reset all data?',
        onOk: onReset,
      }),
    },
  ];

  return (
    <div className="toolbar-sticky">
      <Space size={16}>
        <Button
          icon={<SaveOutlined />}
          onClick={onSave}
          className="toolbar-button"
        >
          Save Resume
        </Button>
        <Button
          icon={<EyeOutlined />}
          onClick={handlePreviewWithValidation}
          className="toolbar-button"
        >
          Preview
        </Button>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownloadPDF}
          loading={loading}
          className="toolbar-button download-button"
        >
          Download PDF
        </Button>
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button icon={<MoreOutlined />} className="toolbar-button" />
        </Dropdown>
      </Space>
    </div>
  );
};

export default Toolbar;