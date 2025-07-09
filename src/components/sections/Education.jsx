import { useState, useEffect } from "react";
import { Button, Input, Form, Space, Checkbox, DatePicker, message, Select, Radio } from "antd";
import useResumeStore from "../../stores/useResumeStore";
import { generateAIDescription } from "../../utils/aiDescriptionGenerator";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const { Option } = Select;

const Education = ({ isEditing }) => {
  const { education, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [includeDescription, setIncludeDescription] = useState(false);
  const [loading, setLoading] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [gradeType, setGradeType] = useState('cgpa');

  const degreeOptions = [
    "Intermediate/12th",
    "High School/10th",
    "Diploma",
    "Bachelor's",
    "Master's",
    "PhD",
    "Other"
  ];

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
          gradeValue: eduToEdit.gradeValue,
          gradeType: eduToEdit.gradeType || 'cgpa',
          description: eduToEdit.description || "",
        });
        setIncludeDescription(!!eduToEdit.description);
        setGradeType(eduToEdit.gradeType || 'cgpa');
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
      gradeType: values.gradeType,
      gradeValue: values.gradeValue,
      description: includeDescription ? values.description || "" : "",
    };
    addEducation(newEdu);
    form.resetFields();
    setIncludeDescription(false);
    setGradeType('cgpa');
  };

  const handleEditEducation = async (values) => {
    updateEducation(editingId, {
      institution: values.institution,
      degree: values.degree,
      field: values.field,
      startDate: values.startDate ? values.startDate.format("MM/YYYY") : null,
      endDate: values.endDate ? values.endDate.format("MM/YYYY") : null,
      gradeType: values.gradeType,
      gradeValue: values.gradeValue,
      description: includeDescription ? values.description || "" : "",
    });
    editForm.resetFields();
    setEditingId(null);
    setIncludeDescription(false);
    setGradeType('cgpa');
  };

  const handleGenerateFormDescription = async () => {
    setFormLoading(true);
    const values = form.getFieldsValue();
    if (!values.institution || !values.degree) {
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
            <Select placeholder="Select degree">
              {degreeOptions.map(degree => (
                <Option key={degree} value={degree}>{degree}</Option>
              ))}
            </Select>
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
          
          <Form.Item name="gradeType" label="Grade Type" initialValue="cgpa">
            <Radio.Group onChange={(e) => setGradeType(e.target.value)}>
              <Radio value="cgpa">CGPA</Radio>
              <Radio value="percentage">Percentage</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item 
            name="gradeValue" 
            label={gradeType === 'cgpa' ? 'CGPA' : 'Percentage'} 
            rules={[
              { 
                validator: (_, value) => {
                  if (value && gradeType === 'percentage' && (value < 0 || value > 100)) {
                    return Promise.reject('Percentage must be between 0 and 100');
                  }
                  if (value && gradeType === 'cgpa' && (value < 0 || value > 10)) {
                    return Promise.reject('CGPA must be between 0 and 10');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input type="number" />
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
            <Select placeholder="Select degree">
              {degreeOptions.map(degree => (
                <Option key={degree} value={degree}>{degree}</Option>
              ))}
            </Select>
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
          
          <Form.Item name="gradeType" label="Grade Type">
            <Radio.Group onChange={(e) => setGradeType(e.target.value)}>
              <Radio value="cgpa">CGPA</Radio>
              <Radio value="percentage">Percentage</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item 
            name="gradeValue" 
            label={gradeType === 'cgpa' ? 'CGPA' : 'Percentage'}
          >
            <Input type="number" />
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
              <Button onClick={() => setEditingId(null)}>
                Cancel
              </Button>
              <Button
                loading={loading[editingId]}
                onClick={() => handleGenerateDescription(editingId)}
                disabled={!editForm.getFieldValue("institution") || !editForm.getFieldValue("degree")}
              >
                Generate AI Description
              </Button>
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
          <p>{edu.gradeType === 'percentage' ? 'Percentage' : 'CGPA'}: {edu.gradeValue || "Not specified"}</p>
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