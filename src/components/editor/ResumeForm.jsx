import { Tabs, message, Collapse } from "antd";
import PersonalInfo from "../sections/PersonalInfo";
import Experience from "../sections/Experience";
import Education from "../sections/Education";
import Skills from "../sections/Skills";
import useResumeStore from "../../stores/useResumeStore";
import SectionAdder from "./SectionAdder.jsx";
import Projects from "../sections/Projects";
import Certifications from "../sections/Certifications";
import Languages from "../sections/Language";
import Achievements from "../sections/Achievements";
import ExtraCurriculars from "../sections/ExtraCurriculars";
import { useEffect } from "react";
import "../../styles/ResumeForm.css";

const ResumeForm = ({ onPreviewToggle }) => {
  const { resetResume, personalInfo } = useResumeStore();
  // Ensure resumeMetadata and removeSection are destructured from useResumeStore
  const { resumeMetadata, removeSection } = useResumeStore();

  const handlePreview = () => {
    if (!personalInfo.name) {
      message.warning("Please fill in your personal information first");
      return;
    }
    onPreviewToggle();
  };

  // This component is correctly defined, but needs to be USED
  const RemovableSection = ({ sectionKey, children }) => {
    // removeSection is already destructured above, no need to re-destructure here if in scope
    // const { removeSection } = useResumeStore(); // No need for this line here if removeSection is passed down or already available

    return (
      <div className="custom-section-wrapper">
        {children}
        <button
          className="delete-section-btn"
          onClick={() => removeSection(sectionKey)}
          aria-label={`Remove ${sectionKey.replace(/_/g, " ")} section`} // Added for accessibility
        >
          Remove
        </button>
      </div>
    );
  };

  const collapseItems = [
    {
      key: "personal",
      label: "Personal Information",
      children: <PersonalInfo isEditing />,
    },
    {
      key: "experience",
      label: "Work Experience",
      children: <Experience isEditing />,
    },
    { key: "education", label: "Education", children: <Education isEditing /> },
    { key: "skills", label: "Skills", children: <Skills isEditing /> },
    { key: "projects", label: "Projects", children: <Projects isEditing /> },
  ];

  useEffect(() => {
    console.log("ResumeForm.jsx: Active panels=", [
      "personal",
      "experience",
      "education",
      "skills",
      "projects",
    ]);
  }, []);

  const tabItems = [
    {
      key: "1",
      label: "Core Sections",
      children: (
        <div className="core-sections" onClick={(e) => e.stopPropagation()}>
          <Collapse
            defaultActiveKey={[
              "personal",
              "experience",
              "education",
              "skills",
              "projects",
            ]}
            items={collapseItems}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Additional Sections",
      children: (
        <div className="additional-sections">
          {/* Group 1: Certifications & Achievements */}
          <div className="section-group">
            <h3>Certifications & Achievements</h3>
            {resumeMetadata.sectionOrder.includes("certifications") && (
              <Certifications isEditing />
            )}
            {resumeMetadata.sectionOrder.includes("achievements") && (
              <Achievements isEditing />
            )}
          </div>

          {/* Group 2: Other / Custom Sections */}
          <div className="section-group">
            <h3>Other Sections</h3>
            {resumeMetadata.sectionOrder.includes("languages") && (
              <Languages isEditing />
            )}
            {resumeMetadata.sectionOrder.includes("extraCurriculars") && (
              <ExtraCurriculars isEditing />
            )}

            {/* CUSTOM SECTIONS: Replaced direct rendering with RemovableSection */}
            {resumeMetadata.sectionOrder
              .filter(
                (key) =>
                  ![
                    "personal",
                    "experience",
                    "education",
                    "skills",
                    "projects",
                    "certifications",
                    "languages",
                    "achievements",
                    "extraCurriculars",
                  ].includes(key)
              )
              .map((key) => (
                // Use the RemovableSection component here
                <RemovableSection key={key} sectionKey={key}>
                  <div
                    className="custom-section-content" // Added a class for styling if needed
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      marginBottom: "15px",
                      borderRadius: "5px",
                    }}
                  >
                    <h4 style={{ margin: 0 }}>{key.replace(/_/g, " ")}</h4>
                    <textarea
                      style={{
                        width: "100%",
                        minHeight: "120px",
                        padding: "12px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        marginTop: "10px",
                        resize: "vertical",
                      }}
                      placeholder={`Enter details for ${key.replace(/_/g, " ")}`}
                    />
                  </div>
                </RemovableSection>
              ))}

            {/* Section Adder Button */}
            <SectionAdder />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="resume-form-container">
      <div className="width-constrainer">
        <div className="resume-editor">
          <div className="editor-content">
            <Tabs defaultActiveKey="1" type="card" items={tabItems} />
            {/* REMOVED DUPLICATE CUSTOM SECTION RENDERING HERE */}
            {/* The custom sections are now rendered ONLY within the "Additional Sections" tab */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;