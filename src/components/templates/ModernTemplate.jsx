import { useResumeStore } from '../../stores/useResumeStore';
import { useEffect, useState } from 'react';
import '../../styles/modern-template.css';

const ModernTemplate = () => {
  const [state, setState] = useState(useResumeStore.getState());
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = []
  } = state;

  useEffect(() => {
    console.log('ModernTemplate mounted or updated:', state);
    const unsubscribe = useResumeStore.subscribe((newState) => {
      console.log('Store updated:', newState);
      setState(newState);
    });
    return unsubscribe;
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return isNaN(date) ? '' : date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return '';
    }
  };

  const renderContactInfo = () => {
    const contactItems = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.address,
      personalInfo.linkedin && (
        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      ),
      personalInfo.github && (
        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      )
    ].filter(Boolean);
    return contactItems.length > 0 ? contactItems : ['No contact info'];
  };

  return (
    <div className="modern-template" id="printable-content">
      {/* Header */}
      <header className="modern-header">
        <h1>{personalInfo.name || 'YOUR NAME'}</h1>
        <div className="contact-info">
          {renderContactInfo()}
        </div>
      </header>

      {/* Experience Section */}
      {experience.length > 0 && (
        <section className="modern-section">
          <h2>EXPERIENCE</h2>
          <hr />
          {experience.map((exp, index) => (
            <div className="experience-item" key={`exp-${index}`}>
              <div className="experience-header">
                <div className="experience-left">
                  <h3>{exp.company || 'Company'}</h3>
                  <div className="position-title">{exp.position || 'Position'}</div>
                </div>
                <div className="experience-right">
                  <div className="experience-dates">
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                  {exp.location && <div className="experience-location">{exp.location}</div>}
                </div>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="experience-bullets">
                  {exp.bullets.map((bullet, i) => (
                    <li key={`exp-bullet-${i}`}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section className="modern-section">
          <h2>EDUCATION</h2>
          <hr />
          {education.map((edu, index) => (
            <div className="education-item" key={`edu-${index}`}>
              <div className="education-header">
                <div className="education-left">
                  <h3>{edu.institution || 'Institution'}</h3>
                  <div className="degree-info">
                    {edu.degree || 'Degree'}{edu.field && `, ${edu.field}`}
                  </div>
                </div>
                <div className="education-right">
                  <div className="education-dates">
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </div>
                  {edu.gpa && <div className="education-gpa">CGPA: {edu.gpa}</div>}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects Section */}
      // In your ModernTemplate component, update the Projects section:
{projects.length > 0 && (
  <section className="modern-section">
    <h2>PROJECTS</h2>
    <hr />
    {projects.map((proj, index) => (
      <div className="project-item" key={`proj-${index}`}>
        <div className="project-header">
          <h3>{proj.name || 'Project Name'}</h3>
          {proj.technologies && (
            <div className="project-tech">
              {Array.isArray(proj.technologies) 
                ? proj.technologies.join(', ')
                : proj.technologies}
            </div>
          )}
        </div>
        
        {proj.bullets && proj.bullets.length > 0 && (
          <div className="project-bullets">
            {proj.bullets.map((bullet, i) => (
              <div key={`proj-bullet-${i}`} className="bullet-point">
                • {bullet.replace(/^•\s*/, '').trim()}
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </section>
)}

      {/* Technical Skills Section */}
      {skills.length > 0 && (
        <section className="modern-section">
          <h2>OTHER</h2>
          <hr />
          <div className="other-item">
            <strong>Technical Skills:</strong> {skills.map(s => s.name).join(', ') || 'No skills listed'}
          </div>
          <div className="other-item">
            <strong>Languages:</strong> {personalInfo.languages || 'german (Advanced)'}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;