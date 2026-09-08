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
    field = "B.Tech / B.E";
  } else if (/b\.?\s*arch/.test(str)) field = "B.Arch";
  else if (/mba|pgdm/.test(str)) field = "MBA/PGDM";
  else if (/m\.?\s*tech|m\.?\s*e\b/.test(str)) field = "M.Tech";
  else if (/diploma/.test(str)) field = "Diploma";
  else if (/b\.?\s*com/.test(str)) field = "B.Com";
  else if (/b\.?\s*sc/.test(str)) field = "B.Sc";
  else if (/b\.?\s*a\b|bachelor of arts/.test(str)) field = "B.A - Bachelor of Arts";
  else if (/b\.?\s*c\.?\s*a|bachelor of computer/.test(str)) field = "B.C.A";

  let course = "";
  if (field === "B.Tech / B.E" && /\bcomputer/.test(str)) {
    course = "Computer Science and Engineering (CSE)";
  }
  return { field, course };
}

/** Collapse "B.Tech / B.E." and "B.Tech/B.E" to the same key */
export function normalizeLookupKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "");
}

function scoreOptionMatch(saved, optionLabel) {
  const a = String(saved || "").trim().toLowerCase();
  const b = String(optionLabel || "").trim().toLowerCase();
  if (!a || !b) return 0;
  if (a === b) return 100;
  const ka = normalizeLookupKey(a);
  const kb = normalizeLookupKey(b);
  if (ka && ka === kb) return 95;
  if (ka && kb && (ka.includes(kb) || kb.includes(ka))) {
    return 80 + Math.min(ka.length, kb.length) / Math.max(ka.length, kb.length);
  }
  if (tokensOverlap(a, b)) return 60;
  // Computers ↔ Computer Science / Computer Engineering
  if (
    (/^computers?$/.test(a) || /\bcomputer/.test(a)) &&
    /\bcomputer/.test(b)
  ) {
    return 55;
  }
  return 0;
}

/** Match AI/resume education text to Super Admin education dropdown option */
export function matchEducationOption(savedField, educationOptions = []) {
  if (!savedField || !Array.isArray(educationOptions) || !educationOptions.length) {
    return null;
  }
  let best = null;
  let bestScore = 0;
  for (const opt of educationOptions) {
    const score = scoreOptionMatch(savedField, opt.label);
    if (score > bestScore) {
      bestScore = score;
      best = opt;
    }
  }
  return bestScore >= 55 ? best : null;
}

