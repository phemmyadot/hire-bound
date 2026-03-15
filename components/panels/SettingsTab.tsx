"use client";

import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { Field, SectionHeader, EditCard, BulletRow, TwoCol, Btn } from "@/components/ui";

interface Props {
  onPreview: () => void;
}

export function SettingsTab({ onPreview }: Props) {
  const { resume } = useResume();
  const { editData, setField, exp, proj, edu } = resume;
  if (!editData) return null;

  return (
    <div
      style={{ flex: 1, overflow: "auto", padding: "24px 28px", animation: "fadeIn 0.2s ease" }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "3px" }}>
              Edit Fields
            </h2>
            <p style={{ color: COLORS.textDim, fontSize: "12.5px" }}>
              Changes update the resume preview instantly
            </p>
          </div>
          <Btn
            variant="primary"
            onClick={onPreview}
            style={{ padding: "6px 14px", fontSize: "11.5px" }}
          >
            ← Preview
          </Btn>
        </div>

        {/* Contact */}
        <SectionHeader title="Contact & Header" />
        <TwoCol>
          <Field label="Full Name"  value={editData.name}     onChange={(v) => setField("name", v)} />
          <Field label="Tagline"    value={editData.tagline}  onChange={(v) => setField("tagline", v)} placeholder="Senior SWE | React · Node · AWS" />
          <Field label="Email"      value={editData.email}    onChange={(v) => setField("email", v)} />
          <Field label="Phone"      value={editData.phone}    onChange={(v) => setField("phone", v)} />
          <Field label="Location"   value={editData.location} onChange={(v) => setField("location", v)} />
          <Field label="LinkedIn"   value={editData.linkedin} onChange={(v) => setField("linkedin", v)} />
          <Field label="GitHub"     value={editData.github}   onChange={(v) => setField("github", v)} />
          <Field label="Website"    value={editData.website}  onChange={(v) => setField("website", v)} />
        </TwoCol>

        {/* Summary */}
        <SectionHeader title="Summary" />
        <Field
          value={editData.summary}
          onChange={(v) => setField("summary", v)}
          multiline
          placeholder="Professional summary…"
        />

        {/* Experience */}
        <SectionHeader title="Experience" onAdd={exp.add} addLabel="Add Role" />
        {(editData.experience || []).map((e, eIdx) => (
          <EditCard
            key={eIdx}
            title={`${e.title || `Role ${eIdx + 1}`}${e.company ? ` @ ${e.company}` : ""}`}
            onRemove={() => exp.rm(eIdx)}
          >
            <TwoCol>
              <Field label="Job Title" value={e.title}    onChange={(v) => exp.setField(eIdx, "title", v)} />
              <Field label="Company"   value={e.company}  onChange={(v) => exp.setField(eIdx, "company", v)} />
              <Field label="Location"  value={e.location} onChange={(v) => exp.setField(eIdx, "location", v)} />
              <Field label="Dates"     value={e.dates}    onChange={(v) => exp.setField(eIdx, "dates", v)} placeholder="Jan 2022 – Present" />
            </TwoCol>
            <div
              style={{
                fontSize: "10px",
                fontWeight: "600",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: COLORS.textDim,
                marginBottom: "6px",
              }}
            >
              Bullets
            </div>
            {(e.bullets || []).map((b, bIdx) => (
              <BulletRow
                key={bIdx}
                value={b}
                onChange={(v) => exp.setBullet(eIdx, bIdx, v)}
                onRemove={() => exp.rmBullet(eIdx, bIdx)}
              />
            ))}
            <Btn
              variant="dashed"
              onClick={() => exp.addBullet(eIdx)}
              style={{ width: "100%", textAlign: "center", padding: "4px 12px" }}
            >
              + Add bullet
            </Btn>
          </EditCard>
        ))}

        {/* Projects */}
        <SectionHeader title="Projects" onAdd={proj.add} addLabel="Add Project" />
        {(editData.projects || []).map((p, pIdx) => (
          <EditCard
            key={pIdx}
            title={p.name || `Project ${pIdx + 1}`}
            onRemove={() => proj.rm(pIdx)}
          >
            <TwoCol>
              <Field label="Project Name" value={p.name} onChange={(v) => proj.setField(pIdx, "name", v)} />
              <Field label="Tech Stack"   value={p.tech} onChange={(v) => proj.setField(pIdx, "tech", v)} placeholder="React, Node.js, PostgreSQL" />
            </TwoCol>
            <div
              style={{
                fontSize: "10px",
                fontWeight: "600",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: COLORS.textDim,
                marginBottom: "6px",
              }}
            >
              Bullets
            </div>
            {(Array.isArray(p.description) ? p.description : [p.description || ""]).map(
              (b, bIdx) => (
                <BulletRow
                  key={bIdx}
                  value={b}
                  onChange={(v) => proj.setBullet(pIdx, bIdx, v)}
                  onRemove={() => proj.rmBullet(pIdx, bIdx)}
                />
              )
            )}
            <Btn
              variant="dashed"
              onClick={() => proj.addBullet(pIdx)}
              style={{ width: "100%", textAlign: "center", padding: "4px 12px" }}
            >
              + Add bullet
            </Btn>
          </EditCard>
        ))}

        {/* Education */}
        <SectionHeader title="Education" onAdd={edu.add} addLabel="Add Entry" />
        {(editData.education || []).map((e, eIdx) => (
          <EditCard key={eIdx} title={e.school || `Entry ${eIdx + 1}`} onRemove={() => edu.rm(eIdx)}>
            <TwoCol>
              <Field label="School" value={e.school} onChange={(v) => edu.setField(eIdx, "school", v)} />
              <Field label="Dates"  value={e.dates}  onChange={(v) => edu.setField(eIdx, "dates", v)} />
            </TwoCol>
            <Field label="Degree" value={e.degree} onChange={(v) => edu.setField(eIdx, "degree", v)} />
          </EditCard>
        ))}

        {/* Certifications */}
        <SectionHeader title="Certifications" />
        <EditCard title="Certifications">
          <Field
            label="Comma-separated"
            value={(editData.certifications || []).join(", ")}
            onChange={(v) =>
              setField(
                "certifications",
                v.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            placeholder="AWS Certified Developer, Google Cloud Professional"
          />
        </EditCard>

        <div style={{ height: "40px" }} />
      </div>
    </div>
  );
}
