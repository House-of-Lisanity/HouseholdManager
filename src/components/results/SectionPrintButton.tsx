import React from "react";

type PrintSection = "calendar" | "meals" | "workouts" | "shopping" | "all";

interface SectionPrintButtonProps {
  section: PrintSection;
  label?: string;
}

export default function SectionPrintButton({
  section,
  label = "Print",
}: SectionPrintButtonProps) {
  const handlePrint = () => {
    if (section !== "all") {
      document.body.setAttribute("data-print-section", section);
    }

    const cleanup = () => {
      document.body.removeAttribute("data-print-section");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);

    window.print();
  };

  return (
    <button
      className="section-print-btn"
      onClick={handlePrint}
      aria-label={`Print ${section === "all" ? "all sections" : section}`}
    >
      {label}
    </button>
  );
}
