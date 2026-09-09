import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Input, Label } from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { selectThemeColors } from "@utils";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSelector } from "react-redux";
import { State, City } from "country-state-city";
import AiJobDescriptionPanel from "./AiJobDescriptionPanel";
import { getAllClientsAPI } from "../../../apis/client";
import { getAreasByCity } from "../../../apis/areas";
import { resolveIndianAddress } from "../../../utility/resolveIndianAddress";
import { cleanAreaValue } from "../../../utility/normalizeResumeExtract";
import { getAllJobSubCatAPI } from "../../../apis/jobSubCategory";

const composeJobLocation = (data = {}) => {
  const parts = [data.area, data.city, data.state]
    .map((v) => String(v || "").trim())
    .filter(Boolean);
  return parts.join(", ");
};

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
  const jobCategories = useSelector((state) => state?.jobCategory?.results);
  const authUser = useSelector((state) => state.auth.user);
  const themecolor = localStorage.getItem("themecolor");

  const [focus, setIsfocus] = useState(null);
  const [selectIndustries, setSelectIndustries] = useState(null);
  const [selectJobCategory, setSelectJobCategory] = useState(null);
  const [selectJobSubCategory, setSelectJobSubCategory] = useState(null);
  const [jobSubCategoryOptions, setJobSubCategoryOptions] = useState([]);
  const [allJobSubCategories, setAllJobSubCategories] = useState([]);
  const [experience, setExperience] = useState(null);
  const [employmentType, setEmploymentType] = useState(null);
  const [qualification, setQualification] = useState(null);
  const [status, setStatus] = useState(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientOptions, setClientOptions] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaOptions, setAreaOptions] = useState([]);
  const [areasLoading, setAreasLoading] = useState(false);

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await getAllJobSubCatAPI({});
        if (!cancelled) setAllJobSubCategories(resp?.results || []);
      } catch (e) {
        if (!cancelled) setAllJobSubCategories([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const catId =
      selectJobCategory?.value || jobOpening?.jobCategoryId || "";
    if (!catId) {
      setJobSubCategoryOptions([]);
      return;
    }
    setJobSubCategoryOptions(
      (allJobSubCategories || [])
        .filter((s) => String(s.jobCategoryId) === String(catId))
        .map((s) => ({
          label: s.jobSubCategory,
          value: s.id || s._id,
          jobCategoryId: s.jobCategoryId,
        }))
    );
  }, [selectJobCategory?.value, jobOpening?.jobCategoryId, allJobSubCategories]);

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
    if (jobOpening?.jobCategoryId && jobCategories?.length) {
      const found = jobCategories.find(
        (j) => j.id === jobOpening.jobCategoryId || j._id === jobOpening.jobCategoryId
      );
      if (found) {
        setSelectJobCategory({
          label: found.jobCategory,
          value: found.id || found._id,
        });
      } else if (jobOpening?.jobCategory?.jobCategory) {
        setSelectJobCategory({
          label: jobOpening.jobCategory.jobCategory,
          value: jobOpening.jobCategoryId,
        });
      }
    }
    if (jobOpening?.jobSubCategoryId && allJobSubCategories?.length) {
      const found = allJobSubCategories.find(
        (s) =>
          String(s.id) === String(jobOpening.jobSubCategoryId) ||
          String(s._id) === String(jobOpening.jobSubCategoryId)
      );
      if (found) {
        setSelectJobSubCategory({
          label: found.jobSubCategory,
          value: found.id || found._id,
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
  }, [jobOpening?.id, industries, jobCategories, allJobSubCategories]);

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

  useEffect(() => {
    try {
      const result = State.getStatesOfCountry("IN") || [];
      setStates(
        result.map((ele) => ({
          ...ele,
          label: ele.name,
          value: ele.name,
          key: "state",
        }))
      );
    } catch (error) {
      setStates([]);
    }
  }, []);

  useEffect(() => {
    const isoCode = selectedState?.isoCode || jobOpening?.stateId;
    if (!isoCode) {
      setCities([]);
      return;
    }
    try {
      const result = City.getCitiesOfState("IN", isoCode) || [];
      setCities(
        result.map((ele) => ({
          ...ele,
          label: ele.name,
          value: ele.name,
          key: "city",
        }))
      );
    } catch (error) {
      setCities([]);
    }
  }, [selectedState, jobOpening?.stateId]);

  const cityName = useMemo(
    () => selectedCity?.value || selectedCity?.name || jobOpening?.city || "",
    [selectedCity, jobOpening?.city]
  );
  const stateName = useMemo(
    () => selectedState?.value || selectedState?.name || jobOpening?.state || "",
    [selectedState, jobOpening?.state]
  );

  // Prefill state/city/area when editing (or from old single jobLocation)
  useEffect(() => {
    if (!states.length) return;

    let nextState = jobOpening?.state;
    let nextStateId = jobOpening?.stateId;
    let nextCity = jobOpening?.city;
    let nextCityId = jobOpening?.cityId;
    let nextArea = jobOpening?.area;

    if (!nextState && !nextCity && jobOpening?.jobLocation) {
      const parts = String(jobOpening.jobLocation)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length >= 3) {
        nextArea = nextArea || parts[0];
        nextCity = parts[1];
        nextState = parts.slice(2).join(", ");
      } else if (parts.length === 2) {
        nextCity = parts[0];
        nextState = parts[1];
      } else if (parts.length === 1) {
        nextCity = parts[0];
      }
    }

    const resolved = resolveIndianAddress({
      state: nextState,
      stateId: nextStateId,
      city: nextCity,
      cityId: nextCityId,
    });

    if (resolved.stateId) {
      const match = states.find((s) => s.isoCode === resolved.stateId);
      if (match && selectedState?.isoCode !== match.isoCode) {
        setSelectedState(match);
      }
    } else if (!jobOpening?.id && !jobOpening?.state) {
      setSelectedState(null);
      setSelectedCity(null);
      setSelectedArea(null);
    }

    if (
      resolved.stateId &&
      (jobOpening?.state !== resolved.state ||
        jobOpening?.stateId !== resolved.stateId ||
        (!jobOpening?.area && nextArea) ||
        (!jobOpening?.city && resolved.city))
    ) {
      setJobOpening((prev) => {
        const merged = {
          ...(prev || {}),
          state: resolved.state,
          stateId: resolved.stateId,
        };
        if (resolved.city) {
          merged.city = resolved.city;
          merged.cityId = resolved.cityId || resolved.city;
        }
        if (nextArea && !merged.area) merged.area = nextArea;
        merged.jobLocation = composeJobLocation(merged);
        return merged;
      });
    }
  }, [jobOpening?.id, jobOpening?.state, jobOpening?.stateId, jobOpening?.jobLocation, states]);

  useEffect(() => {
    if (!jobOpening?.city || !cities.length) return;
    const match =
      cities.find(
        (c) => c.name?.toLowerCase() === String(jobOpening.city).toLowerCase()
      ) ||
      cities.find(
        (c) =>
          c.name?.toLowerCase() === String(jobOpening.cityId || "").toLowerCase()
      );
    if (!match) return;
    if (!selectedCity || selectedCity.value !== match.name) {
      setSelectedCity(match);
    }
    if (jobOpening.cityId !== match.name || jobOpening.city !== match.name) {
      setJobOpening((prev) => {
        const merged = {
          ...(prev || {}),
          city: match.name,
          cityId: match.name,
        };
        merged.jobLocation = composeJobLocation(merged);
        return merged;
      });
    }
  }, [jobOpening?.city, jobOpening?.id, cities]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cityName) {
        setAreaOptions([]);
        setSelectedArea(null);
        return;
      }
      setAreasLoading(true);
      try {
        const resp = await getAreasByCity({
          state: stateName,
          city: cityName,
        });
        const list = Array.isArray(resp?.data)
          ? resp.data
          : Array.isArray(resp)
          ? resp
          : [];
        if (cancelled) return;
        const options = list.map((a) => ({
          label: a.name,
          value: a.name,
          key: "area",
          id: a.id,
        }));
        setAreaOptions(options);

        const currentArea = cleanAreaValue(jobOpening?.area || "");
        if (currentArea) {
          const lower = currentArea.toLowerCase();
          const match =
            options.find((o) => o.value.toLowerCase() === lower) ||
            options.find(
              (o) =>
                o.value.toLowerCase().includes(lower) ||
                lower.includes(o.value.toLowerCase())
            );
          setSelectedArea(
            match || {
              label: currentArea,
              value: currentArea,
              key: "area",
            }
          );
        } else {
          setSelectedArea(null);
        }
      } catch (err) {
        if (!cancelled) {
          setAreaOptions([]);
          setSelectedArea(null);
        }
      } finally {
        if (!cancelled) setAreasLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cityName, stateName, jobOpening?.area, jobOpening?.id]);

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
          <Label>
            Job Category <span style={{ color: "red" }}>*</span>
          </Label>
          <Select
            isDisabled={isRecruiter}
            id="jobCategoryId"
            value={selectJobCategory}
            placeholder="Select Job Category"
            options={(jobCategories || []).map((ele) => ({
              label: ele?.jobCategory,
              value: ele?.id || ele?._id,
            }))}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setSelectJobCategory(e);
              setSelectJobSubCategory(null);
              setJobOpening({
                ...jobOpening,
                jobCategoryId: e?.value || "",
                jobSubCategoryId: "",
              });
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Job Sub Category</Label>
          <Select
            isDisabled={isRecruiter || !selectJobCategory?.value}
            id="jobSubCategoryId"
            value={selectJobSubCategory}
            placeholder={
              !selectJobCategory?.value
                ? "Select job category first"
                : "Select Job Sub Category"
            }
            options={jobSubCategoryOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            isClearable
            onChange={(e) => {
              setSelectJobSubCategory(e || null);
              setJobOpening({
                ...jobOpening,
                jobSubCategoryId: e?.value || "",
              });
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
          <Label>State</Label>
          <Select
            isDisabled={isRecruiter}
            id="state"
            value={selectedState || null}
            placeholder={jobOpening?.state || "Select State"}
            options={states}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setSelectedState(e);
              setSelectedCity(null);
              setSelectedArea(null);
              setAreaOptions([]);
              setJobOpening((prev) => {
                const next = {
                  ...(prev || {}),
                  state: e.value,
                  stateId: e.isoCode,
                };
                delete next.city;
                delete next.cityId;
                delete next.area;
                next.jobLocation = composeJobLocation(next);
                return next;
              });
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>City</Label>
          <Select
            isDisabled={isRecruiter}
            id="city"
            value={selectedCity || null}
            placeholder={jobOpening?.city || "Select City"}
            options={cities}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setSelectedCity(e);
              setSelectedArea(null);
              setJobOpening((prev) => {
                const next = {
                  ...(prev || {}),
                  city: e.value,
                  cityId: e.value,
                };
                delete next.area;
                next.jobLocation = composeJobLocation(next);
                return next;
              });
            }}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <Label>Area</Label>
          <Select
            isDisabled={isRecruiter || !cityName || areasLoading}
            id="area"
            value={selectedArea || null}
            placeholder={
              !cityName
                ? "Select city first"
                : areasLoading
                ? "Loading areas..."
                : areaOptions.length
                ? "Select Area"
                : "No areas for this city"
            }
            options={areaOptions}
            isClearable
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setSelectedArea(e || null);
              setJobOpening((prev) => {
                const next = { ...(prev || {}) };
                if (e?.value) next.area = e.value;
                else delete next.area;
                next.jobLocation = composeJobLocation(next);
                return next;
              });
            }}
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
