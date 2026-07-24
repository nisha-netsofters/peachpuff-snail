import React, { Fragment, useState, useEffect } from "react";
import Select from "react-select";
import Sidebar from "@components/sidebar";
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
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectThemeColors } from "../../../utility/Utils";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";
import jobCategoryActions from "./../../../redux/jobCategory/actions";
import industriesActions from "./../../../redux/industries/actions";
import hotVacancyActions from "../../../redux/hotVacancy/actions";
// import hotVacancyActions from "../../../redux/hotVacancy/actions";

const initialState = {
  companyName: "",
  contactOwnerName: "",
  contactOwnerEmail: "",
  jobcategory: [],
  industries: [],
  numberofvacancy: "",
  expirence: "",
  gender: "",
  work: "",
  qualification: "",
  salaryRangeStart: "",
  salaryRangeEnd: "",
};

const Filter = ({
  setFilterData,
  setFilterToggleMode,
  handleFilter = () => {},
  toggleSidebar,
  open,
  handleFilterToggleMode = () => {},
  clear,
  setclear = () => {},
}) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(initialState);
  // const [inquiry, setInquiry] = useState()
  const { width } = useBreakpoint();

  const handleFilterChange = (id, value) => {
    setFilter({ ...filter, [id]: value });
  };
  const handleFilterChangeforjobandind = (label, id) => {
    const updatedArray = [...filter[label], id];
    setFilter({ ...filter, [label]: updatedArray });
  };

  const jobCategories = useSelector((state) => state?.jobCategory?.results);
  const industroies = useSelector((state) => state?.industries);
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (!auth?.user?.clients?.id) {
      dispatch({
        type: jobCategoryActions.GET_ALL_JOBCAT,
      });
      dispatch({ type: industriesActions?.GET_ALL_INDUSTRIES });
    }
  }, []);
  const handleFilterData = async () => {
    const filterdata = {};
    for (const key in filter) {
      if (filter[key].length > 0) {
        filterdata[key] = filter[key];
      }
    }
    setFilterData((prev) => ({ ...prev, filter }));
    handleFilter(filterdata);
    handleFilterToggleMode(false);
  };
  const handleClear = async () => {
    setFilter(initialState);
    await dispatch({
      type: hotVacancyActions.GET_HOT_VACANCY,
      payload: {
        filterData: [],
        page: 1,
        perPage: 10,
      },
    });
    setFilterData([]);
    handleFilterToggleMode(false);
    setclear(false);
    setSalaryRange();
    setjobCategory();
    setindustries();
  };
  useEffect(() => {
    if (clear == true) {
      setFilter(initialState);
      setclear(false);
    }
  }, [clear]);
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

  const genderOptions = [
    { value: "male", id: "gender", label: "Male" },
    { value: "female", id: "gender", label: "Female" },
    { value: "both", id: "gender", label: "Both" },
  ];
  const workOptions = [
    { value: "inhouse", id: "work", label: "Inhouse" },
    { value: "field", id: "work", label: "field" },
    { value: "both", id: "work", label: "Both" },
  ];
  const qualificationOptions = [
    { value: "Graduation", id: "qualification", label: "graduation" },
    { value: "Under Graduate", id: "qualification", label: "Under Graduate" },
    { value: "Any", id: "qualification", label: "Any" },
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
  const [salaryRange, setSalaryRange] = useState("");
  const [workstate, setworkstate] = useState("");
  const [qualificationstate, setqualificationstate] = useState("");

  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  // const [jobCategory, setjobCategory] = useState([]);
  const [focus, setIsfocus] = useState(null);
  const [jobCategory, setjobCategory] = useState([]);
  const [industries, setindustries] = useState([]);
  const [gender, setGender] = useState([]);

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
              >
                Search
              </Button>
              <Button
                className="add-new-user "
                color="link"
                onClick={handleClear}
                style={{ color: themecolor }}
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
          <Row noGutters>
            <Col md="12" className="mt-1">
              <Label id="companyName">Company Name</Label>
              <Input
                type="text"
                name="companyName"
                onFocus={() => setIsfocus("companyName")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "companyName" && themecolor,
                }}
                id="companyName"
                maxLength={200}
                value={filter?.companyName}
                placeholder="Enter Company Name"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="contactOwnerName">Contact Owner Name</Label>
              <Input
                type="text"
                name="contactOwnerName"
                onFocus={() => setIsfocus("contactOwnerName")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "contactOwnerName" && themecolor,
                }}
                id="contactOwnerName"
                maxLength={200}
                value={filter?.contactOwnerName}
                placeholder="Enter Contact Person Name"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="contactOwnerEmail">contact Owner Email</Label>
              <Input
                type="email"
                id="contactOwnerEmail"
                name="contactOwnerEmail"
                onFocus={() => setIsfocus("contactOwnerEmail")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "contactOwnerEmail" && themecolor,
                }}
                value={filter?.contactOwnerEmail}
                placeholder="contact Owner Email"
                onChange={(e) => {
                  handleFilterChange(e.target.id, e.target.value);
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
                onChange={(e) => {
                  handleFilterChange(e.id, e.value);
                  setGender(e);
                }}
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
              <Label id="jobCategoryId">Job Category</Label>
              <Select
                isMulti
                menuPlacement="auto"
                id="jobCategory"
                value={jobCategory}
                placeholder="Select jobCategory"
                options={jobCategories?.map((ele) => {
                  ele.value = ele?.id;
                  ele.label = ele?.jobCategory;
                  return ele;
                })}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setjobCategory(e);
                  e.map((item) => {
                    handleFilterChangeforjobandind("jobcategory", item?.id);
                  });
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="industries">Industries</Label>
              <Select
                isMulti
                menuPlacement="auto"
                id="industries"
                value={industries}
                placeholder="Select industries"
                options={
                  industroies.length &&
                  industroies?.map((ele) => {
                    ele.value = ele?.id;
                    ele.label = ele?.industryCategory;
                    return ele;
                  })
                }
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setindustries(e);
                  e.map((item) => {
                    handleFilterChangeforjobandind("industries", item?.id);
                  });
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="Work">Work</Label>
              <Select
                style={{
                  borderColor: focus === "Work" && themecolor,
                }}
                menuPlacement="auto"
                id="Work"
                value={workstate}
                placeholder="Select Work"
                options={workOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setworkstate(e);
                  handleFilterChange(e?.id, e?.value);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="qualification">Qualification</Label>
              <Select
                style={{
                  borderColor: focus === "qualification" && themecolor,
                }}
                menuPlacement="auto"
                id="Work"
                value={qualificationstate}
                placeholder="Select Qualification"
                options={qualificationOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setqualificationstate(e);
                  handleFilterChange(e?.id, e?.value);
                }}
              />
            </Col>
          </Row>
        </Fragment>
      </Sidebar>
    </>
  );
};

export default Filter;
