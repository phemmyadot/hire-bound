export const RESUME_SYSTEM_PROMPT = (hasJD: boolean) => `You are an expert tech resume writer and ATS specialist for software engineers.

${
  hasJD
    ? `A job description is provided. Tailor everything to it:
   - Weave JD keywords naturally into bullet points and summary — not just skills
   - Only add keywords to skills if they are genuine technical tools/languages/frameworks
   - Soft keywords ("agile", "cross-functional", "CI/CD") belong in bullets`
    : "Optimize for general software engineering roles."
}

Return ONLY a valid JSON object, no markdown, no backticks:
{
  "name","tagline","email","phone","location","github","linkedin","website",
  "summary": "2-3 sentences naturally weaving key JD terms",
  "experience": [{ "title","company","location","dates","bullets": ["Strong verb + metric + JD keyword where natural"] }],
  "projects":   [{ "name","tech","description": ["Impact bullet"] }],
  "education":  [{ "school","degree","dates" }],
  "coreSkills": ["TypeScript","React","..."],
  "deprioritizedSkills": [{ "skill","reason" }],
  "certifications": [],
  "atsScore": 87,
  "keywordsMatched": ["keywords found ANYWHERE in resume — bullets, summary, skills"],
  "keywordsMissing": ["JD keywords not yet in resume"],
  "coverLetter": "Dear Hiring Manager,\\n\\n[Para 1: Hook+role]\\n\\n[Para 2: 2-3 achievements with metrics]\\n\\n[Para 3: Why this company]\\n\\n[Para 4: CTA]\\n\\nBest regards,\\n[Name]",
  "suggestions": [
    { "category","priority": "high"|"medium"|"low","title","reason" }
  ]
}

RULES: All bullets start with strong action verbs. Add quantified metrics. Return ONLY the JSON.`;

export const JOBS_SYSTEM_PROMPT =
  "You generate realistic job listings matched to a candidate's profile. Return ONLY valid JSON, no markdown.";

export const buildJobsPrompt = ({
  title,
  skills,
  location,
  jobDesc,
}: {
  title: string;
  skills: string;
  location: string;
  jobDesc: string;
}) => {
  const jdSnippet = jobDesc?.trim().slice(0, 400) || "not provided";
  const q = encodeURIComponent(title);
  const l = encodeURIComponent(location);
  return `Generate 12 realistic job listings for a candidate:
- Most recent title: ${title}
- Key skills: ${skills}
- Location: ${location}
- JD context: ${jdSnippet}

Return a JSON array of 12 objects:
{
  "id": "unique_string",
  "title": "Job Title",
  "company": "Real Company Name",
  "location": "City, ST",
  "type": "Remote"|"Hybrid"|"On-site",
  "salary": "$120k – $160k",
  "posted": "2d ago",
  "match": 92,
  "tags": ["React","TypeScript","AWS"],
  "description": "2 sentence why-this-fits summary.",
  "linkedin": "https://www.linkedin.com/jobs/search/?keywords=${q}&location=${l}",
  "indeed": "https://www.indeed.com/jobs?q=${q}&l=${l}",
  "glassdoor": "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&typedKeyword=${q}"
}

Mix: FAANG, startups, fintech, healthtech. Vary types and locations. Scores 70–98. Return ONLY the JSON array.`;
};
