const ModernTemplate = () => {
  const hasLowCGPA = education.some((edu) => {
    const gpa = parseFloat(edu.gpa);
    return !isNaN(gpa) && gpa < 8.5;
  });

  return (
    <div className="modern-template" ref={resumeRef}>
      <header className="modern-header">
        <h1 style={{ marginBottom: '4px' }}>{personalInfo.name || "YOUR NAME"}</h1>
        <div className="contact-info" style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px'
        }}>
          {[
            personalInfo.email && (
              <span key="email">
                <span style={{ marginRight: '4px' }}>📝</span>
                {personalInfo.email}
              </span>
            ),
            personalInfo.phone && (
              <span key="phone">
                <span style={{ marginRight: '4px' }}>📞</span>
                {personalInfo.phone}
              </span>
            ),
            personalInfo.address && (
              <span key="address">
                <span style={{ marginRight: '4px' }}>📍</span>
                {personalInfo.address}
              </span>
            ),
            personalInfo.linkedin && (
              <a
                key="linkedin"
                href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span style={{ marginRight: '4px' }}>🔗</span>
                LinkedIn
              </a>
            ),
            personalInfo.github && (
              <a
                key="github"
                href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span style={{ marginRight: '4px' }}>🐙</span>
                GitHub
              </a>
            ),
          ]
            .filter(Boolean)
            .map((item, index, array) => (
              <span key={index} style={{ display: 'flex', alignItems: 'center' }}>
                {item}
              </span>
            ))}
        </div>
      </header>

      {experience.length > 0 && (
        <section className="modern-section">
          <h2 style={{ 
            borderBottom: '1px solid #333',
            paddingBottom: '4px',
            marginBottom: '12px'
          }}>EXPERIENCE</h2>
          {experience.map((exp, index) => (
            <div className="experience-item" key={exp.id || `exp-${index}`} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{exp.company || "Company"}</h3>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>{exp.position || "Position"}</p>
                  {exp.location && <p style={{ margin: '0 0 8px 0', fontStyle: 'italic' }}>{exp.location}</p>}
                </div>
                {(exp.startDate || exp.endDate) && (
                  <p style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                )}
              </div>
              {renderBulletPoints(exp.description)}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="bullet-list" style={{ marginTop: '8px' }}>
                  {exp.bullets.map((bullet, i) => (
                    <li key={`exp-bullet-${i}`} style={{ marginBottom: '4px' }}>{bullet.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="modern-section">
          <h2 style={{ 
            borderBottom: '1px solid #333',
            paddingBottom: '4px',
            marginBottom: '12px'
          }}>EDUCATION</h2>
          {education.map((edu, index) => (
            <div className="education-item" key={edu.id || `edu-${index}`} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{edu.institution || "Institution"}</h3>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>{edu.degree || "Degree"}</p>
                  {edu.gpa && <p style={{ margin: '0 0 8px 0' }}><strong>CGPA:</strong> {edu.gpa}/10</p>}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <p style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}
                  </p>
                )}
              </div>
              {renderBulletPoints(edu.description)}
              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="bullet-list" style={{ marginTop: '8px' }}>
                  {edu.bullets.map((bullet, i) => (
                    <li key={`edu-bullet-${i}`} style={{ marginBottom: '4px' }}>{bullet.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Similar styling for other sections (projects, skills, etc.) */}
      {projects.length > 0 && (
        <section className="modern-section">
          <h2 style={{ 
            borderBottom: '1px solid #333',
            paddingBottom: '4px',
            marginBottom: '12px'
          }}>PROJECTS</h2>
          {projects.map((proj, index) => (
            <div className="project-item" key={proj.id || `proj-${index}`} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{proj.title || "Project Title"}</h3>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <p style={{ margin: '0 0 8px 0', fontStyle: 'italic' }}>
                      {proj.techStack.join(", ")}
                    </p>
                  )}
                </div>
                {(proj.startDate || proj.endDate) && (
                  <p style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {proj.startDate ? formatDate(proj.startDate) : ""} –{" "}
                    {proj.current ? "Present" : proj.endDate ? formatDate(proj.endDate) : ""}
                  </p>
                )}
              </div>
              {renderBulletPoints(proj.description)}
              {proj.bullets && proj.bullets.length > 0 && (
                <ul className="bullet-list" style={{ marginTop: '8px' }}>
                  {proj.bullets.map((bullet, i) => (
                    <li key={`proj-bullet-${i}`} style={{ marginBottom: '4px' }}>{bullet.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Add similar styling for other sections like skills, certifications, etc. */}
      {Object.values(skills).flat().length > 0 && (
        <section className="modern-section">
          <h2 style={{ 
            borderBottom: '1px solid #333',
            paddingBottom: '4px',
            marginBottom: '12px'
          }}>SKILLS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
            {skills.frameworks.length > 0 && (
              <div>
                <strong>Frameworks:</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                  {skills.frameworks.map((s, i) => (
                    <li key={`framework-${i}`}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {skills.languages.length > 0 && (
              <div>
                <strong>Languages:</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                  {skills.languages.map((s, i) => (
                    <li key={`language-${i}`}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {skills.tools.length > 0 && (
              <div>
                <strong>Tools:</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                  {skills.tools.map((s, i) => (
                    <li key={`tool-${i}`}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};