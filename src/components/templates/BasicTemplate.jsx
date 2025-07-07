import { useResumeStore } from '../../stores/useResumeStore';
import { useMemo } from 'react';
import '../../styles/templates.css';

const BasicTemplate = () => {
  const {
    personalInfo,
    experience,
    education,
    skills,
    resumeMetadata
  } = useResumeStore();

  // ATS-optimized formatting
  const formattedSkills = useMemo(() => {
    return skills.map(skill => skill.name).join(' • ');
  }, [skills]);

  return (
    <div className="basic-template ats-optimized">
      {/* Header with ATS-friendly formatting */}
      <header className="resume-header">
        <h1 className="applicant-name">{personalInfo.name}</h1>
        <div className="contact-info">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.linkedin && <span>linkedin.com/in/{personalInfo.linkedin.split('/').pop()}</span>}
        </div>
      </header>

      {/* Professional Summary - Important for ATS */}
      {personalInfo.summary && (
        <section className="summary-section">
          <h2 className="section-title">Professional Summary</h2>
          <p className="summary-text">{personalInfo.summary}</p>
        </section>
      )}

      {/* Work Experience - Most important for ATS */}
      {experience.length > 0 && (
        <section className="experience-section">
          <h2 className="section-title">Professional Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h3 className="job-title">{exp.position}</h3>
                <div className="company-info">
                  <span className="company-name">{exp.company}</span>
                  <span className="employment-dates">{exp.startDate} - {exp.endDate}</span>
                </div>
              </div>
              <div className="job-description">
                {exp.description.split('\n').map((bullet, i) => (
                  <p key={i} className="job-bullet">• {bullet}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Education - Standard ATS fields */}
      {education.length > 0 && (
        <section className="education-section">
          <h2 className="section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <h3 className="degree">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
              <div className="education-info">
                <span className="institution">{edu.institution}</span>
                <span className="education-dates">{edu.startDate} - {edu.endDate}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills - Keyword optimization for ATS */}
      {skills.length > 0 && (
        <section className="skills-section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-list">
            {formattedSkills}
          </div>
        </section>
      )}
    </div>
  );
};

export default BasicTemplate;