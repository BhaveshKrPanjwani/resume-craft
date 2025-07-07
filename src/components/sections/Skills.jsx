import { Select, Tag, Empty } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import useResumeStore from '../../stores/useResumeStore';
import { useCallback, useEffect, useRef } from 'react';

const skillOptions = {
  languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin'],
  frameworks: ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Spring', 'Laravel', 'Flask', '.NET'],
  tools: ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'Webpack', 'Figma', 'Postman', 'Jira', 'VS Code', 'AWS'],
};

const Skills = ({ isEditing = false }) => {
  // Use a ref to track the previous skills to prevent unnecessary updates
  const prevSkillsRef = useRef();
  
  // Get only the necessary parts from the store
  const skills = useResumeStore(state => state.skills || { frameworks: [], languages: [], tools: [] });
  const addSkill = useResumeStore(state => state.addSkill);
  const removeSkill = useResumeStore(state => state.removeSkill);

  // Memoize the handleChange function with proper dependencies
  const handleChange = useCallback((category, selectedSkills) => {
    // Get current skills for this category
    const currentSkills = skills[category] || [];
    
    // Create maps for efficient lookups
    const currentSkillsMap = new Map(currentSkills.map(skill => [skill.name, skill]));
    const selectedSkillsSet = new Set(selectedSkills);

    // Determine skills to add and remove
    const skillsToAdd = selectedSkills.filter(name => !currentSkillsMap.has(name));
    const skillsToRemove = currentSkills.filter(skill => !selectedSkillsSet.has(skill.name));

    // Process removals first
    skillsToRemove.forEach(skill => {
      removeSkill(category, skill.id);
    });

    // Then process additions
    skillsToAdd.forEach(name => {
      addSkill(category, {
        name,
        category,
        id: `${category}-${name}-${Date.now()}`
      });
    });
  }, [skills, addSkill, removeSkill]);

  // Compare current skills with previous to prevent unnecessary updates
  useEffect(() => {
    prevSkillsRef.current = skills;
  }, [skills]);

  if (!isEditing) {
    // View mode - optimized rendering
    const hasSkills = Object.values(skills).some(arr => arr.length > 0);
    
    return (
      <div className="skills-section">
        <h2>Technical Skills</h2>
        {hasSkills ? (
          <div className="skills-display">
            {Object.entries(skillOptions).map(([category]) => {
              const categorySkills = skills[category] || [];
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category} className="skill-category">
                  <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  <div className="skills-list">
                    {categorySkills.map(skill => (
                      <Tag key={skill.id} className="skill-tag">
                        {skill.name}
                      </Tag>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty description="No skills added yet" />
        )}
      </div>
    );
  }

  // Edit mode - optimized select rendering
  return (
    <div className="skills-editor">
      <h2>Technical Skills</h2>
      <div className="skill-categories">
        {Object.entries(skillOptions).map(([category, options]) => {
          const currentSkills = skills[category] || [];
          const currentSkillNames = currentSkills.map(s => s.name);
          
          return (
            <div key={category} className="skill-category-edit">
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={`Select ${category}`}
                value={currentSkillNames}
                onChange={(selected) => handleChange(category, selected)}
                options={options.map(option => ({
                  value: option,
                  label: option,
                }))}
                tagRender={({ label, value, closable, onClose }) => (
                  <Tag
                    closable={closable}
                    onClose={onClose}
                    closeIcon={<CloseOutlined />}
                    style={{ marginRight: 3 }}
                  >
                    {label}
                  </Tag>
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;