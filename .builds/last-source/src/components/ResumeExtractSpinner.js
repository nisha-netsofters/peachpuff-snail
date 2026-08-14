import React from "react";

const STYLE_ID = "uw-resume-extract-spinner-style";

const injectSpinnerCss = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  // Injected at runtime so production postcss-rtl cannot rename the keyframes.
  style.textContent = `
    @keyframes uwResumeSpin {
      to { transform: rotate(360deg); }
    }
    .uw-resume-extract-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
      box-sizing: border-box;
      animation: uwResumeSpin 0.75s linear infinite;
    }
  `;
  document.head.appendChild(style);
};

const ResumeExtractSpinner = () => {
  injectSpinnerCss();

  return <span className="uw-resume-extract-spinner" aria-hidden="true" />;
};

export default ResumeExtractSpinner;
