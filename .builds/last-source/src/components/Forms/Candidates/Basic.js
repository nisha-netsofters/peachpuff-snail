import React, { useEffect, useState } from "react";
import { Plus, X } from "react-feather";
import { Row, Col, Input, Label, Button, Progress } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { useSelector } from "react-redux";
import { tostify } from "../../Tostify";
import { resolveIndianAddress } from "../../../utility/resolveIndianAddress";
import apiCall from "../../../utility/axiosInterceptor";
import {
  normalizeExtractedResume,
  genderSelectValue,
} from "../../../utility/normalizeResumeExtract";
import course from "../Course";

const DEFAULT_API_CONFIG_ERROR =
  "Resume auto-extraction is unavailable. Please ask your Super Admin to enable and configure OCR & API Configuration (AI API key and model are required).";

const AI_VALIDATION_MESSAGES = {
  AI_API_KEY_INVALID:
    "Invalid AI API key. Please ask your Super Admin to update the API key in OCR & API Configuration, then try again.",
  AI_MODEL_INVALID:
    "Invalid AI model. Please ask your Super Admin to set a valid model in OCR & API Configuration.",
  AI_RATE_LIMIT:
    "AI service rate limit reached. Please wait a moment and try again.",
  AI_SERVICE_BUSY:
    "Gemini is temporarily busy (high demand). Please wait a few seconds and upload again.",
  AI_NETWORK_ERROR:
    "Live server could not reach Google Gemini. This is not an OCR config change — Hostinger may be blocking outbound Gemini API calls.",
  API_CONFIG_NOT_SET: DEFAULT_API_CONFIG_ERROR,
};

const getFriendlyExtractError = (result) => {
  if (!result) {
    return "Failed to extract resume data. Please verify your backend server is running.";
  }
  if (result.code && AI_VALIDATION_MESSAGES[result.code]) {
    return AI_VALIDATION_MESSAGES[result.code];
  }
  const raw = result.error || result.msg || result.message || "";
  const lower = String(raw).toLowerCase();
  if (
    lower.includes("invalid api key") ||
    lower.includes("api key not valid") ||
    lower.includes("unauthorized") ||
    lower.includes("invalid authentication")
  ) {
    return AI_VALIDATION_MESSAGES.AI_API_KEY_INVALID;
  }
  if (lower.includes("cannot reach google gemini") || lower.includes("enotfound") || lower.includes("econnrefused")) {
    return AI_VALIDATION_MESSAGES.AI_NETWORK_ERROR;
  }
  if (lower.includes("high demand") || lower.includes("try again later") || lower.includes("temporarily busy")) {
    return AI_VALIDATION_MESSAGES.AI_SERVICE_BUSY;
  }
  if (lower.includes("model") && (lower.includes("invalid") || lower.includes("not found"))) {
    return AI_VALIDATION_MESSAGES.AI_MODEL_INVALID;
  }
  // Never show raw OAuth / Google console text to users
  if (/oauth|sign-in|developers\.google|access token/i.test(raw)) {
    return AI_VALIDATION_MESSAGES.AI_API_KEY_INVALID;
  }
  return raw || "Unable to parse resume. Please try again.";
};

