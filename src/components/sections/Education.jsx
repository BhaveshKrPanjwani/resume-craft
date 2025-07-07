import { useState, useEffect } from "react";
import { Button, Input, Form, Space, Checkbox, DatePicker, message } from "antd"; // Added DatePicker
import useResumeStore from "../../stores/useResumeStore";
import { generateAIDescription } from "../../utils/aiDescriptionGenerator";
import { v4 as uuidv4 } from "uuid";
import moment from "moment"; // Ensure moment.js is installed (npm install moment)

const Education = ({ isEditing }) => {
  const { education, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [includeDescription, setIncludeDescription] = useState(false);
  const [loading, setLoading] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  console.log("Education.jsx: isEditing=", isEditing, "education=", education, "editingId=", editingId);

  useEffect(() => {
    if (editingId) {
      const eduToEdit = education.find((e) => e.id === editingId);
      if (eduToEdit) {
        editForm.setFieldsValue({
          institution: eduToEdit.institution,
          degree: eduToEdit.degree,
          field: eduToEdit.field,
          startDate: eduToEdit.startDate ? moment(eduToEdit.startDate, "MM/YYYY") : null,
          endDate: eduToEdit.endDate ? moment(eduToEdit.endDate, "MM/YYYY") : null,
          gpa: eduToEdit.gpa,
          description: eduToEdit.description || "",
        });
        setIncludeDescription(!!eduToEdit.description);
      }
    }
  }, [editingId, education, editForm]);

  const handleAddEducation = async (values) => {
  const newEdu = {
    id: uuidv4(),
    institution: values.institution,
    degree: values.degree,
    field: values.field,
    startDate: values.startDate ? values.startDate.format("MM/YYYY") : null,
    endDate: values.endDate ? values.endDate.format("MM/YYYY") : null,
    gpa: values.gpa || null, // Ensure this line is present and correct
    description: includeDescription ? values.description || "" : "",
  };
  addEducation(newEdu);
  form.resetFields();
  setIncludeDescription(false);
};

  const handleEditEducation = async (values) => {
    updateEducation(editingId, {
      institution: values.institution,
      degree: values.degree,
      field: values.field,
      startDate: values.startDate ? values.startDate.format("MM/YYYY") : null,
      endDate: values.endDate ? values.endDate.format("MM/YYYY") : null,
      gpa: values.gpa,
      description: includeDescription ? values.description || "" : "",
    });
    editForm.resetFields();
    setEditingId(null);
    setIncludeDescription(false);
  };

  const handleGenerateFormDescription = async () => {
    setFormLoading(true);
    const values = form.getFieldsValue();
    if (!values.institution || !values.degree) {
      console.error("Institution and degree are required for AI description");
      message.warning("Institution and degree are required for AI description");
      setFormLoading(false);
      return;
    }
    try {
      const description = await generateAIDescription("education", {
        institution: values.institution,
        degree: values.degree,
        field: values.field || "",
      });
      form.setFieldsValue({ description });
      setIncludeDescription(true);
    } catch (error) {
      console.error("Failed to generate form description:", error);
      message.error("Failed to generate description");
    }
    setFormLoading(false);
  };

  const handleGenerateDescription = async (id) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    const edu = education.find((e) => e.id === id);
    if (!edu) {
      console.error("Education not found for id:", id);
      setLoading((prev) => ({ ...prev, [id]: false }));
      return;
    }
    try {
      const description = await generateAIDescription("education", {
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field || "",
      });
      updateEducation(id, { description });
    } catch (error) {
      console.error("Failed to generate description:", error);
    }
    setLoading((prev) => ({ ...prev, [id]: false }));
  };

  const startEditing = (edu) => {
    setEditingId(edu.id);
    editForm.setFieldsValue(edu);
    setIncludeDescription(!!edu.description);
  };

  return (
    <div className="education-section" style={{ padding: 16 }}>
      {isEditing && (
        <Form form={form} onFinish={handleAddEducation} layout="vertical">
          <h4>Add New Education</h4>
          <Form.Item name="institution" label="Institution" rules={[{ required: true, message: "Institution is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="degree" label="Degree" rules={[{ required: true, message: "Degree is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="field" label="Field of Study">
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
          <Form.Item name="gpa" label="CGPA">
            <Input />
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={includeDescription}
              onChange={(e) => setIncludeDescription(e.target.checked)}
            >
              Include Description
            </Checkbox>
          </Form.Item>
          {includeDescription && (
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
          )}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Education
              </Button>
              <Button
                loading={formLoading}
                onClick={handleGenerateFormDescription}
                disabled={!form.getFieldValue("institution") || !form.getFieldValue("degree")}
              >
                Generate AI Description
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      {editingId && isEditing && (
        <Form form={editForm} onFinish={handleEditEducation} layout="vertical">
          <h4>Edit Education</h4>
          <Form.Item name="institution" label="Institution" rules={[{ required: true, message: "Institution is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="degree" label="Degree" rules={[{ required: true, message: "Degree is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="field" label="Field of Study">
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
          <Form.Item name="gpa" label="CGPA">
            <Input />
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={includeDescription}
              onChange={(e) => setIncludeDescription(e.target.checked)}
            >
              Include Description
            </Checkbox>
          </Form.Item>
          {includeDescription && (
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
          )}
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

      {education.length === 0 && isEditing && (
        <p>No education entries added. Click "Add Education" to start.</p>
      )}
      {education.map((edu) => (
        <div key={edu.id} className="education-entry" style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 8 }}>
          <h4>{edu.institution} - {edu.degree}</h4>
          <p>{edu.field || "No field specified"}</p>
          <p>{edu.startDate || "No start date"} - {edu.endDate || "Present"}</p>
          <p>CGPA: {edu.gpa || "Not specified"}</p>
          <p>{edu.description || "No description provided"}</p>
          {isEditing && (
            <Space>
              <Button onClick={() => startEditing(edu)} style={{ marginTop: 8 }}>
                Edit
              </Button>
              <Button danger onClick={() => removeEducation(edu.id)} style={{ marginTop: 8 }}>
                Remove
              </Button>
            </Space>
          )}
        </div>
      ))}
    </div>
  );
};

export default Education;