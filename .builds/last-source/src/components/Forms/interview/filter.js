import React, { Fragment, useEffect, useState } from "react";
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
// import interviewActions from '../../../redux/interview/actions'
import { selectThemeColors } from "@utils";
import Scrollbars from "react-custom-scrollbars";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import moment from "moment";
import actions from "../../../redux/client/actions";
import interviewActions from "./../../../redux/interview/actions";
import action from "./../../../redux/user/actions";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";

const Filter = ({
  clients,
  userId,
  setFilterToggleMode,
  candidates,
  setFilterData,
  handleFilter = () => {},
  toggleSidebar,
  open,
  handleFilterToggleMode = () => {},
  clear,
  setclear = () => {},
}) => {
  const dispatch = useDispatch();
  const [selectCandidate, setSelectCandidate] = useState("");
  const getCompany = useSelector((state) => state?.client);
  const roleWiseUser = useSelector((state) => state?.user?.roleWise);
  
  const userRole = useSelector((state) => state?.auth?.user?.role?.name);
  const [selectCompany, setSelectCompany] = useState("");
  const [date, setDate] = useState(null);
  const [lineup, setLineup] = useState(null);
  const [interview, setInterview] = useState("");
  const [options, setOptions] = useState([]);
  const [schedul, setSchedul] = useState([]);
  const [interviewStatus, setInterviewStatus] = useState(null);
  const [mobile, setMobile] = useState("");
  const { width } = useBreakpoint();
  const interviewOptions = [
    { value: "personal", id: "interviewType", label: "Personal" },
    { value: "virtual", id: "interviewType", label: "Virtual" },
    { value: "telephonic", id: "interviewType", label: "Telephonic" },
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

  useEffect(() => {
    dispatch({
      type: actions.GET_All_CLIENT,
    });
    dispatch({
      type: action.GET_USER_ROLE_WISE,
    });
  }, []);

  useEffect(() => {
    if (candidates !== null) {
      candidates?.map((ele) => {
        ele.label = `${ele.firstname} ${ele.lastname}`;
        ele.value = ele?.id;
        ele.key = "candidateId";
      });
    }
    const test = [];
    if (clients?.client !== null) {
      clients?.map((ele) => {
        ele.label = ele.companyName;
        ele.key = "onBoardingId";
        test.push(ele);
      });
    }
    if (getCompany?.length > 0) {
      getCompany?.filter((ele) => {
        ele.label = ele.companyName;
        ele.key = "onBoardingId";
        ele.value = ele.id;
        test.push(ele);
      });
    }
    setOptions(test);
  }, [candidates, clients, getCompany]);

  const handleFilterData = async () => {
    const filterdata = {};
    if (date !== null) {
      const dateFormat = moment(date).format("MM/DD/YYYY");
      filterdata.date = dateFormat;
    }
    if (lineup !== null) {
      const date = new Date(lineup);
      filterdata.createdAt = moment(date).format("YYYY-MM-DD");
    }
    if (selectCandidate != "") {
      filterdata.firstname = selectCandidate;
    }
    if (selectCompany?.id) {
      filterdata.onBoardingId = selectCompany?.id;
    }
    if (interviewStatus?.value) {
      filterdata.interviewStatus = interviewStatus.value;
    }
    if (interview?.value?.length > 0) {
      filterdata.interviewType = interview?.value;
    }
    if (schedul?.id) {
      filterdata.scheduledby = schedul?.id;
    }
    if (mobile?.length > 0) {
      filterdata.mobile = mobile;
    }
    handleFilter(filterdata);
    handleFilterToggleMode(false);
  };

  const handleClear = async () => {
    setSelectCandidate("");
    setSelectCompany("");
    setDate(null);
    setInterview("");
    setSchedul("");
    setInterviewStatus(null);
    setMobile("");
    await dispatch({
      type: interviewActions.GET_INTERVIEW,
      payload: {
        filterData: [],
        page: 1,
        perPage: 10,
        userId,
      },
    });
    setDate(null);
    setLineup(null);
    setFilterData([]);
    handleFilterToggleMode(false);
    setclear(false);
  };
  useEffect(() => {
    if (clear == true) {
      handleClear();
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
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
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
              <Label id="candidateId">Select Candidate</Label>
              <Input
                id="candidateId"
                onFocus={() => setIsfocus("candidateId")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "candidateId" && themecolor,
                }}
                className="w-100"
                type="text"
                value={selectCandidate}
                placeholder="Enter Candidate Name"
                onChange={(e) => setSelectCandidate(e.target.value)}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label for="role-select">Contact Number</Label>
              <Input
                id="mobile"
                onFocus={() => setIsfocus("mobile")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "mobile" && themecolor,
                }}
                className="w-100"
                type="text"
                maxLength={10}
                placeholder="Enter Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="companyId">Select Company</Label>
              <Select
                menuPlacement="auto"
                id="companyId"
                value={selectCompany}
                placeholder="Select Company"
                options={options}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setSelectCompany(e);
                }}
              />
            </Col>
            {userRole !== "Recruiter" && (
              <Col md="12" className="mt-1">
                <Label id="jobCategoryId">Scheduled By</Label>
                <Select
                  menuPlacement="auto"
                  id="jobCategoryId"
                  value={schedul}
                  placeholder="Scheduled By"
                  options={roleWiseUser?.filter((item) => {
                    // item.id = "schedulBy"
                    item.value = item.id;
                    item.label = item.name;
                    item.key = "schedulby";
                    return item;
                  })}
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  onChange={(e) => {
                    // handleFilterChange(e.id, e.value)
                    setSchedul(e);
                  }}
                />
              </Col>
            )}
            <Col md="12" className="mt-1">
              <Label id="interviewStatus">Interview Status</Label>
              <Select
                menuPlacement="auto"
                id="interviewStatus"
                placeholder="Select Interview Status"
                value={interviewStatus}
                options={statusOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setInterviewStatus(e);

                  // setStatusOp(e)
                  // const interviewStatusUpdate = new Date().toISOString()
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="date">Lineup Date</Label>
              <Flatpickr
                className="form-control"
                onFocus={() => setIsfocus("lineup")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "lineup" && themecolor,
                }}
                placeholder={"Select Date"}
                value={lineup}
                options={{ dateFormat: "d-M-y" }}
                id="default-picker"
                onChange={(date) => {
                  setLineup(date[0]);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="date">Sheduled Date</Label>
              <Flatpickr
                className="form-control"
                placeholder={"Select Date"}
                value={date}
                onFocus={() => setIsfocus("Sheduled")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "Sheduled" && themecolor,
                }}
                options={{ dateFormat: "d-M-y" }}
                id="default-picker"
                onChange={(date) => {
                  setDate(date[0]);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label for="role-select">Interview</Label>
              <Select
                menuPlacement="auto"
                id="interview"
                value={interview}
                placeholder="Select Interview Option"
                options={interviewOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setInterview(e);
                  // handleChange(e)
                  // setInterviewValidation(e.value)
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
