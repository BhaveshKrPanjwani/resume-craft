import { useState, useEffect } from "react";
import { Button, Input, Form, Space, Checkbox, DatePicker, message } from "antd"; // Added DatePicker
import useResumeStore from "../../stores/useResumeStore";
import { generateAIDescription } from "../../utils/aiDescriptionGenerator";
import { v4 as uuidv4 } from "uuid";
import moment from "moment"; // Ensure moment.js is installed (npm install moment)

function Projects({ isEditing }) {
  const { projects, addProject, updateProject, removeProject } = useResumeStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  console.log("Projects.jsx: isEditing=", isEditing, "projects=", projects);

  useEffect(() => {
    if (projects.length > 0) {
      const firstProject = projects[0];
      form.setFieldsValue({
        title: firstProject.title,
        techStack: firstProject.techStack?.join(", ") || "",
        description: firstProject.description || "",
        startDate: firstProject.startDate ? moment(firstProject.startDate, "MM/YYYY") : null,
        endDate: firstProject.endDate ? moment(firstProject.endDate, "MM/YYYY") : null,
      });
    }
  }, [projects, form]);

  const handleAddProject = async (values) => {
    const newProj = {
      id: uuidv4(),
      title: values.title,
      techStack: values.techStack ? values.techStack.split(",").map((s) => s.trim()) : [],
      description: values.description || "",
      startDate: values.startDate ? values.startDate.format("MM/YYYY") : null,
      endDate: values.endDate ? values.endDate.format("MM/YYYY") : null,
    };
    addProject(newProj);
    form.resetFields();
  };

  const handleGenerateFormDescription = async () => {
    setFormLoading(true);
    const values = form.getFieldsValue();
    if (!values.title) {
      console.error("Title is required for AI description");
      message.warning("Title is required for AI description");
      setFormLoading(false);
      return;
    }
    try {
      const description = await generateAIDescription("project", {
        title: values.title,
        techStack: values.techStack ? values.techStack.split(",").map((s) => s.trim()) : [],
      });
      form.setFieldsValue({ description });
    } catch (error) {
      console.error("Failed to generate form description:", error);
      message.error("Failed to generate description");
    }
    setFormLoading(false);
  };

  const handleGenerateDescription = async (id) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    const proj = projects.find((p) => p.id === id);
    if (!proj) {
      console.error("Project not found for id:", id);
      setLoading((prev) => ({ ...prev, [id]: false }));
      return;
    }
    try {
      const description = await generateAIDescription("project", {
        title: proj.title,
        techStack: proj.techStack || [],
      });
      updateProject(id, { description });
    } catch (error) {
      console.error("Failed to generate description:", error);
    }
    setLoading((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="projects-section" style={{ padding: 16 }}>
      <h3>Projects</h3>
      {isEditing && (
        <Form form={form} onFinish={handleAddProject} layout="vertical">
          <h4>Add New Project</h4>
          <Form.Item
            name="title"
            label="Project Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="techStack" label="Tech Stack (comma-separated)">
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
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
               <Button
                type="primary"
                htmlType="submit"
                // size="large" // Matches header button size
                className="custom-save-button"
              >
                Add Project
              </Button>
              <Button
                loading={formLoading}
                onClick={handleGenerateFormDescription}
              >
                Generate AI Description
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
      {projects.length === 0 && isEditing && (
        <p>No projects added. Click "Add Project" to start.</p>
      )}
      {isEditing &&
        projects.map((proj) => (
          <div
            key={proj.id}
            className="project-entry"
            style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 8 }}
          >
            <h4>{proj.title}</h4>
            <p>Tech Stack: {proj.techStack?.join(", ") || "None"}</p>
            <p>{proj.startDate || "No start date"} - {proj.endDate || "Present"}</p>
            <p>{proj.description || "No description provided"}</p>
            <Space>
              <Button
                onClick={() => {
                  form.setFieldsValue({
                    title: proj.title,
                    techStack: proj.techStack?.join(", ") || "",
                    description: proj.description || "",
                    startDate: proj.startDate ? moment(proj.startDate, "MM/YYYY") : null,
                    endDate: proj.endDate ? moment(proj.endDate, "MM/YYYY") : null,
                  });
                }}
                style={{ marginTop: 8 }}
              >
                Edit
              </Button>
              <Button
                danger
                onClick={() => removeProject(proj.id)}
                style={{ marginTop: 8 }}
              >
                Remove
              </Button>
            </Space>
          </div>
        ))}
    </div>
  );
}

export default Projects;