const Basic = ({
  candidate,
  setCandidate,
  create,
  setGender,
  setEmail,
  gender,
  isDisabledAllFields = false,
  handleChange = () => {},
  allowMultipleResumeSelection = false,
  resumeUploadOnly = false,
  onResumeBusyChange = () => {},
  bulkUploadProgress = null,
}) => {
  const loginUser = useSelector((state) => state.auth.user);
  const genderOptions = [
    { value: "male", id: "gender", label: "Male" },
    { value: "female", id: "gender", label: "Female" },
  ];
  useEffect(() => {
    if (candidate?.gender?.length > 0) {
      const selectVal = genderSelectValue(candidate.gender);
      if (selectVal) setGender(selectVal);
    }
  }, []);

  useEffect(() => {
    if (create && loginUser?.id) {
      setCandidate((prev) => {
        const base = Array.isArray(prev) ? {} : prev || {};
        if (base.userId === loginUser.id) return base;
        return { ...base, userId: loginUser.id };
      });
    }
  }, [create, loginUser?.id]);
  const themecolor = localStorage.getItem("themecolor");
  const [focus, setIsfocus] = useState(null);

  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(false);
  // Default blocked: only enable after Super Admin OCR+AI config is confirmed ready
  const [apiConfigReady, setApiConfigReady] = useState(false);
  const [apiConfigError, setApiConfigError] = useState(DEFAULT_API_CONFIG_ERROR);
  const [apiConfigChecking, setApiConfigChecking] = useState(true);
  const [extractError, setExtractError] = useState("");
  const [preparingResumes, setPreparingResumes] = useState({
    active: false,
    done: 0,
    total: 0,
  });

  const resumeCacheKey = (f) => `${f?.name || "resume"}_${f?.size || 0}`;

  const parseResumeFileToData = async (resumeFile) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const result = await apiCall.post("/candidate/parse-resume", formData);
      if (result?.success) return result.data || {};
    } catch (err1) {
      try {
        const pubRes = await apiCall.post("/candidate/publicParseResume", formData);
        if (pubRes?.success) return pubRes.data || {};
      } catch (ePub) {}
    }
    return null;
  };

  const preparseRemainingResumes = async (files, initialCache) => {
    if (!files || files.length <= 1) return;
    const cache = { ...initialCache };
    setPreparingResumes({ active: true, done: 1, total: files.length });
    for (let j = 1; j < files.length; j++) {
      const f = files[j];
      const data = await parseResumeFileToData(f);
      if (data) cache[resumeCacheKey(f)] = data;
      setPreparingResumes({ active: true, done: j + 1, total: files.length });
      setCandidate((prev) => {
        const base = Array.isArray(prev) ? {} : prev || {};
        return { ...base, resumeParseCache: { ...cache } };
      });
    }
    setPreparingResumes({ active: false, done: 0, total: 0 });
  };

  // Keep parent Submit button disabled while API check / extract is in progress (resume-only page)
  useEffect(() => {
    if (!resumeUploadOnly) return;
    onResumeBusyChange(Boolean(loading || apiConfigChecking || preparingResumes.active));
  }, [loading, apiConfigChecking, preparingResumes.active, resumeUploadOnly, onResumeBusyChange]);

  // Use same SERVER_URL as job-description AI (axios apiCall) — not frontend host:7001
  const fetchResumeExtractionStatus = async () => {
    const paths = [
      "/candidate/public-resume-extraction-status",
      "/candidate/resume-extraction-status",
    ];
    for (let p = 0; p < paths.length; p++) {
      try {
        const data = await apiCall.get(paths[p]);
        const status = data?.resumeExtraction;
        if (status && typeof status.ready === "boolean") {
          return status;
        }
      } catch (e) {}
    }
    return null;
  };

  useEffect(() => {
    if (!resumeUploadOnly) return;
    let cancelled = false;
    const MIN_CHECK_MS = 400;

    const checkResumeApiConfig = async () => {
      setApiConfigChecking(true);
      const startedAt = Date.now();
      const status = await fetchResumeExtractionStatus();
      if (cancelled) return;

      const elapsed = Date.now() - startedAt;
      const waitMore = Math.max(0, MIN_CHECK_MS - elapsed);
      if (waitMore > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitMore));
      }
      if (cancelled) return;

      if (status && status.ready === true) {
        setApiConfigReady(true);
        setApiConfigError("");
      } else {
        setApiConfigReady(false);
        setApiConfigError(
          (status && status.message) || DEFAULT_API_CONFIG_ERROR
        );
      }
      setApiConfigChecking(false);
    };

    checkResumeApiConfig();
    return () => {
      cancelled = true;
    };
  }, [resumeUploadOnly]);

  const handleFileChange = async (evt) => {
    const files = Array.from((evt.target && evt.target.files) || []);
    const file = files[0];
    if (!file) return;

    // Always re-check Super Admin OCR/AI config before extraction
    setApiConfigChecking(true);
    const startedAt = Date.now();
    const latestStatus = await fetchResumeExtractionStatus();
    const waitMore = Math.max(0, 400 - (Date.now() - startedAt));
    if (waitMore > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMore));
    }
    setApiConfigChecking(false);
    const isReady = latestStatus && latestStatus.ready === true;
    setApiConfigReady(!!isReady);
    if (!isReady) {
      const msg =
        (latestStatus && latestStatus.message) || DEFAULT_API_CONFIG_ERROR;
      setApiConfigError(msg);
      setExtractError(msg);
      setExtracted(false);
      tostify(msg);
      if (evt.target) evt.target.value = "";
      return;
    }
    setApiConfigError("");
    setExtractError("");

    const allowedExt = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
    const allowedMime = [
      'application/pdf',
      'application/msword',
      'application/vnd.ms-word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    const isAllowedResumeFile = (f) => {
      const ext = String(f?.name || "").split(".").pop().toLowerCase();
      if (allowedExt.includes(ext)) return true;
      if (!f?.type) return false;
      // octet-stream is only valid when extension is an allowed resume type
      if (f.type === "application/octet-stream") {
        return allowedExt.includes(ext);
      }
      return allowedMime.includes(f.type);
    };
    // Validate every selected file (bulk import may include DOC/DOCX)
    const invalidFile = files.find((f) => !isAllowedResumeFile(f));
    if (invalidFile) {
      const msg = "Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG file";
      setExtractError(msg);
      tostify(msg);
      if (evt.target) evt.target.value = "";
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      let result = null;

      // Same production API as job-description AI (SERVER_URL via apiCall)
      try {
        result = await apiCall.post("/candidate/parse-resume", formData);
      } catch (err1) {
        result = err1?.response?.data || null;
      }

      // Session-token failures only (not AI "access token" / API key errors)
      const isAiValidationError =
        result?.code &&
        ["AI_API_KEY_INVALID", "AI_MODEL_INVALID", "AI_RATE_LIMIT", "AI_SERVICE_BUSY", "AI_PARSE_FAILED", "API_CONFIG_NOT_SET"].includes(
          result.code
        );
      const isSessionTokenError =
        !isAiValidationError &&
        ((result?.msg && /invalid token|expired token|unauthorized/i.test(result.msg)) ||
          (result?.error && /invalid token|expired token/i.test(String(result.error))));

      if ((!result || !result.success) && (isSessionTokenError || !result) && !isAiValidationError) {
        try {
          const pubRes = await apiCall.post("/candidate/publicParseResume", formData);
          if (pubRes && (pubRes.success || pubRes.code)) {
            result = pubRes;
          }
        } catch (ePub) {
          if (ePub?.response?.data) result = ePub.response.data;
        }
      }

      if (!result || !result.success) {
        if (result?.code === "API_CONFIG_NOT_SET") {
          setApiConfigReady(false);
          setApiConfigError(result.error || DEFAULT_API_CONFIG_ERROR);
        }
        throw Object.assign(new Error(getFriendlyExtractError(result)), {
          code: result?.code,
        });
      }
      const s = normalizeExtractedResume(result.data || {}, course);
      console.log("ResumeUploadHelper parsed data s:", s);
      if (typeof setCandidate === 'function') {
        setCandidate((prev) => {
          const curr = Array.isArray(prev) ? {} : prev || {};
          const edu = (curr.education && curr.education.length) ? curr.education : (s.education || []);
          const prof = Object.assign({}, curr.professional || {}, s.professional || {});
          const address = resolveIndianAddress({
            state: s.state || curr.state || "",
            city: s.city || curr.city || "",
            stateId: curr.stateId || "",
            cityId: curr.cityId || "",
          });
          return Object.assign({}, curr, {
            firstname: s.firstname || curr.firstname || "",
            lastname: s.lastname || curr.lastname || "",
            mobile: s.mobile || curr.mobile || "",
            alternateMobile: s.alternateMobile || curr.alternateMobile || "",
            email: s.email || curr.email || "",
            gender: s.gender || curr.gender || "",
            dateOfBirth: s.dateOfBirth || curr.dateOfBirth || "",
            street: s.street || curr.street || "",
            area: s.area || curr.area || "",
            city: address.city,
            cityId: address.cityId,
            state: address.state,
            stateId: address.stateId,
            zip: String(s.zip || curr.zip || "")
              .replace(/\D/g, "")
              .slice(0, 6),
            linkedinProfile: s.linkedinProfile || curr.linkedinProfile || "",
            portfolioWebsite: s.portfolioWebsite || curr.portfolioWebsite || "",
            languages: s.languages || curr.languages || "",
            certifications: s.certifications || curr.certifications || "",
            industry: s.industry || curr.industry || "",
            education: edu,
            professional: prof,
            resume: file,
            ...(allowMultipleResumeSelection ? { resumeFiles: files } : {}),
            resumeParsedAt: new Date().toISOString(),
            resumeParseCache: {
              ...(curr.resumeParseCache || {}),
              [resumeCacheKey(file)]: result.data || {},
            },
          });
        });
      }
      if (allowMultipleResumeSelection && files.length > 1) {
        const initialCache = {
          [resumeCacheKey(file)]: result.data || {},
        };
        preparseRemainingResumes(files, initialCache);
      }
      const genderSelect = genderSelectValue(s.gender);
      if (genderSelect && typeof setGender === 'function') {
        setGender(genderSelect);
      }
      if (s.email && typeof setEmail === 'function') {
        setEmail(s.email.toLowerCase());
      }
      setExtracted(true);
      setExtractError("");
    } catch (err) {
      const msg =
        getFriendlyExtractError({
          code: err?.code,
          error: err?.message,
        }) || "Unable to parse resume. Please try again.";
      setExtractError(msg);
      setExtracted(false);
      tostify(msg);
    } finally {
      setLoading(false);
      if (evt.target) evt.target.value = '';
    }
  };

  const themeColor = localStorage.getItem('themecolor') || '#105996';

  const selectedResumeFiles =
    Array.isArray(candidate?.resumeFiles) && candidate.resumeFiles.length > 0
      ? candidate.resumeFiles
      : candidate?.resume
        ? [candidate.resume]
        : [];

  const bulkActive = bulkUploadProgress?.active === true;
  const bulkTotal = bulkUploadProgress?.total || 0;
  const bulkCurrent = bulkUploadProgress?.current || 0;
  const bulkPhase = bulkUploadProgress?.phase || "";
  const bulkPhaseText =
    bulkPhase === "parsing"
      ? "Extracting data from resume (AI)..."
      : bulkPhase === "uploading"
        ? "Saving candidate..."
        : "Processing";
  const bulkPercent =
    bulkTotal > 0 ? Math.min(100, Math.round((bulkCurrent / bulkTotal) * 100)) : 0;

  const removeResumeFile = (index) => {
    if (bulkActive || isDisabledAllFields) return;
    setCandidate((prev) => {
      const base = Array.isArray(prev) ? {} : prev || {};
      const files = [...(base.resumeFiles || selectedResumeFiles)];
      files.splice(index, 1);
      const next = {
        ...base,
        resumeFiles: files,
        resume: files[0] || null,
      };
      if (files.length === 0) {
        delete next.resumeParsedAt;
        setExtracted(false);
      } else if (index === 0) {
        delete next.resumeParsedAt;
        setExtracted(false);
      }
      return next;
    });
  };

  return (
    <div>
      {/* Resume Upload Helper — only on /candidate bulk upload page */}
      {resumeUploadOnly && (
      <div className="mb-3 p-3 border rounded" style={{ backgroundColor: "#f8f9fa", borderColor: "#e9ecef" }}>
        <Row className="gy-1">
          <Col xs={12} className="mb-2">
            <h4 style={{ color: themeColor, fontWeight: 600, marginBottom: "4px" }}>Resume Upload with Auto Data Extraction</h4>
            <p className="text-muted mb-1" style={{ fontSize: "13px" }}>Upload a resume (PDF / DOC / DOCX / JPG / PNG) to auto-fill candidate details. Review all fields before saving.</p>
            {!apiConfigChecking && apiConfigReady === false && (
              <div
                className="mt-2 p-2 rounded"
                style={{
                  backgroundColor: "#f8d7da",
                  border: "1px solid #f5c2c7",
                  color: "#842029",
                  fontSize: "13px",
                }}
              >
                {apiConfigError || DEFAULT_API_CONFIG_ERROR}
              </div>
            )}
            {extractError && (
              <div
                className="mt-2 p-2 rounded"
                style={{
                  backgroundColor: "#fff3cd",
                  border: "1px solid #ffecb5",
                  color: "#664d03",
                  fontSize: "13px",
                }}
              >
                {extractError}
              </div>
            )}
          </Col>
          <Col lg={8} xs={12}>
            <Label className="form-label fw-bold mb-1" style={{ fontSize: "12px", color: "#5e5873" }}>Upload Resume</Label>
            <Input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
              multiple={allowMultipleResumeSelection}
              disabled={
                isDisabledAllFields ||
                loading ||
                apiConfigChecking ||
                apiConfigReady !== true ||
                bulkActive
              }
              onChange={handleFileChange}
            />
          </Col>
          <Col lg={4} xs={12} className="d-flex align-items-end mt-2 mt-lg-0">
            {loading || apiConfigChecking ? (
              <div className="d-flex align-items-center gap-2 text-primary fw-bold w-100" style={{ paddingBottom: "6px" }}>
                <div className="spinner-border spinner-border-sm" role="status"></div>
                <span style={{ fontSize: "12px" }}>
                  {loading ? "Extracting data..." : "Checking API config..."}
                </span>
              </div>
            ) : preparingResumes.active ? (
              <div className="d-flex align-items-center gap-2 text-primary fw-bold w-100" style={{ paddingBottom: "6px" }}>
                <div className="spinner-border spinner-border-sm" role="status"></div>
                <span style={{ fontSize: "12px" }}>
                  Preparing {preparingResumes.done} of {preparingResumes.total} resumes...
                </span>
              </div>
            ) : apiConfigReady !== true ? (
              <span className="text-danger w-100" style={{ fontSize: "12px", fontWeight: 600, paddingBottom: "6px" }}>
                Resume upload blocked until API is configured
              </span>
            ) : (candidate?.resumeParsedAt || extracted) ? (
              <Button
                type="button"
                className="btn btn-sm w-100 fw-bold"
                disabled
                style={{
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  border: "1px solid #c3e6cb",
                  padding: "8px 10px",
                }}
              >
                ✓ Auto Data Extracted
              </Button>
            ) : allowMultipleResumeSelection && selectedResumeFiles.length > 0 ? (
              <span className="text-muted w-100" style={{ fontSize: "12px", paddingBottom: "6px" }}>
                First file preview — all files upload on Submit
              </span>
            ) : (
              <span className="text-muted w-100" style={{ fontSize: "12px", paddingBottom: "6px" }}>
                Select file to extract info automatically
              </span>
            )}
          </Col>

          {allowMultipleResumeSelection && selectedResumeFiles.length > 0 && (
            <Col xs={12} className="mt-2">
              <div
                className="d-flex justify-content-between align-items-center mb-50 px-1"
                style={{ fontSize: "12px", color: "#5e5873" }}
              >
                <strong>
                  {selectedResumeFiles.length} resume
                  {selectedResumeFiles.length > 1 ? "s" : ""} selected
                </strong>
                {!bulkActive && (
                  <span className="text-muted">Tap ✕ to remove before Submit</span>
                )}
              </div>
              <div
                style={{
                  maxHeight: "140px",
                  overflowY: "auto",
                  border: "1px solid #dce3ed",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}
              >
                {selectedResumeFiles.map((file, index) => {
                  const name = file?.name || `Resume ${index + 1}`;
                  return (
                    <div
                      key={`${name}-${index}`}
                      className="d-flex align-items-center justify-content-between"
                      style={{
                        padding: "8px 12px",
                        borderBottom:
                          index < selectedResumeFiles.length - 1
                            ? "1px solid #f0f2f5"
                            : "none",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#4b4b4b",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {index === 0 && candidate?.resumeParsedAt ? (
                          <span style={{ color: themeColor, fontWeight: 600 }}>★ </span>
                        ) : null}
                        {name}
                      </span>
                      {!bulkActive && (
                        <Button
                          type="button"
                          color="link"
                          className="p-0 d-flex align-items-center"
                          style={{ color: "#ea5455", minWidth: "22px" }}
                          onClick={() => removeResumeFile(index)}
                          title="Remove resume"
                        >
                          <X size={15} />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Col>
          )}

          {bulkActive && bulkTotal > 0 && (
            <Col xs={12} className="mt-2">
              <div
                className="p-2 rounded"
                style={{
                  backgroundColor: "#f0f4ff",
                  border: `1px solid ${themeColor}33`,
                }}
              >
                <div className="mb-50">
                  <strong style={{ fontSize: "13px", color: themeColor }}>
                    Uploading {bulkCurrent} of {bulkTotal}
                  </strong>
                </div>
                <Progress
                  value={bulkPercent}
                  style={{ height: "10px", borderRadius: "6px" }}
                  color="primary"
                />
                <small className="text-muted d-block mt-50" style={{ fontSize: "11px" }}>
                  {bulkUploadProgress?.label
                    ? `${bulkPhaseText}: ${bulkUploadProgress.label}`
                    : bulkPhaseText}
                </small>
              </div>
            </Col>
          )}
        </Row>
      </div>
      )}

      {!resumeUploadOnly && (
      <>
      {/* BASIC INFO */}
      <Row className="gy-1 pt-75">
        <div>
          <h4>Basic Info</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="firstname">
              First Name<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="firstname"
              name="firstname"
              className="w-100"
              maxLength={200}
              type="text"
              onFocus={() => setIsfocus("firstname")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "firstname" && themecolor,
              }}
              disabled={isDisabledAllFields}
              placeholder={"Enter FirstName"}
              value={candidate?.firstname}
              onChange={(e) => {
                handleChange(e);
                // setFName(e.target.value)
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="lastname">
              Last Name<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="lastname"
              name="lastname"
              onFocus={() => setIsfocus("lastname")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "lastname" && themecolor,
              }}
              maxLength={200}
              className="w-100"
              type="text"
              value={candidate?.lastname}
              disabled={isDisabledAllFields}
              // value={searchTerm}
              placeholder={"Enter Lastname"}
              onChange={(e) => {
                // setLName(e.target.value)
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="email">
              Email<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="email"
              name="email"
              onFocus={() => setIsfocus("email")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "email" && themecolor,
              }}
              className="w-100"
              maxLength={200}
              type="email"
              placeholder={"Enter Email"}
              disabled={isDisabledAllFields}
              value={candidate?.email}
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase());
                // handleChange(e)
                setCandidate({
                  ...candidate,
                  [e.target.id]: e.target.value.toLowerCase(),
                });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="mail">
              Mobile<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="mobile"
              onFocus={() => setIsfocus("mobile")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "mobile" && themecolor,
              }}
              className="w-100"
              type="text"
              placeholder={"Enter Mobile"}
              maxLength="10"
              disabled={isDisabledAllFields}
              value={candidate?.mobile}
              onChange={(e) => {
                // setMobile(e.target.value)
                setCandidate({
                  ...candidate,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                });
                //  handleChange(e)
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="number">
              Father / Mother Contact<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="alternateMobile"
              onFocus={() => setIsfocus("alternateMobile")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "alternateMobile" && themecolor,
              }}
              className="w-100"
              placeholder={"Enter Father/Mother Mother"}
              type="text"
              maxLength={"10"}
              disabled={isDisabledAllFields}
              value={candidate?.alternateMobile}
              onChange={(e) => {
                // setAlternateMobile(e.target.value)
                // handleChange(e)
                setCandidate({
                  ...candidate,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label for="role-select">
            Gender<span style={{ color: "red" }}>*</span>
          </Label>
          <Select
            id="gender"
            value={gender}
            placeholder="Select Gender"
            options={genderOptions}
            className="react-select"
            isDisabled={isDisabledAllFields}
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setGender(e);
              handleChange(e);
            }}
          />
        </Col>
      </Row>
      </>
      )}
    </div>
  );
};

export default Basic;
