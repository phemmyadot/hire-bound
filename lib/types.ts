export interface Experience {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface Project {
  name: string;
  tech: string;
  description: string | string[];
}

export interface Education {
  school: string;
  degree: string;
  dates: string;
}

export interface Suggestion {
  category: string;
  priority: "high" | "medium" | "low";
  title: string;
  reason: string;
}

export interface SuggestedBullet {
  text: string;
  reason: string;
}

export interface SuggestedBulletsForRole {
  role: string;
  bullets: SuggestedBullet[];
}

export interface DeprioritizedSkill {
  skill: string;
  reason: string;
}

export interface ResumeData {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  summary: string;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  coreSkills: string[];
  skills?: string[];
  deprioritizedSkills: DeprioritizedSkill[];
  certifications: string[];
  atsScore: number;
  keywordsMatched: string[];
  keywordsMissing: string[];
  coverLetter: string;
  suggestions: Suggestion[];
  suggestedBullets?: SuggestedBulletsForRole[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Remote" | "Hybrid" | "On-site";
  salary: string;
  posted: string;
  match: number;
  tags: string[];
  description: string;
  linkedin: string;
  indeed: string;
  glassdoor: string;
}
