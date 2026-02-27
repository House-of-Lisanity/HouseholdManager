"use client";

interface PasswordRequirementsProps {
  password: string;
}

const RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character", test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p) },
];

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  if (!password) return null;

  return (
    <ul className="password-requirements" aria-label="Password requirements">
      {RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li key={rule.label} className={met ? "met" : "unmet"}>
            {met ? "\u2713" : "\u2717"} {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
