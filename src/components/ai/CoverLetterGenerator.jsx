import { useState } from 'react';
import { Card, Input, Button, Spin, Typography, message } from 'antd';
import { generateCoverLetter } from '../../utils/aiUtils';
import useResumeStore from '../../stores/useResumeStore';

const { TextArea } = Input;
const { Title } = Typography;

const CoverLetterGenerator = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const resumeData = useResumeStore(state => state.getResumeData());

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      message.warning('Please enter a job description');
      return;
    }

    setLoading(true);
    try {
      const result = await generateCoverLetter(resumeData, jobDescription);
      setLetter(result);
    } catch (error) {
      message.error('Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Cover Letter Generator" className="cover-letter-card">
      <div className="input-section">
        <TextArea
          rows={6}
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <Button 
          type="primary" 
          onClick={handleGenerate}
          loading={loading}
          style={{ marginTop: 16 }}
        >
          Generate Cover Letter
        </Button>
      </div>

      {loading && <Spin tip="Generating cover letter..." />}

      {letter && (
        <div className="result-section" style={{ marginTop: 24 }}>
          <Title level={4}>Generated Cover Letter</Title>
          <div className="letter-content" style={{ whiteSpace: 'pre-line' }}>
            {letter.content}
          </div>
          <Button type="primary" style={{ marginTop: 16 }}>
            Download as DOCX
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CoverLetterGenerator;