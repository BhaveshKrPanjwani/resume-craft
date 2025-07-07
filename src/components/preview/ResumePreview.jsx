import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useResumeStore from "../../stores/useResumeStore";
import PDFGenerator from "./PDFGenerator";
import { useEffect, useState, useRef } from "react";
import "../../styles/ats-resume.css";
import { useNavigate } from "react-router-dom";

const ResumePreview = ({ onBack }) => {
  const [state, setState] = useState(useResumeStore.getState());
  const resumeRef = useRef(null);
  const navigate = useNavigate();
  const {
    personalInfo = {},
    experience = [],
    education = [],
    projects = [],
    languages = [],
    certifications = [],
    achievements = [],
    extraCurriculars = [],
    skills = { frameworks: [], languages: [], tools: [] },
    resumeMetadata = { template: "basic" },
  } = state;

  useEffect(() => {
    console.log("Subscribing to store in ResumePreview");
    const unsubscribe = useResumeStore.subscribe(
      (newState) => {
        console.log("Store updated in Preview:", newState);
        setState(newState);
      },
      (state) => state
    );
    return () => {
      console.log("Unsubscribing from store in ResumePreview");
      unsubscribe();
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const ModernTemplate = () => {
    const hasLowCGPA = education.some((edu) => {
      const gpa = parseFloat(edu.gpa);
      return !isNaN(gpa) && gpa < 8.5;
    });

    return (
      <div className="modern-template" ref={resumeRef}>
        <header className="modern-header">
          <h1>{personalInfo.name || "YOUR NAME"}</h1>
          <div className="contact-info">
            {[
              personalInfo.email,
              personalInfo.phone,
              personalInfo.address,
              personalInfo.linkedin && (
                <a
                  key="linkedin"
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              ),
              personalInfo.github && (
                <a
                  key="github"
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              ),
            ]
              .filter(Boolean)
              .map((item, index, array) => (
                <span key={index}>
                  {item}
                  {index < array.length - 1 && " | "}
                </span>
              ))}
          </div>
        </header>

        {experience.length > 0 && (
          <section className="modern-section">
            <h2>EXPERIENCE</h2>
            {experience.map((exp, index) => (
              <div className="experience-item" key={exp.id || `exp-${index}`}>
                <div className="item-content">
                  {exp.company && <p><strong>{exp.company}</strong></p>}
                  {exp.position && <p>{exp.position}</p>}
                  {exp.location && <p>{exp.location}</p>}
                  {exp.description && (
                    <ul className="bullet-list">
                      {exp.description
                        .split("\n")
                        .filter((line) => line.trim().startsWith("•"))
                        .map((bullet, i) => (
                          <li key={`exp-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                        ))}
                    </ul>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="bullet-list">
                      {exp.bullets.map((bullet, i) => (
                        <li key={`exp-bullet-${i}`}>{bullet.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {(exp.startDate || exp.endDate || exp.current) && (
                  <p className="date-rhs"><strong>
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </strong></p>
                )}
              </div>
            ))}
          </section>
        )}

        {!hasLowCGPA && education.length > 0 && (
          <section className="modern-section">
            <h2>EDUCATION</h2>
            {education.map((edu, index) => (
              <div className="education-item" key={edu.id || `edu-${index}`}>
                <div className="item-content">
                  {edu.institution && <p><strong>{edu.institution}</strong></p>}
                  {edu.degree && <p>{edu.degree}</p>}
                  {edu.gpa && <p><strong>CGPA:</strong> {edu.gpa}/10</p>}
                  {edu.description && (
                    <ul className="bullet-list">
                      {edu.description
                        .split("\n")
                        .filter((line) => line.trim().startsWith("•"))
                        .map((bullet, i) => (
                          <li key={`edu-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                        ))}
                    </ul>
                  )}
                  {edu.bullets && edu.bullets.length > 0 && (
                    <ul className="bullet-list">
                      {edu.bullets.map((bullet, i) => (
                        <li key={`edu-bullet-${i}`}>{bullet.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {(edu.startDate || edu.endDate || edu.current) && (
                  <p className="date-rhs"><strong>
                    {formatDate(edu.startDate)} –{" "}
                    {edu.current ? "Present" : formatDate(edu.endDate)}
                  </strong></p>
                )}
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section className="modern-section">
            <h2>PROJECTS</h2>
            {projects.map((proj, index) => (
              <div className="project-item" key={proj.id || `proj-${index}`}>
                <div className="item-content">
                  {proj.title && <p><strong>{proj.title}</strong></p>}
                  {proj.techStack && proj.techStack.length > 0 && <p>{proj.techStack.join(", ")}</p>}
                  {proj.description && (
                    <ul className="bullet-list">
                      {proj.description
                        .split("\n")
                        .filter((line) => line.trim().startsWith("•"))
                        .map((bullet, i) => (
                          <li key={`proj-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                        ))}
                    </ul>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="bullet-list">
                      {proj.bullets.map((bullet, i) => (
                        <li key={`proj-bullet-${i}`}>{bullet.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {(proj.startDate || proj.endDate || proj.current) && (
                  <p className="date-rhs"><strong>
                    {proj.startDate ? formatDate(proj.startDate) : ""} –{" "}
                    {proj.current ? "Present" : proj.endDate ? formatDate(proj.endDate) : ""}
                  </strong></p>
                )}
              </div>
            ))}
          </section>
        )}

        {hasLowCGPA && education.length > 0 && (
          <section className="modern-section">
            <h2>EDUCATION</h2>
            {education.map((edu, index) => (
              <div className="education-item" key={edu.id || `edu-${index}`}>
                <div className="item-content">
                  {edu.institution && <p><strong>{edu.institution}</strong></p>}
                  {edu.degree && <p>{edu.degree}</p>}
                  {edu.gpa && <p><strong>CGPA:</strong> {edu.gpa}/10</p>}
                  {edu.description && (
                    <ul className="bullet-list">
                      {edu.description
                        .split("\n")
                        .filter((line) => line.trim().startsWith("•"))
                        .map((bullet, i) => (
                          <li key={`edu-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                        ))}
                    </ul>
                  )}
                  {edu.bullets && edu.bullets.length > 0 && (
                    <ul className="bullet-list">
                      {edu.bullets.map((bullet, i) => (
                        <li key={`edu-bullet-${i}`}>{bullet.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {(edu.startDate || edu.endDate || edu.current) && (
                  <p className="date-rhs"><strong>
                    {formatDate(edu.startDate)} –{" "}
                    {edu.current ? "Present" : formatDate(edu.endDate)}
                  </strong></p>
                )}
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section className="modern-section">
            <h2>CERTIFICATIONS</h2>
            {certifications.map((cert, index) => (
              <div key={cert.id || `cert-${index}`}>
                <div className="item-content">
                  {cert.name && <p><strong>{cert.name}</strong></p>}
                  {(cert.issuer || cert.date) && (
                    <p>
                      {cert.issuer || "Issuing Organization"} •{" "}
                      {cert.date || "Date"}
                    </p>
                  )}
                  {cert.credentialId && <p>Credential ID: {cert.credentialId}</p>}
                  {cert.description && (
                    <ul className="bullet-list">
                      {cert.description
                        .split("\n")
                        .filter((line) => line.trim().startsWith("•"))
                        .map((bullet, i) => (
                          <li key={`cert-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                        ))}
                    </ul>
                  )}
                  {cert.bullets && cert.bullets.length > 0 && (
                    <ul className="bullet-list">
                      {cert.bullets.map((bullet, i) => (
                        <li key={`cert-bullet-${i}`}>{bullet.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {cert.date && <p className="date-rhs"><strong>{cert.date}</strong></p>}
              </div>
            ))}
          </section>
        )}

        {achievements.length > 0 && (
          <section className="modern-section">
            <h2>ACHIEVEMENTS</h2>
            {achievements.map((achievement, index) => (
              <div key={achievement.id || `ach-${index}`}>
                <div className="item-content">
                  {achievement.title && <p><strong>{achievement.title}</strong></p>}
                  {achievement.description && (
                    <ul className="bullet-list">
                      {achievement.description
                        .split("\n")
                        .filter((line) => line.trim().startsWith("•"))
                        .map((bullet, i) => (
                          <li key={`ach-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                        ))}
                    </ul>
                  )}
                  {achievement.bullets && achievement.bullets.length > 0 && (
                    <ul className="bullet-list">
                      {achievement.bullets.map((bullet, i) => (
                        <li key={`ach-bullet-${i}`}>{bullet.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {achievement.date && <p className="date-rhs"><strong>{achievement.date}</strong></p>}
              </div>
            ))}
          </section>
        )}

        {Object.values(skills).flat().length > 0 && (
          <section className="modern-section">
            <h2>SKILLS</h2>
            <div className="skills-container">
              {skills.frameworks.length > 0 && (
                <div className="skill-category">
                  <strong>Frameworks:</strong>{" "}
                  {skills.frameworks.map((s) => s.name).join(", ")}
                </div>
              )}
              {skills.languages.length > 0 && (
                <div className="skill-category">
                  <strong>Languages:</strong>{" "}
                  {skills.languages.map((s) => s.name).join(", ")}
                </div>
              )}
              {skills.tools.length > 0 && (
                <div className="skill-category">
                  <strong>Tools:</strong>{" "}
                  {skills.tools.map((s) => s.name).join(", ")}
                </div>
              )}
            </div>
          </section>
        )}

        {(languages.length > 0 || extraCurriculars.length > 0) && (
          <section className="modern-section">
            <h2>OTHERS</h2>
            {languages.length > 0 && (
              <div className="languages-item">
                <p><strong>Languages:</strong></p>
                {languages.map((lang) => (
                  <p key={lang.id || Math.random()}>
                    {lang.name && `${lang.name} (${lang.proficiency || "Proficiency"})`}
                  </p>
                ))}
              </div>
            )}
            {extraCurriculars.length > 0 && (
              <div className="extraCurriculars-item">
                <p><strong>Extracurricular Activities:</strong></p>
                {extraCurriculars.map((activity) => (
                  <div key={activity.id || `act-${index}`}>
                    <div className="item-content">
                      {activity.title && <p>{activity.title}</p>}
                      {activity.description && (
                        <ul className="bullet-list">
                          {activity.description
                            .split("\n")
                            .filter((line) => line.trim().startsWith("•"))
                            .map((bullet, i) => (
                              <li key={`act-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                            ))}
                        </ul>
                      )}
                      {activity.bullets && activity.bullets.length > 0 && (
                        <ul className="bullet-list">
                          {activity.bullets.map((bullet, i) => (
                            <li key={`act-bullet-${i}`}>{bullet.trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {(activity.startDate || activity.endDate || activity.current) && (
                      <p className="date-rhs"><strong>
                        {formatDate(activity.startDate)} –{" "}
                        {activity.current ? "Present" : formatDate(activity.endDate)}
                      </strong></p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    );
  };

  const BasicTemplate = () => (
    <div className="ats-resume" ref={resumeRef}>
      <div className="resume-header">
        <h1>{personalInfo.name || "YOUR NAME"}</h1>
        <div className="contact-info">
          {[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.address,
            personalInfo.linkedin && (
              <a
                key="linkedin"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            ),
            personalInfo.github && (
              <a
                key="github"
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            ),
          ]
            .filter(Boolean)
            .map((item, index, array) => (
              <span key={index}>
                {item}
                {index < array.length - 1 && " | "}
              </span>
            ))}
        </div>
      </div>

      {experience.length > 0 && (
        <div className="resume-section">
          <h2>EXPERIENCE</h2>
          {experience.map((exp) => (
            <div className="experience-item" key={exp.id || Math.random()}>
              <div className="item-content">
                {exp.company && <p><strong>{exp.company}</strong></p>}
                {exp.position && <p>{exp.position}</p>}
                {exp.location && <p>{exp.location}</p>}
                {exp.description && (
                  <ul className="bullet-list">
                    {exp.description
                      .split("\n")
                      .filter((line) => line.trim().startsWith("•"))
                      .map((bullet, i) => (
                        <li key={`exp-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                      ))}
                  </ul>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="bullet-list">
                    {exp.bullets.map((bullet, i) => (
                      <li key={`exp-bullet-${i}`}>{bullet.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
              {(exp.startDate || exp.endDate || exp.current) && (
                <p className="date-rhs"><strong>
                  {formatDate(exp.startDate)} –{" "}
                  {exp.current ? "Present" : formatDate(exp.endDate)}
                </strong></p>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="resume-section">
          <h2>EDUCATION</h2>
          {education.map((edu) => (
            <div className="education-item" key={edu.id || Math.random()}>
              <div className="item-content">
                {edu.institution && <p><strong>{edu.institution}</strong></p>}
                {edu.degree && <p>{edu.degree}</p>}
                {edu.gpa && <p><strong>CGPA:</strong> {edu.gpa}/10</p>}
                {edu.description && (
                  <ul className="bullet-list">
                    {edu.description
                      .split("\n")
                      .filter((line) => line.trim().startsWith("•"))
                      .map((bullet, i) => (
                        <li key={`edu-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                      ))}
                  </ul>
                )}
                {edu.bullets && edu.bullets.length > 0 && (
                  <ul className="bullet-list">
                    {edu.bullets.map((bullet, i) => (
                      <li key={`edu-bullet-${i}`}>{bullet.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
              {(edu.startDate || edu.endDate || edu.current) && (
                <p className="date-rhs"><strong>
                  {formatDate(edu.startDate)} –{" "}
                  {edu.current ? "Present" : formatDate(edu.endDate)}
                </strong></p>
              )}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="resume-section">
          <h2>PROJECTS</h2>
          {projects.map((proj) => (
            <div className="project-item" key={proj.id || Math.random()}>
              <div className="item-content">
                {proj.title && <p><strong>{proj.title}</strong></p>}
                {proj.techStack && proj.techStack.length > 0 && <p>{proj.techStack.join(", ")}</p>}
                {proj.description && (
                  <ul className="bullet-list">
                    {proj.description
                      .split("\n")
                      .filter((line) => line.trim().startsWith("•"))
                      .map((bullet, i) => (
                        <li key={`proj-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                      ))}
                  </ul>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="bullet-list">
                    {proj.bullets.map((bullet, i) => (
                      <li key={`proj-bullet-${i}`}>{bullet.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
              {(proj.startDate || proj.endDate || proj.current) && (
                <p className="date-rhs"><strong>
                  {proj.startDate ? formatDate(proj.startDate) : ""} –{" "}
                  {proj.current ? "Present" : proj.endDate ? formatDate(proj.endDate) : ""}
                </strong></p>
              )}
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="resume-section">
          <h2>CERTIFICATIONS</h2>
          {certifications.map((cert) => (
            <div key={cert.id || Math.random()}>
              <div className="item-content">
                {cert.name && <p><strong>{cert.name}</strong></p>}
                {(cert.issuer || cert.date) && (
                  <p>
                    {cert.issuer || "Issuing Organization"} •{" "}
                    {cert.date || "Date"}
                  </p>
                )}
                {cert.credentialId && <p>Credential ID: {cert.credentialId}</p>}
                {cert.description && (
                  <ul className="bullet-list">
                    {cert.description
                      .split("\n")
                      .filter((line) => line.trim().startsWith("•"))
                      .map((bullet, i) => (
                        <li key={`cert-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                      ))}
                  </ul>
                )}
                {cert.bullets && cert.bullets.length > 0 && (
                  <ul className="bullet-list">
                    {cert.bullets.map((bullet, i) => (
                      <li key={`cert-bullet-${i}`}>{bullet.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
              {cert.date && <p className="date-rhs"><strong>{cert.date}</strong></p>}
            </div>
          ))}
        </div>
      )}

      {achievements.length > 0 && (
        <div className="resume-section">
          <h2>ACHIEVEMENTS</h2>
          {achievements.map((achievement) => (
            <div key={achievement.id || Math.random()}>
              <div className="item-content">
                {achievement.title && <p><strong>{achievement.title}</strong></p>}
                {achievement.description && (
                  <ul className="bullet-list">
                    {achievement.description
                      .split("\n")
                      .filter((line) => line.trim().startsWith("•"))
                      .map((bullet, i) => (
                        <li key={`ach-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                      ))}
                  </ul>
                )}
                {achievement.bullets && achievement.bullets.length > 0 && (
                  <ul className="bullet-list">
                    {achievement.bullets.map((bullet, i) => (
                      <li key={`ach-bullet-${i}`}>{bullet.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
              {achievement.date && <p className="date-rhs"><strong>{achievement.date}</strong></p>}
            </div>
          ))}
        </div>
      )}

      {Object.values(skills).flat().length > 0 && (
        <div className="resume-section">
          <h2>SKILLS</h2>
          <div className="skills-container">
            {skills.frameworks.length > 0 && (
              <div className="skill-category">
                <strong>Frameworks:</strong>{" "}
                {skills.frameworks.map((s) => s.name).join(", ")}
              </div>
            )}
            {skills.languages.length > 0 && (
              <div className="skill-category">
                <strong>Languages:</strong>{" "}
                {skills.languages.map((s) => s.name).join(", ")}
              </div>
            )}
            {skills.tools.length > 0 && (
              <div className="skill-category">
                <strong>Tools:</strong>{" "}
                {skills.tools.map((s) => s.name).join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      {(languages.length > 0 || extraCurriculars.length > 0) && (
        <div className="resume-section">
          <h2>OTHERS</h2>
          {languages.length > 0 && (
            <div className="languages-item">
              <p><strong>Languages:</strong></p>
              {languages.map((lang) => (
                <p key={lang.id || Math.random()}>
                  {lang.name && `${lang.name} (${lang.proficiency || "Proficiency"})`}
                </p>
              ))}
            </div>
          )}
          {extraCurriculars.length > 0 && (
            <div className="extraCurriculars-item">
              <p><strong>Extracurricular Activities:</strong></p>
              {extraCurriculars.map((activity) => (
                <div key={activity.id || `act-${index}`}>
                  <div className="item-content">
                    {activity.title && <p>{activity.title}</p>}
                    {activity.description && (
                      <ul className="bullet-list">
                        {activity.description
                          .split("\n")
                          .filter((line) => line.trim().startsWith("•"))
                          .map((bullet, i) => (
                            <li key={`act-desc-bullet-${i}`}>{bullet.trim().slice(1).trim()}</li>
                          ))}
                      </ul>
                    )}
                    {activity.bullets && activity.bullets.length > 0 && (
                      <ul className="bullet-list">
                        {activity.bullets.map((bullet, i) => (
                          <li key={`act-bullet-${i}`}>{bullet.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {(activity.startDate || activity.endDate || activity.current) && (
                    <p className="date-rhs"><strong>
                      {formatDate(activity.startDate)} –{" "}
                      {activity.current ? "Present" : formatDate(activity.endDate)}
                    </strong></p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const TemplateComponents = {
    basic: BasicTemplate,
    modern: ModernTemplate,
  };

  const SelectedTemplate = TemplateComponents[resumeMetadata.template || "basic"];
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="preview-container">
      <div className="preview-toolbar no-print">
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} type="text">
          Back to Editor
        </Button>
        <PDFGenerator
          targetRef={resumeRef}
          fileName={`${personalInfo.name || "resume"}.pdf`}
        />
      </div>

      <div className="preview-content">
        <SelectedTemplate />
      </div>
    </div>
  );
};

export default ResumePreview;
