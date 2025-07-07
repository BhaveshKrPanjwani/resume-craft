import React from 'react';
import { Button, Input, DatePicker, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import useResumeStore from '../../stores/useResumeStore';
import dayjs from 'dayjs';

const ExtraCurriculars = ({ isEditing }) => {
  const extraCurriculars = useResumeStore(state => state.extraCurriculars);
  const addExtraCurricular = useResumeStore(state => state.addExtraCurricular);
  const updateExtraCurricular = useResumeStore(state => state.updateExtraCurricular);
  const removeExtraCurricular = useResumeStore(state => state.removeExtraCurricular);

  const onChangeField = (id, field, value) => {
    updateExtraCurricular(id, { [field]: value });
  };

  return (
    <div>
      {extraCurriculars.map(({ id, title, date, description }) => (
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
              onClick={() => removeExtraCurricular(id)}
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
            addExtraCurricular({
              id: Date.now(),
              title: '',
              date: '',
              description: '',
            })
          }
          block
        >
          Add Extra-Curricular
        </Button>
      )}
    </div>
  );
};

export default ExtraCurriculars;
