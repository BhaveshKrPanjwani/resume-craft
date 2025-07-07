import { useResumeStore } from '../stores/useResumeStore';

const DynamicResume = () => {
  const {
    personalInfo,
    experience,
    education,
    skills,
    certifications,
    languages,
    resumeMetadata
  } = useResumeStore();

  // Format date to "MMM YYYY" format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="ats-resume" id="printable-content">
      {/* Header */}
      <div className="resume-header">
        <h1>{personalInfo.name}</h1>
        <div className="contact-info">
          {[personalInfo.email, personalInfo.phone, personalInfo.address]
            .filter(Boolean)
            .join(' | ')}
        </div>
      </div>

      {/* Experience Section */}
      {experience.length > 0 && (
        <div className="resume-section">
          <h2>EXPERIENCE</h2>
          {experience.map((exp) => (
            <div className="experience-item" key={exp.id}>
              <h3>{exp.company}</h3>
              <div className="job-title">{exp.position}</div>
              <ul className="job-bullets">
                {exp.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
              <div className="job-meta">
                {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)} | {exp.location}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <div className="resume-section">
          <h2>EDUCATION</h2>
          {education.map((edu) => (
            <div className="education-item" key={edu.id}>
              <h3>{edu.institution}</h3>
              <div className="degree">{edu.degree}</div>
              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="education-bullets">
                  {edu.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
              <div className="education-meta">
                {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Other Sections */}
      <div className="resume-section">
        <h2>OTHER</h2>
        
        {skills.length > 0 && (
          <div className="skills-section">
            <strong>Technical Skills:</strong> {skills.map(s => s.name).join(', ')}
          </div>
        )}
        
        {languages.length > 0 && (
          <div className="languages-section">
            <strong>Languages:</strong> {languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}
          </div>
        )}
        
        {certifications.length > 0 && (
          <div className="certifications-section">
            <strong>Certifications:</strong> {certifications.map(c => c.name).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicResume;