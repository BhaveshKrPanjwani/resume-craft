import { create } from "zustand";
import { persist } from "zustand/middleware";

const useResumeStore = create(
  persist(
    (set, get) => ({
      // Personal Information
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        github: "",
        website: "",
        photo: "",
        summary: "",
        title: "",
      },
      updatePersonalInfo: (info) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
        })),

      // Experience (company, position, startDate, endDate, location, description, bullets)
     experience: [],
      addExperience: (newExperience) =>
        set((state) => ({
          experience: [
            ...state.experience,
            { 
              ...newExperience,
              description: newExperience.description || "", // Ensure description exists
              bullets: newExperience.bullets || [], // Ensure bullets exists
              id: Date.now().toString() 
            },
          ],
        })),
      updateExperience: (id, updatedFields) =>
        set((state) => ({
          experience: state.experience.map((exp) =>
            exp.id === id ? { 
              ...exp, 
              ...updatedFields,
              description: updatedFields.description ?? exp.description, // Nullish coalescing
              bullets: updatedFields.bullets ?? exp.bullets
            } : exp
          ),
        })),
      removeExperience: (id) =>
        set((state) => ({
          experience: state.experience.filter((exp) => exp.id !== id),
        })),
      reorderExperience: (startIndex, endIndex) => {
        const result = Array.from(get().experience);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        set({ experience: result });
      },

      // Education (institution, degree, field, startDate, endDate, gpa, description)
      education: [],
      addEducation: (newEducation) =>
  set((state) => ({
    education: [
      ...state.education,
      {
        ...newEducation,
        id: Date.now().toString(),
        gpa: newEducation.gpa || "", // Changed from gradeValue to gpa
      },
    ],
  })),
updateEducation: (id, updatedFields) =>
  set((state) => ({
    education: state.education.map((edu) =>
      edu.id === id
        ? {
            ...edu,
            ...updatedFields,
            gpa: updatedFields.gpa || edu.gpa, // Changed from gradeValue to gpa
          }
        : edu
    ),
  })),
      removeEducation: (id) =>
        set((state) => ({
          education: state.education.filter((edu) => edu.id !== id),
        })),
      reorderEducation: (startIndex, endIndex) => {
        const result = Array.from(get().education);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        set({ education: result });
      },

      // Skills (name, id)
      // Change the skills structure in your store to:
      skills: {
        frameworks: [],
        languages: [],
        tools: [],
      },

      // Update the skill-related actions:
      // In your useResumeStore.js
      addSkill: (category, newSkill) =>
        set((state) => ({
          skills: {
            ...state.skills,
            [category]: [
              ...state.skills[category],
              {
                ...newSkill,
                id: newSkill.id || Date.now().toString(),
                category,
              },
            ],
          },
        })),

      addSkills: (newSkills) =>
        set((state) => {
          const updatedSkills = { ...state.skills };

          newSkills.forEach((skill) => {
            if (skill.category && updatedSkills[skill.category]) {
              const existingIds = updatedSkills[skill.category].map(
                (s) => s.id
              );
              if (!existingIds.includes(skill.id)) {
                updatedSkills[skill.category].push({
                  ...skill,
                  id: skill.id || Date.now().toString(),
                });
              }
            }
          });

          return { skills: updatedSkills };
        }),

      updateSkill: (category, id, updatedFields) =>
        set((state) => ({
          skills: {
            ...state.skills,
            [category]: state.skills[category].map((skill) =>
              skill.id === id ? { ...skill, ...updatedFields } : skill
            ),
          },
        })),

      removeSkill: (category, id) =>
        set((state) => ({
          skills: {
            ...state.skills,
            [category]: state.skills[category].filter(
              (skill) => skill.id !== id
            ),
          },
        })),
      // Projects (title, techStack, startDate, endDate, description, bullets)
      projects: [],
      addProject: (newProject) =>
        set((state) => ({
          projects: [
            ...state.projects,
            { ...newProject, id: Date.now().toString() },
          ],
        })),
      updateProject: (id, updatedFields) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updatedFields } : project
          ),
        })),
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),

      // Certifications (name, id)
      certifications: [],
addCertification: (newCertification) =>
  set((state) => ({
    certifications: [
      ...state.certifications,
      { 
        ...newCertification, 
        id: Date.now().toString(),
        url: newCertification.url || '' // Ensure URL field exists
      },
    ],
  })),
updateCertification: (id, updatedFields) =>
  set((state) => ({
    certifications: state.certifications.map((cert) =>
      cert.id === id ? { ...cert, ...updatedFields } : cert
    ),
  })),
removeCertification: (id) =>
  set((state) => ({
    certifications: state.certifications.filter((cert) => cert.id !== id),
  })),

      // Languages (name, proficiency, id)
      languages: [],
      addLanguage: (newLanguage) =>
        set((state) => ({
          languages: [
            ...state.languages,
            { ...newLanguage, id: Date.now().toString() },
          ],
        })),
      updateLanguage: (id, updatedFields) =>
        set((state) => ({
          languages: state.languages.map((lang) =>
            lang.id === id ? { ...lang, ...updatedFields } : lang
          ),
        })),
      removeLanguage: (id) =>
        set((state) => ({
          languages: state.languages.filter((lang) => lang.id !== id),
        })),

      // Achievements
      achievements: [],
addAchievement: (newAchievement) =>
  set((state) => ({
    achievements: [
      ...state.achievements,
      { 
        ...newAchievement, 
        id: Date.now().toString(),
        description: newAchievement.description || '', // Ensure description exists
        bullets: newAchievement.bullets || [] // Ensure bullets array exists
      },
    ],
  })),