/** Match AI/resume course text to Super Admin course dropdown option */
export function matchCourseOption(savedCourse, courseOptions = []) {
  if (!savedCourse || !Array.isArray(courseOptions) || !courseOptions.length) {
    return null;
  }
  let best = null;
  let bestScore = 0;
  for (const opt of courseOptions) {
    const score = Math.max(
      scoreOptionMatch(savedCourse, opt.label),
      scoreOptionMatch(savedCourse, opt.value)
    );
    if (score > bestScore) {
      bestScore = score;
      best = opt;
    }
  }
  return bestScore >= 55 ? best : null;
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

/**
 * Fuzzy-match resume signals to a Job Category that EXISTS in DB only.
 * Uses designation + skills + education + other resume fields together.
 * Never picks a category from a single weak word (e.g. skill "Analytics"
 * → "Data Science Analytics"). If role is not in master list → null.
 */
export function matchJobCategoryId(raw, jobCategories = []) {
  if (!Array.isArray(jobCategories) || !jobCategories.length) return null;

  const toStr = (item) =>
    String(
      typeof item === "object" && item !== null
        ? item.jobCategory || item.label || item.name || item.sub || ""
        : item || ""
    )
      .trim()
      .toLowerCase();

  const normalizeName = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  let primaryTexts = [];
  let corpusParts = [];

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const skillText = Array.isArray(raw.skill)
      ? raw.skill.join(" ")
      : Array.isArray(raw.skills)
        ? raw.skills.join(" ")
        : raw.skill || raw.skills || "";
    const eduText = Array.isArray(raw.education)
      ? raw.education
          .map((e) => [e?.name, e?.sub, e?.institution].filter(Boolean).join(" "))
          .join(" ")
      : "";
    primaryTexts = [raw.designation, raw.jobCategory, raw.jobCategoryName]
      .map(toStr)
      .filter((s) => s && s !== "[object object]");
    corpusParts = [
      raw.designation,
      raw.jobCategory,
      raw.jobCategoryName,
      skillText,
      raw.currentEmployer,
      raw.field,
      raw.course,
      raw.highestQualification,
      eduText,
      raw.summary,
      raw.about,
      raw.fileName,
      raw.resumeText,
      raw.preferedJobLocation,
    ]
      .map(toStr)
      .filter((s) => s && s !== "[object object]");
  } else {
    const texts = (Array.isArray(raw) ? raw : [raw])
      .map(toStr)
      .filter((s) => s && s !== "[object object]");
    primaryTexts = texts.slice(0, 2);
    corpusParts = texts;
  }

  if (!corpusParts.length && !primaryTexts.length) return null;

  const corpus = corpusParts.join(" ");
  const corpusNorm = normalizeName(corpus);
  const primaryNorm = primaryTexts.map(normalizeName).filter(Boolean);

  const stop = new Set([
    "and",
    "the",
    "for",
    "job",
    "jobs",
    "category",
    "it",
    "senior",
    "junior",
    "lead",
    "assistant",
    "executive",
    "officer",
    "manager",
    "with",
    "from",
    "year",
    "years",
  ]);

  // One weak skill/common word alone must never pick a multi-word category
  const weakAlone = new Set([
    "analytics",
    "analysis",
    "data",
    "science",
    "leadership",
    "teamwork",
    "communication",
    "problem",
    "solving",
    "innovation",
    "inovation",
    "collaboration",
    "management",
    "support",
    "service",
    "customer",
    "sales",
    "marketing",
    "digital",
    "computer",
    "office",
    "admin",
    "general",
  ]);

  const tokenize = (s) =>
    normalizeName(s)
      .split(" ")
      .filter((t) => t.length > 2 && !stop.has(t));

  // Fuzzy token match (developer ↔ development, etc.)
  const tokensMatch = (a, b) => {
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.includes(b) || b.includes(a)) return true;
    const minLen = Math.min(a.length, b.length);
    if (minLen >= 5) {
      const prefix = Math.min(6, minLen);
      if (a.slice(0, prefix) === b.slice(0, prefix)) return true;
    }
    return false;
  };

  const catId = (j) => j.id || j._id || j.value || null;
  const catName = (j) => String(j.jobCategory || j.label || "").trim();

  // 1) Fuzzy primary match vs DB names only (designation / parsed category)
  for (const str of primaryNorm) {
    if (!str) continue;
    const found = jobCategories.find((j) => {
      const name = normalizeName(catName(j));
      if (!name) return false;
      if (name === str || name.includes(str) || str.includes(name)) return true;
      const nt = tokenize(name);
      const st = tokenize(str);
      if (!nt.length || !st.length) return false;
      // fuzzy: most category tokens covered by designation tokens
      const hit = nt.filter((n) => st.some((t) => tokensMatch(t, n))).length;
      return hit >= Math.ceil(nt.length * 0.5) && hit >= 1 && !(hit === 1 && weakAlone.has(nt[0]) && nt.length > 1);
    });
    if (found) return catId(found);
  }

  // 2) Category phrase appears in full resume text
  for (const j of jobCategories) {
    const name = normalizeName(catName(j));
    if (name.length < 3) continue;
    if (corpusNorm.includes(name)) return catId(j);
  }

  // 3) Fuzzy token coverage over whole resume — need enough category words,
  //    not just one skill word like "Analytics"
  const corpusTokens = tokenize(corpusNorm);
  if (!corpusTokens.length) return null;

  let best = null;
  let bestScore = 0;

  for (const j of jobCategories) {
    const name = normalizeName(catName(j));
    const nameTokens = tokenize(name);
    if (!nameTokens.length) continue;

    const matched = nameTokens.filter((n) =>
      corpusTokens.some((t) => tokensMatch(t, n))
    );
    const coverage = matched.length / nameTokens.length;

    // Block: only 1 weak word matched on a multi-word category
    if (nameTokens.length >= 2 && matched.length === 1 && weakAlone.has(matched[0])) {
      continue;
    }
    // Need at least half the category tokens (fuzzy), min 1 for single-word categories
    if (nameTokens.length === 1) {
      if (matched.length < 1) continue;
      if (weakAlone.has(matched[0]) && matched[0].length < 8) continue;
    } else if (coverage < 0.5 || matched.length < 2) {
      continue;
    }

    let score = coverage * 10 + matched.length;
    const primaryHit = primaryNorm.some((p) => {
      const pt = tokenize(p);
      return nameTokens.some((n) => pt.some((t) => tokensMatch(t, n)));
    });
    if (primaryHit) score += 4;

    if (score > bestScore) {
      bestScore = score;
      best = j;
    }
  }

  if (!best) return null;
  return catId(best);
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
