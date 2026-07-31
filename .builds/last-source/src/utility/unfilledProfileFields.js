/**
 * Candidate unfilled-field helpers for profile page highlighting.
 * Checklist stays in sync with WhatsApp {{unfilled_fields}} (welcomeMessage.js).
 */
import { isFilled } from "./profileCompleteness";

export const CANDIDATE_FIELD_CHECKS = [
  {
    key: "fullName",
    label: "Full Name",
    section: "Personal Information",
    get: (c) =>
      `${c?.firstname || ""} ${c?.lastname || ""}`.trim() || c?.name || "",
  },
  {
    key: "mobile",
    label: "Mobile Number",
    section: "Personal Information",
    get: (c) => c?.mobile,
  },
  {
    key: "alternateMobile",
    label: "Alternate Mobile",
    section: "Personal Information",
    get: (c) => c?.alternateMobile,
  },
  {
    key: "email",
    label: "Email",
    section: "Personal Information",
    get: (c) => c?.email,
  },
  {
    key: "gender",
    label: "Gender",
    section: "Personal Information",
    get: (c) => c?.gender,
  },
  {
    key: "currentAddress",
    label: "Current Address",
    section: "Personal Information",
    get: (c) => c?.street || c?.address || c?.currentAddress,
  },
  {
    key: "city",
    label: "City",
    section: "Personal Information",
    get: (c) => c?.cityId || c?.city,
  },
  {
    key: "state",
    label: "State",
    section: "Personal Information",
    get: (c) => c?.stateId || c?.state,
  },
  {
    key: "currentEmployer",
    label: "Current Employer",
    section: "Professional Information",
    get: (c) => c?.professional?.currentEmployer || c?.currentEmployer,
  },
  {
    key: "currentCompany",
    label: "Current Company",
    section: "Professional Information",
    get: (c) => c?.professional?.currentCompany || c?.currentCompany,
  },
  {
    key: "currentlyWorking",
    label: "Currently Working",
    section: "Professional Information",
    get: (c) => c?.professional?.currentlyWorking || c?.currentlyWorking,
  },
  {
    key: "currentDesignation",
    label: "Current Designation",
    section: "Professional Information",
    get: (c) => c?.professional?.designation || c?.designation,
  },
  {
    key: "noticePeriod",
    label: "Notice Period",
    section: "Professional Information",
    get: (c) => c?.professional?.noticePeriod || c?.noticePeriod,
  },
  {
    key: "skills",
    label: "Skills",
    section: "Professional Information",
    get: (c) => c?.professional?.skill || c?.skill || c?.skills,
  },
  {
    key: "languages",
    label: "Languages",
    section: "Professional Information",
    get: (c) =>
      c?.languages || c?.professional?.languages || c?.professional?.english,
  },
  {
    key: "preferedJobLocation",
    label: "Preferred Job Location",
    section: "Professional Information",
    get: (c) =>
      c?.professional?.preferedJobLocation || c?.preferedJobLocation,
  },
  {
    key: "industry",
    label: "Industry",
    section: "Professional Information",
    get: (c) => c?.industries_relation || c?.industries,
  },
  {
    key: "education",
    label: "Education",
    section: "Professional Information",
    get: (c) => {
      if (Array.isArray(c?.education) && c.education.length > 0) {
        return c.education;
      }
      return (
        c?.professional?.highestQualification ||
        c?.highestQualification ||
        c?.professional?.field
      );
    },
  },
  {
    key: "certifications",
    label: "Certifications",
    section: "Professional Information",
    get: (c) => c?.certifications || c?.professional?.certifications,
  },
  {
    key: "resume",
    label: "Resume File",
    section: "Additional Information",
    get: (c) => c?.resume,
  },
  {
    key: "totalExperience",
    label: "Total Experience",
    section: "Additional Information",
    get: (c) =>
      c?.professional?.experienceInyear ||
      c?.experienceInyear ||
      c?.totalExperience,
    treatZeroAsEmpty: true,
  },
  {
    key: "currentSalary",
    label: "Current Salary",
    section: "Additional Information",
    get: (c) => c?.professional?.currentSalary ?? c?.currentSalary,
    treatZeroAsEmpty: true,
  },
  {
    key: "expectedSalary",
    label: "Expected Salary",
    section: "Additional Information",
    get: (c) =>
      c?.professional?.expectedsalary ??
      c?.expectedsalary ??
      c?.expectedSalary,
    treatZeroAsEmpty: true,
  },
];

export const getUnfilledCandidateFields = (
  candidate = {},
  { excludeKeys = [] } = {}
) => {
  const excluded = new Set(excludeKeys);
  const unfilled = [];
  CANDIDATE_FIELD_CHECKS.forEach((field) => {
    if (excluded.has(field.key)) return;
    const value = field.get(candidate);
    if (!isFilled(value, { treatZeroAsEmpty: field.treatZeroAsEmpty })) {
      unfilled.push({
        key: field.key,
        label: field.label,
        section: field.section,
      });
    }
  });
  return unfilled;
};

export const getUnfilledFieldKeySet = (candidate = {}, options = {}) =>
  new Set(getUnfilledCandidateFields(candidate, options).map((f) => f.key));

/** Fields not shown/editable on candidate self-profile page */
export const PROFILE_PAGE_EXCLUDED_KEYS = ["resume"];

export const UNFILLED_BORDER = "#ea5455";

export const getUnfilledInputStyle = (isUnfilled, focusStyle = {}) => {
  if (!isUnfilled) return focusStyle;
  return {
    ...focusStyle,
    borderColor: UNFILLED_BORDER,
    boxShadow: "0 0 0 0.2rem rgba(234, 84, 85, 0.15)",
  };
};

export const getUnfilledSelectStyles = (isUnfilled) => {
  if (!isUnfilled) return undefined;
  return {
    control: (base) => ({
      ...base,
      borderColor: UNFILLED_BORDER,
      boxShadow: "0 0 0 0.2rem rgba(234, 84, 85, 0.15)",
      "&:hover": { borderColor: UNFILLED_BORDER },
    }),
  };
};
