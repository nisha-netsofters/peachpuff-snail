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
 * System-wide resume → Job Category match (DB list only).
 * Uses full resume (role + experience + body + skills) but only accepts a
 * PROPER match. Certificate/skill words alone never pick a category.
 * Conflicting designation blocks unrelated categories even if a course
 * name appears in the text. AI free-text jobCategory is ignored.
 * No proper match → null (do not save).
 */
export function matchJobCategoryId(raw, jobCategories = []) {
  if (!Array.isArray(jobCategories) || !jobCategories.length) return null;

  const toStr = (item) =>
    String(
      typeof item === "object" && item !== null
        ? item.jobCategory ||
            item.label ||
            item.name ||
            item.sub ||
            item.title ||
            item.designation ||
            item.role ||
            ""
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

  const stripNoise = (s) =>
    normalizeName(s)
      .replace(
        /\b(certificate|certification|certified|course completed|completed course|diploma in)\b[\w\s]{0,50}/g,
        " "
      )
      .replace(/\bdigital\s+literacy(\s+for\s+employment)?\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  // Drop training phrases that look like job categories but are courses only
  const stripTrainingPhrases = (s) => {
    let t = normalizeName(s);
    if (!t) return "";
    t = t.replace(
      /\b([a-z]+(?:\s+[a-z]+){0,3})\s+(certificate|certification|certified|course|training|workshop)\b/g,
      " "
    );
    t = t.replace(
      /\b(certificate|certification|course|training|workshop)\s+(in\s+)?([a-z]+(?:\s+[a-z]+){0,3})\b/g,
      " "
    );
    return t.replace(/\s+/g, " ").trim();
  };

  let roleParts = [];
  let bodyParts = [];
  let skillParts = [];

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const expTitles = Array.isArray(raw.experience)
      ? raw.experience.map((e) =>
          [e?.title, e?.designation, e?.role].filter(Boolean).join(" ")
        )
      : [];
    const expBody = Array.isArray(raw.experience)
      ? raw.experience.map((e) =>
          [e?.description, e?.details, e?.responsibilities, e?.company]
            .filter(Boolean)
            .join(" ")
        )
      : [];

    roleParts = [raw.designation, raw.title, ...expTitles, raw.fileName]
      .map(toStr)
      .filter((s) => s && s !== "[object object]");

    bodyParts = [
      ...expBody,
      raw.summary,
      raw.about,
      raw.resumeText,
      raw.currentEmployer,
      raw.field,
      raw.course,
      raw.highestQualification,
      Array.isArray(raw.education)
        ? raw.education
            .map((e) =>
              [e?.name, e?.sub, e?.institution].filter(Boolean).join(" ")
            )
            .join(" ")
        : "",
      raw.preferedJobLocation,
    ]
      .map(toStr)
      .filter((s) => s && s !== "[object object]");

    const skillText = Array.isArray(raw.skill)
      ? raw.skill.join(" ")
      : Array.isArray(raw.skills)
        ? raw.skills.join(" ")
        : raw.skill || raw.skills || "";
    skillParts = [skillText]
      .map(toStr)
      .filter((s) => s && s !== "[object object]");
  } else {
    roleParts = (Array.isArray(raw) ? raw : [raw])
      .map(toStr)
      .filter((s) => s && s !== "[object object]");
  }

  const roleNorm = roleParts.map(normalizeName).filter(Boolean);
  const bodyNorm = bodyParts
    .map((s) => stripTrainingPhrases(stripNoise(s)))
    .filter(Boolean);
  const skillNorm = skillParts
    .map((s) => stripTrainingPhrases(stripNoise(s)))
    .filter(Boolean);

  if (!roleNorm.length && !bodyNorm.length && !skillNorm.length) return null;

  const roleJoined = roleNorm.join(" ");
  const bodyJoined = bodyNorm.join(" ");
  const skillJoined = skillNorm.join(" ");

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
    "pdf",
    "docx",
    "doc",
    "resume",
    "month",
    "months",
    "experience",
  ]);

  const weakToken = new Set([
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
    "literacy",
    "employment",
    "banking",
    "finance",
    "financial",
  ]);

  const tokenize = (s) =>
    normalizeName(s)
      .split(" ")
      .filter((t) => t.length > 2 && !stop.has(t));

  const tokensMatch = (a, b) => {
    if (!a || !b) return false;
    if (a === b) return true;
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
    if (Math.min(a.length, b.length) >= 6 && i >= 5) return true;
    const shorter = a.length <= b.length ? a : b;
    const longer = a.length <= b.length ? b : a;
    if (shorter.length >= 5 && longer.startsWith(shorter)) return true;
    if (shorter.length >= 6 && longer.includes(shorter)) return true;
    return false;
  };

  const catId = (j) => j.id || j._id || j.value || null;
  const catName = (j) => String(j.jobCategory || j.label || "").trim();
  const roleTokensAll = tokenize(roleJoined);

  // Designation/title exists but shares no tokens with category → conflict
  const roleConflicts = (nameTokens) => {
    if (!roleTokensAll.length) return false;
    const overlap = nameTokens.filter((n) =>
      roleTokensAll.some((t) => tokensMatch(t, n))
    );
    if (overlap.length > 0) return false;
    return roleTokensAll.some((t) => t.length >= 5);
  };

  const isSalesMarketingJobTitle = (text) => {
    const t = normalizeName(text);
    if (!t) return false;
    if (
      /\b(receptionist|developer|engineer|accountant|nurse|teacher|driver|cashier|scientist|doctor)\b/.test(
        t
      )
    ) {
      return false;
    }
    return (
      /\b(sales|marketing)\s+(executive|manager|officer|associate|representative|consultant|head|lead|coordinator|specialist|trainee|intern)\b/.test(
        t
      ) || /\b(sales\s+and\s+marketing|business\s+development)\b/.test(t)
    );
  };

  const isSalesAndMarketingCat = (name, nameTokens) =>
    nameTokens.includes("sales") &&
    nameTokens.includes("marketing") &&
    !name.includes("digital");

  let best = null;
  let bestScore = 0;

  for (const j of jobCategories) {
    const name = normalizeName(catName(j));
    if (!name || name.length < 3) continue;
    const nameTokens = tokenize(name);
    if (!nameTokens.length) continue;

    const conflicts = roleConflicts(nameTokens);
    let score = 0;

    for (const str of roleNorm) {
      if (!str) continue;
      if (str === name || (name.length >= 5 && str.includes(name))) {
        score = Math.max(score, 100);
      } else if (
        name.length >= 5 &&
        str.length >= 5 &&
        name.includes(str) &&
        tokenize(str).some((t) => !weakToken.has(t) || t.length >= 8)
      ) {
        score = Math.max(score, 92);
      }
    }

    const roleMatched = nameTokens.filter((n) =>
      roleTokensAll.some((t) => tokensMatch(t, n))
    );
    const bodyTokens = tokenize(bodyJoined);
    const skillTokens = tokenize(skillJoined);
    const bodyMatched = nameTokens.filter((n) =>
      bodyTokens.some((t) => tokensMatch(t, n))
    );
    const strong = (arr) => arr.filter((t) => !weakToken.has(t));
    const coverage = (arr) => arr.length / nameTokens.length;
    const allWeak = nameTokens.every((t) => weakToken.has(t));

    if (nameTokens.length === 1) {
      const tok = nameTokens[0];
      if (roleMatched.length === 1 && !(weakToken.has(tok) && tok.length < 8)) {
        score = Math.max(score, 80);
      }
    } else if (roleMatched.length > 0) {
      if (
        coverage(roleMatched) >= 0.99 ||
        (roleMatched.length >= 2 && strong(roleMatched).length >= 1)
      ) {
        score = Math.max(
          score,
          Math.round(coverage(roleMatched) * 70) +
            strong(roleMatched).length * 12 +
            roleMatched.length * 6
        );
      }
      // Multi-word soft categories (Data Science Analytics, etc.)
      if (
        allWeak &&
        (roleMatched.length === nameTokens.length ||
          (roleMatched.length >= 2 && coverage(roleMatched) >= 0.66))
      ) {
        score = Math.max(score, 86);
      }
      if (
        allWeak &&
        isSalesAndMarketingCat(name, nameTokens) &&
        isSalesMarketingJobTitle(roleJoined)
      ) {
        score = Math.max(score, 84);
      }
    }

    // Body can support only when role does not conflict with this category
    if (!conflicts) {
      if (name.length >= 6 && bodyJoined.includes(name)) {
        score = Math.max(score, roleMatched.length ? 88 : 76);
      }
      if (!allWeak && roleMatched.length >= 1 && bodyMatched.length >= 1) {
        const rb = [...new Set([...roleMatched, ...bodyMatched])];
        if (rb.length >= 2 && strong(rb).length >= 1 && coverage(rb) >= 0.5) {
          score = Math.max(
            score,
            Math.round(coverage(rb) * 65) + strong(rb).length * 10
          );
        }
      }
      if (
        allWeak &&
        roleMatched.length >= 1 &&
        [...new Set([...roleMatched, ...bodyMatched])].length ===
          nameTokens.length
      ) {
        score = Math.max(score, 78);
      }
    }

    // Skills + titles + designation together. Tiny extra if already a role match.
    // Skills alone on weak words (Analytics, Digital Marketing cert) never win.
    const skillMatched = nameTokens.filter((n) =>
      skillTokens.some((t) => tokensMatch(t, n))
    );
    if (roleMatched.length >= 1 && skillMatched.length >= 1) {
      const rs = [...new Set([...roleMatched, ...skillMatched])];
      if (rs.length >= 2 && strong(rs).length >= 1) {
        score = Math.max(
          score,
          Math.round(coverage(rs) * 68) + strong(rs).length * 10
        );
      }
      score += Math.min(4, skillMatched.length);
    } else if (score >= 80) {
      score += Math.min(4, skillMatched.length);
    }
    if (
      !roleMatched.length &&
      skillMatched.length &&
      (allWeak || skillMatched.every((t) => weakToken.has(t)))
    ) {
      continue;
    }

    if (conflicts && score < 92) continue;
    if (
      score < 84 &&
      nameTokens.length >= 2 &&
      roleMatched.length + bodyMatched.length <= 1 &&
      [...roleMatched, ...bodyMatched].every((t) => weakToken.has(t))
    ) {
      continue;
    }
    if (score < 72) continue;

    if (score > bestScore) {
      bestScore = score;
      best = j;
    }
  }

  if (!best) return null;
  const id = catId(best);
  if (!id) return null;
  const exists = jobCategories.some(
    (j) => String(catId(j)) === String(id) && normalizeName(catName(j))
  );
  return exists ? id : null;
}