updateAchievement: (id, updatedFields) =>
  set((state) => ({
    achievements: state.achievements.map((ach) =>
      ach.id === id ? { ...ach, ...updatedFields } : ach
    ),
  })),
removeAchievement: (id) =>
  set((state) => ({
    achievements: state.achievements.filter((ach) => ach.id !== id),
  })),
      // Extracurriculars
      extraCurriculars: [],
      addExtraCurricular: (newItem) =>
        set((state) => ({
          extraCurriculars: [
            ...state.extraCurriculars,
            { ...newItem, id: Date.now().toString() },
          ],
        })),
      updateExtraCurricular: (id, updatedFields) =>
        set((state) => ({
          extraCurriculars: state.extraCurriculars.map((item) =>
            item.id === id ? { ...item, ...updatedFields } : item
          ),
        })),
      removeExtraCurricular: (id) =>
        set((state) => ({
          extraCurriculars: state.extraCurriculars.filter(
            (item) => item.id !== id
          ),
        })),

      // Resume Metadata
      resumeMetadata: {
        template: "modern",
        colorScheme: "blue",
        fontSize: "medium",
        sectionOrder: [
          "personal",
          // "summary",
          "experience",
          "education",
          "skills",
          "projects",
          "certifications",
          "languages",
          "achievements",
          "extraCurriculars",
        ],
        lastUpdated: new Date().toISOString(),
      },
      updateResumeMetadata: (metadata) =>
        set((state) => ({
          resumeMetadata: { ...state.resumeMetadata, ...metadata },
        })),
      removeSection: (sectionKey) => {
        const coreSections = [
          "personalInfo",
          "summary",
          "experience",
          "education",
          "skills",
          "projects",
          "certifications",
          "languages",
          "achievements",
          "extraCurriculars",
        ];

        if (coreSections.includes(sectionKey)) {
          console.warn("Cannot remove core section:", sectionKey);
          return; // Do not allow removing core sections
        }

        const current = get().resumeMetadata.sectionOrder;
        const updated = current.filter((key) => key !== sectionKey);

        set((state) => ({
          resumeMetadata: {
            ...state.resumeMetadata,
            sectionOrder: updated,
          },
        }));
      },

      // Reset all data
      resetResume: () =>
        set({
          personalInfo: {
            name: "",
            title: "",
            email: "",
            phone: "",
            address: "",
            linkedin: "",
            github: "",
            website: "",
            photo: "",
            summary: "",
          },
          experience: [],
          education: [],
          skills: {
            frameworks: [],
            languages: [],
            tools: [],
          },
          projects: [],
          certifications: [],
          languages: [],
          achievements: [],
          extraCurriculars: [],
          resumeMetadata: {
            template: "modern",
            colorScheme: "blue",
            fontSize: "medium",
            sectionOrder: [
              "personalInfo",
              "summary",
              "experience",
              "education",
              "skills",
              "projects",
              "certifications",
              "languages",
              "achievements",
              "extraCurriculars",
            ],
            lastUpdated: new Date().toISOString(),
          },
        }),

      // Import/Export helpers
      getResumeData: () => {
        const {
          personalInfo,
          experience,
          education,
          skills,
          projects,
          certifications,
          languages,
          achievements,
          extraCurriculars,
          resumeMetadata,
        } = get();
        return {
          personalInfo,
          experience,
          education,
          skills,
          projects,
          certifications,
          languages,
          achievements,
          extraCurriculars,
          resumeMetadata,
        };
      },
      setResumeData: (data) => {
        set({
          personalInfo: data.personalInfo || {
            name: "",
            title: "",
            email: "",
            phone: "",
            address: "",
            linkedin: "",
            github: "",
            website: "",
            photo: "",
            summary: "",
          },
          experience: data.experience || [],
          education: data.education || [],
          skills: data.skills || {
            frameworks: [],
            languages: [],
            tools: [],
          },
          projects: data.projects || [],
          certifications: data.certifications || [],
          languages: data.languages || [],
          achievements: data.achievements || [],
          extraCurriculars: data.extraCurriculars || [],
          resumeMetadata: data.resumeMetadata || {
            template: "modern",
            colorScheme: "blue",
            fontSize: "medium",
            sectionOrder: [
              "personalInfo",
              "summary",
              "experience",
              "education",
              "skills",
              "projects",
              "certifications",
              "languages",
              "achievements",
              "extraCurriculars",
            ],
            lastUpdated: new Date().toISOString(),
          },
        });
      },

      // Debug method
      debugState: () => console.log(get()),
      clearOnRefresh: () => {
        // Check if this is a page refresh
        const navigationEntries = performance.getEntriesByType("navigation");
        const isRefresh =
          navigationEntries.length > 0 &&
          navigationEntries[0].type === "reload";

        if (isRefresh) {
          set({
            personalInfo: {
              name: "",
              title: "",
              email: "",
              phone: "",
              address: "",
              linkedin: "",
              github: "",
              website: "",
              photo: "",
              summary: "",
            },
            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            languages: [],
            achievements: [],
            extraCurriculars: [],
            resumeMetadata: {
              template: "modern",
              colorScheme: "blue",
              fontSize: "medium",
              sectionOrder: [
                "personalInfo",
                "summary",
                "experience",
                "education",
                "skills",
                "projects",
                "certifications",
                "languages",
                "achievements",
                "extraCurriculars",
              ],
              lastUpdated: new Date().toISOString(),
            },
          });
        }
      },
    }),
    {
      name: "resume-storage",
      // Remove createJSONStorage and use default storage
      getStorage: () => sessionStorage,
      partialize: (state) => ({
        fromPreview: state.fromPreview,
      }),
    }
  )
);
console.log("Initial useResumeStore state:", useResumeStore.getState());
export default useResumeStore;
