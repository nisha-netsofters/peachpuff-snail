import React, { useEffect, useState } from "react";
import { Row, Col, Input, Label } from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { selectThemeColors } from "@utils";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSelector } from "react-redux";
import AiJobDescriptionPanel from "./AiJobDescriptionPanel";
import { getAllClientsAPI } from "../../../apis/client";

const experienceOptions = [
  { value: "0-1 year", id: "minExperienceYears", label: "0-1 Year" },
  { value: "1-3 year", id: "minExperienceYears", label: "1-3 Year" },
  { value: "3-5 year", id: "minExperienceYears", label: "3-5 Year" },
  { value: "5 year above", id: "minExperienceYears", label: "5 Year Above" },
];

const employmentTypeOptions = [
  { value: "Full-time", id: "employmentType", label: "Full-time" },
  { value: "Part-time", id: "employmentType", label: "Part-time" },
  { value: "Contract", id: "employmentType", label: "Contract" },
  { value: "Internship", id: "employmentType", label: "Internship" },
  { value: "Freelance", id: "employmentType", label: "Freelance" },
];

const statusOptions = [
  { value: "draft", id: "postingStatus", label: "Draft" },
  { value: "open", id: "postingStatus", label: "Open" },
  { value: "published", id: "postingStatus", label: "Published" },
  { value: "closed", id: "postingStatus", label: "Closed" },
  { value: "archived", id: "postingStatus", label: "Archived" },
];

const qualificationOptions = [
  { value: "under graduate", id: "qualification", label: "Under Graduate" },
  { value: "graduation", id: "qualification", label: "Graduation" },
  { value: "post graduate", id: "qualification", label: "Post Graduate" },
  { value: "any", id: "qualification", label: "Any" },
];

