import React, { Fragment, useState, useEffect } from "react";
import Select from "react-select";

import {
  Row,
  Col,
  Card,
  Input,
  Label,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
} from "reactstrap";

import { selectThemeColors } from "@utils";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
// import PickerDefault from './../pickerDefalut'
import { useDispatch, useSelector } from "react-redux";
// import actions from '../../../redux/candidate/actions'
import { Scrollbars } from "react-custom-scrollbars";
import course from "./../Course";
// import jobCategoryActions from "./../../../redux/jobCategory/actions";
// import industriesActions from "./../../../redux/industries/actions";
import { Country, State, City } from "country-state-city";
import actions from "../../../redux/candidate/actions";
import Sidebar from "@components/sidebar";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";
import { useLocation } from "react-router-dom";

const initialState = {
  firstname: "",
  lastname: "",
  highestQualification: "",
  english: "",
  preferedJobLocation: "",
  jobCategoryId: "",
  experienceInyear: "",
  currentSalary: "",
  expectedsalary: "",
  noticePeriod: "",
  currentlyWorking: "",
  mobile: "",
  email: "",
  city: "",
  state: "",
  designation: "",
  comments: "",
  interviewStatus: "",
};

const Filter = ({
  setFilterData,
  setJobCategoryId = () => {},
  setFilterToggleMode,
  setLoading,
  setFilterJobCategory,
  // filterJobCategory,
  isSavedCandidates,
  toggleSidebar,
  open,
  handleFilterToggleMode = () => {},
  handleFilter = () => {},
  clear,
  setclear = () => {},
  filterKey = () => {},
  filterData,
  // handleClearr,
}) => {
  const { clients } = useSelector((state) => state.auth.user);
  console.info("----------------------------");
  console.info("clients =>", clients);
  console.info("----------------------------");
  const params = useLocation();
  const isBestMatches = params?.pathname?.includes("/best-matches");
  const dispatch = useDispatch();
  const industries = useSelector((state) => state.industries);
  const auth = useSelector((state) => state.auth);

  const jobCategories =
    // auth?.user?.clients?.jobCategories ||
    useSelector((state) => state.jobCategory.results);

  const [field, setField] = useState();
  const [subCourse, setSubCourse] = useState();
  const [gender, setGender] = useState();
  const [isClient, setIsClient] = useState(false);
  const [english, setEnglish] = useState();
  const [filter, setFilter] = useState(initialState);
  const [jobCategoryOptions, setJobCategoryOptions] = useState();
  const [industriesOptions, setIndustriesOptions] = useState();
  const [jobCategory, setjobCategory] = useState([]);
  const [experienceInYear, setExperienceInYear] = useState();
  const [quelification, setQuelification] = useState();
  const [noticePeriod, setNoticePeriod] = useState();
  const [currentlyWorking, setCurrentlyWorking] = useState();
  const [industry, setIndustry] = useState([]);
  const [eng, setEng] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [interviewStatus, setInterviewStatus] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(null);
  const { width } = useBreakpoint();
  useEffect(() => {
    states?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = "state";
    });
  }, [states]);
  useEffect(() => {
    cities?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = "city";
    });
  }, [cities]);
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
        const result = await City.getCitiesOfState(
          "IN",
          selectedState?.isoCode
        );
        setCities(result);
      } catch (error) {
        setCities([]);
      }
    };

    getCities();
  }, [selectedState]);

  useEffect(() => {
    if (auth?.user?.clients?.id) {
      setIsClient(true);
    }
  }, [auth]);

  useEffect(() => {
    if (clients?.jobCategory_relation?.length > 0) {
      if (isBestMatches == true) {
        jobCategories.filter((item) => {
          item.label = item.jobCategory;
          item.value = item.id;
          // item.id = "jobCategoryId"
          return item;
        });
        setJobCategoryOptions(jobCategories);
      } else {
        if (jobCategories?.length > 0) {
          jobCategories.filter((item) => {
            item.label = item.jobCategory;
            item.value = item.id;
            // item.id = "jobCategoryId"
            return item;
          });
          setJobCategoryOptions(jobCategories);
        }
      }
    } else {
      if (jobCategories?.length > 0) {
        jobCategories.filter((item) => {
          item.label = item.jobCategory;
          item.value = item.id;
          // item.id = "jobCategoryId"
          return item;
        });
        setJobCategoryOptions(jobCategories);
      }
    }
  }, [jobCategories, clients]);

  useEffect(() => {
    if (clients?.industries_relation?.length > 0) {
      if (isBestMatches == true) {
        const selected = [];
        clients?.industries_relation?.forEach((ele) => {
          ele.label = ele?.industries?.industryCategory;
          ele.value = ele?.industries?.id;
          selected.push(ele);
        });
        setIndustriesOptions(selected);
      } else {
        if (industries?.length > 0) {
          industries.filter((item) => {
            item.label = item?.industryCategory;
            item.value = item?.id;
            // item.id = "jobCategoryId"
            return item;
          });
          setIndustriesOptions(industries);
        }
      }
    } else {
      if (industries?.length > 0) {
        industries.filter((item) => {
          item.label = item?.industryCategory;
          item.value = item?.id;
          // item.id = "jobCategoryId"
          return item;
        });
        setIndustriesOptions(industries);
      }
    }
  }, [industries, clients]);

  const genderOptions = [
    { value: "male", id: "gender", label: "Male" },
    { value: "female", id: "gender", label: "Female" },
  ];

  const experienceOptions = [
    { value: "0-1 year", id: "experienceInyear", label: "0-1 Year" },
    { value: "1-3 year", id: "experienceInyear", label: "1-3 Year" },
    { value: "3-5 year", id: "experienceInyear", label: "3-5 Year" },
    { value: "5 year above", id: "experienceInyear", label: "5 Year Above" },
  ];

  const Quelification = [
    // { value: '12th', id: 'highestQualification', label: '12th' },
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

  const English = [
    { value: "Poor", id: "english", label: "Poor" },
    { value: "Average", id: "english", label: "Average" },
    { value: "Excellent", id: "english", label: "Excellent" },
  ];
  const statusOptions = [
    { value: "available", id: "interviewStatus", label: "Available" },
    { value: "shortlisted", id: "interviewStatus", label: "Shortlisted" },
    { value: "trail", id: "interviewStatus", label: "Trail" },
    { value: "reschedule", id: "interviewStatus", label: "Reschedule" },
    { value: "scheduled", id: "interviewStatus", label: "Scheduled" },
    { value: "completed", id: "interviewStatus", label: "Completed" },
    { value: "hired", id: "interviewStatus", label: "Hired" },
    { value: "rejected", id: "interviewStatus", label: "Rejected" },
    { value: "hold", id: "interviewStatus", label: "Hold" },
    { value: "CV Shared", id: "interviewStatus", label: "CV Shared" },
    { value: "Not Joined It", id: "interviewStatus", label: "Not Joined It" },
    { value: "Left", id: "interviewStatus", label: "Left" },
  ];
  const profileCompletionOptions = [
    { value: "100", id: "profileCompletion", label: "100% Complete" },
    { value: "above80", id: "profileCompletion", label: "Above 80%" },
    { value: "below50", id: "profileCompletion", label: "Below 50%" },
  ];
  const salaryRangeOptions = [
    {
      value: "10000 to 25000",
      id: "salaryRange",
      label: "10000 to 25000",
      start: "10000",
      end: "25000",
    },
    {
      value: "25000 to 50000",
      id: "salaryRange",
      label: "25000 to 50000",
      start: "25000",
      end: "50000",
    },
    {
      value: "50000 to 75000",
      id: "salaryRange",
      label: "50000 to 75000",
      start: "50000",
      end: "75000",
    },
    {
      value: "75000 to 100000",
      id: "salaryRange",
      label: "75000 to 100000",
      start: "75000",
      end: "100000",
    },
  ];
  const handleFilterChange = (id, value) => {
    setFilter({ ...filter, [id]: value });
  };

  const handleFilterData = () => {
    const filterdata = {};
    for (const key in filter) {
      const val = filter[key];
      if (typeof val === "string" && val.trim().length > 0) {
        filterdata[key] = val.trim();
      } else if (Array.isArray(val) && val.length > 0) {
        filterdata[key] = val;
      }
    }
    if (jobCategory?.length > 0) {
      const temp = jobCategory.map((ele) => ele.value);
      if (auth?.user?.clients?.id) {
        filterdata.filterJobCategoryId = temp;
        setFilterJobCategory(temp);
      } else {
        setJobCategoryId(temp);
      }
      filterdata.jobCategoryId = temp;
    } else {
      setJobCategoryId([]);
      setFilterJobCategory([]);
    }
    if (gender?.value?.length > 0) {
      filterdata.gender = gender.value;
    }
    if (eng?.value?.length > 0) {
      filterdata.english = eng.value;
    }
    if (quelification?.value?.length > 0) {
      filterdata.highestQualification = quelification.value;
    }
    if (experienceInYear?.value?.length > 0) {
      filterdata.experienceInyear = experienceInYear.value;
    }
    if (noticePeriod?.value?.length > 0) {
      filterdata.noticePeriod = noticePeriod.value;
    }
    if (currentlyWorking?.value?.length > 0) {
      filterdata.currentlyWorking = currentlyWorking.value;
    }
    if (selectedState?.value?.length > 0) {
      filterdata.state = selectedState?.value;
    }
    if (selectedCity?.value?.length > 0) {
      filterdata.city = selectedCity?.value;
    }
    if (industry?.length > 0) {
      filterdata.industries = industry.map((ele) => ele.value);
    }
    if (interviewStatus?.value?.length > 0) {
      filterdata.interviewStatus = interviewStatus.value;
    }
    if (profileCompletion?.value?.length > 0) {
      filterdata.profileCompletion = profileCompletion.value;
    }
    handleFilterToggleMode(false);
    handleFilter(filterdata);
  };
  const [salaryRange, setSalaryRange] = useState("");

  const handleClear = () => {
    const data = {};
    setSalaryRange("");
    setQuelification({ value: "", label: "Select Qualification" });
    setGender({ value: "", label: "Select Gender" });
    setEnglish({ value: "", label: "Select English" });
    setExperienceInYear({ value: "", label: "Select Experience" });
    setNoticePeriod({ value: "", label: "Select Notice Period" });
    setCurrentlyWorking({ value: "", label: "Select Working Option" });
    setEng({ value: "", label: "Select English level" });
    setFilter(initialState);
    setjobCategory([]);
    setLoading(true);
    setIndustry([]);
    setSelectedState("");
    setSelectedCity("");
    setFilterJobCategory([]);
    setJobCategoryId([]);
    setInterviewStatus({ value: "", label: "Select Interview Status" });
    setProfileCompletion({ value: "", label: "Select Profile Completion" });
    if (auth?.user?.clients?.id) {
      const industriesId = [];
      data.userId = auth?.user?.id;
      auth?.user?.clients?.industries_relation?.map((ele) => {
        industriesId.push(ele?.industriesId);
        data.industriesId = industriesId;
      });
      const clientJobCategoryIds = [];
      auth?.user?.clients?.jobCategory_relation?.map((ele) => {
        clientJobCategoryIds.push(ele?.jobCategoryId);
        data.jobCategoryId = clientJobCategoryIds;
      });
    }
    if (filterKey(filterData).length) {
      if (auth?.user?.clients?.id) {
        if (isBestMatches == true) {
          dispatch({
            type: actions.GET_BEST_MATCHES_CANDIDATE,
            payload: {
              filterData: data,
              page: 1,
              perPage: 10,
              isSavedCandidates,
            },
          });
        } else {
          dispatch({
            type: actions.GET_CLIENT_CANDIDATE,
            payload: {
              filterData: data,
              page: 1,
              perPage: 10,
              isSavedCandidates,
            },
          });
        }
      } else {
        dispatch({
          type: actions.GET_CANDIDATE,
          payload: {
            filterData: data,
            page: 1,
            perPage: 10,
          },
        });
      }
    } else {
      setLoading(false);
    }
    setFilterData({});
    setSubCourse({ label: "Select Field" });
    setField({ label: "Select Course" });
    handleFilterToggleMode(false);
    setclear(false);
  };
  useEffect(() => {
    if (clear == true) {
      handleClear();
    }
  }, [clear]);
  // handleClearr(handleClear());
  useEffect(() => {
    setSubCourse(null);
  }, [field]);

  useEffect(() => {
    const keyDownHandler = async (event) => {
      if (event.key === "Escape") {
        setFilterToggleMode(false);
      }
      if (event.key === "Enter") {
        document.getElementById("handleFilterData")?.click();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  // const colourStyles = {
  //   // control: (styles) => ({ ...styles, backgroundColor: "white" }),
  //   option: (styles, { isDisabled, isFocused, isSelected }) => {
  //     // const color = chroma(data.color);
  //     return {
  //       ...styles,
  //       backgroundColor: isSelected
  //         ? themecolor
  //         : isFocused
  //         ? themecolor
  //         : "#fff",
  //       color: isFocused ? "#fff" : "grey",
  //       cursor: isDisabled ? "not-allowed" : "default",
  //       // "&:focus": {
  //       //   backgroundColor: themecolor,
  //       // },
  //       "&:hover": {
  //         color: "#fff",
  //       },
  //     };
  //   },
  // };
  const [focus, setIsfocus] = useState(null);
  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title={
          <>
            <div>
              Filter
              <Button
                id="handleFilterData"
                className="add-new-user"
                color="link"
                onClick={handleFilterData}
                style={
                  width < 576
                    ? { marginLeft: "12px", color: themecolor }
                    : { marginLeft: "140px", color: themecolor }
                }
                // style={{ marginLeft: "140px" }}
              >
                Search
              </Button>
              <Button
                className="add-new-user "
                color="link"
                style={{ color: themecolor }}
                onClick={handleClear}
              >
                Clear
              </Button>
            </div>
          </>
        }
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        // onClosed={handleFilterToggleMode(false)}
      >
        <Fragment>
          <Row noGutters style={{ marginBottom: "10px" }}>
            {auth?.user?.role?.name !== "Client" ? (
              <Col md="12" className="mt-1">
                <Label id="interviewStatus">Interview Status</Label>
                <Select
                  id="interviewStatus"
                  placeholder="Select Interview Status"
                  value={interviewStatus}
                  options={statusOptions}
                  className="react-select"
                  classNamePrefix="select"
                  // styles={colourStyles}
                  theme={selectThemeColors}
                  onChange={(e) => {
                    setInterviewStatus(e);

                    // setStatusOp(e)
                    // const interviewStatusUpdate = new Date().toISOString()
                  }}
                />
              </Col>
            ) : null}

            <Col md="12" className="mt-1">
              <Label id="profileCompletion">Profile Completion</Label>
              <Select
                id="profileCompletion"
                placeholder="Select Profile Completion"
                value={profileCompletion}
                options={profileCompletionOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setProfileCompletion(e);
                }}
              />
            </Col>

            <Col md="12" className="mt-1">
              <Label for="role-select">First Name</Label>
              <Input
                id="firstname"
                className="w-100"
                type="text"
                maxLength={200}
                placeholder="Enter FirstName"
                onFocus={() => setIsfocus("firstname")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "firstname" && themecolor,
                }}
                value={filter.firstname}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z]/gi, "")
                  )
                }
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label for="role-select">Last Name</Label>
              <Input
                id="lastname"
                className="w-100"
                type="text"
                placeholder="Enter LastName"
                maxLength={200}
                value={filter.lastname}
                onFocus={() => setIsfocus("lastname")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "lastname" && themecolor,
                }}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z]/gi, "")
                  )
                }
              />
            </Col>
            {!isClient && (
              <>
                <Col md="12" className="mt-1">
                  <Label for="role-select">Email</Label>

                  <Input
                    id="email"
                    className="w-100"
                    type="email"
                    maxLength={200}
                    placeholder="Enter email"
                    value={filter.email}
                    onChange={(e) =>
                      handleFilterChange(e.target.id, e.target.value)
                    }
                    onFocus={() => setIsfocus("email")}
                    onBlur={() => setIsfocus(null)}
                    style={{
                      borderColor: focus === "email" && themecolor,
                    }}
                  />
                </Col>
                <Col md="12" className="mt-1">
                  <Label for="role-select">Contact Number</Label>
                  <Input
                    id="mobile"
                    className="w-100"
                    type="text"
                    maxLength={10}
                    placeholder="Enter Mobile"
                    value={filter.mobile}
                    onFocus={() => setIsfocus("mobile")}
                    onBlur={() => setIsfocus(null)}
                    style={{
                      borderColor: focus === "mobile" && themecolor,
                    }}
                    onChange={(e) =>
                      handleFilterChange(
                        e.target.id,
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                  />
                </Col>
              </>
            )}
            <Col md="12" className="mt-1">
              <Label>Industries</Label>
              <Select
                menuPlacement="auto"
                isMulti
                id="industriesId"
                value={industry}
                placeholder="Select Industry"
                options={industriesOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setIndustry(e);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label for="role-select">Gender</Label>
              <Select
                menuPlacement="auto"
                id="gender"
                value={gender}
                placeholder="Select Gender"
                options={genderOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => setGender(e)}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label>State</Label>
              <Select
                menuPlacement="auto"
                id="state"
                value={selectedState}
                placeholder={"Select State"}
                options={states}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setSelectedState(e);
                  setSelectedCity("");
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label for="role-select">City</Label>
              {/* <Input
                    id="city"
                    className="w-100"
                    type="text"
                    maxLength={200}
                    placeholder="Enter City"
                    value={filter.city}
                    onChange={(e) =>
                      handleFilterChange(
                        e.target.id,
                        e.target.value.replace(/[^a-z  -]/gi, "")
                      )
                    }
                  /> */}
              <Select
                menuPlacement="auto"
                id="city"
                value={selectedCity}
                placeholder={"Select City"}
                options={cities}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setSelectedCity(e);
                }}
              />
            </Col>

            <Col md="12" className="mt-1">
              <Label id="jobCategoryId">Job Category</Label>
              <Select
                isMulti
                menuPlacement="auto"
                id="jobCategoryId"
                value={jobCategory}
                placeholder="Select jobCategory"
                options={jobCategoryOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setjobCategory(e);
                }}
              />
            </Col>
            {!isClient && (
              <>
                <Col md="12" className="mt-1">
                  <div>
                    <Label>Education</Label>
                    <Select
                      menuPlacement="auto"
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
                        handleFilterChange(e.id, e.label);
                        // setFieldValue(e.id, e.label)
                      }}
                    />
                  </div>
                </Col>
                <Col md="12" className="mt-1">
                  <div>
                    <Label>Course</Label>
                    <Select
                      style={{ cursor: "pointer" }}
                      menuPlacement="auto"
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
                        handleFilterChange(e.id, e.value);
                      }}
                    />
                  </div>
                </Col>
                <Col md="12" className="mt-1">
                  <Label for="role-select">Designation</Label>
                  <Input
                    id="designation"
                    className="w-100"
                    type="text"
                    placeholder="Enter Designation"
                    maxLength={200}
                    value={filter.designation}
                    onFocus={() => setIsfocus("designation")}
                    onBlur={() => setIsfocus(null)}
                    style={{
                      borderColor: focus === "designation" && themecolor,
                    }}
                    onChange={(e) =>
                      handleFilterChange(
                        e.target.id,
                        e.target.value.replace(/[^a-z /]/gi, "")
                      )
                    }
                  />
                </Col>
              </>
            )}
            <Col md="12" className="mt-1">
              <Label>Experience </Label>
              <Select
                menuPlacement="auto"
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
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label for="role-select">Qualification Held</Label>
              <Select
                menuPlacement="auto"
                id="highestQualification"
                value={quelification}
                placeholder="Select Qualification"
                options={Quelification}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setQuelification(e);
                }}
              />
            </Col>

            <Col md="12" className="mt-1">
              <Label>English Speaking Level</Label>
              <Select
                menuPlacement="auto"
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
                  // setFieldValue(e.id, e.value)
                  handleFilterChange(e.id, e.value);
                }}
              />
            </Col>

            <Col md="12" className="mt-1">
              <Label>Enter Prefered Job Location</Label>
              <Input
                id="preferedJobLocation"
                name="preferedJobLocation"
                value={filter?.preferedJobLocation}
                className="w-100"
                maxLength={200}
                onFocus={() => setIsfocus("preferedJobLocation")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "preferedJobLocation" && themecolor,
                }}
                type="text"
                placeholder={"Eg: Vesu, Adajan, Kamrej"}
                onChange={(e) =>
                  handleFilterChange(e.target.id, e.target.value)
                }
              />
            </Col>

            <Col md="12" className="mt-1">
              <Label id="salaryRangeStart">Salary Range</Label>
              <Select
                id="negotiable"
                value={salaryRange}
                placeholder="Select Salary Range"
                options={salaryRangeOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    ["salaryRangeStart"]: e.start,
                    ["salaryRangeEnd"]: e.end,
                  });
                  setSalaryRange(e);
                }}
              />
            </Col>

            <Col md="12" className="mt-1">
              <Label>Notice Period</Label>
              <Select
                menuPlacement="auto"
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
                }}
              />
            </Col>

            <Col md="12" className="mt-1">
              <Label>Currently Working</Label>
              <Select
                menuPlacement="auto"
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
                }}
              />
            </Col>
            {!isClient && (
              <Col md="12" className="mt-1">
                <Label>Comments</Label>
                <Input
                  id="comments"
                  name="comments"
                  maxLength={200}
                  onFocus={() => setIsfocus("comments")}
                  onBlur={() => setIsfocus(null)}
                  style={{
                    borderColor: focus === "comments" && themecolor,
                  }}
                  value={filter?.comments}
                  className="w-100"
                  type="text"
                  placeholder={"Enter Any Keyword"}
                  onChange={(e) =>
                    handleFilterChange(e.target.id, e.target.value)
                  }
                />
              </Col>
            )}
          </Row>
          {/* <Card style={{ height: "calc(100vh - 258px)", marginBottom: 0 }}>
            <CardHeader>
              <CardTitle tag="h4">Filters</CardTitle>
              <Button
                id="handleFilterData"
                style={{ position: "absolute", right: "80px" }}
                className="add-new-user"
                color="link"
                onClick={handleFilterData}
              >
                Search
              </Button>
              <Button
                className="add-new-user "
                color="link"
                onClick={handleClear}
              >
                Clear
              </Button>
            </CardHeader>
            <CardBody>
              <Scrollbars style={{ height: "100%" }} autoHide>
             
              </Scrollbars>
            </CardBody>
          </Card> */}
        </Fragment>
      </Sidebar>
    </>
  );
};

export default Filter;