/**
 * Match resume role against Sub Category first, then Job Category.
 * Returns { jobCategoryId, jobSubCategoryId } — both only from master lists.
 */
export function matchJobCategoryAndSub(
  raw,
  jobCategories = [],
  jobSubCategories = []
) {
  const normalizeName = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

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
    "pdf",
    "docx",
    "doc",
    "resume",
  ]);

  const weakToken = new Set([
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
    "banking",
    "finance",
    "financial",
    "literacy",
    "employment",
    "certificate",
    "certification",
    "certified",
    "course",
    "training",
  ]);

  const tokenize = (s) =>
    normalizeName(s)
      .split(" ")
      .filter((t) => t.length > 2 && !stop.has(t));

  const tokensMatch = (a, b) => {
    if (!a || !b) return false;
    if (a === b) return true;
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
    if (Math.min(a.length, b.length) >= 6 && i >= 5) return true;
    const shorter = a.length <= b.length ? a : b;
    const longer = a.length <= b.length ? b : a;
    if (shorter.length >= 5 && longer.startsWith(shorter)) return true;
    if (shorter.length >= 6 && longer.includes(shorter)) return true;
    return false;
  };

  const toStr = (item) =>
    String(
      typeof item === "object" && item !== null
        ? item.jobCategory ||
            item.jobSubCategory ||
            item.label ||
            item.title ||
            item.designation ||
            item.role ||
            ""
        : item || ""
    )
      .trim()
      .toLowerCase();

  let roleParts = [];
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const expTitles = Array.isArray(raw.experience)
      ? raw.experience.map((e) =>
          [e?.title, e?.designation, e?.role].filter(Boolean).join(" ")
        )
      : [];
    roleParts = [raw.designation, raw.title, ...expTitles, raw.fileName]
      .map(toStr)
      .filter((s) => s && s !== "[object object]");
  } else {
    roleParts = (Array.isArray(raw) ? raw : [raw])
      .map(toStr)
      .filter((s) => s && s !== "[object object]");
  }

  const designation = normalizeName(
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? raw.designation || raw.title || ""
      : ""
  );
  const roleJoined = normalizeName(roleParts.join(" "));
  const roleTokens = tokenize(roleJoined);

  const empty = { jobCategoryId: null, jobSubCategoryId: null };
  if (!roleJoined && !designation) return empty;

  // 1) Sub category (job role) first
  if (Array.isArray(jobSubCategories) && jobSubCategories.length) {
    let bestSub = null;
    let bestScore = 0;
    for (const s of jobSubCategories) {
      const name = normalizeName(s.jobSubCategory || s.label || "");
      if (!name || name.length < 3) continue;
      let score = 0;
      if (designation === name || roleJoined === name) score = 100;
      else if (name.length >= 5 && (designation.includes(name) || roleJoined.includes(name)))
        score = 95;
      else if (name.length >= 5 && name.includes(designation) && designation.length >= 5)
        score = 92;
      else {
        const nameTokens = tokenize(name);
        const matched = nameTokens.filter((n) =>
          roleTokens.some((t) => tokensMatch(t, n))
        );
        if (
          nameTokens.length &&
          matched.length === nameTokens.length &&
          matched.some((t) => !weakToken.has(t) || t.length >= 8)
        ) {
          score = 88;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestSub = s;
      }
    }
    if (bestSub && bestScore >= 88) {
      const subId = bestSub.id || bestSub._id || bestSub.value || null;
      const parentId = bestSub.jobCategoryId || null;
      const parentOk =
        !parentId ||
        !Array.isArray(jobCategories) ||
        !jobCategories.length ||
        jobCategories.some(
          (j) =>
            String(j.id || j._id || j.value) === String(parentId)
        );
      if (subId && parentId && parentOk) {
        return {
          jobCategoryId: String(parentId),
          jobSubCategoryId: String(subId),
        };
      }
    }
  }

  // 2) Fallback: category (department) only
  const catId = matchJobCategoryId(raw, jobCategories);
  return {
    jobCategoryId: catId ? String(catId) : null,
    jobSubCategoryId: null,
  };
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
