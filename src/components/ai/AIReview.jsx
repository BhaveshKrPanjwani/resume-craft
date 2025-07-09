import { useState, useEffect } from 'react';
import { Card, Spin, List, Typography, Button } from 'antd';
import useResumeStore from '../../stores/useResumeStore';

const { Title, Text } = Typography;

const AIReview = () => {
  const [loading, setLoading] = useState(false); // Removed analysis state since we're not using it
  const resumeData = useResumeStore(state => state.getResumeData());

  // Removed the useEffect since we're not analyzing anything
  // This is now just a placeholder component

  return (
    <Card title="AI Resume Review" className="ai-review-card">
      {loading ? (
        <Spin tip="Analyzing your resume..." size="large" />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Title level={4}>AI Review Feature Coming Soon</Title>
          <Text type="secondary">
            This feature is currently under development.
          </Text>
          <Button 
            type="primary" 
            style={{ marginTop: 16 }}
            disabled
          >
            Feature Unavailable
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AIReview;