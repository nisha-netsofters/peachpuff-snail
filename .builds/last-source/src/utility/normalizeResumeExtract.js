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

function tokensOverlap(a, b) {
  const ta = String(a || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
  const tb = String(b || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
  return ta.some((t) => tb.some((u) => u.includes(t) || t.includes(u)));
}

export function matchEducationField(raw, courseList = []) {
  const str = String(raw || "").trim().toLowerCase();
  if (!str || !Array.isArray(courseList)) return { field: "", course: "" };

  for (const c of courseList) {
    const name = String(c.name || "").toLowerCase();
    const nameHit =
      str.includes(name) ||
      name.includes(str) ||
      // "b.tech/b.e." vs "b.e. in computer engineering"
      name.split(/[\/|]/).some((part) => {
        const p = part.trim();
        return p.length > 2 && (str.includes(p) || tokensOverlap(str, p));
      });
    if (nameHit) {
      const subMatch = (c.sub || []).find((s) => {
        const sub = String(s).toLowerCase();
        return (
          str.includes(sub) ||
          sub.includes(str) ||
          tokensOverlap(str, sub) ||
          // Computer Engineering ↔ Computers
          (sub.startsWith("computer") && /\bcomputer/.test(str))
        );
      });
      return {
        field: c.name,
        course: subMatch || "",
      };
    }
  }

  let field = "";
  if (/b\.?\s*tech|b\.?\s*e\b|bachelor of engineering|computer engineering/.test(str)) {
    field = "B.Tech/B.E.";
  } else if (/b\.?\s*arch/.test(str)) field = "B.Architect";
  else if (/mba|pgdm/.test(str)) field = "MBA/PGDM";
  else if (/diploma/.test(str)) field = "Diploma";

  let course = "";
  if (field === "B.Tech/B.E." && /\bcomputer/.test(str)) course = "Computers";
  return { field, course };
}

/** Strip "Area / Locality: Vesu" leftovers → "Vesu" */
export function cleanAreaValue(raw) {
  let area = String(raw || "").trim();
  if (!area) return "";
  area = area
    .replace(/^\/?\s*locality\s*/i, "")
    .replace(/^\/?\s*suburb\s*/i, "")
    .replace(/^\/?\s*area\s*/i, "")
    .replace(/^[:\-–—|/]+\s*/g, "")
    .trim();
  const afterColon = area.match(/^(?:area|locality|suburb)\s*[:\-–—|/]\s*(.+)$/i);
  if (afterColon) area = afterColon[1].trim();
  if (/^(area|locality|suburb|select)$/i.test(area)) return "";
  return area;
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
  if (found) return found.id || found._id || found.value || null;

  // Fuzzy: "IT Software - Developer" ↔ "Software Development"
  const stop = new Set(["and", "the", "for", "job", "jobs", "category", "it"]);
  const tokens = str
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !stop.has(t));
  if (!tokens.length) return null;

  let best = null;
  let bestScore = 0;
  for (const j of jobCategories) {
    const name = String(j.jobCategory || j.label || "").toLowerCase();
    const nameTokens = name
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2 && !stop.has(t));
    const score = tokens.filter((t) =>
      nameTokens.some((n) => n.includes(t) || t.includes(n))
    ).length;
    if (score > bestScore) {
      bestScore = score;
      best = j;
    }
  }
  if (bestScore < 1 || !best) return null;
  return best.id || best._id || best.value || null;
}

export function normalizeProfessional(prof = {}, courseList = [], education = []) {
  const p = { ...(prof || {}) };

  p.experienceInyear = normalizeExperienceInYear(p.experienceInyear);
  p.currentlyWorking = normalizeCurrentlyWorking(p.currentlyWorking);
  p.noticePeriod = normalizeNoticePeriod(p.noticePeriod);

  const edu0 =
    Array.isArray(education) && education.length ? education[0] : null;
  const eduSource = [
    p.field,
    p.course,
    p.highestQualification,
    prof.course,
    prof.highestQualification,
    edu0?.sub,
    edu0?.name,
  ]
    .filter(Boolean)
    .join(" ");
  const eduMatch = matchEducationField(eduSource, courseList);
  if (eduMatch.field && !p.field) p.field = eduMatch.field;
  if (eduMatch.course) {
    // Prefer Course.js option (e.g. Computers) over free text (Computer Engineering)
    if (
      !p.course ||
      String(p.course).toLowerCase() !== String(eduMatch.course).toLowerCase()
    ) {
      const raw = String(p.course || "").toLowerCase();
      const matched = String(eduMatch.course).toLowerCase();
      if (
        !p.course ||
        raw.includes(matched) ||
        matched.includes(raw) ||
        tokensOverlap(raw, matched) ||
        (matched.startsWith("computer") && /\bcomputer/.test(raw))
      ) {
        p.course = eduMatch.course;
      }
    }
  }
  // "Computer Engineering" alone → Computers under B.Tech/B.E.
  if (p.course && !p.field) {
    const again = matchEducationField(p.course, courseList);
    if (again.field) p.field = again.field;
    if (again.course) p.course = again.course;
  }

  p.highestQualification = normalizeHighestQualification(
    p.highestQualification || edu0?.name || p.course || ""
  );

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
  const professional = normalizeProfessional(
    data.professional || {},
    courseList,
    data.education || []
  );
  return {
    ...data,
    gender: normalizeGender(data.gender),
    area: cleanAreaValue(data.area),
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
