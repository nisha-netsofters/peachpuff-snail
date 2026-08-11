import React, { useEffect, useState } from "react";
import { Plus, X } from "react-feather";
import { Row, Col, Input, Label, Button } from "reactstrap";
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
    lower.includes("api key") ||
    lower.includes("unauthorized") ||
    lower.includes("invalid authentication") ||
    lower.includes("credential")
  ) {
    return AI_VALIDATION_MESSAGES.AI_API_KEY_INVALID;
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

  // Keep parent Submit button disabled while API check / extract is in progress
  useEffect(() => {
    onResumeBusyChange(Boolean(loading || apiConfigChecking));
  }, [loading, apiConfigChecking]);

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
    let cancelled = false;
    const MIN_CHECK_MS = 2500;

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
  }, []);

  const handleFileChange = async (evt) => {
    const files = Array.from((evt.target && evt.target.files) || []);
    const file = files[0];
    if (!file) return;

    // Always re-check Super Admin OCR/AI config before extraction
    setApiConfigChecking(true);
    const startedAt = Date.now();
    const latestStatus = await fetchResumeExtractionStatus();
    const waitMore = Math.max(0, 2500 - (Date.now() - startedAt));
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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    const isAllowedResumeFile = (f) => {
      const ext = String(f?.name || "").split(".").pop().toLowerCase();
      return allowedExt.includes(ext) || allowedMime.includes(f?.type);
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
        ["AI_API_KEY_INVALID", "AI_MODEL_INVALID", "AI_RATE_LIMIT", "AI_PARSE_FAILED", "API_CONFIG_NOT_SET"].includes(
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
            resumeParsedAt: new Date().toISOString()
          });
        });
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

  return (
    <div>
      {/* Resume Upload Helper */}
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
              disabled={isDisabledAllFields || loading || apiConfigChecking || apiConfigReady !== true}
              onChange={handleFileChange}
            />
          </Col>
          <Col lg={4} xs={12} className="d-flex align-items-end mt-2 mt-lg-0">
            {loading || apiConfigChecking ? (
              <div className="d-flex align-items-center gap-2 text-primary fw-bold">
                <div className="spinner-border spinner-border-sm" role="status"></div>
                <span>{loading ? "Extracting data..." : "Checking API config..."}</span>
              </div>
            ) : apiConfigReady !== true ? (
              <span className="text-danger" style={{ fontSize: "12px", fontWeight: 600 }}>
                Resume upload blocked until API is configured
              </span>
            ) : (candidate?.resumeParsedAt || extracted) ? (
              <Button
                type="button"
                className="btn btn-sm w-100 fw-bold"
                disabled
                style={{ backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb", padding: "8px" }}
              >
                ✓ Auto Data Extracted
              </Button>
            ) : allowMultipleResumeSelection && candidate?.resumeFiles?.length > 0 ? (
              <span className="text-muted" style={{ fontSize: "12px" }}>
                {candidate.resumeFiles.length} files selected. First file will be used for auto-extraction.
              </span>
            ) : (
              <span className="text-muted" style={{ fontSize: "12px" }}>Select file to extract info automatically</span>
            )}
          </Col>
        </Row>
      </div>

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
