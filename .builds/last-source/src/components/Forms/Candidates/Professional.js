import React, { useEffect, useState } from "react";
import { Col, Form, Input, Label, Row, Button } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
// import actions from "../../../redux/industries/actions";
import { Formik } from "formik";
import {
  // useDispatch,
  useSelector
} from "react-redux";
import course from "./../Course";
import { toast } from "react-toastify";
import { FileText } from "react-feather";
import { BsUpload } from "react-icons/bs";
import { resolveAssetUrl } from "../../../utility/resolveAssetUrl";
import { tostify } from "../../Tostify";
// import jobCategoryActions from "../../../redux/jobCategory/actions";

const Professional = ({
  candidate,
  industriesData,
  setCandidate,
  resumeFile,
  isResumeUploading,
  showResumeFileName,
  setShowResumeFileName,
  handleResumeChange,
  update,
  isDisabledAllFields,
}) => {
  const jobCategory = useSelector((state) => state.jobCategory.results);
  const industries = useSelector((state) => state.industries);

  // const dispatch = useDispatch();
  const [quelification, setQuelification] = useState();
  const [field, setField] = useState();
  const [industriesOptions, setIndustriesOptions] = useState([]);
  const [subCourse, setSubCourse] = useState();
  const [experienceInYear, setExperienceInYear] = useState([]);
  const [selectindustries, setSelectIndustries] = useState([]);
  const [noticePeriod, setNoticePeriod] = useState();
  const [currentlyWorking, setCurrentlyWorking] = useState();
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);
  const [jobCat, setJobCat] = useState();
  const [eng, setEng] = useState([]);
  useEffect(() => {
    console.log("jobs=====================>", candidate?.professional?.jobCategoryId);

  }), []
  useEffect(() => {
    if (jobCategory?.length > 0) {
      const options = jobCategory.map((item) => ({
        ...item,
        label: item.jobCategory,
        value: item.id || item._id, // Ensure both label and value are set
      }));
      setJobCategoryOptions(options);
    }
  }, [jobCategory]);

  useEffect(() => {
    if (industriesData?.length > 0) {
      const selected = [];
      industriesData.forEach((ele) => {
        ele.label = ele?.industries?.industryCategory;
        ele.value = ele?.industries?.id;
        selected.push(ele);
      });
      setSelectIndustries(selected);
    }
  }, [industriesData]);

  useEffect(() => {
    if (industries?.length > 0) {
      setIndustriesOptions(industries);
    }
  }, [industries]);
  const Quelification = [
    {
      value: "under graduate",
      id: "highestQualification",
      label: "Under Graduate",
    },
    { value: "graduation", id: "highestQualification", label: "Graduation" },
    {
      value: "post graduate",
      id: "highestQualification",
      label: "Post Graduate",
    },
  ];

  const English = [
    { value: "Poor", id: "english", label: "Poor" },
    { value: "Average", id: "english", label: "Average" },
    { value: "Excellent", id: "english", label: "Excellent" },
  ];

  const experienceOptions = [
    { value: "0-1 year", id: "experienceInyear", label: "0-1 Year" },
    { value: "1-3 year", id: "experienceInyear", label: "1-3 Year" },
    { value: "3-5 year", id: "experienceInyear", label: "3-5 Year" },
    { value: "5 year above", id: "experienceInyear", label: "5 Year Above" },
  ];
  const NoticePeriodOptions = [
    { value: "none", id: "noticePeriod", label: "None" },
    { value: "1-15 days", id: "noticePeriod", label: "1-15 Days" },
    { value: "15-30 days", id: "noticePeriod", label: "15-30 Days" },
    { value: "30-45 days", id: "noticePeriod", label: "30-45 Days" },
  ];
  const currentlyWorkingOptions = [
    { value: "yes", id: "currentlyWorking", label: "Yes" },
    { value: "no", id: "currentlyWorking", label: "No" },
  ];
  useEffect(() => {
    if (update === true && candidate?.professional?.field?.length > 0) {
      if (
        subCourse?.field === candidate?.professional?.field ||
        subCourse?.field === undefined
      ) {
        setSubCourse({
          label: candidate?.professional?.course,
          field: field?.label,
          value: candidate?.professional?.course,
        });
      } else {
        setSubCourse(null);
      }
    } else {
      setSubCourse(null);
    }
  }, [field]);

  const onIndustriesChange = (industry) => {
    const data = [];
    industry?.map((ele) => {
      if (ele.c_Id === undefined) {
        data.push({ industriesId: ele.value });
      } else {
        data.push(ele);
      }
    });
    setCandidate((prev) => ({ ...prev, industries_relation: data }));
  };

  const [calculatedExpectedSalary, setCalculatedExpectedSalary] = useState(
    "Current Monthly Salary + 20%"
  );

  const themecolor = localStorage.getItem("themecolor");
  const [focus, setIsfocus] = useState(null);

  return (
    <div>
      <Formik initialValues={{}}>
        {({ values, setFieldValue }) => {
          useEffect(() => {
            const prof = candidate?.professional;
            if (!prof || typeof prof !== "object") return;

            for (const key in prof) {
              if (prof[key] !== undefined && prof[key] !== null && prof[key] !== "") {
                setFieldValue(key, prof[key]);
              }
            }
            if (prof?.experienceInyear?.length > 0) {
              setExperienceInYear({
                label: prof.experienceInyear,
                value: prof.experienceInyear,
              });
            }
            if (prof?.highestQualification?.length > 0) {
              let label = prof.highestQualification;
              const value = prof.highestQualification;
              if (value === "graduation") label = "Graduation";
              if (value === "post graduate") label = "Post Graduate";
              if (value === "under graduate") label = "Under Graduate";
              setQuelification({ value, label, id: "highestQualification" });
            }
            const jobCategoryId =
              prof?.jobCategoryId ||
              prof?.jobCategory?._id ||
              prof?.jobCategory?.id;

            if (jobCategoryId) {
              const label =
                prof?.jobCategory?.jobCategory ||
                prof?.jobCategoryName ||
                jobCategory?.find(
                  (j) => j.id === jobCategoryId || j._id === jobCategoryId
                )?.jobCategory ||
                "Selected Category";

              setJobCat({
                label: label,
                value: jobCategoryId,
              });
              setFieldValue("jobCategoryId", jobCategoryId);
            }
            if (prof?.noticePeriod?.length > 0) {
              setNoticePeriod({
                label: prof.noticePeriod,
                value: prof.noticePeriod,
              });
            }
            if (prof?.english?.length > 0) {
              setEng({
                label: prof.english,
                value: prof.english,
                id: "english",
              });
            }

            if (prof?.currentlyWorking?.length > 0) {
              setCurrentlyWorking({
                label: prof.currentlyWorking,
                value: prof.currentlyWorking,
              });
            }
            if (prof?.field?.length > 0) {
              course.filter((ele) => {
                if (ele.name === prof.field) {
                  setField({ value: ele.sub, label: ele.name });
                }
              });
            }
            if (prof?.currentSalary && Number(prof.currentSalary) > 0) {
              const calculatedSalary = parseFloat(prof.currentSalary) * 1.2;
              if (!isNaN(calculatedSalary)) {
                setCalculatedExpectedSalary(calculatedSalary.toFixed(0));
              }
            }
          }, [candidate?.id, candidate?.resumeParsedAt]);

          function handleSalary() {
            setTimeout(() => {
              const n = parseFloat(calculatedExpectedSalary);
              if (!isNaN(n) && n > 0) {
                setCandidate((prev) => ({
                  ...prev,
                  expectedsalary: n,
                  professional: {
                    ...(prev?.professional || {}),
                    expectedsalary: n,
                  },
                }));
              }
            }, 10);
          }

          useEffect(() => {
            if (!isNaN(values.currentSalary)) {
              const calculatedSalary = parseFloat(values.currentSalary) * 1.20;

              if (isNaN(calculatedSalary)) {
                setCalculatedExpectedSalary("Current Monthly Salary + 20%");
              }
              if (!isNaN(calculatedSalary)) {
                setCalculatedExpectedSalary(calculatedSalary.toFixed(0));
                setFieldValue("expectedsalary", calculatedSalary.toFixed(0));
              }
            } else {
            }
          }, [values.currentSalary]);
          useEffect(() => {
            // Merge Formik professional values without wiping already-parsed fields with empties
            setCandidate((prev) => {
              const prevProf = prev?.professional || {};
              const merged = { ...prevProf };
              Object.keys(values || {}).forEach((key) => {
                const nextVal = values[key];
                if (
                  nextVal === undefined ||
                  nextVal === null ||
                  nextVal === "" ||
                  nextVal === "Current Monthly Salary + 20%"
                ) {
                  return;
                }
                if (key === "jobCategory") return;
                merged[key] = nextVal;
              });
              return { ...prev, professional: merged };
            });
          }, [values]);
          console.log('---------------------');
          console.log('values =>', values);
          console.log('---------------------');
          return (
            <Form>
              <div>
                {" "}
                <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
                  <div>
                    <h4>Professional Details</h4>
                  </div>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Industries</Label>
                      <Select
                        style={{ cursor: "pointer" }}
                        id="industries"
                        name="industries"
                        value={selectindustries}
                        isMulti
                        placeholder="Select Industries"
                        isDisabled={isDisabledAllFields}
                        options={industriesOptions?.filter((ele) => {
                          ele.label = ele?.industryCategory;
                          ele.value = ele?.id;
                          return ele;
                        })}
                        className="react-select"
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={(e) => {
                          if (e.length <= 3) {
                            setSelectIndustries(e);
                            onIndustriesChange(e);
                          } else toast.warn("Only 3 industries can select");
                        }}
                      />
                      <p style={{ color: "red", fontSize: "12px" }}>
                        *You Can select 3 industries
                      </p>
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Experience </Label>
                      <Select
                        style={{ cursor: "pointer" }}
                        id="experienceInyear"
                        name="experienceInyear"
                        value={experienceInYear}
                        placeholder="Select Experience"
                        options={experienceOptions}
                        isDisabled={isDisabledAllFields}
                        className="react-select"
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={(e) => {
                          setExperienceInYear(e);
                          setFieldValue("experienceInyear", e.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>
                        Qualification Held
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Select
                        style={{ cursor: "pointer" }}
                        id="highestQualification"
                        name="highestQualification"
                        value={quelification}
                        placeholder="Select Qualification"
                        options={Quelification}
                        isDisabled={isDisabledAllFields}
                        className="react-select"
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={(e) => {
                          setQuelification(e);
                          setFieldValue(e.id, e.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>
                        Education<span style={{ color: "red" }}>*</span>
                      </Label>
                      <Select
                        style={{ cursor: "pointer" }}
                        id="field"
                        name="field"
                        value={field}
                        isDisabled={isDisabledAllFields}
                        placeholder="Select Education"
                        options={course?.map((ele) => {
                          ele = {
                            label: ele.name,
                            id: "field",
                            value: ele.sub,
                          };
                          return ele;
                        })}
                        className="react-select"
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={(e) => {
                          setField(e);
                          setFieldValue(e.id, e.label);
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Course</Label>
                      <Select
                        style={{ cursor: "pointer" }}
                        id="course"
                        name="course"
                        value={subCourse}
                        placeholder="Select course"
                        isDisabled={isDisabledAllFields}
                        options={field?.value?.map((ele) => {
                          ele = {
                            label: ele,
                            field: field?.label,
                            id: "course",
                            value: ele,
                          };
                          return ele;
                        })}
                        className="react-select"
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={(e) => {
                          setSubCourse(e);
                          setFieldValue(e.id, e.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>
                        Designation<span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        id="designation"
                        name="designation"
                        onFocus={() => setIsfocus("designation")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor: focus === "designation" && themecolor,
                        }}
                        value={values?.designation}
                        maxLength={200}
                        className="w-100"
                        type="text"
                        disabled={isDisabledAllFields}
                        placeholder={"Enter designation"}
                        // value={candidate?.professional?.expectedsalary}
                        // onChange={(e) => handleChangeProfessional(e)}
                        onChange={(e) => {
                          setFieldValue(
                            e.target.name,
                            e.target.value.replace(/[^a-z /]/gi, "")
                          )
                        }
                        }
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>
                        Job Category<span style={{ color: "red" }}>*</span>
                      </Label>
                      <Select
                        style={{ cursor: "pointer" }}
                        id="jobCategoryId"
                        name="jobCategoryId"
                        value={jobCat}
                        isDisabled={isDisabledAllFields}
                        placeholder="Select jobCategory"
                        options={jobCategoryOptions}
                        className="react-select"
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={(e) => {
                          setJobCat(e);
                          setFieldValue("jobCategoryId", e.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Current Employer</Label>
                      <Input
                        id="currentEmployer"
                        onFocus={() => setIsfocus("currentEmployer")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor:
                            focus === "currentEmployer" && themecolor,
                        }}
                        name="currentEmployer"
                        className="w-100"
                        value={values?.currentEmployer}
                        type="text"
                        maxLength={200}
                        disabled={isDisabledAllFields}
                        placeholder={"Current Employer"}
                        // value={candidate?.professional?.currentEmployer}
                        onChange={(e) => {
                          setFieldValue(
                            e.target.name,
                            e.target.value.replace(/[^a-z ^0-9 / , -]/gi, "")
                          )
                        }
                        }
 
                      // onChange={(e) => handleChangeProfessional(e)}
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Current Company</Label>
                      <Input
                        id="currentCompany"
                        onFocus={() => setIsfocus("currentCompany")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor:
                            focus === "currentCompany" && themecolor,
                        }}
                        name="currentCompany"
                        className="w-100"
                        value={values?.currentCompany || ""}
                        type="text"
                        maxLength={200}
                        disabled={isDisabledAllFields}
                        placeholder={"Current Company"}
                        onChange={(e) => {
                          setFieldValue(
                            e.target.name,
                            e.target.value
                          )
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Last/Current Monthly Salary</Label>
                      <Input
                        id="currentSalary"
                        onFocus={() => setIsfocus("currentSalary")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor: focus === "currentSalary" && themecolor,
                        }}
                        name="currentSalary"
                        className="w-100"
                        maxLength={10}
                        type="text"
                        disabled={isDisabledAllFields}
                        value={values?.currentSalary}
                        placeholder={"Enter Current Monthly Salary"}
                        onChange={(e) => {
                          setFieldValue(
                            e.target.name,
                            e.target.value.replace(/\D/g, "")
                          )
                          handleSalary()
                        }
                        }
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Expected Monthly Salary</Label>
                      <Input
                        disabled
                        id="expectedsalary"
                        onFocus={() => setIsfocus("expectedsalary")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor: focus === "expectedsalary" && themecolor,
                        }}
                        name="expectedsalary"
                        value={calculatedExpectedSalary}
                        className="w-100"
                        type="text"
                        maxLength={10}
                        placeholder={"Current Monthly Salary + 20%"}
                        // value={candidate?.professional?.expectedsalary}
                        // onChange={(e) => handleChangeProfessional(e)}
                        onChange={(e) => {
                          setFieldValue(
                            e.target.name,
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        }
                      />
                      <p style={{ color: "red", fontSize: "12px" }}>
                        *Expected salary will be nagotiable depanding upon
                        inerview
                      </p>
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Notice Period</Label>
                      <Select
                        style={{ cursor: "pointer" }}
                        id="noticePeriod"
                        name="noticePeriod"
                        value={noticePeriod}
                        isDisabled={isDisabledAllFields}
                        placeholder="Select noticePeriod"
                        options={NoticePeriodOptions}
                        className="react-select"
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={(e) => {
                          setNoticePeriod(e);
                          setFieldValue(e.id, e.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Currently Working</Label>
                      <Select
                        style={{ cursor: "pointer" }}
                        id="currentlyWorking"
                        name="currentlyWorking"
                        value={currentlyWorking}
                        placeholder="Select Working"
                        isDisabled={isDisabledAllFields}
                        options={currentlyWorkingOptions}
                        className="react-select"
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={(e) => {
                          setCurrentlyWorking(e);
                          setFieldValue(e.id, e.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>
                        How About your English in Speaking ?
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Select
                        style={{ cursor: "pointer" }}
                        id="english"
                        name="english"
                        value={eng}
                        placeholder="English level"
                        options={English}
                        isDisabled={isDisabledAllFields}
                        className="react-select"
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={(e) => {
                          setEng(e);
                          setFieldValue(e.id, e.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>
                        Enter Preferred Job Location{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        id="preferedJobLocation"
                        onFocus={() => setIsfocus("preferedJobLocation")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor:
                            focus === "preferedJobLocation" && themecolor,
                        }}
                        name="preferedJobLocation"
                        value={values?.preferedJobLocation}
                        disabled={isDisabledAllFields}
                        className="w-100"
                        maxLength={200}
                        type="text"
                        placeholder={"Eg: Vesu, Adajan, Kamrej"}
                        onChange={(e) => {

                          setFieldValue(e.target.name, e.target.value)
                        }
                        }
                      />
                    </div>
                  </Col>

                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Skill Set</Label>
                      <Input
                        id="skill"
                        onFocus={() => setIsfocus("skill")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor: focus === "skill" && themecolor,
                        }}
                        name="skill"
                        value={values?.skill || candidate?.professional?.skill || ""}
                        className="w-100"
                        disabled={isDisabledAllFields}
                        maxLength={200}
                        type="textarea"
                        placeholder={"HTML | CSS | React | Node"}
                        onChange={(e) => {
                          setFieldValue(e.target.name, e.target.value)
                        }}
                      />
                    </div>
                  </Col>

                  {/* Resume Upload/Update Section - Disabled per user request */}
                  {false && handleResumeChange && (
                    <Row className="mt-4">
                      <Col xs="12">
                        <h5 className="mb-2 text-black fw-bold fs-4">Resume Information</h5>
                      </Col>
                      <Col lg={6} xs={12} className="mb-1">
                        <Label className="form-label">Resume (PDF only)</Label>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          {candidate?.resume &&
                            candidate.resume.length > 0 &&
                            showResumeFileName &&
                            !resumeFile ? (
                            <>
                              <Label
                                style={{
                                  marginBottom: 0,
                                  flex: 1,
                                  minWidth: "200px",
                                }}
                              >
                                {(() => {
                                  try {
                                    const decodedUrl = decodeURIComponent(
                                      candidate.resume
                                    );
                                    const fileName = decodedUrl.substring(
                                      decodedUrl.lastIndexOf("/") + 1
                                    );
                                    return fileName && fileName !== "undefined"
                                      ? `${fileName.length > 30
                                        ? fileName.slice(0, 30) + "..."
                                        : fileName
                                      }`
                                      : "Resume uploaded";
                                  } catch (e) {
                                    return "Resume uploaded";
                                  }
                                })()}
                              </Label>
                              <Button
                                type="button"
                                color="default"
                                style={{
                                  padding: "0.25rem 0.5rem",
                                  backgroundColor: themecolor,
                                  color: "white",
                                }}
                                onClick={() => setShowResumeFileName(false)}
                              >
                                <BsUpload size={16} className="me-1" />
                                Update
                              </Button>
                              <Button
                                type="button"
                                color="default"
                                style={{
                                  padding: "0.25rem 0.5rem",
                                  backgroundColor: themecolor,
                                  color: "white",
                                }}
                                onClick={() => {
                                  const url = resolveAssetUrl(candidate.resume);
                                  if (!url) {
                                    tostify("Resume file not available");
                                    return;
                                  }
                                  window.open(url, "_blank", "noopener,noreferrer");
                                }}
                              >
                                <FileText size={16} className="me-1" />
                                View Resume
                              </Button>
                            </>
                          ) : (
                            <>
                              <Input
                                type="file"
                                accept=".pdf,application/pdf"
                                id="resume"
                                onChange={handleResumeChange}
                                className="w-100"
                                style={{
                                  maxWidth: "400px",
                                  display:
                                    (!candidate?.resume ||
                                      candidate.resume.length === 0) &&
                                      !resumeFile
                                      ? "none"
                                      : "block",
                                }}
                              />
                              {(!candidate?.resume ||
                                candidate.resume.length === 0) &&
                                !resumeFile && (
                                  <Button
                                    type="button"
                                    color="default"
                                    style={{
                                      padding: "0.25rem 0.5rem",
                                      backgroundColor: themecolor,
                                      color: "white",
                                    }}
                                    onClick={() =>
                                      document.getElementById("resume").click()
                                    }
                                  >
                                    <BsUpload size={16} className="me-1" />
                                    Upload
                                  </Button>
                                )}
                            </>
                          )}
                          {resumeFile && (
                            <Label style={{ marginBottom: 0, color: "#28a745" }}>
                              {resumeFile.name.length > 30
                                ? `${resumeFile.name.slice(0, 30)}...`
                                : resumeFile.name}{" "}
                              (Ready to upload)
                            </Label>
                          )}
                        </div>
                        {isResumeUploading && (
                          <small className="text-muted">Uploading resume...</small>
                        )}
                      </Col>
                    </Row>
                  )}

                </Row>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Professional;
