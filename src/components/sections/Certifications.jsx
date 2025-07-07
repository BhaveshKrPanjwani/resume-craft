import { Form, Input, DatePicker, Button, Space, Collapse } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useResumeStore from '../../stores/useResumeStore';
import dayjs from 'dayjs'; // Add this import

const Certifications = ({ isEditing = false }) => {
  const { certifications, addCertification, removeCertification } = useResumeStore();

  if (!isEditing) {
    return (
      <div className="certifications-section">
        <h2>Certifications</h2>
        {certifications.map((cert) => (
          <div key={cert.id} className="certification-item">
            <h3>{cert.name}</h3>
            <p>{cert.issuer} • {cert.date}</p>
            {cert.credentialId && <p>Credential ID: {cert.credentialId}</p>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="certifications-editor">
      <h2>Certifications</h2>
      <Button 
        type="dashed" 
        icon={<PlusOutlined />} 
        onClick={() => addCertification({
          id: Date.now(),
          name: '',
          issuer: '',
          date: '',
          credentialId: ''
        })}
        block
      >
        Add Certification
      </Button>
      
      <div className="certifications-list">
        {certifications.map((cert) => (
          <div key={cert.id} className="certification-item">
            <Form layout="vertical">
              <Form.Item label="Certification Name">
                <Input
                  value={cert.name}
                  onChange={(e) => useResumeStore.getState().updateCertification(cert.id, { name: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Issuing Organization">
                <Input
                  value={cert.issuer}
                  onChange={(e) => useResumeStore.getState().updateCertification(cert.id, { issuer: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Date Earned">
                <DatePicker
                  value={cert.date ? dayjs(cert.date) : null}
                  onChange={(date) => useResumeStore.getState().updateCertification(cert.id, { date: date ? date.format('MMM YYYY') : '' })}
                />
              </Form.Item>
              <Form.Item label="Credential ID (Optional)">
                <Input
                  value={cert.credentialId}
                  onChange={(e) => useResumeStore.getState().updateCertification(cert.id, { credentialId: e.target.value })}
                />
              </Form.Item>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeCertification(cert.id)}
              >
                Remove Certification
              </Button>
            </Form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;