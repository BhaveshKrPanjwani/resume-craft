import React from 'react';
import { Button, Input, DatePicker, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import useResumeStore from '../../stores/useResumeStore';
import dayjs from 'dayjs';

const Achievements = ({ isEditing }) => {
  const achievements = useResumeStore(state => state.achievements);
  const addAchievement = useResumeStore(state => state.addAchievement);
  const updateAchievement = useResumeStore(state => state.updateAchievement);
  const removeAchievement = useResumeStore(state => state.removeAchievement);

  const onChangeField = (id, field, value) => {
    updateAchievement(id, { [field]: value });
  };

  return (
    <div>
        <h2>Achievements</h2>
      {achievements.map(({ id, title, date, description }) => (
        
        <Space
          key={id}
          direction="vertical"
          style={{ marginBottom: 16, width: '100%' }}
          size="small"
        >
          <Input
            placeholder="Title"
            value={title}
            disabled={!isEditing}
            onChange={e => onChangeField(id, 'title', e.target.value)}
          />
          <DatePicker
            value={date ? dayjs(date) : null}
            disabled={!isEditing}
            onChange={(dateMoment, dateString) => onChangeField(id, 'date', dateString)}
          />
          <Input.TextArea
            placeholder="Description"
            value={description}
            disabled={!isEditing}
            onChange={e => onChangeField(id, 'description', e.target.value)}
            rows={3}
          />
          {isEditing && (
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => removeAchievement(id)}
            >
              Remove
            </Button>
          )}
        </Space>
      ))}

      {isEditing && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() =>
            addAchievement({
              id: Date.now(),
              title: '',
              date: '',
              description: '',
            })
          }
          block
        >
          Add Achievement
        </Button>
      )}
    </div>
  );
};

export default Achievements;
