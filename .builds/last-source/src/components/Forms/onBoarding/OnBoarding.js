import React, { useEffect, useState } from "react";
import { Plus, X } from "react-feather";
import { Row, Col, Input, Label } from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { selectThemeColors } from "@utils";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSelector } from "react-redux";
import course from "./../Course";

const OnBoarding = ({
  onBoarding,
  update,
  setOnBoarding,
  isRecruiter,
  handleChange = () => {},
}) => {
  const jobCategories = useSelector((state) => state.jobCategory.results);
  const industries = useSelector((state) => state.industries);
  const [am, setAm] = useState();
  const [field, setField] = useState();
  const [subCourse, setSubCourse] = useState();
  const [pm, setPm] = useState();
  const [gender, setGender] = useState();
  const [qua, setQua] = useState();
  const [work, setWork] = useState();
  const [jobCategory, setjobCategory] = useState();
  const [jobCategoryOptions, setJobCategoryOptions] = useState();
  const [sunday, setSunday] = useState();
  const [experienceInYear, setExperienceInYear] = useState([]);
  const [negotiable, setNegotiable] = useState();
  const [selectindustries, setSelectIndustries] = useState([]);

  useEffect(() => {
    if (onBoarding?.gender?.length > 0) {
      let label = "Male";
      if (onBoarding?.gender === "female") label = "Female";
      if (onBoarding?.gender === "both") label = "Both";
      setGender({ value: [onBoarding.gender], label });
    }
    if (onBoarding?.work?.length > 0) {
      let label = "inhouse";
      if (onBoarding?.work === "field") label = "Field";
      if (onBoarding?.work === "both") label = "Both";
      setWork({ value: [onBoarding.work], label });
    }
    if (onBoarding?.qualification?.length > 0) {
      let label = "graduation";
      const value = onBoarding?.qualification;
      if (value === "post graduate") label = "Post Graduate";
      if (value === "under graduate") label = "Under Graduate";
      if (value === "any") label = "Any";
      setQua({ value, label, id: "qualification" });
    }
    if (onBoarding?.sunday?.length > 0) {
      let label = "On";
      if (onBoarding?.sunday === "off") label = "Off";
      setSunday({ value: [onBoarding.sunday], label });
    }
    if (onBoarding?.workType !== undefined) {
      let label = "Inhouse";
      if (onBoarding?.workType === "field") label = "Field";
      if (onBoarding?.workType === "both") label = "Both";
      setWork({ value: [onBoarding?.workType], label });
    }
    if (onBoarding?.negotiable?.length > 0) {
      let label = "Yes";
      if (onBoarding?.negotiable === "no") label = "No";
      setNegotiable({ value: [onBoarding.negotiable], label });
    }
    if (onBoarding?.jobCategory?.jobCategory !== undefined) {
      setjobCategory({ label: onBoarding?.jobCategory?.jobCategory });
    }
    if (onBoarding?.minExperienceYears !== undefined) {
      setExperienceInYear({ label: onBoarding?.minExperienceYears });
    }
    if (onBoarding?.field?.length > 0) {
      course.filter((ele) => {
        if (ele.name === onBoarding?.field) {
          setField({ value: ele.sub, label: ele.name });
        }
      });
    }
  }, []);
  useEffect(() => {
    if (am !== undefined) {
      setOnBoarding({ ...onBoarding, jobStartTime: am });
    }
    if (pm !== undefined) {
      setOnBoarding({ ...onBoarding, jobEndTime: pm });
    }
  }, [am, pm]);
  useEffect(() => {
    if (update === true && onBoarding?.field?.length > 0) {
      if (
        subCourse?.field === onBoarding?.field ||
        subCourse?.field === undefined
      ) {
        setSubCourse({
          label: onBoarding?.course,
          field: field?.label,
          value: onBoarding?.course,
        });
      } else {
        setSubCourse(null);
      }
    } else {
      setSubCourse(null);
    }
    if (field?.value?.length === 0) {
      setOnBoarding({ ...onBoarding, course: "Please Select" });
    }
  }, [field]);

  const genderOptions = [
    { value: "male", id: "gender", label: "Male" },
    { value: "female", id: "gender", label: "Female" },
    { value: "both", id: "gender", label: "Both" },
  ];

  const workOptions = [
    { value: "inhouse", id: "workType", label: "Inhouse" },
    { value: "field", id: "workType", label: "Field" },
    { value: "both", id: "workType", label: "Both" },
  ];
  const qualification = [
    { value: "under graduate", id: "qualification", label: "Under Graduate" },
    { value: "graduation", id: "qualification", label: "Graduation" },
    { value: "post graduate", id: "qualification", label: "Post Graduate" },
    { value: "any", id: "qualification", label: "Any" },
  ];
  const sundayOptions = [
    { value: "on", id: "sunday", label: "On" },
    { value: "off", id: "sunday", label: "Off" },
  ];
  const experienceOptions = [
    { value: "0-1 year", id: "minExperienceYears", label: "0-1 Year" },
    { value: "1-3 year", id: "minExperienceYears", label: "1-3 Year" },
    { value: "3-5 year", id: "minExperienceYears", label: "3-5 Year" },
    { value: "5 year above", id: "minExperienceYears", label: "5 Year Above" },
  ];
  const negotiableOptions = [
    { value: "yes", id: "negotiable", label: "Yes" },
    { value: "no", id: "negotiable", label: "No" },
  ];

  useEffect(() => {
    if (jobCategories?.length > 0) {
      jobCategories.filter((item) => {
        item.label = item.jobCategory;
        return item;
      });
      setPm();
      setJobCategoryOptions(jobCategories);
    }
  }, [jobCategories]);
  useEffect(() => {
    if (industries?.length > 0) {
      if (onBoarding?.industries?.industryCategory) {
        setSelectIndustries({
          label: onBoarding?.industries?.industryCategory,
          value: onBoarding?.industries?.id,
        });
      }
    }
  }, [onBoarding]);
  const themecolor = localStorage.getItem("themecolor");
  const [focus, setIsfocus] = useState(null);
  return (
    <>
      <Row className="gy-1 pt-75">
        <div>
          <h4>Client Info</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyName">
              Company Name<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={isRecruiter}
              id="companyName"
              onFocus={() => setIsfocus("companyName")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyName" && themecolor,
              }}
              name="companyName"
              maxLength={200}
              className="w-100"
              type="text"
              placeholder={"Enter company name"}
              value={onBoarding?.companyName}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyowner">
              Company Owner<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={isRecruiter}
              id="companyOwner"
              onFocus={() => setIsfocus("companyOwner")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyOwner" && themecolor,
              }}
              name="companyOwner"
              className="w-100"
              maxLength={200}
              type="text"
              value={onBoarding?.companyOwner}
              placeholder={"Enter company owner"}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyContactNo">
              Contact Number<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={isRecruiter}
              id="companyContactNo"
              onFocus={() => setIsfocus("companyContactNo")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyContactNo" && themecolor,
              }}
              name="companyContactNo"
              className="w-100"
              type="text"
              maxLength={10}
              value={onBoarding?.companyContactNo}
              placeholder={"Enter contact number"}
              onChange={(e) => {
                handleChange(e);
                setOnBoarding({
                  ...onBoarding,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyEmail">
              Email<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={isRecruiter}
              id="companyEmail"
              onFocus={() => setIsfocus("companyEmail")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyEmail" && themecolor,
              }}
              name="companyEmail"
              maxLength={200}
              className="w-100"
              type="text"
              value={onBoarding?.companyEmail}
              placeholder={"Enter Email"}
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase();
                setOnBoarding({ ...onBoarding, [e.target.id]: e.target.value });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyStreetAddress">Street</Label>
            <Input
              disabled={isRecruiter}
              id="companyStreetAddress"
              onFocus={() => setIsfocus("companyStreetAddress")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyStreetAddress" && themecolor,
              }}
              name="companyStreetAddress"
              className="w-100"
              type="text"
              maxLength={200}
              value={onBoarding?.companyStreetAddress}
              placeholder={"Enter street"}
              onChange={(e) =>
                setOnBoarding({ ...onBoarding, [e.target.id]: e.target.value })
              }
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyCity">City</Label>
            <Input
              disabled={isRecruiter}
              id="companyCity"
              onFocus={() => setIsfocus("companyCity")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyCity" && themecolor,
              }}
              name="companyCity"
              className="w-100"
              type="text"
              maxLength={200}
              value={onBoarding?.companyCity}
              placeholder={"Enter City"}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyState">State</Label>
            <Input
              disabled={isRecruiter}
              id="companyState"
              onFocus={() => setIsfocus("companyState")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyState" && themecolor,
              }}
              name="companyState"
              className="w-100"
              type="text"
              maxLength={200}
              value={onBoarding?.companyState}
              placeholder={"Enter State"}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyPincode">Pin code</Label>
            <Input
              disabled={isRecruiter}
              id="companyPincode"
              onFocus={() => setIsfocus("companyPincode")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyPincode" && themecolor,
              }}
              name="companyPincode"
              className="w-100"
              type="text"
              maxLength={6}
              value={onBoarding?.companyPincode}
              placeholder={"Enter PIN code"}
              onChange={(e) =>
                setOnBoarding({
                  ...onBoarding,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyWebsite">Web Site</Label>
            <Input
              disabled={isRecruiter}
              id="companyWebsite"
              onFocus={() => setIsfocus("companyWebsite")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyWebsite" && themecolor,
              }}
              className="w-100"
              placeholder={"Web Site"}
              type="text"
              maxLength={250}
              value={onBoarding?.companyWebsite}
              onChange={(e) =>
                setOnBoarding({ ...onBoarding, [e.target.id]: e.target.value })
              }
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyMapURL">URL (Google Map)</Label>
            <Input
              disabled={isRecruiter}
              id="companyMapURL"
              onFocus={() => setIsfocus("companyMapURL")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyMapURL" && themecolor,
              }}
              name="companyMapURL"
              className="w-100"
              type="text"
              maxLength={250}
              value={onBoarding?.companyMapURL}
              placeholder={"Enter website"}
              onChange={(e) =>
                setOnBoarding({ ...onBoarding, [e.target.id]: e.target.value })
              }
            />
          </div>
        </Col>
      </Row>
      <Row className="gy-1 pt-75 mt-75">
        <div>
          <h4>Job Description</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>Industries </Label>
            <Select
              style={{ cursor: "pointer" }}
              id="industries"
              name="industries"
              value={selectindustries}
              placeholder="Select Industries"
              options={
                industries?.length > 0 &&
                industries?.filter((ele) => {
                  ele.label = ele?.industryCategory;
                  ele.value = ele?.id;
                  return ele;
                })
              }
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectIndustries(e);
                if (onBoarding?.industries?.industryCategory) {
                  delete onBoarding?.industries;
                }
                setOnBoarding({ ...onBoarding, industriesId: e.value });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="jobCategoryId">jobCategory</Label>
            <Select
              isDisabled={isRecruiter}
              id="jobCategoryId"
              value={jobCategory}
              placeholder="Select jobCategory"
              options={jobCategoryOptions}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setjobCategory(e);
                setOnBoarding({ ...onBoarding, jobCategoryId: e.value });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="numberOfVacancy">
              No. of Vacancy<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={isRecruiter}
              id="numberOfVacancy"
              onFocus={() => setIsfocus("numberOfVacancy")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "numberOfVacancy" && themecolor,
              }}
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={15}
              min={0}
              value={onBoarding?.numberOfVacancy}
              placeholder={"Enter number of vacancy"}
              onChange={(e) => {
                setOnBoarding({
                  ...onBoarding,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="noOfVacancy">
              Job Time Start <span style={{ color: "red" }}>*</span>
            </Label>
            <Flatpickr
              disabled={isRecruiter}
              className="form-control"
              value={
                onBoarding?.jobStartTime
                  ? new Date(onBoarding?.jobStartTime)
                  : new Date(am)
              }
              id="timepicker"
              onFocus={() => setIsfocus("timepicker")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "timepicker" && themecolor,
              }}
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: "h:i:K",
              }}
              onChange={(date) => {
                setAm(date[0]);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="noOfVacancy">
              Job Time End <span style={{ color: "red" }}>*</span>
            </Label>
            <Flatpickr
              disabled={isRecruiter}
              className="form-control"
              value={
                onBoarding?.jobEndTime
                  ? new Date(onBoarding?.jobEndTime)
                  : new Date(pm)
              }
              id="timepicker"
              onFocus={() => setIsfocus("jobEndTime")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "jobEndTime" && themecolor,
              }}
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: "h:i:K",
              }}
              onChange={(date) => {
                setPm(date[0]);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label for="role-select">Sunday</Label>
          <Select
            isDisabled={isRecruiter}
            id="sunday"
            value={sunday}
            placeholder="Select Sunday"
            options={sundayOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setSunday(e);
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="experience">
              Min. Experience (In Years)<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              isDisabled={isRecruiter}
              style={{ cursor: "pointer" }}
              id="minExperienceYear"
              name="minExperienceYear"
              value={experienceInYear}
              placeholder="Select Experience"
              options={experienceOptions}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setExperienceInYear(e);
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label for="role-select">
            Gender<span style={{ color: "red" }}>*</span>
          </Label>
          <Select
            isDisabled={isRecruiter}
            id="gender"
            value={gender}
            placeholder="Select Gender"
            options={genderOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setGender(e);
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label for="workType">
            Work<span style={{ color: "red" }}>*</span>
          </Label>
          <Select
            isDisabled={isRecruiter}
            id="workType"
            value={work}
            placeholder="Select work"
            options={workOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setWork(e);
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="qualification">
            Qualification<span style={{ color: "red" }}>*</span>
          </Label>
          <Select
            isDisabled={isRecruiter}
            id="qualification"
            value={qua}
            placeholder="Select qualification"
            options={qualification}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setQua(e);
              handleChange(e);
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>Education</Label>
            <Select
              style={{ cursor: "pointer" }}
              id="field"
              name="field"
              value={field}
              placeholder="Select field"
              options={course?.map((ele) => {
                ele = { label: ele.name, id: "field", value: ele.sub };
                return ele;
              })}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setField(e);
                //   setFieldValue(e.id, e.label)
                setOnBoarding({ ...onBoarding, field: e.label });
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
                handleChange(e);
                //   setFieldValue(e.id, e.value)
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="designation">Designation</Label>
            <Input
              disabled={isRecruiter}
              id="designation"
              onFocus={() => setIsfocus("designation")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "designation" && themecolor,
              }}
              name="designation"
              maxLength={200}
              className="w-100"
              type="text"
              value={onBoarding?.designation}
              placeholder={"Enter Designation"}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="salaryRangeStart">
            Salary Range Start<span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            disabled={isRecruiter}
            id="salaryRangeStart"
            onFocus={() => setIsfocus("salaryRangeStart")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "salaryRangeStart" && themecolor,
            }}
            name="salaryRangeStart"
            maxLength={9}
            type="text"
            value={onBoarding?.salaryRangeStart}
            placeholder={"Enter salary"}
            onChange={(e) => {
              setOnBoarding({
                ...onBoarding,
                salaryRangeStart: e.target.value.replace(/\D/g, ""),
              });
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="salaryRangeEnd">
            Salary Range End<span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            disabled={isRecruiter}
            id="salaryRangeEnd"
            onFocus={() => setIsfocus("salaryRangeEnd")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "salaryRangeEnd" && themecolor,
            }}
            name="salaryRangeEnd"
            type="text"
            maxLength={9}
            value={onBoarding?.salaryRangeEnd}
            placeholder={"Enter salary"}
            onChange={(e) => {
              setOnBoarding({
                ...onBoarding,
                salaryRangeEnd: e.target.value.replace(/\D/g, ""),
              });
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label for="role-select">Negotiable</Label>
          <Select
            isDisabled={isRecruiter}
            id="negotiable"
            value={negotiable}
            placeholder="Select Negotiable"
            options={negotiableOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setNegotiable(e);
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="jobLocation">
              Job Location (Full Address)<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={isRecruiter}
              id="jobLocation"
              onFocus={() => setIsfocus("jobLocation")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "jobLocation" && themecolor,
              }}
              name="jobLocation"
              className="w-100"
              maxLength={200}
              type="text"
              placeholder={"Enter jobLocation"}
              value={onBoarding?.jobLocation}
              onChange={(e) => {
                setOnBoarding({ ...onBoarding, [e.target.id]: e.target.value });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="basicSkill">Basic Skills Required</Label>
            <Input
              disabled={isRecruiter}
              id="basicSkill"
              onFocus={() => setIsfocus("basicSkill")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "basicSkill" && themecolor,
              }}
              name="basicSkill"
              maxLength={500}
              className="w-100"
              type="textarea"
              placeholder={"Enter Basic Skill"}
              value={onBoarding?.basicSkill}
              onChange={(e) => {
                setOnBoarding({ ...onBoarding, [e.target.id]: e.target.value });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="keyRole">Key Role and Responsibilities</Label>
            <Input
              id="keyRole"
              onFocus={() => setIsfocus("keyRole")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "keyRole" && themecolor,
              }}
              disabled={isRecruiter}
              name="keyRole"
              className="w-100"
              maxLength={500}
              type="textarea"
              placeholder={"Enter Key Role and Responsibilities"}
              value={onBoarding?.keyRole}
              onChange={(e) => {
                setOnBoarding({ ...onBoarding, [e.target.id]: e.target.value });
              }}
            />
          </div>
        </Col>
      </Row>
      <Row className="gy-1 pt-75 mt-75">
        <div>
          <h4>If Any Benefits From Company For Employees </h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="workingDays">Working Days</Label>
            <Input
              disabled={isRecruiter}
              id="workingDays"
              onFocus={() => setIsfocus("workingDays")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "workingDays" && themecolor,
              }}
              name="workingDays"
              className="w-100"
              type="text"
              maxLength={7}
              placeholder={"Enter working days"}
              value={onBoarding?.workingDays}
              onChange={(e) =>
                setOnBoarding({
                  ...onBoarding,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="plSlCl">PL/SL/CL (Paid/Sick/Casual leave)</Label>
            <Input
              disabled={isRecruiter}
              id="plSlCl"
              onFocus={() => setIsfocus("plSlCl")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "plSlCl" && themecolor,
              }}
              name="plSlCl"
              className="w-100"
              maxLength={7}
              type="text"
              placeholder={"Enter leave"}
              value={onBoarding?.plSlCl}
              onChange={(e) =>
                setOnBoarding({
                  ...onBoarding,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="healthPolicy">Health Policy</Label>
            <Input
              disabled={isRecruiter}
              id="healthPolicy"
              onFocus={() => setIsfocus("healthPolicy")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "healthPolicy" && themecolor,
              }}
              name="healthPolicy"
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter healthPolicy"}
              value={onBoarding?.healthPolicy}
              onChange={(e) =>
                setOnBoarding({ ...onBoarding, [e.target.id]: e.target.value })
              }
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="pfEsic">PF/ESIC</Label>
            <Input
              disabled={isRecruiter}
              id="pfEsic"
              onFocus={() => setIsfocus("pfEsic")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "pfEsic" && themecolor,
              }}
              name="pfEsic"
              className="w-100"
              type="text"
              maxLength={8}
              placeholder={"Enter PF/ESIC"}
              value={onBoarding?.pfEsic}
              onChange={(e) =>
                setOnBoarding({
                  ...onBoarding,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="other">Other</Label>
            <Input
              disabled={isRecruiter}
              id="other"
              onFocus={() => setIsfocus("other")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "other" && themecolor,
              }}
              name="other"
              className="w-100"
              maxLength={250}
              type="text"
              placeholder={"other"}
              value={onBoarding?.other}
              onChange={(e) =>
                setOnBoarding({ ...onBoarding, [e.target.id]: e.target.value })
              }
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default OnBoarding;
