import { useReactToPrint } from 'react-to-print';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';

const DownloadButton = ({ targetRef, fileName = 'resume.pdf' }) => {
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handlePrint = useReactToPrint({
    content: () => {
      if (!isMounted || !targetRef?.current) {
        message.error('Resume content not ready. Please try again.');
        return null;
      }
      return targetRef.current;
    },
    documentTitle: fileName.replace('.pdf', ''),
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        margin: 0;
        padding: 0;
        background: white !important;
      }
      .ats-resume, .modern-template {
        width: 210mm !important;
        min-height: 297mm !important;
        padding: 15mm !important;
        box-shadow: none !important;
      }
      .no-print {
        display: none !important;
      }
    `,
    onBeforeGetContent: () => {
      setLoading(true);
      return new Promise((resolve) => {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          message.loading({ content: 'Preparing PDF...', key: 'pdf', duration: 0 });
          resolve();
        }, 300);
      });
    },
    onAfterPrint: () => {
      if (isMounted) {
        setLoading(false);
        message.success({ content: 'PDF downloaded!', key: 'pdf' });
      }
    },
    onPrintError: (error) => {
      if (isMounted) {
        setLoading(false);
        console.error('Print error:', error);
        message.error({
          content: 'Failed to generate PDF. Please try in Chrome browser.',
          key: 'pdf',
          duration: 5,
        });
      }
    },
    removeAfterPrint: false,
  });

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={handlePrint}
      loading={loading}
      disabled={!targetRef?.current || loading}
    >
      Download PDF
    </Button>
  );
};

export default DownloadButton;