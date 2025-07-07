import { Select, Space, Tag } from 'antd';
import useResumeStore from '../../stores/useResumeStore';
import { Button, Input } from 'antd';
import { PlusOutlined,DeleteOutlined } from '@ant-design/icons';


const { Option } = Select;

const Languages = ({ isEditing = false }) => {
  const { languages, addLanguage, removeLanguage } = useResumeStore();
  
  const proficiencyLevels = [
    'Basic', 'Intermediate', 'Advanced', 'Native'
  ];

  if (!isEditing) {
    return (
      <div className="languages-section">
        <h2>Languages</h2>
        <Space wrap>
          {languages.map((lang) => (
            <Tag key={lang.id}>
              {lang.name} ({lang.proficiency})
            </Tag>
          ))}
        </Space>
      </div>
    );
  }

  return (
    <div className="languages-editor">
      <h2>Languages</h2>
      <div className="languages-list">
        {languages.map((lang) => (
          <div key={lang.id} className="language-item">
            <Space>
              <Input
                value={lang.name}
                onChange={(e) => useResumeStore.getState().updateLanguage(lang.id, { name: e.target.value })}
                placeholder="Language"
              />
              <Select
                value={lang.proficiency}
                onChange={(value) => useResumeStore.getState().updateLanguage(lang.id, { proficiency: value })}
                style={{ width: 150 }}
              >
                {proficiencyLevels.map(level => (
                  <Option key={level} value={level}>{level}</Option>
                ))}
              </Select>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeLanguage(lang.id)}
              />
            </Space>
          </div>
        ))}
      </div>
      <Button 
        type="dashed" 
        icon={<PlusOutlined />}
        onClick={() => addLanguage({
          id: Date.now(),
          name: '',
          proficiency: 'Intermediate'
        })}
        block
      >
        Add Language
      </Button>
    </div>
  );
};

export default Languages;