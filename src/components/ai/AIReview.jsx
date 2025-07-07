import { useState, useEffect } from 'react';
import { Card, Spin, List, Typography, Button } from 'antd';
import { analyzeResume } from '../../utils/aiUtils';
import useResumeStore from '../../stores/useResumeStore';

const { Title, Text } = Typography;

const AIReview = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const resumeData = useResumeStore(state => state.getResumeData());

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const result = await analyzeResume(resumeData);
        setAnalysis(result);
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [resumeData]);

  return (
    <Card title="AI Resume Review" className="ai-review-card">
      {loading ? (
        <Spin tip="Analyzing your resume..." size="large" />
      ) : (
        <>
          <div className="score-section">
            <Title level={2}>Overall Score: {analysis.score}/100</Title>
            <Text type={analysis.score > 80 ? 'success' : analysis.score > 60 ? 'warning' : 'danger'}>
              {analysis.score > 80 ? 'Excellent!' : analysis.score > 60 ? 'Good, but could improve' : 'Needs significant work'}
            </Text>
          </div>
          
          <List
            header={<Title level={4}>Recommendations</Title>}
            bordered
            dataSource={analysis.suggestions}
            renderItem={(item) => (
              <List.Item>
                <Text>{item}</Text>
              </List.Item>
            )}
          />
          
          <Button type="primary" style={{ marginTop: 16 }}>
            Apply Suggestions Automatically
          </Button>
        </>
      )}
    </Card>
  );
};

export default AIReview;