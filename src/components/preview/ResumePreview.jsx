import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useResumeStore from "../../stores/useResumeStore";
import PDFGenerator from "./PDFGenerator";
import { useEffect, useState, useRef } from "react";
import "../../styles/ats-resume.css";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
} from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

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
    resumeMetadata = { template: "modern" },
  } = state;
  console.log("Template value in ResumePreview:", resumeMetadata.template); // Check the value used for rendering
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
  const renderBulletPoints = (description) => {
    if (!description) return null;

    // Convert description to array of bullet points
    let bullets = [];

    // Case 1: Already formatted with bullet points (•)
    if (description.includes("•")) {
      bullets = description
        .split("\n")
        .filter((line) => line.trim().startsWith("•"))
        .map((line) => line.trim().slice(1).trim());
    }
    // Case 2: Plain text with newlines
    else if (description.includes("\n")) {
      bullets = description.split("\n").filter((line) => line.trim());
    }
    // Case 3: Single line of text
    else {
      bullets = [description];
    }

    // Ensure we have at least one bullet point
    if (bullets.length === 0) {
      bullets = [description || ""]; // Fallback to original description or empty string
    }

    return (
      <ul className="bullet-list">
        {bullets.map((bullet, i) => (
          <li key={`bullet-${i}`}>{bullet}</li>
        ))}
      </ul>
    );
  };
  const ModernTemplate = () => {
    const hasLowCGPA = education.some((edu) => {
      const gpa = parseFloat(edu.gpa);
      return !isNaN(gpa) && gpa < 8.5;
    });

    const renderBulletPoints = (description) => {
      if (!description) return null;

      let bullets = [];

      if (description.includes("•")) {
        bullets = description
          .split("\n")
          .filter((line) => line.trim().startsWith("•"))
          .map((line) => line.trim().slice(1).trim());
      } else if (description.includes("\n")) {
        bullets = description.split("\n").filter((line) => line.trim());
      } else {
        bullets = [description];
      }

      if (bullets.length === 0) {
        bullets = [description || ""];
      }

      return (
        <ul className="latex-bullet-list">
          {bullets.map((bullet, i) => (
            <li key={`bullet-${i}`}>{bullet}</li>
          ))}
        </ul>
      );
    };

    return (
      <div className="modern-template latex-mode" ref={resumeRef}>
        <header className="latex-header">
          <h1>{personalInfo.name || "YOUR NAME"}</h1>
          <div className="latex-contact-info">
            {[
              personalInfo.email && (
                <span
                  key="email"
                  className="contact-item"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    className="icon"
                    width="16"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"></path>
                  </svg>
                  <span>{personalInfo.email}</span>
                </span>
              ),
              personalInfo.phone && (
                <span
                  key="phone"
                  className="contact-item"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    className="icon"
                    width="16"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"></path>
                  </svg>
                  <span>{personalInfo.phone}</span>
                </span>
              ),
              personalInfo.address && (
                <span
                  key="address"
                  className="contact-item"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    className="icon"
                    width="16"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"></path>
                  </svg>
                  <span>{personalInfo.address}</span>
                </span>
              ),
              personalInfo.linkedin && (
                <a
                  key="linkedin"
                  href={
                    personalInfo.linkedin.startsWith("http")
                      ? personalInfo.linkedin
                      : `https://${personalInfo.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item latex-link"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    className="icon"
                    width="16"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              ),
              personalInfo.github && (
                <a
                  key="github"
                  href={
                    personalInfo.github.startsWith("http")
                      ? personalInfo.github
                      : `https://${personalInfo.github}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item latex-link"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    className="icon"
                    width="16"
                    height="25"
                    viewBox="0 0 98 96"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                    />
                  </svg>
                  {/* Added size prop */}
                  <span>GitHub</span>
                </a>
              ),
            ].filter(Boolean)}
          </div>
        </header>

        {/* Experience Section */}
        {experience.length > 0 && (
          <section className="latex-section">
            <h2>EXPERIENCE</h2>
            {experience.map((exp, index) => (
              <div className="latex-item" key={exp.id || `exp-${index}`}>
                <div className="latex-item-header">
                  <div>
                    <h3 className="latex-item-title">{exp.company}</h3>
                    <p className="latex-item-subtitle">{exp.position}</p>
                    {exp.location && (
                      <p className="latex-item-subtitle">{exp.location}</p>
                    )}
                  </div>
                  {(exp.startDate || exp.endDate || exp.current) && (
                    <p className="latex-item-date">
                      {formatDate(exp.startDate)} –{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                  )}
                </div>
                {renderBulletPoints(exp.description)}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="latex-bullet-list">
                    {exp.bullets.map((bullet, i) => (
                      <li key={`exp-bullet-${i}`}>{bullet.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education Section */}
        {/* Education Section */}
        {education.length > 0 && !hasLowCGPA && (
          <section className="latex-section">
            <h2>EDUCATION</h2>
            {education.map((edu, index) => (
              <div className="latex-item" key={edu.id || `edu-${index}`}>
                <div className="latex-item-header">
                  <div>
                    <h3 className="latex-item-title">{edu.institution}</h3>
                    <p className="latex-item-subtitle">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                    {edu.gradeValue && (
                      <p className="latex-item-subtitle">
                        <strong>
                          {edu.gradeType === "percentage"
                            ? "Percentage"
                            : "CGPA"}
                          :
                        </strong>
                        {edu.gradeValue}
                        {edu.gradeType === "percentage" ? "%" : "/10"}
                      </p>
                    )}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <p className="latex-item-date">
                      {formatDate(edu.startDate)} –{" "}
                      {edu.endDate ? formatDate(edu.endDate) : "Present"}
                    </p>
                  )}
                </div>
                {renderBulletPoints(edu.description)}
                {edu.bullets && edu.bullets.length > 0 && (
                  <ul className="latex-bullet-list">
                    {edu.bullets.map((bullet, i) => (
                      <li key={`edu-bullet-${i}`}>{bullet.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="latex-section">
            <h2>PROJECTS</h2>
            {projects.map((proj, index) => (
              <div className="latex-item" key={proj.id || `proj-${index}`}>
                <div className="latex-item-header">
                  <div>
                    <h3 className="latex-item-title">
                      {proj.title}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <span className="latex-tech-stack">
                          {" | " + proj.techStack.join(", ")}
                        </span>
                      )}
                    </h3>
                  </div>
                  {(proj.startDate || proj.endDate || proj.current) && (
                    <p className="latex-item-date">
                      {proj.startDate ? formatDate(proj.startDate) : ""} –{" "}
                      {proj.current
                        ? "Present"
                        : proj.endDate
                        ? formatDate(proj.endDate)
                        : ""}
                    </p>
                  )}
                </div>
                {renderBulletPoints(proj.description)}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="latex-bullet-list">
                    {proj.bullets.map((bullet, i) => (
                      <li key={`proj-bullet-${i}`}>{bullet.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section className="modern-section">
            <h2>CERTIFICATIONS</h2>
            {certifications.map((cert, index) => (
              <div
                key={cert.id || `cert-${index}`}
                className="certification-container"
              >
                <div className="item-content">
                  <div className="certification-header">
                    {cert.name && (
                      <p>
                        <strong>{cert.name}</strong>
                      </p>
                    )}
                    {(cert.issuer || cert.date) && (
                      <p>
                        {cert.issuer || "Issuing Organization"} •{" "}
                        {cert.date || "Date"}
                      </p>
                    )}
                    {cert.credentialId && (
                      <p>Credential ID: {cert.credentialId}</p>
                    )}
                  </div>
                  {cert.description && (
                    <ul className="bullet-list">
                      {cert.description
                        .split("\n")
                        .filter((line) => line.trim().startsWith("•"))
                        .map((bullet, i) => (
                          <li key={`cert-desc-bullet-${i}`}>
                            {bullet.trim().slice(1).trim()}
                          </li>
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
                <div className="certification-right">
                  {cert.url && (
                    <a
                      href={
                        cert.url.startsWith("http")
                          ? cert.url
                          : `https://${cert.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="certificate-link"
                    >
                      <span className="link-icon">🔗</span> Certificate
                    </a>
                  )}
                  {cert.date && !cert.url && (
                    <p className="date-rhs">
                      <strong>{cert.date}</strong>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {achievements.length > 0 && (
          <section className="modern-section">
            <h2>ACHIEVEMENTS</h2>
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id || `ach-${index}`}
                className="achievement-item"
              >
                <div className="item-content">
                  <div className="achievement-header">
                    {achievement.title && (
                      <p className="achievement-title">
                        <strong>{achievement.title}</strong>
                      </p>
                    )}
                    {achievement.date && (
                      <p className="achievement-date">
                        <strong>{achievement.date}</strong>
                      </p>
                    )}
                  </div>

                  {/* Render description if it exists */}
                  {achievement.description && (
                    <div className="achievement-description">
                      {achievement.description
                        .split("\n")
                        .map(
                          (paragraph, i) =>
                            paragraph.trim() && (
                              <p key={`desc-${i}`}>{paragraph.trim()}</p>
                            )
                        )}
                    </div>
                  )}

                  {/* Render bullet points if they exist */}
                  {achievement.bullets && achievement.bullets.length > 0 && (
                    <ul className="bullet-list">
                      {achievement.bullets.map((bullet, i) => (
                        <li key={`bullet-${i}`}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
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
                <p>
                  <strong>Languages:</strong>
                </p>
                {languages.map((lang) => (
                  <p key={lang.id || Math.random()}>
                    {lang.name &&
                      `${lang.name} (${lang.proficiency || "Proficiency"})`}
                  </p>
                ))}
              </div>
            )}
            {extraCurriculars.length > 0 && (
              <div className="extraCurriculars-item">
                <p>
                  <strong>Extracurricular Activities:</strong>
                </p>
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
                              <li key={`act-desc-bullet-${i}`}>
                                {bullet.trim().slice(1).trim()}
                              </li>
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
                    {(activity.startDate ||
                      activity.endDate ||
                      activity.current) && (
                      <p className="date-rhs">
                        <strong>
                          {formatDate(activity.startDate)} –{" "}
                          {activity.current
                            ? "Present"
                            : formatDate(activity.endDate)}
                        </strong>
                      </p>
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
                {exp.company && (
                  <p>
                    <strong>{exp.company}</strong>
                  </p>
                )}
                {exp.position && <p>{exp.position}</p>}
                {exp.location && <p>{exp.location}</p>}
                {exp.description && (
                  <ul className="bullet-list">
                    {exp.description
                      .split("\n")
                      .filter((line) => line.trim().startsWith("•"))
                      .map((bullet, i) => (
                        <li key={`exp-desc-bullet-${i}`}>
                          {bullet.trim().slice(1).trim()}
                        </li>
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
                <p className="date-rhs">
                  <strong>
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </strong>
                </p>
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
                {edu.institution && (
                  <p>
                    <strong>{edu.institution}</strong>
                  </p>
                )}
                {edu.degree && <p>{edu.degree}</p>}
                {edu.gpa && (
                  <p>
                    <strong>CGPA:</strong> {edu.gpa}/10
                  </p>
                )}
                {edu.description && (
                  <ul className="bullet-list">
                    {edu.description
                      .split("\n")
                      .filter((line) => line.trim().startsWith("•"))
                      .map((bullet, i) => (
                        <li key={`edu-desc-bullet-${i}`}>
                          {bullet.trim().slice(1).trim()}
                        </li>
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
                <p className="date-rhs">
                  <strong>
                    {formatDate(edu.startDate)} –{" "}
                    {edu.current ? "Present" : formatDate(edu.endDate)}
                  </strong>
                </p>
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
                {proj.title && (
                  <p>
                    <strong>{proj.title}</strong>
                  </p>
                )}
                {proj.techStack && proj.techStack.length > 0 && (
                  <p>{proj.techStack.join(", ")}</p>
                )}
                {proj.description && (
                  <ul className="bullet-list">
                    {proj.description
                      .split("\n")
                      .filter((line) => line.trim().startsWith("•"))
                      .map((bullet, i) => (
                        <li key={`proj-desc-bullet-${i}`}>
                          {bullet.trim().slice(1).trim()}
                        </li>
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
                <p className="date-rhs">
                  <strong>
                    {proj.startDate ? formatDate(proj.startDate) : ""} –{" "}
                    {proj.current
                      ? "Present"
                      : proj.endDate
                      ? formatDate(proj.endDate)
                      : ""}
                  </strong>
                </p>
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
                {cert.name && (
                  <p>
                    <strong>{cert.name}</strong>
                  </p>
                )}
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
                        <li key={`cert-desc-bullet-${i}`}>
                          {bullet.trim().slice(1).trim()}
                        </li>
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
              {cert.date && (
                <p className="date-rhs">
                  <strong>{cert.date}</strong>
                </p>
              )}
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
                {achievement.title && (
                  <p>
                    <strong>{achievement.title}</strong>
                  </p>
                )}
                {achievement.description && (
                  <ul className="bullet-list">
                    {achievement.description
                      .split("\n")
                      .filter((line) => line.trim().startsWith("•"))
                      .map((bullet, i) => (
                        <li key={`ach-desc-bullet-${i}`}>
                          {bullet.trim().slice(1).trim()}
                        </li>
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
              {achievement.date && (
                <p className="date-rhs">
                  <strong>{achievement.date}</strong>
                </p>
              )}
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
              <p>
                <strong>Languages:</strong>
              </p>
              {languages.map((lang) => (
                <p key={lang.id || Math.random()}>
                  {lang.name &&
                    `${lang.name} (${lang.proficiency || "Proficiency"})`}
                </p>
              ))}
            </div>
          )}
          {extraCurriculars.length > 0 && (
            <div className="extraCurriculars-item">
              <p>
                <strong>Extracurricular Activities:</strong>
              </p>
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
                            <li key={`act-desc-bullet-${i}`}>
                              {bullet.trim().slice(1).trim()}
                            </li>
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
                  {(activity.startDate ||
                    activity.endDate ||
                    activity.current) && (
                    <p className="date-rhs">
                      <strong>
                        {formatDate(activity.startDate)} –{" "}
                        {activity.current
                          ? "Present"
                          : formatDate(activity.endDate)}
                      </strong>
                    </p>
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

  const SelectedTemplate =
    TemplateComponents[resumeMetadata.template || "basic"];
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

      <div className="preview-content" ref={resumeRef}>
        <SelectedTemplate />
      </div>
    </div>
  );
};

export default ResumePreview;
