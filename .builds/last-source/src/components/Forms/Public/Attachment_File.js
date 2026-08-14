import React, { useEffect, useState } from "react";
import {
  Col,
  Input,
  Label,
  Row,
  Button,
  InputGroup,
} from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import UploadFileProgressBar from "../../ProgressBar/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import awsUploadAssets from "./../../../helper/awsUploadAssets";
import actions from "../../../redux/fileUploadProgress.js/actions";
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
import ResumeExtractSpinner from "../../ResumeExtractSpinner";

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

const Attachment_File = ({
  CandidateHandler = () => {},
  stepper,
  fileOnChangeHandler = () => {},
  loading,
  candidate,
  setCandidate,
  setEmail,
  setMobile,
  setGender,
  setProfessional,
  isFirstStep = false,
  isFinalStep = false,
}) => {
  const { progress } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [isShowFileName, setIsShowFileName] = useState(true);
  const [isShowImageName, setIsShowImageName] = useState(true);
  const [focus, setIsfocus] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [selectedResumeName, setSelectedResumeName] = useState("");
  const [apiConfigReady, setApiConfigReady] = useState(false);
  const [apiConfigError, setApiConfigError] = useState(DEFAULT_API_CONFIG_ERROR);
  const [apiConfigChecking, setApiConfigChecking] = useState(true);
  const [extractError, setExtractError] = useState("");

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
    if (progress?.isUploaded && progress?.uploadedLink) fileOnChangeHandler();
    if (progress?.isError)
      dispatch({
        type: actions.CLEAR_PROGRESS,
      });
  }, [progress]);

  useEffect(() => {
    if (candidate?.resumeParsedAt) setExtracted(true);
  }, [candidate?.resumeParsedAt]);

  const applyExtractedData = (s, file) => {
    const normalized = normalizeExtractedResume(s, course);
    const genderVal = normalized.gender;
    if (typeof setCandidate === "function") {
      setCandidate((prev) => {
        const curr = Array.isArray(prev) ? {} : prev || {};
        const edu =
          curr.education && curr.education.length
            ? curr.education
            : normalized.education || [];
        const prof = Object.assign({}, curr.professional || {}, normalized.professional || {});
        const address = resolveIndianAddress({
          state: normalized.state || curr.state || "",
          city: normalized.city || curr.city || "",
          stateId: curr.stateId || "",
          cityId: curr.cityId || "",
        });
        return Object.assign({}, curr, {
          firstname: normalized.firstname || curr.firstname || "",
          lastname: normalized.lastname || curr.lastname || "",
          mobile: normalized.mobile || curr.mobile || "",
          alternateMobile: normalized.alternateMobile || curr.alternateMobile || "",
          email: normalized.email || curr.email || "",
          gender: genderVal || curr.gender || "",
          dateOfBirth: normalized.dateOfBirth || curr.dateOfBirth || "",
          street: normalized.street || curr.street || "",
          city: address.city,
          cityId: address.cityId,
          state: address.state,
          stateId: address.stateId,
          zip: String(normalized.zip || curr.zip || "")
            .replace(/\D/g, "")
            .slice(0, 6),
          linkedinProfile: normalized.linkedinProfile || curr.linkedinProfile || "",
          portfolioWebsite: normalized.portfolioWebsite || curr.portfolioWebsite || "",
          languages: normalized.languages || curr.languages || "",
          certifications: normalized.certifications || curr.certifications || "",
          industry: normalized.industry || curr.industry || "",
          education: edu,
          professional: prof,
          resume: file,
          resumeParsedAt: new Date().toISOString(),
        });
      });
    }
    if (normalized.professional && typeof setProfessional === "function") {
      setProfessional((prev) => ({
        ...(Array.isArray(prev) ? {} : prev || {}),
        ...normalized.professional,
      }));
    }
    const genderSelect = genderSelectValue(genderVal);
    if (genderSelect && typeof setGender === "function") {
      setGender(genderSelect);
    } else if (typeof setGender === "function" && !genderVal) {
      setGender(null);
    }
    if (normalized.email && typeof setEmail === "function") {
      setEmail(String(normalized.email).toLowerCase());
    }
    if (normalized.mobile && typeof setMobile === "function") {
      setMobile(String(normalized.mobile).replace(/\D/g, "").slice(0, 10));
    }
  };

  const handleResumeSelect = async (evt) => {
    const file = evt?.target?.files?.[0];
    if (!file) return;

    setSelectedResumeName(file.name);
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
      // Still allow plain upload without AI
      await awsUploadAssets(file, "resume", dispatch);
      if (evt.target) evt.target.value = "";
      return;
    }

    setApiConfigError("");
    setExtractError("");

    const ext = file.name.split(".").pop().toLowerCase();
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
    const extAllowed = allowedExt.includes(ext);
    const mimeAllowed =
      file.type &&
      (allowedMime.includes(file.type) ||
        (file.type === "application/octet-stream" && extAllowed));
    if (!extAllowed && !mimeAllowed) {
      const msg = "Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG file";
      setExtractError(msg);
      tostify(msg);
      return;
    }

    setExtracting(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      let result = null;
      try {
        result = await apiCall.post("/candidate/publicParseResume", formData);
      } catch (err1) {
        result = err1?.response?.data || null;
        if (!result) {
          try {
            result = await apiCall.post("/candidate/parse-resume", formData);
          } catch (err2) {
            result = err2?.response?.data || null;
          }
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

      applyExtractedData(result.data || {}, file);
      setExtracted(true);
      setExtractError("");
      tostifySuccess(
        "✓ Resume data extracted successfully. Please review fields in next steps."
      );

      // Persist file URL for final submit
      await awsUploadAssets(file, "resume", dispatch);
    } catch (err) {
      const msg =
        getFriendlyExtractError({
          code: err?.code,
          error: err?.message,
        }) || "Unable to parse resume. Please try again.";
      setExtractError(msg);
      setExtracted(false);
      tostify(msg);
      // Fallback: still upload resume without extraction
      try {
        await awsUploadAssets(file, "resume", dispatch);
      } catch (e) {}
    } finally {
      setExtracting(false);
      if (evt.target) evt.target.value = "";
    }
  };

  const handleUploadImage = async (image) => {
    if (!image) return;
    await awsUploadAssets(image, "image", dispatch);
  };

  const handlePrimaryAction = () => {
    if (isFinalStep) {
      CandidateHandler();
      return;
    }
    if (!candidate?.resume) {
      tostify("Please upload resume");
      return;
    }
    stepper?.next();
  };

  const getResumeDisplayName = () => {
    const resume = candidate?.resume;
    if (!resume) return selectedResumeName || "";
    if (typeof resume === "string") {
      try {
        const decoded = decodeURIComponent(resume);
        const name = decoded.substring(decoded.lastIndexOf("/") + 1);
        return name && name !== "undefined" ? name : selectedResumeName || "Resume uploaded";
      } catch (e) {
        return selectedResumeName || "Resume uploaded";
      }
    }
    if (resume?.name) return resume.name;
    return selectedResumeName || "Resume uploaded";
  };

  const getImageDisplayName = () => {
    const image = candidate?.image;
    if (!image) return "";
    if (typeof image === "string") {
      try {
        const decoded = decodeURIComponent(image);
        const name = decoded.substring(decoded.lastIndexOf("/") + 1);
        return name && name !== "undefined" ? name : "Image uploaded";
      } catch (e) {
        return "Image uploaded";
      }
    }
    if (image?.name) return image.name;
    return "Image uploaded";
  };

  const hasResume = Boolean(
    selectedResumeName ||
      (typeof candidate?.resume === "string" && candidate.resume.length > 0) ||
      (candidate?.resume && typeof candidate.resume === "object")
  );
  const hasImage = Boolean(
    (typeof candidate?.image === "string" && candidate.image.length > 0) ||
      (candidate?.image && typeof candidate.image === "object")
  );

  const themeColor = "#105996";
  const busy = loading || extracting || apiConfigChecking;
  const resumeLabel = getResumeDisplayName();
  const imageLabel = getImageDisplayName();

  return (
    <div>
      <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
        <div>
          <h4>Attachment Information</h4>
        </div>

        <Col xs={12}>
          <div
            className="mb-2 p-3 border rounded"
            style={{ backgroundColor: "#f8f9fa", borderColor: "#e9ecef" }}
          >
            <h5 style={{ color: themeColor, fontWeight: 600, marginBottom: 4 }}>
              Resume Upload with Auto Data Extraction
            </h5>
            <p className="text-muted mb-1" style={{ fontSize: 13 }}>
              Upload a resume (PDF / DOC / DOCX / JPG / PNG) to auto-fill candidate details.
              Review all fields in the next steps before submitting.
            </p>
            {!apiConfigChecking && apiConfigReady === false && (
              <div
                className="mt-2 p-2 rounded"
                style={{
                  backgroundColor: "#f8d7da",
                  border: "1px solid #f5c2c7",
                  color: "#842029",
                  fontSize: 13,
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
                  fontSize: 13,
                }}
              >
                {extractError}
              </div>
            )}
            {(extracting || apiConfigChecking) && (
              <div className="mt-2 d-flex align-items-center gap-2 text-primary fw-bold">
                <ResumeExtractSpinner />
                <span>
                  {extracting ? "Extracting data..." : "Checking API config..."}
                </span>
              </div>
            )}
            {!extracting && !apiConfigChecking && (candidate?.resumeParsedAt || extracted) && (
              <div
                className="mt-2 p-2 rounded d-flex align-items-center gap-2"
                style={{
                  backgroundColor: "#d4edda",
                  border: "1px solid #c3e6cb",
                  color: "#155724",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    fontSize: 14,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>Auto Data Extracted — continue to review details</span>
              </div>
            )}
          </div>
        </Col>

        <Col md={6} xs={12}>
          <Label>Resume</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {hasResume && isShowFileName ? (
              <Label className="mb-0" style={{ wordBreak: "break-all" }}>
                {resumeLabel}
              </Label>
            ) : (
              <InputGroup>
                <Input
                  type="file"
                  onFocus={() => setIsfocus("Resume")}
                  onBlur={() => setIsfocus(null)}
                  style={{
                    borderColor: focus === "Resume" && themeColor,
                  }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                  id="resume"
                  name="customFile"
                  disabled={busy}
                  onChange={handleResumeSelect}
                />
              </InputGroup>
            )}
            {hasResume ? (
              <Button
                type="button"
                className="add-new-user"
                color="default"
                style={{ color: themeColor }}
                title="Change resume"
                onClick={() => {
                  setIsShowFileName(false);
                  setSelectedResumeName("");
                  setCandidate((prev) => {
                    const base = Array.isArray(prev) ? {} : prev || {};
                    const next = { ...base };
                    delete next.resume;
                    delete next.resumeParsedAt;
                    return next;
                  });
                  setExtracted(false);
                }}
              >
                <Cancel height={16} width={16} />
              </Button>
            ) : null}
            {hasResume && typeof candidate?.resume === "string" ? (
              <Button
                type="button"
                className="add-new-user"
                color="default"
                style={{ color: themeColor }}
                onClick={() => {
                  const url = resolveAssetUrl(candidate?.resume);
                  if (!url) {
                    tostify("Resume file not available");
                    return;
                  }
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                View
              </Button>
            ) : null}
          </div>
          {progress?.resume && <UploadFileProgressBar />}
        </Col>
        <Col md={6} xs={12}>
          <Label>Image</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {hasImage && isShowImageName ? (
              <Label className="mb-0" style={{ wordBreak: "break-all" }}>
                {imageLabel}
              </Label>
            ) : (
              <InputGroup>
                <Input
                  type="file"
                  onFocus={() => setIsfocus("Image")}
                  onBlur={() => setIsfocus(null)}
                  style={{
                    borderColor: focus === "Image" && themeColor,
                  }}
                  accept="image/png, image/jpeg, image/jpg"
                  id="image"
                  name="customFile"
                  disabled={busy}
                  onChange={(e) => {
                    handleUploadImage(e.target.files[0]);
                  }}
                />
              </InputGroup>
            )}

            {hasImage ? (
              <Button
                type="button"
                className="add-new-user"
                color="default"
                style={{ color: themeColor }}
                onClick={() => {
                  setIsShowImageName(false);
                  setCandidate((prev) => {
                    const base = Array.isArray(prev) ? {} : prev || {};
                    const next = { ...base };
                    delete next.image;
                    return next;
                  });
                }}
              >
                <Cancel height={16} width={16} />
              </Button>
            ) : null}

            {hasImage && typeof candidate?.image === "string" ? (
              <Button
                type="button"
                className="add-new-user"
                color="default"
                style={{ color: themeColor }}
                onClick={() => {
                  const url = resolveAssetUrl(candidate?.image);
                  if (!url) {
                    tostify("Image file not available");
                    return;
                  }
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                View
              </Button>
            ) : null}
          </div>
          {progress?.image && <UploadFileProgressBar />}
        </Col>
      </Row>
      <Row className="mt-2" style={{ display: "flex" }}>
        <Col style={{ textAlign: "left" }}>
          {!isFirstStep ? (
            <Button
              type="button"
              color="default"
              style={{ backgroundColor: themeColor, color: "white" }}
              onClick={() => stepper?.previous()}
              className="btn-next"
            >
              <span className="align-middle d-sm-inline-block d-none">
                Previous
              </span>
              <ArrowLeft
                size={14}
                className="align-middle ms-sm-25 ms-0"
              ></ArrowLeft>
            </Button>
          ) : null}
        </Col>
        <Col style={{ textAlign: "right" }}>
          <Button
            type="button"
            className="add-new-user"
            color="default"
            style={{ backgroundColor: themeColor, color: "white" }}
            disabled={busy}
            onClick={handlePrimaryAction}
          >
            {busy
              ? "Loading..."
              : isFinalStep
              ? "Submit"
              : (
                <>
                  <span className="align-middle d-sm-inline-block d-none">
                    Next
                  </span>
                  <ArrowRight
                    size={14}
                    className="align-middle ms-sm-25 ms-0"
                  />
                </>
              )}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Attachment_File;
