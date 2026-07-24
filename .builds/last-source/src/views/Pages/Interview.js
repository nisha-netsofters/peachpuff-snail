/* eslint-disable */
import DataTable from "react-data-table-component";
import {
  Edit,
  Delete,
  Trash,
  Trash2,
  Share,
  FileText,
  Filter as FilterIcon,
  UserPlus,
  UserCheck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "react-feather";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomHeader from "../../components/Header/CustomHeader";
import Filter from "../../components/Forms/interview/filter";
import interviewActions from "../../redux/interview/actions";
import candidateActions from "../../redux/candidate/actions";
import onBoardingActions from "../../redux/onBoarding/actions";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import InterviewDialog from "../../components/Dialog/interviewDialog";
import { tostify } from "../../components/Tostify";
import { useHistory, useLocation } from "react-router-dom";
import ReactCanvasConfetti from "react-canvas-confetti";
import Loader from "./../../components/Dialog/Loader";
import moment from "moment";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import actions from "../../redux/client/actions";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

const Interview = () => {
  const auth = useSelector((state) => state.auth);
  const { width } = useBreakpoint();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation().search;
  const [animation, setAnimation] = useState(false);
  const candidateId = new URLSearchParams(location).get("id");
  const name = new URLSearchParams(location).get("first");
  const interviews = useSelector((state) => state.interview);
  const clients = useSelector((state) => state.onBoarding.results);
  const candidates = useSelector((state) => state.candidate.results);
  const loginUser = useSelector((state) => state.auth.user);
  const [show, setShow] = useState(false);
  const [interview, setInterview] = useState([]);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [selectCandidateValidation, setSelectCandidateValidation] =
    useState(null);
  const [selectCompanyValidation, setSelectCompanyValidation] = useState(null);
  const [dateValidation, setDateValidation] = useState(null);
  const [interviewStartValidation, setInterviewStartValidation] =
    useState(null);
  const [interviewValidation, setInterviewValidation] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [interviewList, setInterviewList] = useState();
  const { user } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(
    interviews?.results?.map(() => false) ?? []
  );

  const toggle = (index) => {
    const newCollapseStates = [...isOpen];
    newCollapseStates[index] = !newCollapseStates[index];
    setIsOpen(newCollapseStates);
  };
  const slug = localStorage.getItem("slug");
  const clearStates = () => {
    setShow(false);
    setLoading(false);
    setCreate(false);
    setUpdate(false);
    if (candidateId !== null) {
      history.push(`/${slug}/interview`);
    }
  };

  useEffect(() => {
    // if (filterData?.length > 0) {
    //     getInterviews()
    // }
    if (interviews?.results?.length >= 0) {
      setInterviewList(interviews?.results);
      setLoading(false);
    }
    if (interviews?.isSuccess === true) {
      // getInterviews(1);
      clearStates();
    }
  }, [interviews?.results]);
  const getInterviews = async (page) => {
    setLoading(true);

    await dispatch({
      type: interviewActions.GET_INTERVIEW,
      payload: {
        filterData,
        page,
        perPage,
        userId: loginUser.id,
      },
    });
  };
  // useEffect(() => {
  // }, [update])

  useEffect(() => {
    if (!show) {
      setInterview([]);
      setCreate(false);
      setUpdate(false);
    }
    setSelectCandidateValidation(null);
    setSelectCompanyValidation(null);
    setDateValidation(null);
    setInterviewStartValidation(null);
    setInterviewValidation(null);
  }, [show]);

  useEffect(() => {
    if (candidateId && name === null) {
      setShow(true);
      setUpdate(true);
      setInterview(interviews);
    }
    if (candidateId?.length > 0 && name !== null) {
      setShow(true);
      setCreate(true);
      setInterview({ ...interview, candidateId });
    }
  }, [location]);

  // useEffect(() => {
  //   (async () => {
  //     await dispatch({
  //       type: candidateActions.GET_CANDIDATE,
  //       payload: {
  //         filterData,
  //       },
  //     });
  //     await dispatch({
  //       type: onBoardingActions.GET_ONBOARDING,
  //       payload: {
  //         filterData,
  //         userId: loginUser?.id,
  //       },
  //     });
  //   })();
  // }, []);

  // useEffect(() => {
  //   if (create === false && update === false && candidateId === null) {
  //     getInterviews(currentPage);
  //   }
  // }, []);

  useEffect(() => {
    if (filterData && Object.keys(filterData).length > 0) {
      getInterviews(1);
    }
  }, [filterData]);

  useEffect(() => {
    getInterviews(1);
  }, []);

  useEffect(() => {
    setTotalRows(interviews.total);
  }, [interviews]);

  const deleteInterview = async (row) => {
    setLoading(true);
    await dispatch({
      type: interviewActions.DELETE_INTERVIEW,
      payload: { id: row.id, page: currentPage, perPage: perPage },
    });
  };

  const columns = [
    {
      name: "Action",
      minWidth: "110px",
      cell: (row) => (
        <div div className="column-action d-flex align-items-center">
          {row.fullname}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setInterview(row);
              setUpdate(true);
              setShow(true);
            }}
          >
            <Edit size={17} className="mx-1" />
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteClick(row)}
          >
            <Trash size={17} className="mx-1" />
          </span>
        </div>
      ),
    },
    {
      name: "Interview Status",
      minWidth: "110px",
      cell: (row) => {
        let color = "light-success";
        if (row?.interviewStatus === "available")
          color = "light-warning";
        else if (row?.interviewStatus === "scheduled")
          color = "light-info";
        else if (row?.interviewStatus === "rejected")
          color = "light-danger";
        else if (row?.interviewStatus === "completed")
          color = "light-secondary";
        else if (row?.interviewStatus === "CV Shared")
          color = "secondary";
        else if (row?.interviewStatus === "hired")
          color = "light-success";
        else if (row?.interviewStatus === "Not Joined It")
          color = "warning";
        else if (row?.interviewStatus === "Left")
          color = "light-info";
        else if (row?.interviewStatus === "shortlisted")
          color = "info";
        else if (row?.interviewStatus === "trail") color = "dark";
        else if (row?.interviewStatus === "reschedule")
          color = "warning";
        return (
          <Badge
            Badge
            pill
            color={color}
            className="column-action d-flex align-items-center"
            style={{ textTransform: "capitalize" }}
          >
            {row?.interviewStatus}
          </Badge>
        );
      },
    },
    {
      name: "candidate Name",
      selector: (row) =>
        `${row?.candidate?.firstname} ${row?.candidate?.lastname}`,
    },
    {
      name: "Mobile",
      selector: (row) => `${row?.candidate?.mobile}`,
    },
    {
      name: "Company Name",
      selector: (row) => {
        let name = row?.onBoarding?.companyName;
        if (row?.client?.companyName) name = row?.client?.companyName;
        return name;
      },
    },
    {
      name: "Scheduled By",
      selector: (row) => <>{row?.users?.name}</>,
    },
    {
      name: "Lineup Date",
      selector: (row) => moment(row?.createdAt).format("DD-MM-YYYY"),
    },
    {
      name: "Interview Date",
      selector: (row) => moment(row?.date).format("DD-MM-YYYY"),
    },
    {
      name: "Job Joining Date",
      selector: (row) =>
        row?.interviewStatus === "hired" &&
        moment(row?.joiningDate).format("DD-MM-YYYY"),
    },
    {
      name: "Starting Salary",
      selector: (row) =>
        row?.interviewStatus === "hired" && row?.startingSalary,
    },
    {
      name: "Interview Type",
      selector: (row) => row?.interviewType,
    },
    {
      name: "Interview Start Time",
      selector: (row) => {
        return (
          row?.interviewStatus === "scheduled" &&
          moment(row?.time).format("LT")
        );
      },
    },
    {
      name: "link",
      selector: (row) => row?.link,
    },
    {
      name: "Comments",
      selector: (row) => row?.comments,
    },
  ];

  const interviewCreatehandler = async () => {
    setLoading(true);
    await dispatch({
      type: interviewActions.CREATE_INTERVIEW,
      payload: { data: interview, page: currentPage, perPage: perPage },
    });
  };

  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(interviews?.results[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }
  function downloadCSV(array) {
    // const link = document.createElement('a');
    const csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const filename = "export.csv";

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  const interviewUpdatehandler = async () => {
    if (interview.candidate.interviewStatus === "hired") {
      setAnimation({});
    }
    setLoading(true);
    await dispatch({
      type: interviewActions.UPDATE_INTERVIEW,
      payload: { data: interview, page: currentPage, perPage: perPage },
    });
    if (candidateId && name === null) history.push("/dashboard");
  };

  const interviewHandler = async () => {
    if (update === true) {
      interviewUpdatehandler();
    }
    if (create === true) {
      if (selectCandidateValidation === null)
        tostify("Please Select Candidate");
      else if (selectCompanyValidation === null)
        tostify("Please Select Company");
      else if (dateValidation === null) tostify("Please Select date");
      else if (
        interviewStartValidation === null &&
        (interview?.interviewStatus === "scheduled" ||
          interview?.interviewStatus === undefined)
      )
        tostify("Please Select Interview Time");
      else if (
        interviewValidation === null &&
        interview?.interviewStatus === "scheduled"
      )
        tostify("Please Select Interview Option");
      else interviewCreatehandler();
    }
  };
  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    getInterviews(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    await dispatch({
      type: interviewActions.GET_INTERVIEW,
      payload: {
        filterData,
        page,
        perPage: newPerPage,
        userId: loginUser?.id,
      },
    });
    setPerPage(newPerPage);
  };

  const handleFilter = (filter) => {
    setFilterData(filter);
    if (width < 769) {
      filterToggle();
    }
  };
  const handleFilterToggleMode = (filter) => {
    setFilterToggleMode(filter);
  };
  const [clear, setclear] = useState(false);
  const handleClear = () => {
    setclear(true);
  };
  const setclearstate = (clear) => {
    setclear(clear);
  };

  const filterToggle = () => {
    setFilterToggleMode(!filterToggleMode);
  };
  useEffect(() => {
    setAnimation(false);
  }, []);

  const renderStates = (interviews) => {
    let name = interviews?.onBoarding?.companyName;
    if (interviews?.client?.companyName) name = interviews?.client?.companyName;

    const statesArr = [
      {
        title: "Candidate Name",
        value:
          `${interviews?.candidate?.firstname} ${interviews?.candidate?.lastname}` ||
          "-",
      },
      {
        title: "Mobile",
        value: `${interviews?.candidate?.mobile}` || "-",
      },
      {
        title: "Company Name",
        value: name || "-",
      },
      {
        title: "Scheduled By",
        value: interviews?.users?.name || "-",
      },
      {
        title: "Lineup Date",
        value: moment(interviews?.date).format("DD-MM-YYYY") || "-",
      },
    ];

    return statesArr.map((state) => (
      <>
        <div
          key={state.title}
          className="browser-states"
          style={{ marginTop: "5px" }}
        >
          <div className="state-col">
            <strong
              style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
            >
              {state.title}:{" "}
            </strong>
            <strong style={{ fontSize: "12px" }}>{state.value}</strong>
          </div>
        </div>
      </>
    ));
  };

  const renderStatesMore = (interviews) => {
    const statesArr = [
      {
        title: "Interview Date",
        value: moment(interviews?.date).format("DD-MM-YYYY") || "-",
      },
      {
        title: "Job Joining Date",
        value:
          (interview?.interviewStatus === "hired" &&
            moment(interviews?.joiningDate).format("DD-MM-YYYY")) ||
          "-",
      },
      {
        title: "Starting Salary",
        value:
          (interview?.interviewStatus === "hired" &&
            interviews?.startingSalary) ||
          "-",
      },
      {
        title: "Interview Type",
        value: interviews?.interviewType || "-",
      },
      {
        title: "Interview Start Time",
        value:
          (interview?.interviewStatus === "scheduled" &&
            moment(interviews?.time).format("LT")) ||
          "-",
      },
      {
        title: "link",
        value: interviews?.link || "-",
      },
      {
        title: "Comments",
        value: interviews?.comments || "-",
      },
    ];

    return statesArr.map((state) => (
      <>
        <div
          key={state.title}
          className="browser-states"
          style={{ marginTop: "5px" }}
        >
          <div className="state-col">
            <strong
              style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
            >
              {state.title}:{" "}
            </strong>
            <strong style={{ fontSize: "12px" }}>{state.value}</strong>
          </div>
        </div>
      </>
    ));
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [InterviewsToDelete, setInterviewsToDelete] = useState(null);

  const handleDeleteClick = (result) => {
    setInterviewsToDelete(result);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    deleteInterview(InterviewsToDelete);
    setShowDeleteModal(false);
  };

  const totalPages = Math.ceil(interviews?.total / perPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const customStyles = {
    headCells: {
      style: {
        justifyContent: "center",
        width: "150px",
        backgroundColor: `${themecolor}10`,
      },
    },
    cells: {
      style: {
        justifyContent: "center",
        fontWeight: "bold",
      },
    },
  };
  const [hoverIndex, setHoverIndex] = useState(0);
  const CSVStyle = {
    backgroundColor: hoverIndex == 1 && `${themecolor}30`,
    color: hoverIndex == 1 && themecolor,
  };
  const editStyle = {
    backgroundColor: hoverIndex == 2 && `${themecolor}30`,
    color: hoverIndex == 2 && themecolor,
  };
  const deleteStyle = {
    backgroundColor: hoverIndex == 3 && `${themecolor}30`,
    color: hoverIndex == 3 && themecolor,
  };
  return (
    <>
      <div style={{ display: "flex", alignItems: "end" }}>
        <h3 style={{ color: themecolor }}>
          <b>Interview</b>
        </h3>

        <ReactCanvasConfetti
          fire={animation}
          particleCount={500}
          angle={90}
          spread={360}
          startVelocity={100}
          decay={0.8}
          gravity={1}
          origin={{ x: 0.5, y: 0.5 }}
          shapes={"circle"}
          scalar={1}
          zIndex={-1}
          disableForReducedMotion={false}
          resize={true}
          useWorker={true}
          height={window.innerHeight}
          width={window.innerWidth}
          style={canvasStyles}
        />
        {Object.keys(filterData).length > 0 ? (
          <div
            style={{ marginLeft: "auto", display: "flex", alignItems: "end" }}
          >
            {width > 786 ? (
              <h3 style={{ fontSize: "16px", marginBottom: "9px" }}>
                No Of Filter Applied : {Object.keys(filterData).length}
              </h3>
            ) : null}

            <Button
              className="add-new-user "
              color="link"
              onClick={handleClear}
              style={{ color: themecolor }}
            >
              {width > 786 ? "Clear" : "Clear Filter"}
            </Button>
            {/* <X size={17} className="mx-1" onClick={handleClear} /> */}
          </div>
        ) : null}
        <Button
          style={
            width > 769
              ? {
                  width: "145px",
                  marginLeft:
                    Object.keys(filterData).length > 0 ? "10px" : "auto",
                  backgroundColor: themecolor,
                  color: "white",
                }
              : {
                  width: "60px",
                  marginLeft:
                    Object.keys(filterData).length > 0 ? "10px" : "auto",
                  backgroundColor: themecolor,
                  color: "white",
                }
          }
          color="default"
          onClick={() => {
            setFilterData([]);
            filterToggle();
          }}
        >
          {width > 769 ? "Filter Data" : <FilterIcon size={17} />}
        </Button>
        {auth?.user?.clients ? (
          <></>
        ) : (
          <Button
            style={
              width > 769
                ? {
                    display: "none",
                    backgroundColor: themecolor,
                    color: "white",
                  }
                : {
                    width: "60px",
                    marginLeft: "10px",
                    backgroundColor: themecolor,
                    color: "white",
                  }
            }
            className="add-new-user"
            color="default"
            onClick={() => {
              setCreate(true);
              setShow(true);
            }}
          >
            <UserPlus size={17} />
          </Button>
        )}
        <div style={width > 768 ? { display: "none" } : { marginLeft: "10px" }}>
          {auth?.user?.agency?.isDownloadAble === true && (
            <>
              {" "}
              <UncontrolledDropdown className="chart-dropdown">
                <DropdownToggle
                  color=""
                  className="bg-transparent btn-sm border-0 p-50"
                >
                  <MoreVertical size={18} className="cursor-pointer" />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem
                    style={CSVStyle}
                    onMouseEnter={() => setHoverIndex(1)}
                    onMouseLeave={() => setHoverIndex(0)}
                    className="w-100"
                    onClick={() => downloadCSV(interviews?.results)}
                  >
                    <FileText className="font-small-4 me-50" />
                    <span className="align-middle">Download CSV</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          )}
        </div>
      </div>
      <Row className="mt-1" style={{ transition: "all 0.5s ease-in-out" }}>
        <Col
          sm={12}
          md={3}
          lg={3}
          xl={3}
          style={{
            transition: "all 0.5s ease-in-out",
            display: filterToggleMode ? "block" : "none",
          }}
        >
          <Filter
            handleFilterToggleMode={handleFilterToggleMode}
            clear={clear}
            setclear={setclearstate}
            open={filterToggleMode}
            toggleSidebar={filterToggle}
            userId={loginUser?.id}
            clients={clients}
            setFilterToggleMode={setFilterToggleMode}
            candidates={candidates}
            filterData={filterData}
            setFilterData={setFilterData}
            handleFilter={handleFilter}
          />
        </Col>
        <Col
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={
            width <= 768
              ? {
                  paddingLeft: 0,
                  paddingRight: 0,
                  overflowY: "auto",
                  maxHeight: "600px",
                }
              : { paddingLeft: 0, paddingRight: 0 }
          }
        >
          {width < 786 && loading == true ? (
            <ComponentSpinner
              isClientCandidate={true}
              theamcolour={themecolor}
            />
          ) : (
            <>
              {interviews?.results?.length > 0 ? (
                <>
                  {interviews?.results?.map((result, index) => {
                    let color = "light-success";
                    if (result?.interviewStatus === "available")
                      color = "light-warning";
                    else if (result?.interviewStatus === "scheduled")
                      color = "light-info";
                    else if (result?.interviewStatus === "rejected")
                      color = "light-danger";
                    else if (result?.interviewStatus === "completed")
                      color = "light-secondary";
                    else if (result?.interviewStatus === "CV Shared")
                      color = "secondary";
                    else if (result?.interviewStatus === "hired")
                      color = "light-success";
                    else if (
                      result?.interviewStatus === "Not Joined It"
                    )
                      color = "warning";
                    else if (result?.interviewStatus === "Left")
                      color = "light-info";
                    else if (
                      result?.interviewStatus === "shortlisted"
                    )
                      color = "info";
                    else if (result?.interviewStatus === "trail")
                      color = "dark";
                    else if (
                      result?.interviewStatus === "reschedule"
                    )
                      color = "warning";
                    return (
                      <Card
                        key={index}
                        className={`card-browser-states`}
                        style={
                          width > 769
                            ? { display: "none" }
                            : filterToggleMode
                            ? { display: "none" }
                            : {
                                borderRadius: "5px",
                                padding: "10px",
                                marginBottom: "1rem",
                              }
                        }
                      >
                        <CardHeader
                          style={{ padding: "0px", justifyContent: "left" }}
                        >
                          <div className="d-flex gap-1 flex-column">
                            <CardTitle
                              tag="h4"
                              className="d-flex gap-1 align-items-center"
                            >
                              <Badge
                                Badge
                                style={{
                                  fontSize: "12px",
                                }}
                                pill
                                color={color}
                                className="column-action d-flex align-items-center"
                              >
                                {result?.interviewStatus}
                              </Badge>
                            </CardTitle>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginLeft: "auto",
                            }}
                          ></div>
                          <UncontrolledDropdown className="chart-dropdown">
                            <DropdownToggle
                              color=""
                              className="bg-transparent btn-sm border-0 p-50"
                            >
                              <MoreVertical
                                size={18}
                                className="cursor-pointer"
                              />
                            </DropdownToggle>
                            <DropdownMenu end>
                              <DropdownItem
                                className="w-100"
                                style={editStyle}
                                onMouseEnter={() => setHoverIndex(2)}
                                onMouseLeave={() => setHoverIndex(0)}
                                onClick={() => {
                                  setInterview(result);
                                  setUpdate(true);
                                  setShow(true);
                                }}
                              >
                                Edit
                              </DropdownItem>
                              <DropdownItem
                                className="w-100"
                                style={deleteStyle}
                                onMouseEnter={() => setHoverIndex(3)}
                                onMouseLeave={() => setHoverIndex(0)}
                                onClick={() => handleDeleteClick(result)}
                              >
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </CardHeader>
                        <CardBody
                          style={{
                            padding: "0.5rem 0.5rem",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {renderStates(result)}{" "}
                          <div>
                            <Collapse isOpen={isOpen[index]}>
                              {renderStatesMore(result)}{" "}
                            </Collapse>
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{ marginTop: "10px" }}
                            >
                              {isOpen[index] ? (
                                <>
                                  <div
                                    className="view-collapse"
                                    onClick={() => toggle(index)}
                                    style={{
                                      color: themecolor,
                                      cursor: "pointer",
                                    }}
                                  >
                                    View Less
                                    <ChevronUp size={17} />{" "}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className="view-collapse"
                                    onClick={() => toggle(index)}
                                    style={{
                                      color: themecolor,
                                      cursor: "pointer",
                                    }}
                                  >
                                    View More
                                    <ChevronDown size={17} />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </>
              ) : (
                <Card
                  className={`card-browser-states`}
                  style={
                    width > 769
                      ? { display: "none" }
                      : filterToggleMode
                      ? { display: "none" }
                      : {
                          borderRadius: "5px",
                          padding: "10px",
                          marginBottom: "1rem",
                        }
                  }
                >
                  <CardHeader
                    style={{ padding: "0px", justifyContent: "center" }}
                  >
                    <div className="d-flex gap-1 flex-column">
                      <CardTitle
                        tag="h4"
                        className="d-flex gap-1 align-items-center"
                      >
                        There are no records to display
                      </CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              )}
            </>
          )}

          {width <= 768 &&
            !filterToggleMode &&
            interviews?.results?.length > 0 && (
              <Pagination className="d-flex mt-3 align-items-center justify-content-center">
                <PaginationItem>
                  <PaginationLink
                    previous
                    href="#"
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                  >
                    <ChevronLeft size={15} /> Prev
                  </PaginationLink>
                </PaginationItem>

                {visiblePageNumbers?.map((pageNumber) => (
                  <PaginationItem
                    key={pageNumber}
                    active={pageNumber === currentPage}
                  >
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      style={{
                        borderRadius: "0.5rem ",
                        backgroundColor:
                          pageNumber === currentPage && themecolor,
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationLink
                    next
                    href="#"
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                  >
                    Next <ChevronRight size={15} />
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            )}
          <Card
            className="overflow-hidden"
            style={width < 769 ? { display: "none" } : {}}
          >
            <div className="react-dataTable">
              {/* <Loader loading={!candidateId && loading} /> */}
              <DataTable
                paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                fixedHeader={true}
                fixedHeaderScrollHeight="500px"
                noHeader
                subHeader
                sortServer
                pagination
                responsive
                customStyles={customStyles}
                progressPending={loading}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                paginationTotalRows={totalRows}
                paginationServer
                allowRowEvents
                progressComponent={
                  <ComponentSpinner
                    isClientCandidate={true}
                    theamcolour={themecolor}
                  />
                }
                highlightOnHover={true}
                columns={columns}
                className="react-dataTable"
                data={interviewList}
                subHeaderComponent={
                  <CustomHeader
                    setShow={setShow}
                    setCreate={setCreate}
                    store={interviews?.results}
                  />
                }
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        className="modal-dialog-centered"
        isOpen={showDeleteModal}
        toggle={() => setShowDeleteModal(!showDeleteModal)}
      >
        <ModalHeader toggle={() => setShowDeleteModal(!showDeleteModal)}>
          Confirm
        </ModalHeader>
        <ModalBody>Are you sure to delete this Interviews?</ModalBody>
        <ModalFooter>
          <Button
            color="default"
            style={{ backgroundColor: themecolor, color: "white" }}
            onClick={confirmDelete}
          >
            Yes, Delete
          </Button>
          <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {show === true ? (
        <>
          <InterviewDialog
            loading={loading}
            candidateId={candidateId}
            setCreate={setCreate}
            create={create}
            setUpdate={setUpdate}
            interviewHandler={interviewHandler}
            interview={interview}
            setInterview={setInterview}
            show={show}
            setShow={setShow}
            clients={clients}
            candidates={candidates}
            update={update}
            loginUser={loginUser}
            setSelectCandidateValidation={setSelectCandidateValidation}
            setSelectCompanyValidation={setSelectCompanyValidation}
            setDateValidation={setDateValidation}
            setInterviewStartValidation={setInterviewStartValidation}
            setInterviewValidation={setInterviewValidation}
          />
        </>
      ) : null}
    </>
  );
};

export default Interview;
