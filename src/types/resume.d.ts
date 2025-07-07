interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  photo?: string;
  summary?: string;
  title?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets?: string[];
}

interface Skill {
  id: string;
  name: string;
  level?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
  url?: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: 'native' | 'fluent' | 'intermediate' | 'basic';
}

interface Project {
  id: string;
  name: string;
  description?: string;
  url?: string;
  bullets?: string[];
}

interface ResumeMetadata {
  template: string;
  colorScheme: string;
  fontSize: string;
  sectionOrder: string[];
  lastUpdated: string;
}

interface ResumeState {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  projects: Project[];
  achievements: string[];
  extraCurriculars: string[];
  resumeMetadata: ResumeMetadata;
  
  // Add your action types here
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  // ... include all your other actions
}