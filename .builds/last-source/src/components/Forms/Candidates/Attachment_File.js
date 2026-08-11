import React, { useState } from "react";
import { Col, Input, Label, Row, Button } from "reactstrap";
import { ReactComponent as Cancel } from "../../../assets/images/x.svg";
import { resolveAssetUrl } from "../../../utility/resolveAssetUrl";
import { tostify } from "../../Tostify";

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
}) => {
  const [isShowFileName, setIsShowFileName] = useState(true);
  const [isShowImageName, setIsShowImageName] = useState(true);

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

  return (
    <div>
      <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
        <div>
          <h4>Attachment Information</h4>
        </div>

        <Col lg={6} xs={12} xl={6}>
          <Label>Resume</Label>
          <div style={{ display: "flex", alignItems: "center" }}>
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
                disabled={isDisabledAllFields}
                placeholder={"fileName"}
                onChange={(e) => {
                  fileOnChangeHandler(e);
                }}
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
