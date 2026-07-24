import React, { useState, useEffect } from "react";
import { Col, Input, Label, Row, Button } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ArrowRight } from "react-feather";
import actions from "./../../../redux/jobCategory/actions";
import course from "./../Course";
import industriesActions from "../../../redux/industries/actions";
import { toast } from "react-toastify";
import { tostify } from "./../../Tostify";
import useBreakpoint from "./../../../utility/hooks/useBreakpoints";

const Professional = ({
  stepper,
  disabled,
  jobOpeningId,
  setIndustries_relation,
  jobOpeningIndustries,
  setProfessional,
  candidate,
}) => {
  const { width } = useBreakpoint();
  const jobCategory = useSelector((state) => state.jobCategory.results);
  const dispatch = useDispatch();
  const industries = useSelector((state) => state.industries);
  const [quelification, setQuelification] = useState();
  const [field, setField] = useState();
  const [subCourse, setSubCourse] = useState();
  const [experienceInYear, setExperienceInYear] = useState([]);
  const [selectindustries, setSelectIndustries] = useState([]);
  const [noticePeriod, setNoticePeriod] = useState();
  const [currentlyWorking, setCurrentlyWorking] = useState();
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);
  const [jobCat, setJobCat] = useState();
  const [eng, setEng] = useState([]);

  useEffect(() => {
    if (jobOpeningIndustries?.id) {
      setSelectIndustries({
        label: jobOpeningIndustries?.industryCategory,
        value: jobOpeningIndustries?.id,
      });
      setIndustries_relation([{ industriesId: jobOpeningIndustries?.id }]);
    }
  }, [jobOpeningIndustries]);
  useEffect(() => {
    if (candidate?.industries_relation?.length > 0) {
      const selected = [];
      candidate?.industries_relation?.forEach((ele) => {
        ele.label = ele?.industries?.industryCategory;
        ele.value = ele?.industries?.id;
        selected.push(ele);
        setIndustries_relation([{ industriesId: ele?.industries?.id }]);
      });

      setSelectIndustries(selected);
    }
  }, [candidate?.industries_relation]);

  useEffect(() => {
    async function fetchData() {
      await dispatch({
        type: actions.GET_ALL_JOBCAT,
      });
      dispatch({
        type: industriesActions.GET_ALL_INDUSTRIES,
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (jobCategory?.length > 0) {
      jobCategory.filter((item) => {
        item.label = item.jobCategory;
        return item;
      });
      setJobCategoryOptions(jobCategory);
    }
  }, [jobCategory]);

  useEffect(() => {
    setSubCourse(null);
  }, [field]);

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
  const onIndustriesChange = (industry) => {
    const data = [];
    industry?.map((ele) => {
      data.push({ industriesId: ele.value });
    });
    setIndustries_relation(data);
  };
  const English = [
    { value: "Poor", id: "english", label: "Poor" },
    { value: "Average", id: "english", label: "Average" },
    { value: "Excellent", id: "english", label: "Excellent" },
  ];
  useEffect(() => {
    if (candidate?.professional?.field?.length > 0) {
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
  const [calculatedExpectedSalary, setCalculatedExpectedSalary] = useState(
    "Current Monthly Salary + 15%"
  );
  return (
    <>
      <Formik initialValues={{}}>
        {({ values, setFieldValue }) => {
          useEffect(() => {
            if (candidate?.id) {
              for (const key in candidate?.professional) {
                setFieldValue(key, candidate?.professional[key]);
              }
              if (candidate?.professional?.experienceInyear?.length > 0) {
                setExperienceInYear({
                  label: candidate?.professional?.experienceInyear,
                  value: candidate?.professional?.experienceInyear,
                });
              }

              if (candidate?.professional?.highestQualification?.length > 0) {
                let label = "12th";
                const value = candidate?.professional?.highestQualification;
                if (value === "graduation") label = "Graduation";
                if (value === "post graduate") label = "Post Graduate";
                if (value === "under graduate") label = "Under Graduate";
                setQuelification({
                  value,
                  label,
                  id: "highestQualification",
                });
              }
              if (candidate?.professional?.jobCategoryId?.length > 0) {
                setJobCat({
                  label: candidate?.professional?.jobCategory?.jobCategory,
                  value: candidate?.professional?.jobCategoryId,
                });
              }
              if (candidate?.professional?.noticePeriod?.length > 0) {
                setNoticePeriod({
                  label: candidate?.professional?.noticePeriod,
                  value: candidate?.professional?.noticePeriod,
                });
              }
              if (candidate?.professional?.english?.length > 0) {
                setEng({
                  label: candidate?.professional?.english,
                  value: candidate?.professional?.english,
                  id: "english",
                });
              }

              if (candidate?.professional?.currentlyWorking?.length > 0) {
                setCurrentlyWorking({
                  label: candidate?.professional?.currentlyWorking,
                  value: candidate?.professional?.currentlyWorking,
                });
              }
              if (candidate?.professional?.field?.length > 0) {
                course.filter((ele) => {
                  if (ele.name === candidate?.professional?.field) {
                    setField({ value: ele.sub, label: ele.name });
                  }
                });
              }
            }
          }, [candidate]);
          const Validations = async () => {
            const error = false;
            if (
              selectindustries?.length === 0 ||
              selectindustries === undefined
            )
              return tostify(" Please Select Industries", error);
            else if (
              values?.highestQualification === undefined ||
              values?.highestQualification?.length === 0
            )
              return tostify("Please Enter Qualification", error);
            else if (values?.field === undefined || values?.field?.length === 0)
              return tostify("Please Enter Education", error);
            else if (
              values?.designation === undefined ||
              values?.designation?.length === 0
            )
              return tostify("Please Enter Designation", error);
            else if (
              values?.jobCategoryId === undefined ||
              values?.jobCategoryId?.length === 0
            )
              return tostify("Please Enter Job Category", error);
            else if (
              values?.preferedJobLocation?.length < 2 ||
              values?.preferedJobLocation === undefined
            )
              return tostify("Please Enter Prefered Job Location", error);
            else if (
              values?.english === undefined ||
              values?.english?.length === 0
            )
              return tostify("Please Enter Speaking Level", error);

            return error;
          };
          const onNextHandler = async () => {
            const err = await Validations();
            if (err === false) {
              stepper?.next();
            }
          };
          useEffect(() => {
            if (!isNaN(values.currentSalary)) {
              const calculatedSalary = parseFloat(values.currentSalary) * 1.15;

              if (isNaN(calculatedSalary)) {
                setCalculatedExpectedSalary("Current Monthly Salary + 15%");
              }
              if (!isNaN(calculatedSalary)) {
                setCalculatedExpectedSalary(calculatedSalary.toFixed(0));
                setFieldValue("expectedsalary", calculatedSalary.toFixed(0));
              }
            } else {
            }
          }, [values.currentSalary]);
          useEffect(() => {
            setProfessional(values);
          }, [values]);
          const [focus, setIsfocus] = useState(null);
          return (
            <Form>
              <div>
                {" "}
                <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
                  <div>
                    <h4>Professional Details</h4>
                  </div>
                  <Col lg={6} xs={12} xl={4}>
                    <div style={{}}>
                      <Label>Industries</Label>
                      <Select
                        isDisabled={jobOpeningId?.length > 0 && disabled}
                        style={{ cursor: "pointer", maxWidth: "200px" }}
                        id="industries"
                        name="industries"
                        value={selectindustries}
                        isMulti
                        placeholder="Select Industries"
                        options={
                          industries?.length > 0 &&
                          industries?.filter((ele) => {
                            ele.label = ele?.industryCategory;
                            ele.value = ele?.id;
                            return ele;
                          })
                        }
                        className={
                          width < 600
                            ? "react-select selected-options"
                            : "react-select"
                        }
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
                          borderColor: focus === "designation" && "#105996",
                        }}
                        value={values?.designation}
                        maxLength={200}
                        className="w-100"
                        type="text"
                        placeholder={"Enter designation"}
                        onChange={(e) =>
                          setFieldValue(
                            e.target.name,
                            e.target.value.replace(/[^a-z ]/gi, "")
                          )
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
                        placeholder="Select jobCategory"
                        options={jobCategoryOptions}
                        className="react-select"
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        onChange={(e) => {
                          setJobCat(e);
                          setFieldValue("jobCategoryId", e.id);
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Current Employer</Label>
                      <Input
                        id="currentEmployer"
                        name="currentEmployer"
                        onFocus={() => setIsfocus("currentEmployer")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor: focus === "currentEmployer" && "#105996",
                        }}
                        className="w-100"
                        value={values?.currentEmployer}
                        type="text"
                        placeholder={"Current Employer"}
                        maxLength={200}
                        // value={candidate?.professional?.currentEmployer}
                        onChange={(e) =>
                          setFieldValue(
                            e.target.name,
                            e.target.value.replace(/[^a-z ^0-9 / , -]/gi, "")
                          )
                        }
                      />
                    </div>
                  </Col>
                  <Col lg={6} xs={12} xl={4}>
                    <div>
                      <Label>Current Monthly Salary</Label>
                      <Input
                        id="currentSalary"
                        name="currentSalary"
                        onFocus={() => setIsfocus("currentSalary")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor: focus === "currentSalary" && "#105996",
                        }}
                        className="w-100"
                        type="text"
                        maxLength={10}
                        value={values?.currentSalary}
                        placeholder={"Enter Current Monthly Salary"}
                        onChange={(e) =>
                          setFieldValue(
                            e.target.name,
                            e.target.value.replace(/\D/g, "")
                          )
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
                        placeholder={"Current Monthly Salary + 15%"}
                        // value={candidate?.professional?.expectedsalary}
                        // onChange={(e) => handleChangeProfessional(e)}
                        onChange={(e) =>
                          setFieldValue(
                            e.target.name,
                            e.target.value.replace(/\D/g, "")
                          )
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
                      <Label>Skill Set</Label>
                      <Input
                        id="skill"
                        name="skill"
                        onFocus={() => setIsfocus("skill")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor: focus === "skill" && "#105996",
                        }}
                        value={values?.skill}
                        maxLength={200}
                        className="w-100"
                        type="text"
                        placeholder={"Enter skill"}
                        onChange={(e) =>
                          setFieldValue(e.target.name, e.target.value)
                        }
                      />
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
                        Enter Preferred Job Location
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        id="preferedJobLocation"
                        name="preferedJobLocation"
                        onFocus={() => setIsfocus("preferedJobLocation")}
                        onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor:
                            focus === "preferedJobLocation" && "#105996",
                        }}
                        value={values?.preferedJobLocation}
                        maxLength={200}
                        className="w-100"
                        type="text"
                        placeholder={"Eg: Vesu, Adajan, Kamrej"}
                        onChange={(e) =>
                          setFieldValue(e.target.name, e.target.value)
                        }
                      />
                    </div>
                  </Col>

                  <Col lg={6} xs={12} xl={4}>
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
                      className="react-select"
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      onChange={(e) => {
                        setEng(e);
                        setFieldValue(e.id, e.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mt-2" style={{ display: "flex" }}>
                  <Col style={{ textAlign: "left" }}>
                    <Button
                      type="submit"
                      color="default"
                      onClick={() => stepper.previous()}
                      className="btn-next"
                      style={{ color: "white", backgroundColor: "#105996" }}
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
                      type="submit"
                      color="default"
                      onClick={() => onNextHandler()}
                      className="btn-next"
                      style={{ color: "white", backgroundColor: "#105996" }}
                    >
                      <span className="align-middle d-sm-inline-block d-none">
                        Next
                      </span>
                      <ArrowRight
                        size={14}
                        className="align-middle ms-sm-25 ms-0"
                      ></ArrowRight>
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Professional;
