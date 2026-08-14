import React, { useEffect, useState } from "react";
import { Col, Input, Label, Row, Button } from "reactstrap";
import { ReactComponent as Cancel } from "../../../assets/images/x.svg";
import { resolveAssetUrl } from "../../../utility/resolveAssetUrl";
import { tostify, tostifySuccess } from "../../Tostify";
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
  if (/oauth|sign-in|developers\.google|access token/i.test(raw)) {
    return AI_VALIDATION_MESSAGES.AI_API_KEY_INVALID;
  }
  return raw || "Unable to parse resume. Please try again.";
};

const getResumeDisplayName = (resume) => {
  if (!resume) return "";
  if (typeof File !== "undefined" && resume instanceof File) {
    return resume.name || "Resume selected";
  }
  if (typeof resume === "string" && resume.length > 0) {
    try {
      const decodedUrl = decodeURIComponent(resume);
      return decodedUrl.substring(decodedUrl.lastIndexOf("/") + 1) || "Resume";
    } catch (e) {
      return "Resume";
    }
  }
  return "";
};

const getResumeDisplayNames = (resumeFiles = [], fallbackResume) => {
  if (Array.isArray(resumeFiles) && resumeFiles.length > 0) {
    return resumeFiles.map((file) => file?.name).filter(Boolean);
  }
  const singleName = getResumeDisplayName(fallbackResume);
  return singleName ? [singleName] : [];
};

const getImageDisplayName = (image) => {
  if (!image) return "";
  if (typeof File !== "undefined" && image instanceof File) {
    return image.name || "Photo selected";
  }
  if (typeof image === "string" && image.length > 0) {
    try {
      const decodedUrl = decodeURIComponent(image);
      return decodedUrl.substring(decodedUrl.lastIndexOf("/") + 1) || "Photo";
    } catch (e) {
      return "Photo";
    }
  }
  return "";
};

const hasStoredResume = (resume) => {
  if (!resume) return false;
  if (typeof File !== "undefined" && resume instanceof File) return resume.size > 0;
  return typeof resume === "string" && resume.length > 0;
};

const hasStoredImage = (image) => {
  if (!image) return false;
  if (typeof File !== "undefined" && image instanceof File) return image.size > 0;
  return typeof image === "string" && image.length > 0;
};

