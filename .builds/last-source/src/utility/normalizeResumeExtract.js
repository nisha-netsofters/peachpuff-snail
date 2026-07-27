/**
 * Normalize AI/OCR resume extract values to match candidate form dropdowns.
 */

export function normalizeGender(gender) {
  const raw = String(gender || "").trim().toLowerCase();
  if (!raw) return "";
  if (
    raw === "f" ||
    raw === "female" ||
    raw === "woman" ||
    raw === "girl" ||
    /\bfemale\b/.test(raw) ||
    /\bwoman\b/.test(raw)
  ) {
    return "female";
  }
  if (
    raw === "m" ||
    raw === "male" ||
    raw === "man" ||
    raw === "boy" ||
    /\bmale\b/.test(raw) ||
    /\bman\b/.test(raw)
  ) {
    return "male";
  }
  return "";
}

export function normalizeExperienceInYear(raw) {
  if (raw === undefined || raw === null || raw === "") return "";
  const str = String(raw).trim().toLowerCase();
  const buckets = ["0-1 year", "1-3 year", "3-5 year", "5 year above"];
  const exact = buckets.find((b) => b === str);
  if (exact) return exact;

  const numMatch = str.match(/(\d+(?:\.\d+)?)/);
  const years = numMatch ? parseFloat(numMatch[1]) : NaN;
  if (!isNaN(years)) {
    if (years < 1) return "0-1 year";
    if (years < 3) return "1-3 year";
    if (years < 5) return "3-5 year";
    return "5 year above";
  }
  if (/fresher|no experience|fresh/.test(str)) return "0-1 year";
  return "";
}

export function normalizeCurrentlyWorking(raw) {
  const str = String(raw || "").trim().toLowerCase();
  if (!str) return "";
  if (/^(yes|y|true|currently|working|employed)/.test(str)) return "yes";
  if (/^(no|n|false|not|unemployed|student)/.test(str)) return "no";
  return "";
}

export function normalizeNoticePeriod(raw) {
  const str = String(raw || "").trim().toLowerCase();
  if (!str) return "";
  if (/none|immediate|not applicable|^na$|0 day/.test(str)) return "none";

  const numMatch = str.match(/(\d+)/);
  const days = numMatch ? parseInt(numMatch[1], 10) : NaN;
  if (!isNaN(days)) {
    if (days <= 15) return "1-15 days";
    if (days <= 30) return "15-30 days";
    return "30-45 days";
  }
  if (/1-15/.test(str)) return "1-15 days";
  if (/15-30/.test(str)) return "15-30 days";
  if (/30-45|45|60|90/.test(str)) return "30-45 days";
  return "";
}

export function normalizeHighestQualification(raw) {
  const str = String(raw || "").trim().toLowerCase();
  if (!str) return "";
  if (["under graduate", "graduation", "post graduate"].includes(str)) return str;
  if (/post\s*grad|master|mba|m\.?tech|m\.?e\.?|msc|mca|phd|doctorate/.test(str)) {
    return "post graduate";
  }
  if (/under\s*grad|12th|hsc|ssc|intermediate/.test(str)) return "under graduate";
  if (
    /b\.?tech|b\.?e\.?|bachelor|b\.?arch|b\.?com|b\.?sc|bca|graduation|graduate|degree|diploma/.test(
      str
    )
  ) {
    return "graduation";
  }
  return "";
}

export function matchEducationField(raw, courseList = []) {
  const str = String(raw || "").trim().toLowerCase();
  if (!str || !Array.isArray(courseList)) return { field: "", course: "" };

  for (const c of courseList) {
    const name = String(c.name || "").toLowerCase();
    if (str.includes(name) || name.includes(str)) {
      const subMatch = (c.sub || []).find((s) => {
        const sub = String(s).toLowerCase();
        return str.includes(sub) || sub.includes(str);
      });
      return {
        field: c.name,
        course: subMatch || (Array.isArray(c.sub) && c.sub.length ? c.sub[0] : ""),
      };
    }
  }

  if (/b\.?tech|b\.?e\b/.test(str)) return { field: "B.Tech/B.E.", course: "" };
  if (/b\.?arch/.test(str)) return { field: "B.Architect", course: "" };
  if (/mba|pgdm/.test(str)) return { field: "MBA/PGDM", course: "" };
  if (/diploma/.test(str)) return { field: "Diploma", course: "" };
  return { field: "", course: "" };
}

export function buildIndustriesRelation(industryStr, industriesList = []) {
  if (!industryStr || !Array.isArray(industriesList) || !industriesList.length) {
    return [];
  }

  const parts = String(industryStr)
    .split(/[,|;/]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const relations = [];

  for (const part of parts) {
    const lower = part.toLowerCase();
    const found = industriesList.find((ind) => {
      const cat = String(ind.industryCategory || ind.label || "").toLowerCase();
      return cat === lower || cat.includes(lower) || lower.includes(cat);
    });
    if (found) {
      const id = found.id || found.value;
      if (id && !relations.some((r) => r.industriesId === id)) {
        relations.push({ industriesId: id });
      }
    }
  }

  return relations.slice(0, 3);
}

export function matchJobCategoryId(raw, jobCategories = []) {
  const str = String(raw || "").trim().toLowerCase();
  if (!str || !Array.isArray(jobCategories)) return null;

  const found = jobCategories.find((j) => {
    const name = String(j.jobCategory || j.label || "").toLowerCase();
    return name === str || name.includes(str) || str.includes(name);
  });
  return found ? found.id || found._id || found.value || null : null;
}

export function normalizeProfessional(prof = {}, courseList = []) {
  const p = { ...(prof || {}) };

  p.experienceInyear = normalizeExperienceInYear(p.experienceInyear);
  p.currentlyWorking = normalizeCurrentlyWorking(p.currentlyWorking);
  p.noticePeriod = normalizeNoticePeriod(p.noticePeriod);
  p.highestQualification = normalizeHighestQualification(
    p.highestQualification || p.course || ""
  );

  const eduSource = [p.field, p.course, p.highestQualification, prof.course, prof.highestQualification]
    .filter(Boolean)
    .join(" ");
  const eduMatch = matchEducationField(eduSource, courseList);
  if (eduMatch.field && !p.field) p.field = eduMatch.field;
  if (eduMatch.course && !p.course) p.course = eduMatch.course;

  if (p.currentSalary != null && p.currentSalary !== "") {
    const n = Number(p.currentSalary);
    p.currentSalary = !isNaN(n) && n > 0 ? n : p.currentSalary;
  }
  if (p.expectedsalary != null && p.expectedsalary !== "") {
    const n = Number(p.expectedsalary);
    p.expectedsalary = !isNaN(n) && n > 0 ? n : p.expectedsalary;
  }

  return p;
}

export function normalizeExtractedResume(data = {}, courseList = []) {
  const professional = normalizeProfessional(data.professional || {}, courseList);
  return {
    ...data,
    gender: normalizeGender(data.gender),
    industry: data.industry || professional.industry || "",
    professional,
  };
}

export function genderSelectValue(gender) {
  const value = normalizeGender(gender);
  if (!value) return null;
  return {
    value,
    id: "gender",
    label: value === "female" ? "Female" : "Male",
  };
}
