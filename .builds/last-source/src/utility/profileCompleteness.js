/**
 * Shared client-side profile completion calculator.
 * Weights must stay in sync with backend services/profileCompleteness.js
 *
 * 100% only when every field in each weighted section is filled
 * (create-form required fields + notice / employer / company / speaking / location).
 */

export const PROFILE_COMPLETION_WEIGHTS = {
  personalInformation: 15,
  contactInformation: 15,
  education: 15,
  experience: 15,
  skills: 10,
  resumeUploaded: 15,
  currentSalary: 7.5,
  expectedSalary: 7.5,
};

export const PROFILE_COMPLETION_SECTION_LABELS = {
  personalInformation: "Personal Information",
  contactInformation: "Contact Information",
  education: "Education",
  experience: "Experience",
  skills: "Skills",
  resumeUploaded: "Resume Uploaded",
  currentSalary: "Current Salary",
  expectedSalary: "Expected Salary",
};

const PLACEHOLDER_STRINGS = new Set([
  "current monthly salary + 20%",
  "select experience",
  "select qualification",
  "select education",
  "select course",
  "select gender",
  "select industries",
  "select jobcategory",
  "select noticeperiod",
  "select working",
  "english level",
  "enter firstname",
  "enter lastname",
  "enter email",
  "enter mobile",
  "enter designation",
  "enter current monthly salary",
  "current employer",
  "current company",
]);

/**
 * Strict filled check for required profile sections.
 */
export const isFilled = (value, { treatZeroAsEmpty = false } = {}) => {
  if (value === null || value === undefined) return false;

  if (typeof File !== "undefined" && value instanceof File) {
    return value.size > 0;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    if ("value" in value) {
      return isFilled(value.value, { treatZeroAsEmpty });
    }
    // populated jobCategory object
    if (value.id || value._id || value.jobCategory) {
      return true;
    }
    return false;
  }

  if (typeof value === "number") {
    if (Number.isNaN(value)) return false;
    if (treatZeroAsEmpty && value === 0) return false;
    return true;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (PLACEHOLDER_STRINGS.has(trimmed.toLowerCase())) return false;
    if (treatZeroAsEmpty && /^0+(\.0+)?$/.test(trimmed)) return false;
    return true;
  }

  if (Array.isArray(value)) return value.length > 0;

  return false;
};

const getBarColor = (pct) => {
  if (pct >= 100) return "success";
  if (pct > 80) return "info";
  if (pct >= 50) return "warning";
  return "danger";
};

export const normalizeCandidateForCompleteness = (candidate = {}) => {
  if (!candidate || Array.isArray(candidate) || typeof candidate !== "object") {
    return {
      firstname: "",
      lastname: "",
      mobile: "",
      email: "",
      alternateMobile: "",
      gender: "",
      state: "",
      stateId: "",
      city: "",
      cityId: "",
      resume: null,
      industries_relation: [],
      professional: {},
    };
  }

  const professional = candidate.professional || {};
  return {
    firstname: candidate.firstname,
    lastname: candidate.lastname,
    mobile: candidate.mobile,
    email: candidate.email,
    alternateMobile: candidate.alternateMobile,
    gender: candidate.gender,
    state: candidate.state,
    stateId: candidate.stateId,
    city: candidate.city,
    cityId: candidate.cityId,
    resume: candidate.resume,
    industries_relation: candidate.industries_relation || [],
    professional: {
      highestQualification:
        professional.highestQualification || candidate.highestQualification,
      field: professional.field || candidate.field,
      experienceInyear:
        professional.experienceInyear || candidate.experienceInyear,
      designation: professional.designation || candidate.designation,
      jobCategoryId:
        professional.jobCategoryId ||
        professional.jobCategory?.id ||
        professional.jobCategory?._id ||
        candidate.jobCategoryId,
      jobCategory: professional.jobCategory,
      noticePeriod: professional.noticePeriod || candidate.noticePeriod,
      currentlyWorking:
        professional.currentlyWorking || candidate.currentlyWorking,
      currentEmployer:
        professional.currentEmployer || candidate.currentEmployer,
      currentCompany:
        professional.currentCompany || candidate.currentCompany,
      skill: professional.skill || candidate.skill,
      english: professional.english || candidate.english,
      preferedJobLocation:
        professional.preferedJobLocation || candidate.preferedJobLocation,
      currentSalary:
        professional.currentSalary ?? candidate.currentSalary ?? null,
      expectedsalary:
        professional.expectedsalary ?? candidate.expectedsalary ?? null,
    },
  };
};

export const calculateProfileCompleteness = (candidate = {}) => {
  const data = normalizeCandidateForCompleteness(candidate);
  const professional = data.professional || {};
  const hasIndustries =
    Array.isArray(data.industries_relation) &&
    data.industries_relation.length > 0;

  const breakdown = {
    // Name + Gender
    personalInformation:
      isFilled(data.firstname) &&
      isFilled(data.lastname) &&
      isFilled(data.gender),
    // Email + Mobile + Alternate + State + City
    contactInformation:
      isFilled(data.mobile) &&
      isFilled(data.email) &&
      isFilled(data.alternateMobile) &&
      (isFilled(data.stateId) || isFilled(data.state)) &&
      (isFilled(data.cityId) || isFilled(data.city)),
    // Qualification + Education field
    education:
      isFilled(professional.highestQualification) &&
      isFilled(professional.field),
    // Exp + Designation + Job Category + Industries + Notice + Working + Employer/Company
    experience:
      isFilled(professional.experienceInyear, { treatZeroAsEmpty: true }) &&
      isFilled(professional.designation) &&
      (isFilled(professional.jobCategoryId) ||
        isFilled(professional.jobCategory)) &&
      hasIndustries &&
      isFilled(professional.noticePeriod) &&
      isFilled(professional.currentlyWorking) &&
      (isFilled(professional.currentEmployer) ||
        isFilled(professional.currentCompany) ||
        String(professional.currentlyWorking || "")
          .trim()
          .toLowerCase() === "no"),
    // Skill + English + Preferred location
    skills:
      isFilled(professional.skill) &&
      isFilled(professional.english) &&
      isFilled(professional.preferedJobLocation),
    resumeUploaded: isFilled(data.resume),
    currentSalary: isFilled(professional.currentSalary, {
      treatZeroAsEmpty: true,
    }),
    expectedSalary: isFilled(professional.expectedsalary, {
      treatZeroAsEmpty: true,
    }),
  };

  let score = 0;
  for (const [key, filled] of Object.entries(breakdown)) {
    if (filled) score += PROFILE_COMPLETION_WEIGHTS[key];
  }

  const profileCompleteness = Math.round(score);
  return {
    profileCompleteness,
    profileCompletenessLabel: `${profileCompleteness}% Complete`,
    profileCompletenessBreakdown: breakdown,
    barColor: getBarColor(profileCompleteness),
  };
};

export default calculateProfileCompleteness;

