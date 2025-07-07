import { Form, Input } from 'antd';
import useResumeStore from '../../stores/useResumeStore';

const PersonalInfo = ({ isEditing }) => {
  const { personalInfo, updatePersonalInfo } = useResumeStore();
  
  const handleChange = (field) => (e) => {
    updatePersonalInfo({ [field]: e.target.value });
  };

  if (!isEditing) {
    return (
      <div className="personal-info">
        <h1>{personalInfo.name}</h1>
        <div className="contact-info">
          <div>{personalInfo.email}</div>
          {personalInfo.linkedin && (
            <div>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          )}
          {personalInfo.github && (
            <div>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Form layout="vertical">
      <Form.Item label="Full Name" required rules={[{ required: true, message: 'Please enter your name' }]}>
        <Input 
          value={personalInfo.name} 
          onChange={handleChange('name')} 
          placeholder="John Doe"
        />
      </Form.Item>
      
      <Form.Item label="Email" required rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
        <Input 
          type="email"
          value={personalInfo.email} 
          onChange={handleChange('email')}
          placeholder="john.doe@example.com"
        />
      </Form.Item>
      
      <Form.Item label="LinkedIn URL (Optional)" help="Include your full profile URL">
        <Input 
          value={personalInfo.linkedin} 
          onChange={handleChange('linkedin')}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </Form.Item>
      
      <Form.Item label="GitHub URL (Optional)" help="Include your full profile URL">
        <Input 
          value={personalInfo.github} 
          onChange={handleChange('github')}
          placeholder="https://github.com/yourusername"
        />
      </Form.Item>
    </Form>
  );
};

export default PersonalInfo;