import type { ResumeData } from "./types";

const renderContact = (data: ResumeData, sep = " | ") =>
  [data.email, data.phone, data.location, data.linkedin, data.github, data.website]
    .filter(Boolean)
    .join(sep);

const renderBullets = (bullets: string[] = []) =>
  bullets.map((b) => `<li>${b}</li>`).join("");

const renderDescArr = (desc: string | string[] | undefined) =>
  (Array.isArray(desc) ? desc : desc ? [desc] : []).map((b) => `<li>${b}</li>`).join("");

export const TEMPLATES = {
  classic: {
    name: "Classic",
    desc: "Single column · Max ATS",
    ats: 99,
    render(data: ResumeData, skills: string[]) {
      return `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=Source+Sans+3:wght@400;500;600&display=swap');
          *{margin:0;padding:0;box-sizing:border-box}
          body{font-family:'Source Sans 3',Arial,sans-serif;color:#1a1a1a;background:#fff;padding:40px 44px;font-size:13px;line-height:1.5;max-width:820px;margin:0 auto}
          h1{font-family:'Source Serif 4',Georgia,serif;font-size:30px;font-weight:700;letter-spacing:-0.5px;margin-bottom:3px}
          .tagline{color:#444;font-size:13px;margin-bottom:8px}
          .contact{font-size:12px;color:#555;margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #1a1a1a}
          h2{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#1a1a1a;margin:14px 0 6px;padding-bottom:3px;border-bottom:1px solid #ddd}
          .entry{margin-bottom:13px}
          .row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1px}
          .title{font-weight:600;font-size:13.5px} .date{font-size:12px;color:#555}
          .sub{color:#555;font-size:12.5px;margin-bottom:5px}
          ul{padding-left:17px;margin:0} li{margin-bottom:3px;font-size:12.5px}
          .skills{font-size:12.5px;color:#333;line-height:1.8}
        </style>
        <h1>${data.name || "Your Name"}</h1>
        <div class="tagline">${data.tagline || ""}</div>
        <div class="contact">${renderContact(data)}</div>
        ${data.summary ? `<h2>Summary</h2><p style="font-size:12.5px;color:#222;margin-bottom:4px">${data.summary}</p>` : ""}
        ${data.experience?.length ? `<h2>Experience</h2>${data.experience.map((e) => `
          <div class="entry">
            <div class="row"><span class="title">${e.title}</span><span class="date">${e.dates || ""}</span></div>
            <div class="sub">${e.company}${e.location ? " · " + e.location : ""}</div>
            <ul>${renderBullets(e.bullets)}</ul>
          </div>`).join("")}` : ""}
        ${data.projects?.length ? `<h2>Projects</h2>${data.projects.map((p) => `
          <div class="entry">
            <div class="row"><span class="title">${p.name}</span><span class="date">${p.tech || ""}</span></div>
            <ul>${renderDescArr(p.description)}</ul>
          </div>`).join("")}` : ""}
        ${data.education?.length ? `<h2>Education</h2>${data.education.map((e) => `
          <div class="entry">
            <div class="row"><span class="title">${e.school}</span><span class="date">${e.dates || ""}</span></div>
            <div class="sub">${e.degree}</div>
          </div>`).join("")}` : ""}
        ${skills?.length ? `<h2>Technical Skills</h2><div class="skills">${skills.join(" · ")}</div>` : ""}
        ${data.certifications?.length ? `<h2>Certifications</h2><div class="skills">${data.certifications.join(" · ")}</div>` : ""}
      `;
    },
  },

  executive: {
    name: "Executive",
    desc: "Centered header · Refined",
    ats: 97,
    render(data: ResumeData, skills: string[]) {
      return `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
          *{margin:0;padding:0;box-sizing:border-box}
          body{font-family:'Lato',Arial,sans-serif;color:#1c1c1c;background:#fff;padding:40px 44px;font-size:13px;line-height:1.55;max-width:820px;margin:0 auto}
          .header{text-align:center;margin-bottom:20px;padding-bottom:16px;border-bottom:3px double #1c1c1c}
          h1{font-family:'Lora',Georgia,serif;font-size:32px;font-weight:700;letter-spacing:1px;margin-bottom:4px;text-transform:uppercase}
          .tagline{color:#555;font-size:12.5px;margin-bottom:6px} .contact{font-size:11.5px;color:#555}
          h2{font-family:'Lora',Georgia,serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1c1c1c;margin:14px 0 6px;border-bottom:1px solid #ccc;padding-bottom:3px}
          .entry{margin-bottom:13px} .row{display:flex;justify-content:space-between;margin-bottom:1px}
          .title{font-weight:700;font-size:13px} .date{font-size:12px;color:#555;font-style:italic}
          .sub{color:#666;font-size:12px;margin-bottom:5px}
          ul{padding-left:16px} li{margin-bottom:3.5px;font-size:12.5px}
          .skills{font-size:12.5px;line-height:1.9}
        </style>
        <div class="header">
          <h1>${data.name || "Your Name"}</h1>
          <div class="tagline">${data.tagline || ""}</div>
          <div class="contact">${renderContact(data, "  ·  ")}</div>
        </div>
        ${data.summary ? `<h2>Professional Summary</h2><p style="font-size:12.5px;color:#333;margin-bottom:2px;font-style:italic">${data.summary}</p>` : ""}
        ${data.experience?.length ? `<h2>Professional Experience</h2>${data.experience.map((e) => `
          <div class="entry">
            <div class="row"><span class="title">${e.title} — ${e.company}</span><span class="date">${e.dates || ""}</span></div>
            <div class="sub">${e.location || ""}</div>
            <ul>${renderBullets(e.bullets)}</ul>
          </div>`).join("")}` : ""}
        ${data.projects?.length ? `<h2>Key Projects</h2>${data.projects.map((p) => `
          <div class="entry">
            <div class="row"><span class="title">${p.name}</span><span class="date">${p.tech || ""}</span></div>
            <ul>${renderDescArr(p.description)}</ul>
          </div>`).join("")}` : ""}
        ${data.education?.length ? `<h2>Education</h2>${data.education.map((e) => `
          <div class="entry">
            <div class="row"><span class="title">${e.school}</span><span class="date">${e.dates || ""}</span></div>
            <div class="sub">${e.degree}</div>
          </div>`).join("")}` : ""}
        ${skills?.length ? `<h2>Technical Skills</h2><div class="skills">${skills.join("  ·  ")}</div>` : ""}
        ${data.certifications?.length ? `<h2>Certifications</h2><div class="skills">${data.certifications.join("  ·  ")}</div>` : ""}
      `;
    },
  },

  compact: {
    name: "Compact",
    desc: "Space-efficient · Info-dense",
    ats: 98,
    render(data: ResumeData, skills: string[]) {
      return `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
          *{margin:0;padding:0;box-sizing:border-box}
          body{font-family:'IBM Plex Sans',Arial,sans-serif;color:#111;background:#fff;padding:28px 36px;font-size:12px;line-height:1.45;max-width:820px;margin:0 auto}
          h1{font-size:24px;font-weight:700;letter-spacing:-0.5px;margin-bottom:2px}
          .tagline{color:#444;font-size:12px;margin-bottom:5px}
          .contact{font-size:11px;color:#555;margin-bottom:14px;padding-bottom:10px;border-bottom:1.5px solid #111}
          h2{font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#000;margin:14px 0 6px;padding-bottom:3px;border-bottom:1px solid #e5e5e5}
          .entry{margin-bottom:10px} .row{display:flex;justify-content:space-between;align-items:baseline}
          .title{font-weight:600;font-size:12.5px} .date{font-size:11px;color:#666}
          .sub{color:#666;font-size:11.5px;margin-bottom:3px}
          ul{padding-left:14px} li{margin-bottom:2px;font-size:12px}
          .skills{font-size:12px;color:#333;line-height:1.8}
        </style>
        <h1>${data.name || "Your Name"}</h1>
        <div class="tagline">${data.tagline || ""}</div>
        <div class="contact">${renderContact(data)}</div>
        ${data.summary ? `<h2>Summary</h2><p style="font-size:12px;margin-bottom:2px;color:#222">${data.summary}</p>` : ""}
        ${data.experience?.length ? `<h2>Experience</h2>${data.experience.map((e) => `
          <div class="entry">
            <div class="row"><span class="title">${e.title}</span><span class="date">${e.dates || ""}</span></div>
            <div class="sub">${e.company}${e.location ? " · " + e.location : ""}</div>
            <ul>${renderBullets(e.bullets)}</ul>
          </div>`).join("")}` : ""}
        ${data.projects?.length ? `<h2>Projects</h2>${data.projects.map((p) => `
          <div class="entry">
            <div class="row"><span class="title">${p.name}</span><span class="date">${p.tech || ""}</span></div>
            <ul>${renderDescArr(p.description)}</ul>
          </div>`).join("")}` : ""}
        ${data.education?.length ? `<h2>Education</h2>${data.education.map((e) => `
          <div class="entry">
            <div class="row"><span class="title">${e.school}</span><span class="date">${e.dates || ""}</span></div>
            <div class="sub">${e.degree}</div>
          </div>`).join("")}` : ""}
        ${skills?.length ? `<h2>Skills</h2><div class="skills">${skills.join(" · ")}</div>` : ""}
        ${data.certifications?.length ? `<h2>Certifications</h2><div class="skills">${data.certifications.join(" · ")}</div>` : ""}
      `;
    },
  },
} as const;