const openStoredAsset = (path) => {
  const url = resolveAssetUrl(path);
  if (!url) {
    tostify("File not available");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};

const Attachment_File = ({
  candidate,
  update,
  isDisabledAllFields,
  fileOnChangeHandler = () => {},
  allowMultipleResumeSelection = false,
  setCandidate,
  setEmail,
  setGender,
  onResumeBusyChange = () => {},
}) => {
  const [isShowFileName, setIsShowFileName] = useState(true);
  const [isShowImageName, setIsShowImageName] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [apiConfigReady, setApiConfigReady] = useState(false);
  const [apiConfigError, setApiConfigError] = useState(DEFAULT_API_CONFIG_ERROR);
  const [apiConfigChecking, setApiConfigChecking] = useState(true);
  const [extractError, setExtractError] = useState("");

  const resumeNames = getResumeDisplayNames(
    candidate?.resumeFiles,
    candidate?.resume
  );
  const fileName = resumeNames.join(", ");
  const imageName = getImageDisplayName(candidate?.image);
  const resumeReady =
    (Array.isArray(candidate?.resumeFiles) && candidate.resumeFiles.length > 0) ||
    hasStoredResume(candidate?.resume);
  const imageReady = hasStoredImage(candidate?.image);
  const showResumeLabel = resumeReady && isShowFileName;
  const showImageLabel = imageReady && isShowImageName;

  const themecolor = localStorage.getItem("themecolor");
  const [focus, setIsfocus] = useState(null);

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
        setApiConfigError((status && status.message) || DEFAULT_API_CONFIG_ERROR);
      }
      setApiConfigChecking(false);
    };

    checkResumeApiConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (candidate?.resumeParsedAt) setExtracted(true);
  }, [candidate?.resumeParsedAt]);

  useEffect(() => {
    onResumeBusyChange(Boolean(extracting || apiConfigChecking));
  }, [extracting, apiConfigChecking, onResumeBusyChange]);

  const applyExtractedData = (rawData, file, files = []) => {
    const s = normalizeExtractedResume(rawData || {}, course);
    if (typeof setCandidate !== "function") return;

    setCandidate((prev) => {
      const curr = Array.isArray(prev) ? {} : prev || {};
      const edu =
        curr.education && curr.education.length
          ? curr.education
          : s.education || [];
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
        ...(allowMultipleResumeSelection && files.length > 0
          ? { resumeFiles: files }
          : {}),
        resumeParsedAt: new Date().toISOString(),
      });
    });

    const genderSelect = genderSelectValue(s.gender);
    if (genderSelect && typeof setGender === "function") {
      setGender(genderSelect);
    }
    if (s.email && typeof setEmail === "function") {
      setEmail(String(s.email).toLowerCase());
    }
  };

  const handleResumeSelect = async (evt) => {
    const files = Array.from((evt.target && evt.target.files) || []);
    const file = files[0];
    if (!file) return;

    setIsShowFileName(true);

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
      const msg = (latestStatus && latestStatus.message) || DEFAULT_API_CONFIG_ERROR;
      setApiConfigError(msg);
      setExtractError(msg);
      tostify(msg);
      fileOnChangeHandler(evt);
      if (evt.target) evt.target.value = "";
      return;
    }

    setApiConfigError("");
    setExtractError("");

    const allowedExt = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];
    const allowedMime = [
      "application/pdf",
      "application/msword",
      "application/vnd.ms-word",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/octet-stream",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const isAllowedResumeFile = (f) => {
      const ext = String(f?.name || "").split(".").pop().toLowerCase();
      if (allowedExt.includes(ext)) return true;
      if (!f?.type) return false;
      if (f.type === "application/octet-stream") {
        return allowedExt.includes(ext);
      }
      return allowedMime.includes(f.type);
    };
    const invalidFile = files.find((f) => !isAllowedResumeFile(f));
    if (invalidFile) {
      const msg = "Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG file";
      setExtractError(msg);
      tostify(msg);
      if (evt.target) evt.target.value = "";
      return;
    }

    setExtracting(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      let result = null;
      try {
        result = await apiCall.post("/candidate/parse-resume", formData);
      } catch (err1) {
        result = err1?.response?.data || null;
      }

      const isAiValidationError =
        result?.code &&
        [
          "AI_API_KEY_INVALID",
          "AI_MODEL_INVALID",
          "AI_RATE_LIMIT",
          "AI_PARSE_FAILED",
          "API_CONFIG_NOT_SET",
        ].includes(result.code);
      const isSessionTokenError =
        !isAiValidationError &&
        ((result?.msg && /invalid token|expired token|unauthorized/i.test(result.msg)) ||
          (result?.error && /invalid token|expired token/i.test(String(result.error))));

      if (
        (!result || !result.success) &&
        (isSessionTokenError || !result) &&
        !isAiValidationError
      ) {
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

      applyExtractedData(result.data || {}, file, files);
      setExtracted(true);
      setExtractError("");
      tostifySuccess("Resume data extracted. Please review all fields before saving.");
    } catch (err) {
      const msg =
        getFriendlyExtractError({
          code: err?.code,
          error: err?.message,
        }) || "Unable to parse resume. Please try again.";
      setExtractError(msg);
      setExtracted(false);
      tostify(msg);
      fileOnChangeHandler(evt);
    } finally {
      setExtracting(false);
      if (evt.target) evt.target.value = "";
    }
  };

  return (
    <div>
      <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
        <div>
          <h4>Attachment Information</h4>
        </div>

        <Col lg={6} xs={12} xl={6}>
          <Label>Resume</Label>
          {extractError && (
            <div
              className="mb-1 p-2 rounded"
              style={{
                backgroundColor: "#fff3cd",
                border: "1px solid #ffecb5",
                color: "#664d03",
                fontSize: "12px",
              }}
            >
              {extractError}
            </div>
          )}
          {!apiConfigChecking && apiConfigReady === false && (
            <div
              className="mb-1 p-2 rounded"
              style={{
                backgroundColor: "#f8d7da",
                border: "1px solid #f5c2c7",
                color: "#842029",
                fontSize: "12px",
              }}
            >
              {apiConfigError || DEFAULT_API_CONFIG_ERROR}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {showResumeLabel ? (
              <Label className="mb-0">
                {fileName
                  ? `${fileName.slice(0, 80)}${fileName.length > 80 ? "…" : ""}`
                  : ""}
              </Label>
            ) : (
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                id="resume"
                multiple={allowMultipleResumeSelection}
                onFocus={() => setIsfocus("resume")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "resume" && themecolor,
                }}
                name="customFile"
                disabled={
                  isDisabledAllFields || extracting || apiConfigChecking
                }
                placeholder={"fileName"}
                onChange={handleResumeSelect}
              />
            )}
            {resumeReady ? (
              <Button
                type="button"
                className="add-new-user"
                color="link"
                onClick={() => setIsShowFileName(!isShowFileName)}
              >
                <Cancel height={16} width={16} />
              </Button>
            ) : null}
            {update && typeof candidate?.resume === "string" && candidate.resume.length > 0 ? (
              <Button
                type="button"
                className="add-new-user"
                color="link"
                onClick={() => openStoredAsset(candidate?.resume)}
              >
                View
              </Button>
            ) : null}
          </div>
          {extracting || apiConfigChecking ? (
            <small className="text-primary d-block mt-50">
              {extracting ? "Extracting resume data..." : "Checking API config..."}
            </small>
          ) : extracted || candidate?.resumeParsedAt ? (
            <small className="text-success d-block mt-50 fw-bold">
              ✓ Auto data extracted — review fields above
            </small>
          ) : (
            <small className="text-muted d-block mt-50">
              Upload resume to auto-fill candidate details
            </small>
          )}
        </Col>

        <Col lg={6} xs={12} xl={6}>
          <Label>Passport Size Photo</Label>
          <div style={{ display: "flex", alignItems: "center" }}>
            {showImageLabel ? (
              <Label className="mb-0">
                {imageName ? `${imageName.slice(0, 40)}${imageName.length > 40 ? "…" : ""}` : ""}
              </Label>
            ) : (
              <Input
                type="file"
                onFocus={() => setIsfocus("file")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "file" && themecolor,
                }}
                accept="image/png, image/jpeg, image/jpg"
                id="image"
                name="customFile"
                disabled={isDisabledAllFields}
                onChange={(e) => fileOnChangeHandler(e)}
              />
            )}

            {imageReady ? (
              <Button
                type="button"
                className="add-new-user"
                color="link"
                onClick={() => setIsShowImageName(!isShowImageName)}
              >
                <Cancel height={16} width={16} />
              </Button>
            ) : null}

            {update && typeof candidate?.image === "string" && candidate.image.length > 0 ? (
              <Button
                type="button"
                className="add-new-user"
                color="link"
                onClick={() => openStoredAsset(candidate?.image)}
              >
                View
              </Button>
            ) : null}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Attachment_File;
