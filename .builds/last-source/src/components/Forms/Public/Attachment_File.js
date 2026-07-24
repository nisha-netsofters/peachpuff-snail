import React, { useEffect, useState } from "react";
import {
  Col,
  Input,
  Label,
  Row,
  Button,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import UploadFileProgressBar from "../../ProgressBar/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { BsUpload } from "react-icons/bs";
import awsUploadAssets from "./../../../helper/awsUploadAssets";
import actions from "../../../redux/fileUploadProgress.js/actions";
// import { toast } from 'react-toastify'
import { ReactComponent as Cancel } from "../../../assets/images/x.svg";
import { resolveAssetUrl } from "../../../utility/resolveAssetUrl";
import { tostify } from "../../Tostify";
const Attachment_File = ({
  CandidateHandler = () => { },
  stepper,
  fileOnChangeHandler = () => { },
  // candidate,
  loading,
  candidate,
}) => {
  const { progress } = useSelector((state) => state);
  const dispatch = useDispatch();
  // const [resume, setResume] = useState(null)
  // const [image, setImage] = useState(null)

  useEffect(() => {
    if (progress?.isUploaded && progress?.uploadedLink) fileOnChangeHandler();
    if (progress?.isError)
      dispatch({
        type: actions.CLEAR_PROGRESS,
      });
  }, [progress]);

  const handleUploadResume = async (resume) => {
    await awsUploadAssets(resume, "resume", dispatch);
  };
  const handleUploadImage = async (image) => {
    await awsUploadAssets(image, "image", dispatch);
  };
  const handleSubmit = () => {
    // if (candidate?.image == undefined) toast.error("please upload the image")
    // if (candidate?.resume == undefined) toast.error("please upload the resume")
    // if (candidate?.image?.length > 0 && candidate?.resume?.length > 0) {
    CandidateHandler();
    // }
  };
  const [isShowFileName, setIsShowFileName] = useState(true);
  const [isShowImageName, setIsShowImageName] = useState(true);
  const decodedUrl = decodeURIComponent(candidate?.resume);
  const fileName = decodedUrl.substring(decodedUrl.lastIndexOf("/") + 1);
  const decodedUrl1 = decodeURIComponent(candidate?.image);
  const imageName = decodedUrl1.substring(decodedUrl1.lastIndexOf("/") + 1);
  const [focus, setIsfocus] = useState(null);
  return (
    <div>
      <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
        <div>
          <h4>Attachment Information</h4>
        </div>

        <Col md={6} xs={12}>
          <Label>Resume</Label>
          <div style={{ display: "flex", alignItems: "center" }}>
            {candidate?.resume?.length > 0 && isShowFileName ? (
              <Label>{fileName != "undefined" ? fileName : ""}</Label>
            ) : (
              <InputGroup>
                <Input
                  type="file"
                  onFocus={() => setIsfocus("Resume")}
                  onBlur={() => setIsfocus(null)}
                  style={{
                    borderColor: focus === "Resume" && "#105996",
                  }}
                  accept=".pdf"
                  id="resume"
                  name="customFile"
                  onChange={(e) => {
                    // setResume(e.target.files[0])
                    handleUploadResume(e.target.files[0]);
                  }}
                />
                {/* <Button
              className='me-1'
              disabled={resume?.name ? false : true}
              color='primary'
              onClick={handleUploadResume}
            >
              <BsUpload />
            </Button> */}
              </InputGroup>
            )}
            {candidate?.resume?.length > 0 ? (
              <Button
                type="button"
                className="add-new-user"
                color="default"
                style={{ color: "#105996" }}
                onClick={() => setIsShowFileName(!isShowFileName)}
              >
                <Cancel height={16} width={16} />
              </Button>
            ) : null}
            {candidate?.resume?.length > 0 ? (
              <Button
                type="button"
                className="add-new-user"
                color="default"
                style={{ color: "#105996" }}
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
          <div style={{ display: "flex", alignItems: "center" }}>
            {candidate?.image?.length > 0 && isShowImageName ? (
              <Label>{imageName != "undefined" ? imageName : ""}</Label>
            ) : (
              <InputGroup>
                <Input
                  type="file"
                  onFocus={() => setIsfocus("Image")}
                  onBlur={() => setIsfocus(null)}
                  style={{
                    borderColor: focus === "Image" && "#105996",
                  }}
                  accept="image/png, image/jpeg, image/jpg"
                  id="image"
                  name="customFile"
                  onChange={(e) => {
                    // setImage(e.target.files[0])
                    handleUploadImage(e.target.files[0]);
                  }}
                />
                {/* <Button
              className='me-1'
              disabled={image?.name ? false : true}
              color='primary'
              onClick={handleUploadImage}
            >
              <BsUpload />
            </Button> */}
              </InputGroup>
            )}

            {candidate?.image?.length > 0 ? (
              <Button
                type="button"
                className="add-new-user"
                color="default"
                style={{ color: "#105996" }}
                onClick={() => setIsShowImageName(!isShowImageName)}
              >
                <Cancel height={16} width={16} />
              </Button>
            ) : null}

            {candidate?.image?.length > 0 ? (
              <Button
                type="button"
                className="add-new-user"
                color="default"
                style={{ color: "#105996" }}
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
          <Button
            type="submit"
            color="default"
            style={{ backgroundColor: "#105996", color: 'white' }}
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
        </Col>
        <Col style={{ textAlign: "right" }}>
          <Button
            type="button"
            className="add-new-user"
            color="default"
            style={{ backgroundColor: "#105996", color: 'white' }}
            onClick={() => handleSubmit()}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Attachment_File;
