import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Progress,
  Row,
} from "reactstrap";
import Basic from "../Forms/Candidates/Basic";
import { Address } from "../Forms/Candidates/Address";
import Professional from "../Forms/Candidates/Professional";
// import Education from '../Forms/Candidates/Education'
// import Experience from '../Forms/Candidates/Experience'
import Attachment_File from "../Forms/Candidates/Attachment_File";
import RecruiterInternalComments from "../Forms/Candidates/RecruiterInternalComments";
import { Country, State, City } from "country-state-city";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import {
  calculateProfileCompleteness,
  PROFILE_COMPLETION_SECTION_LABELS,
  PROFILE_COMPLETION_WEIGHTS,
} from "../../utility/profileCompleteness";
import { resolveIndianAddress } from "../../utility/resolveIndianAddress";

const Candidate = ({
  CandidateHandler = () => { },
  candidate,
  setIndustriesData,
  update,
  // candidateId,
  industriesData,
  setEmail,
  create,
  setCandidate,
  // setFilterData,
  setCreate,
  setUpdate,
  show,
  setGender,
  gender,
  setShow,
  isDisabledAllFields,
  setIsDisabledAllFields,
  loading,
  hideProfileCompletion = false,
  allowMultipleResumeSelection = false,
  resumeUploadOnly = false,
}) => {
  // const { user } = useSelector((state) => state.auth);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  // True while Basic is checking API config or extracting resume data
  const [resumeBusy, setResumeBusy] = useState(false);

  // if (user.email !== "uniqueworldjobs@gmail.com") {
  //   if (candidate.agencyId != user.agencyId) {
  //     setIsDisabledAllFields(true);
  //   } else {
  //     setIsDisabledAllFields(false);
  //   }
  // } else {
  //   setIsDisabledAllFields(false);
  // }
  useEffect(() => {
    const getStates = async () => {
      try {
        const result = await State.getStatesOfCountry("IN");
        setStates(result);
      } catch (error) {
        setStates([]);
      }
    };
    getStates();
  }, []);

  useEffect(() => {
    const getCities = async () => {
      try {
        let isoCode = selectedState?.isoCode || candidate?.stateId;
        if (!isoCode && candidate?.state) {
          isoCode = resolveIndianAddress({
            state: candidate.state,
            stateId: candidate.stateId,
          }).stateId;
        }
        if (!isoCode) {
          setCities([]);
          return;
        }
        const result = await City.getCitiesOfState("IN", isoCode);
        setCities(result || []);
      } catch (error) {
        setCities([]);
      }
    };

    getCities();
  }, [selectedState, candidate?.stateId, candidate?.state, candidate?.resumeParsedAt]);

  // Reset address selects when opening a fresh create form
  useEffect(() => {
    if (!show) return;
    if (!candidate?.state && !candidate?.stateId) {
      setSelectedState(undefined);
      setSelectedCity(undefined);
    }
  }, [show, candidate?.resumeParsedAt, candidate?.id]);

  const completion = useMemo(
    () => calculateProfileCompleteness(candidate || {}),
    [candidate]
  );

  const handleChange = (e) => {
    if (e?.key == "state") {
      setCandidate({ ...candidate, state: e.value, stateId: e.isoCode });
    } else if (e?.key == "city") {
      setCandidate({ ...candidate, city: e.value, cityId: e.value });
    } else {
      if (e?.target?.id === undefined) {
        setCandidate({ ...candidate, [e.id]: e.value });
      } else {
        if (e.target.id === "street" || e.target.id === "area")
          setCandidate({ ...candidate, [e.target.id]: e.target.value });
        else
          setCandidate({
            ...candidate,
            [e.target.id]: e.target.value.replace(/[^a-z]/gi, ""),
          });
      }
    }
  };

  const fileOnChangeHandler = (e) => {
    const files = Array.from(e?.target?.files || []);
    setCandidate({
      ...candidate,
      [e.target.id]: files[0] || null,
      ...(e.target.id === "resume" && allowMultipleResumeSelection
        ? { resumeFiles: files }
        : {}),
    });
  };
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [focus, setIsfocus] = useState(null);
  // const [isdashboard, setisdashboard] = useState(false);

  function pushfunction() {
    // history.push(`/${user?.agency?.slug}/dashboard`);
  }
  return (
    <>
      <Modal
        isOpen={show}
        toggle={() => {
          setShow(show);
        }}
        className={`modal-dialog-centered ${resumeUploadOnly ? "modal-md" : "modal-xl"}`}
      >
        <ModalHeader
          className="bg-transparent"
          // onClick={() => onClickHandler()}
          toggle={() => {
            // setFilterData([])
            setIsDisabledAllFields(false);
            setShow(!show);
            setUpdate(false);
            setCreate(false);
            pushfunction();
          }}
        ></ModalHeader>

        {loading == true ? (
          <Loader loading={loading} theamcolour={themecolor} />
        ) : null}
        <ModalBody className="px-sm-5 pt-50 pb-5">
          {!hideProfileCompletion && !resumeUploadOnly && (
            <div
              className="mb-2 p-2"
              style={{
                border: `1px solid ${themecolor || "#323D76"}33`,
                borderRadius: 8,
                background: "#ffffff",
                position: "sticky",
                top: 0,
                zIndex: 5,
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <strong style={{ fontSize: 14 }}>Profile Completion Ratio</strong>
                <strong style={{ color: themecolor || "#323D76", fontSize: 14 }}>
                  {completion.profileCompletenessLabel}
                </strong>
              </div>
              <Progress
                value={Math.min(Math.max(completion.profileCompleteness, 0), 100)}
                color={completion.barColor}
                style={{ height: 10, borderRadius: 6 }}
                className="mb-1"
              />
              <div
                className="d-flex flex-wrap"
                style={{ gap: "6px 12px", fontSize: 11 }}
              >
                {Object.keys(PROFILE_COMPLETION_SECTION_LABELS).map((key) => {
                  const filled = completion.profileCompletenessBreakdown?.[key];
                  return (
                    <span
                      key={key}
                      style={{
                        color: filled ? "#28c76f" : "#6e6b7b",
                        fontWeight: filled ? 600 : 400,
                      }}
                    >
                      {filled ? "✓" : "○"} {PROFILE_COMPLETION_SECTION_LABELS[key]}{" "}
                      ({PROFILE_COMPLETION_WEIGHTS[key]}%)
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bassic Info */}
          <Basic
            candidate={candidate}
            setCandidate={setCandidate}
            create={create}
            handleChange={handleChange}
            setEmail={setEmail}
            setGender={setGender}
            gender={gender}
            isDisabledAllFields={isDisabledAllFields}
            allowMultipleResumeSelection={allowMultipleResumeSelection}
            resumeUploadOnly={resumeUploadOnly}
            onResumeBusyChange={setResumeBusy}
          />

          {!resumeUploadOnly && (
          <>
          {/* ADDRESS INFORMATION */}
          <Address
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={cities}
            states={states}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            setCandidate={setCandidate}
            candidate={candidate}
            handleChange={handleChange}
            isDisabledAllFields={isDisabledAllFields}
          />

          {/* PROFESSIONAL DETAILS */}
          <Professional
            industriesData={industriesData}
            setIndustriesData={setIndustriesData}
            update={update}
            candidate={candidate}
            setCandidate={setCandidate}
            isDisabledAllFields={isDisabledAllFields}
          />

          {/* EDUCATIONAL DETAILS */}
          {/* <Education
            setCandidate={setCandidate}
            update={update}
            candidate={candidate}
          />

          <Experience
            setCandidate={setCandidate}
            update={update}
            candidate={candidate}
          /> */}

          {/* ATTACHMENT INFORMATION */}
          <Attachment_File
            fileOnChangeHandler={fileOnChangeHandler}
            candidate={candidate}
            update={update}
            isDisabledAllFields={isDisabledAllFields}
            allowMultipleResumeSelection={allowMultipleResumeSelection}
          />
          <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
            <Col lg={12} xs={12} xl={12}>
              <Label id="Comments">Comments</Label>
              <Input
                type="textarea"
                name="comments"
                onFocus={() => setIsfocus("comments")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "comments" && themecolor,
                }}
                id="comments"
                rows="3"
                maxLength={250}
                disabled={isDisabledAllFields}
                value={candidate?.comments}
                placeholder="Enter Comments"
                onChange={(e) => {
                  setCandidate({
                    ...candidate,
                    [e.target.id]: e.target.value,
                  });
                }}
              />
            </Col>
          </Row>

          {(update || candidate?.id) && (
            <RecruiterInternalComments
              candidateId={candidate?.id}
              isDisabledAllFields={isDisabledAllFields}
            />
          )}
          </>
          )}

          {/* SUBMIT BUTTON */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Button
              type="button"
              className="add-new-user"
              disabled={
                isDisabledAllFields === true ||
                loading === true ||
                resumeBusy === true
              }
              style={
                isDisabledAllFields === true ||
                loading === true ||
                resumeBusy === true
                  ? {
                    opacity: "0.6",
                    cursor: "not-allowed",
                    pointerEvents: "none",
                    backgroundColor: themecolor,
                    color: "white",
                  }
                  : { backgroundColor: themecolor, color: "white" }
              }
              color="default"
              onClick={(e) => {
                if (isDisabledAllFields || loading || resumeBusy) return;
                CandidateHandler(e);
              }}
            >
              {resumeUploadOnly
                ? candidate?.resumeFiles?.length > 1
                  ? `Submit ${candidate.resumeFiles.length} Resumes`
                  : "Submit Resume"
                : "Submit"}
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* <Modal
        className="modal-dialog-centered modal-xl modal-loader"

        isOpen={modalLoader} >
        <ModalBody>


          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ComponentSpinner />
          </div>

        </ModalBody>
      </Modal> */}
    </>
  );
};

export default Candidate;
