import { DatePicker, Form, Input, Button, Space, message } from "antd";
import { useState, useEffect } from "react";
import useResumeStore from "../../stores/useResumeStore";
import moment from "moment"; // Ensure moment.js is installed (npm install moment)

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

  const handleAddExperience = (values) => {
    const { bullets, ...rest } = values;
    const newExperience = {
      ...rest,
      startDate: values.startDate ? values.startDate.format("MM/YYYY") : null,
      endDate: values.endDate ? values.endDate.format("MM/YYYY") : null,
      bullets: bullets ? bullets.split("\n").filter((b) => b.trim()) : [],
      id: Date.now(), // Simple ID generation
    };
    addExperience(newExperience);
    form.resetFields();
  };

  const handleEditExperience = (values) => {
    const { bullets, ...rest } = values;
    const updatedExperience = {
      ...rest,
      startDate: values.startDate ? values.startDate.format("MM/YYYY") : null,
      endDate: values.endDate ? values.endDate.format("MM/YYYY") : null,
      bullets: bullets ? bullets.split("\n").filter((b) => b.trim()) : [],
      id: editingId,
    };
    updateExperience(updatedExperience, experience.findIndex((exp) => exp.id === editingId));
    setEditingId(null);
  };

  const handleGenerateFormDescription = () => {
    setFormLoading(true);
    // Placeholder for AI generation logic
    setTimeout(() => {
      const { company, position } = form.getFieldsValue();
      if (company && position) {
        const description = `Worked at ${company} as ${position} - Developed key skills and contributed to team success.`;
        form.setFieldsValue({ description });
      }
      setFormLoading(false);
    }, 1000);
  };

  const startEditing = (exp) => {
    setEditingId(exp.id);
    editForm.setFieldsValue({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate ? moment(exp.startDate, "MM/YYYY") : null,
      endDate: exp.endDate ? moment(exp.endDate, "MM/YYYY") : null,
      location: exp.location,
      description: exp.description,
      bullets: exp.bullets?.join("\n") || "",
    });
  };

  return (
    <div className="experience-section" style={{ padding: 16 }}>
      {isEditing && (
        <Form
          form={form}
          onFinish={handleAddExperience}
          layout="vertical"
          onValuesChange={(changedValues, allValues) => {
            console.log("Form values changed:", allValues);
            console.log("Button disabled:", !allValues.company || !allValues.position);
          }}
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
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="bullets" label="Bullet Points (one per line)">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Experience
              </Button>
              <Button loading={formLoading} onClick={handleGenerateFormDescription}>
                Generate AI Description
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
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="bullets" label="Bullet Points (one per line)">
            <Input.TextArea rows={4} />
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
      {experience.length === 0 && isEditing && (
        <p>No experiences added. Click "Add Experience" to start.</p>
      )}
      {isEditing &&
        experience.map((exp) => (
          <div key={exp.id} className="experience-entry" style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 8 }}>
            <h4>{exp.company} - {exp.position}</h4>
            <p>{exp.startDate || "No start date"} - {exp.endDate || "Present"}</p>
            <p>Location: {exp.location || "Not specified"}</p>
            <p>{exp.description || "No description provided"}</p>
            <ul>
              {exp.bullets?.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
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