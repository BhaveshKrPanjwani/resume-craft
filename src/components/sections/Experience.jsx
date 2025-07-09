import { DatePicker, Form, Input, Button, Space, message } from "antd";
import { useState, useEffect } from "react";
import useResumeStore from "../../stores/useResumeStore";
import moment from "moment";

const Experience = ({ isEditing }) => {
  const { experience, addExperience, updateExperience, removeExperience } = useResumeStore();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (editingId) {
      const expToEdit = experience.find((exp) => exp.id === editingId);
      if (expToEdit) {
        editForm.setFieldsValue({
          company: expToEdit.company,
          position: expToEdit.position,
          startDate: expToEdit.startDate ? moment(expToEdit.startDate, "MM/YYYY") : null,
          endDate: expToEdit.endDate ? moment(expToEdit.endDate, "MM/YYYY") : null,
          location: expToEdit.location,
          description: expToEdit.description,
          bullets: expToEdit.bullets?.join("\n") || "",
        });
      }
    }
  }, [editingId, experience, editForm]);

  const formatDescriptionToBullets = (description) => {
    if (!description) return [];
    
    // If already has bullet points
    if (description.includes('•')) {
      return description
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => line.trim().slice(1).trim());
    }
    
    // If plain text with newlines
    if (description.includes('\n')) {
      return description.split('\n').filter(line => line.trim());
    }
    
    // Single line of text
    return [description];
  };

  const handleAddExperience = (values) => {
    const { bullets, description, ...rest } = values;
    const formattedBullets = [
      ...formatDescriptionToBullets(description),
      ...(bullets ? bullets.split("\n").filter((b) => b.trim()) : [])
    ];
    
    const newExperience = {
      ...rest,
      startDate: values.startDate ? values.startDate.format("MM/YYYY") : null,
      endDate: values.endDate ? values.endDate.format("MM/YYYY") : null,
      bullets: formattedBullets,
      description: null, // We'll only use bullets now
      id: Date.now(),
    };
    addExperience(newExperience);
    form.resetFields();
  };

  const handleEditExperience = (values) => {
    const { bullets, description, ...rest } = values;
    const formattedBullets = [
      ...formatDescriptionToBullets(description),
      ...(bullets ? bullets.split("\n").filter((b) => b.trim()) : [])
    ];
    
    const updatedExperience = {
      ...rest,
      startDate: values.startDate ? values.startDate.format("MM/YYYY") : null,
      endDate: values.endDate ? values.endDate.format("MM/YYYY") : null,
      bullets: formattedBullets,
      description: null, // We'll only use bullets now
      id: editingId,
    };
    updateExperience(updatedExperience, experience.findIndex((exp) => exp.id === editingId));
    setEditingId(null);
  };

  const handleGenerateFormDescription = async () => {
    setFormLoading(true);
    try {
      const { company, position } = form.getFieldsValue();
      if (company && position) {
        // This would be your actual API call
        const generatedBullets = [
          `• Worked as ${position} at ${company}, contributing to team success`,
          `• Developed key skills in [specific area] that improved [specific metric]`,
          `• Collaborated with cross-functional teams to deliver [specific achievement]`
        ];
        form.setFieldsValue({ 
          description: generatedBullets.join('\n'),
          bullets: '' // Clear any existing bullets
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const startEditing = (exp) => {
    setEditingId(exp.id);
    editForm.setFieldsValue({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate ? moment(exp.startDate, "MM/YYYY") : null,
      endDate: exp.endDate ? moment(exp.endDate, "MM/YYYY") : null,
      location: exp.location,
      description: exp.bullets?.map(b => `• ${b}`).join('\n') || "",
      bullets: "",
    });
  };

  const renderBulletPoints = (bullets) => {
    if (!bullets || bullets.length === 0) return null;
    
    return (
      <ul style={{ marginBottom: 0 }}>
        {bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="experience-section" style={{ padding: 16 }}>
      {isEditing && (
        <Form
          form={form}
          onFinish={handleAddExperience}
          layout="vertical"
        >
          <h4>Add New Experience</h4>
          <Form.Item name="company" label="Company" rules={[{ required: true, message: "Company is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Position" rules={[{ required: true, message: "Position is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date">
            <DatePicker
              picker="month"
              format="MM/YYYY"
              placeholder="Select Month/Year"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="endDate" label="End Date">
            <DatePicker
              picker="month"
              format="MM/YYYY"
              placeholder="Select Month/Year"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description (will be converted to bullet points)">
            <Input.TextArea rows={3} placeholder="Enter description or bullet points (start with •)" />
          </Form.Item>
          <Form.Item name="bullets" label="Additional Bullet Points (one per line)">
            <Input.TextArea rows={4} placeholder="Enter additional bullet points (one per line)" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Experience
              </Button>
              <Button loading={formLoading} onClick={handleGenerateFormDescription}>
                Generate AI Bullet Points
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      {editingId && isEditing && (
        <Form form={editForm} onFinish={handleEditExperience} layout="vertical">
          <h4>Edit Experience</h4>
          <Form.Item name="company" label="Company" rules={[{ required: true, message: "Company is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Position" rules={[{ required: true, message: "Position is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date">
            <DatePicker
              picker="month"
              format="MM/YYYY"
              placeholder="Select Month/Year"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="endDate" label="End Date">
            <DatePicker
              picker="month"
              format="MM/YYYY"
              placeholder="Select Month/Year"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description (will be converted to bullet points)">
            <Input.TextArea rows={3} placeholder="Enter description or bullet points (start with •)" />
          </Form.Item>
          <Form.Item name="bullets" label="Additional Bullet Points (one per line)">
            <Input.TextArea rows={4} placeholder="Enter additional bullet points (one per line)" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
              <Button onClick={() => setEditingId(null)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      {/* View Mode (non-editing) */}
      {!isEditing && experience.length > 0 && (
        <div className="experience-view-mode">
          <h3>Work Experience</h3>
          {experience.map((exp) => (
            <div key={exp.id} className="experience-entry" style={{ marginBottom: 16 }}>
              <h4>{exp.company} - {exp.position}</h4>
              <p>{exp.startDate || "No start date"} - {exp.endDate || "Present"}</p>
              {exp.location && <p>Location: {exp.location}</p>}
              {renderBulletPoints(exp.bullets)}
            </div>
          ))}
        </div>
      )}

      {/* Edit Mode Experience List */}
      {isEditing && experience.length === 0 && (
        <p>No experiences added. Click "Add Experience" to start.</p>
      )}
      {isEditing &&
        experience.map((exp) => (
          <div key={exp.id} className="experience-entry" style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 8 }}>
            <h4>{exp.company} - {exp.position}</h4>
            <p>{exp.startDate || "No start date"} - {exp.endDate || "Present"}</p>
            {exp.location && <p>Location: {exp.location}</p>}
            {renderBulletPoints(exp.bullets)}
            <Space>
              <Button onClick={() => startEditing(exp)} style={{ marginTop: 8 }}>
                Edit
              </Button>
              <Button danger onClick={() => removeExperience(exp.id)} style={{ marginTop: 8 }}>
                Remove
              </Button>
            </Space>
          </div>
        ))}
    </div>
  );
};

export default Experience;