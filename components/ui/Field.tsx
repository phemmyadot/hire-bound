"use client";

import { COLORS } from "@/lib/constants";
import { TextInput } from "./TextInput";
import { TextArea } from "./TextArea";
import type { CSSProperties } from "react";

interface Props {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  style?: CSSProperties;
}

export function Field({ label, value, onChange, multiline, placeholder, style }: Props) {
  return (
    <div style={{ marginBottom: "14px" }}>
      {label && (
        <div
          style={{
            fontSize: "10px",
            fontWeight: "600",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: COLORS.textDim,
            marginBottom: "5px",
          }}
        >
          {label}
        </div>
      )}
      {multiline ? (
        <TextArea value={value} onChange={onChange} placeholder={placeholder} style={style} />
      ) : (
        <TextInput value={value} onChange={onChange} placeholder={placeholder} style={style} />
      )}
    </div>
  );
}