const JobOpening = ({
  jobOpening,
  setJobOpening,
  isRecruiter,
  handleChange = () => {},
  assignableUsers = [],
  canAssignRecruiter = false,
}) => {
  const industries = useSelector((state) => state.industries);
  const authUser = useSelector((state) => state.auth.user);
  const themecolor = localStorage.getItem("themecolor");

  const [focus, setIsfocus] = useState(null);
  const [selectIndustries, setSelectIndustries] = useState(null);
  const [experience, setExperience] = useState(null);
  const [employmentType, setEmploymentType] = useState(null);
  const [qualification, setQualification] = useState(null);
  const [status, setStatus] = useState(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientOptions, setClientOptions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllClientsAPI();
        const list = Array.isArray(res) ? res : res?.results || res?.data || [];
        setClientOptions(
          (list || []).map((c) => ({
            value: c.id,
            label:
              c.companyName ||
              c.name ||
              [c.firstname, c.lastname].filter(Boolean).join(" ") ||
              c.email ||
              c.id,
            companyName: c.companyName || c.name || "",
            id: c.id,
          }))
        );
      } catch (e) {
        setClientOptions([]);
      }
    })();
  }, []);

  // Prefill selects when editing
  useEffect(() => {
    if (jobOpening?.industriesId && industries?.length) {
      const found = industries.find((i) => i.id === jobOpening.industriesId);
      if (found) {
        setSelectIndustries({
          label: found.industryCategory,
          value: found.id,
        });
      } else if (jobOpening?.industries?.industryCategory) {
        setSelectIndustries({
          label: jobOpening.industries.industryCategory,
          value: jobOpening.industriesId,
        });
      }
    }
    if (jobOpening?.minExperienceYears) {
      const found = experienceOptions.find(
        (o) => o.value === jobOpening.minExperienceYears
      );
      setExperience(
        found || {
          value: jobOpening.minExperienceYears,
          label: jobOpening.minExperienceYears,
          id: "minExperienceYears",
        }
      );
    }
    if (jobOpening?.employmentType) {
      const found = employmentTypeOptions.find(
        (o) => o.value === jobOpening.employmentType
      );
      setEmploymentType(
        found || {
          value: jobOpening.employmentType,
          label: jobOpening.employmentType,
          id: "employmentType",
        }
      );
    }
    if (jobOpening?.qualification) {
      const found = qualificationOptions.find(
        (o) => o.value === jobOpening.qualification
      );
      setQualification(
        found || {
          value: jobOpening.qualification,
          label: jobOpening.qualification,
          id: "qualification",
        }
      );
    }
    if (jobOpening?.postingStatus) {
      const found = statusOptions.find(
        (o) => o.value === jobOpening.postingStatus
      );
      setStatus(found || { value: jobOpening.postingStatus, label: jobOpening.postingStatus, id: "postingStatus" });
    } else {
      setStatus(statusOptions.find((o) => o.value === "open"));
    }
  }, [jobOpening?.id, industries]);

  useEffect(() => {
    if (jobOpening?.recruiterId && assignableUsers?.length) {
      const found = assignableUsers.find((u) => u.id === jobOpening.recruiterId);
      if (found) {
        setSelectedRecruiter({ value: found.id, label: found.name, id: found.id });
      }
    }
  }, [jobOpening?.recruiterId, assignableUsers]);

  useEffect(() => {
    if (jobOpening?.clientId && clientOptions.length) {
      const found = clientOptions.find((c) => c.value === jobOpening.clientId);
      if (found) setSelectedClient(found);
    }
  }, [jobOpening?.clientId, clientOptions]);

  // Client role: auto company from logged-in client profile
  useEffect(() => {
    if (authUser?.role?.name === "Client" && authUser?.clients) {
      const company =
        authUser.clients.companyName ||
        authUser.clients.name ||
        authUser.name ||
        "";
      if (company && !jobOpening?.companyName) {
        setJobOpening({
          ...jobOpening,
          companyName: company,
          clientId: authUser.clients.id || jobOpening?.clientId,
        });
      }
    }
  }, [authUser?.id]);

  const onTextChange = (e) => {
    const { id, value } = e.target;
    setJobOpening({
      ...jobOpening,
      [id]: value,
      // Keep designation in sync with Job Title for older APIs
      ...(id === "designation" ? {} : {}),
    });
  };

  return (
    <>
      <Row className="gy-1 pt-75">
        <Col xs={12}>
          <h4>Job Details</h4>
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>
            Job Title <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            disabled={isRecruiter}
            id="designation"
            value={jobOpening?.designation || ""}
            placeholder="Enter Job Title"
            maxLength={200}
            onFocus={() => setIsfocus("designation")}
            onBlur={() => setIsfocus(null)}
            style={{ borderColor: focus === "designation" && themecolor }}
            onChange={onTextChange}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Company</Label>
          <Input
            disabled={isRecruiter || authUser?.role?.name === "Client"}
            id="companyName"
            value={jobOpening?.companyName || ""}
            placeholder="Enter Company Name"
            maxLength={200}
            onFocus={() => setIsfocus("companyName")}
            onBlur={() => setIsfocus(null)}
            style={{ borderColor: focus === "companyName" && themecolor }}
            onChange={onTextChange}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Client</Label>
          <Select
            isDisabled={isRecruiter || authUser?.role?.name === "Client"}
            id="clientId"
            value={selectedClient}
            placeholder="Select Client"
            options={clientOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setSelectedClient(e);
              setJobOpening({
                ...jobOpening,
                clientId: e?.value || "",
                companyName: jobOpening?.companyName || e?.companyName || "",
              });
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Industry</Label>
          <Select
            isDisabled={isRecruiter}
            id="industries"
            value={selectIndustries}
            placeholder="Select Industry"
            options={(industries || []).map((ele) => ({
              label: ele?.industryCategory,
              value: ele?.id,
            }))}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setSelectIndustries(e);
              setJobOpening({ ...jobOpening, industriesId: e.value });
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Department</Label>
          <Input
            disabled={isRecruiter}
            id="department"
            value={jobOpening?.department || ""}
            placeholder="Enter Department"
            maxLength={150}
            onFocus={() => setIsfocus("department")}
            onBlur={() => setIsfocus(null)}
            style={{ borderColor: focus === "department" && themecolor }}
            onChange={onTextChange}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Experience</Label>
          <Select
            isDisabled={isRecruiter}
            value={experience}
            placeholder="Select Experience"
            options={experienceOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setExperience(e);
              handleChange(e);
              setJobOpening({ ...jobOpening, minExperienceYears: e.value });
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Salary</Label>
          <Input
            disabled={isRecruiter}
            id="salary"
            value={jobOpening?.salary || ""}
            placeholder="e.g. 25000 - 40000 / month"
            maxLength={100}
            onFocus={() => setIsfocus("salary")}
            onBlur={() => setIsfocus(null)}
            style={{ borderColor: focus === "salary" && themecolor }}
            onChange={onTextChange}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Employment Type</Label>
          <Select
            isDisabled={isRecruiter}
            value={employmentType}
            placeholder="Select Employment Type"
            options={employmentTypeOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setEmploymentType(e);
              setJobOpening({
                ...jobOpening,
                employmentType: e.value,
                workType: e.value,
              });
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Open Positions</Label>
          <Input
            disabled={isRecruiter}
            id="numberOfVacancy"
            value={jobOpening?.numberOfVacancy || ""}
            placeholder="Enter open positions"
            maxLength={6}
            onFocus={() => setIsfocus("numberOfVacancy")}
            onBlur={() => setIsfocus(null)}
            style={{ borderColor: focus === "numberOfVacancy" && themecolor }}
            onChange={(e) =>
              setJobOpening({
                ...jobOpening,
                numberOfVacancy: e.target.value.replace(/\D/g, ""),
              })
            }
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Location</Label>
          <Input
            disabled={isRecruiter}
            id="jobLocation"
            value={jobOpening?.jobLocation || ""}
            placeholder="Enter Location"
            maxLength={200}
            onFocus={() => setIsfocus("jobLocation")}
            onBlur={() => setIsfocus(null)}
            style={{ borderColor: focus === "jobLocation" && themecolor }}
            onChange={onTextChange}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Skills</Label>
          <Input
            disabled={isRecruiter}
            id="basicSkill"
            type="textarea"
            rows={2}
            value={jobOpening?.basicSkill || ""}
            placeholder="Enter required skills"
            maxLength={2000}
            onFocus={() => setIsfocus("basicSkill")}
            onBlur={() => setIsfocus(null)}
            style={{ borderColor: focus === "basicSkill" && themecolor }}
            onChange={onTextChange}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Qualification</Label>
          <Select
            isDisabled={isRecruiter}
            value={qualification}
            placeholder="Select Qualification"
            options={qualificationOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setQualification(e);
              handleChange(e);
              setJobOpening({ ...jobOpening, qualification: e.value });
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Status</Label>
          <Select
            isDisabled={isRecruiter}
            value={status}
            placeholder="Select Status"
            options={statusOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setStatus(e);
              setJobOpening({ ...jobOpening, postingStatus: e.value });
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Recruiter</Label>
          <Select
            isDisabled={isRecruiter || !canAssignRecruiter}
            value={selectedRecruiter}
            placeholder="Select Recruiter / Staff"
            options={(assignableUsers || []).map((u) => ({
              value: u.id,
              label: u.name,
              id: u.id,
            }))}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setSelectedRecruiter(e);
              setJobOpening({ ...jobOpening, recruiterId: e?.value || "" });
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Expiry Date</Label>
          <Flatpickr
            disabled={isRecruiter}
            className="form-control"
            value={jobOpening?.expiryDate ? new Date(jobOpening.expiryDate) : null}
            options={{
              dateFormat: "Y-m-d",
              minDate: "today",
            }}
            placeholder="Select Expiry Date"
            onChange={(date) => {
              setJobOpening({
                ...jobOpening,
                expiryDate: date?.[0] ? date[0].toISOString() : "",
              });
            }}
          />
        </Col>

        <Col xs={12}>
          <Label>Job Description</Label>
          <Input
            disabled={isRecruiter}
            id="jobDescription"
            type="textarea"
            rows={5}
            value={jobOpening?.jobDescription || ""}
            placeholder="Enter Job Description"
            maxLength={10000}
            onFocus={() => setIsfocus("jobDescription")}
            onBlur={() => setIsfocus(null)}
            style={{ borderColor: focus === "jobDescription" && themecolor }}
            onChange={(e) =>
              setJobOpening({
                ...jobOpening,
                jobDescription: e.target.value,
                keyRole: e.target.value,
              })
            }
          />
        </Col>

        <Col xs={12}>
          <Label>Benefits</Label>
          <Input
            disabled={isRecruiter}
            id="benefits"
            type="textarea"
            rows={3}
            value={jobOpening?.benefits || ""}
            placeholder="Enter Benefits"
            maxLength={5000}
            onFocus={() => setIsfocus("benefits")}
            onBlur={() => setIsfocus(null)}
            style={{ borderColor: focus === "benefits" && themecolor }}
            onChange={onTextChange}
          />
        </Col>
      </Row>

      <AiJobDescriptionPanel
        jobOpening={jobOpening}
        setJobOpening={setJobOpening}
        industriesLabel={selectIndustries?.label || ""}
        themecolor={themecolor}
        disabled={isRecruiter}
      />
    </>
  );
};

export default JobOpening;
