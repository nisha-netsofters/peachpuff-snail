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
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  CardBody,
  CardHeader,
  CardTitle,
  Collapse,
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
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import CustomHeader from "../../components/Header/CustomHeader";
import Filter from "../../components/Forms/onBoarding/filter";
import OnBoardingDialog from "../../components/Dialog/OnBoardingDialog";
import onBoardingActions from "../../redux/onBoarding/actions";
import { tostify } from "../../components/Tostify";
import ReactCanvasConfetti from "react-canvas-confetti";
import actions from "./../../redux/jobCategory/actions";
import industriesactions from "../../redux/industries/actions";
// import { uploadFiles } from '../../helper/fileUpload'
import Loader from "../../components/Dialog/Loader";
import { awsUploadAssetsWithResp } from "./../../helper/awsUploadAssets";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

const OnBoarding = () => {
  const { width } = useBreakpoint();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const onBoardings = useSelector((state) => state.onBoarding);
  const users = useSelector((state) => state?.user?.roleWise || []);

  const loginUser = useSelector((state) => state?.auth?.user);
  const [animation, setAnimation] = useState(false);
  const [onBoarding, setOnBoarding] = useState([]);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const locationSearch = useLocation().search;
  const getFilterFromDashboardUrl = () => {
    const params = new URLSearchParams(locationSearch);
    const initial = {};
    const year = params.get("year");
    const month = params.get("month");
    if (year && Number(year) !== 0) initial.statsYear = Number(year);
    if (month && Number(month) !== 0) initial.statsMonth = Number(month);
    return initial;
  };
  const [filterData, setFilterData] = useState(getFilterFromDashboardUrl);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [onBoardingList, setOnBoardingList] = useState();
  const [isOpen, setIsOpen] = useState(
    onBoardings?.results?.map(() => false) ?? []
  );
  const toggle = (index) => {
    const newCollapseStates = [...isOpen];
    newCollapseStates[index] = !newCollapseStates[index];
    setIsOpen(newCollapseStates);
  };
  useEffect(() => {
    dispatch({
      type: industriesactions.GET_ALL_INDUSTRIES,
    });
  }, []);
  const clearStates = () => {
    setOnBoarding([]);
    setAnimation({});
    setUpdate(false);
    setCreate(false);
    setLoading(false);
    setShow(false);
  };
  useEffect(() => {
    if (onBoardings?.results?.length >= 0) {
      setOnBoardingList(onBoardings?.results);
      setLoading(false);
    }
    if (onBoardings?.isSuccess === true) {
      clearStates();
    }
  }, [onBoardings?.results]);

  useEffect(() => {
    if (loginUser?.role?.name === "Recruiter") {
      setIsRecruiter(true);
    }
  }, [loginUser]);

  const getOnBoarding = async (page) => {
    setLoading(true);
    await dispatch({
      type: onBoardingActions.GET_ONBOARDING,
      payload: {
        filterData,
        page,
        perPage,
        userId: loginUser?.id,
      },
    });
  };

  useEffect(() => {
    getJobCat();
  }, []);

  const getJobCat = async () => {
    await dispatch({
      type: actions.GET_ALL_JOBCAT,
    });
  };

  useEffect(() => {
    getOnBoarding(currentPage);
  }, []);

  // useEffect(() => {
  //   if (create === false && update === false) {
  //     getOnBoarding(currentPage);
  //   }
  // }, [create]);

  useEffect(() => {
    (async () => {
      await dispatch({
        type: "GET_USER_ROLE_WISE",
        payload: "Recruiter",
      });
    })();
  }, []);

  useEffect(() => {
    if (!show) setOnBoarding([]);
  }, [show]);

  useEffect(() => {
    setTotalRows(onBoardings.total);
  }, [onBoardings]);

  const deleteOnBoarding = async (row) => {
    setLoading(true);
    await dispatch({
      type: onBoardingActions.DELETE_ONBOARDING,
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
              setOnBoarding(row);
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
      name: "Create_AT",
      selector: (row) => row?.createdAt?.slice(0, 10),
    },
    {
      name: "Status",
      minWidth: "110px",
      cell: (row) => {
        let color = "light-warning";
        if (row.status === "following") color = "light-info";
        else if (row.status === "hold") color = "light-secondary";
        else if (row.status === "fullField") color = "light-success";
        else if (row.status === "sideBySide") color = "light-primary";
        return (
          <Badge
            Badge
            pill
            color={color}
            className="column-action d-flex align-items-center"
            style={{ textTransform: "capitalize" }}
          >
            {row.status}
          </Badge>
        );
      },
    },
    {
      name: "Recruiter",
      selector: (row) => row?.users?.name,
    },
    {
      name: "Company name",
      selector: (row) => row?.companyName,
    },
    {
      name: "Company Owner",
      selector: (row) => row?.companyOwner,
    },
    {
      name: "Company Contact Number",
      selector: (row) => row?.companyContactNo,
    },
    {
      name: "Email",
      selector: (row) => row?.companyEmail,
    },
    {
      name: "State",
      selector: (row) => row?.companyState,
    },
    {
      name: "job Category",
      selector: (row) => row?.jobCategory?.jobCategory,
    },
    {
      name: "No. Of Vacancy",
      selector: (row) => row?.numberOfVacancy,
    },
    {
      name: "Experience",
      selector: (row) => row?.minExperienceYears,
    },
    {
      name: "Gender",
      selector: (row) => row?.gender,
    },
    {
      name: "Work",
      selector: (row) => row?.workType,
    },
    {
      name: "Qualification",
      selector: (row) => row?.qualification,
    },
    {
      name: "Salary Range Start",
      selector: (row) => row?.salaryRangeStart,
    },
    {
      name: "Salary Range End",
      selector: (row) => row?.salaryRangeEnd,
    },
    {
      name: "Job Description File",
      cell: (row) => {
        return row.jobDescriptionFile ? (
          <>
            <div
              style={{ color: "#7F8487", cursor: "pointer" }}
              onClick={() => window.open(row?.jobDescriptionFile)}
            >
              <FileText />
            </div>
          </>
        ) : (
          "null"
        );
      },
    },
  ];
  const onBoardingCreateHandler = async () => {
    setLoading(true);
    if (onBoarding?.jobDescriptionFile) {
      const resp = await awsUploadAssetsWithResp(
        onBoarding?.jobDescriptionFile
      );
      onBoarding.jobDescriptionFile = `${resp.url}`;

      // const resp = await uploadFiles(onBoarding?.jobDescriptionFile)
      onBoarding.jobDescriptionFile = `https:${resp.url}`;
    }
    const fm = new FormData();
    for (const key in onBoarding) {
      fm.append(key, onBoarding[key]);
    }
    await dispatch({
      type: onBoardingActions.CREATE_ONBOARDING,
      payload: { data: fm, page: currentPage, perPage: perPage },
    });
  };

  const onBoardingUpdateHandler = async () => {
    setLoading(true);
    if (
      typeof onBoarding?.jobDescriptionFile === "object" &&
      onBoarding?.jobDescriptionFile !== null &&
      onBoarding?.jobDescriptionFile !== undefined
    ) {
      // const resp = await uploadFiles(onBoarding?.jobDescriptionFile)
      // onBoarding.jobDescriptionFile = `https:${resp.url}`
      const resp = await awsUploadAssetsWithResp(
        onBoarding?.jobDescriptionFile
      );
      onBoarding.jobDescriptionFile = `${resp.url}`;
    }
    const fm = new FormData();
    for (const key in onBoarding) {
      fm.append(key, onBoarding[key]);
    }
    await dispatch({
      type: onBoardingActions.UPDATE_ONBOARDING,
      payload: {
        id: onBoarding.id,
        data: fm,
        page: currentPage,
        perPage: perPage,
      },
    });
  };

  const Validations = async () => {
    const error = false;
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (
      onBoarding?.companyName?.length < 2 ||
      onBoarding?.companyName === undefined
    )
      return tostify("Please Select Company", error);
    else if (
      onBoarding?.companyOwner?.length < 2 ||
      onBoarding?.companyOwner === undefined
    )
      return tostify("Please Enter Company Owner Name");
    else if (
      onBoarding?.companyContactNo?.length !== 10 ||
      onBoarding?.companyContactNo === undefined
    )
      return tostify(" Please Enter Valid Contact Number", error);
    else if (
      !onBoarding?.companyEmail ||
      regex.test(onBoarding?.companyEmail) === false
    )
      return tostify(" Please Enter Valid Email", error);
    else if (
      onBoarding?.companyCity?.length < 2 ||
      onBoarding?.companyCity === undefined
    )
      return tostify("Please Enter city Name");
    else if (
      onBoarding?.companyState?.length < 2 ||
      onBoarding?.companyState === undefined
    )
      return tostify("Please Enter State", error);
    else if (
      onBoarding?.industriesId?.length === 0 ||
      onBoarding?.industriesId === undefined
    )
      return tostify("Please Select Industry ", error);
    else if (
      onBoarding?.jobCategoryId?.length === 0 ||
      onBoarding?.jobCategoryId === undefined
    )
      return tostify("Please Select jobCategory", error);
    else if (
      onBoarding?.numberOfVacancy?.length === 0 ||
      onBoarding?.numberOfVacancy === undefined
    )
      return tostify("Please Enter Number Of Vacancy", error);
    else if (onBoarding?.jobStartTime === undefined)
      return tostify(" Please Select Job Start Time", error);
    else if (onBoarding?.jobEndTime === undefined)
      return tostify(" Please Select Job End Time", error);
    else if (onBoarding?.sunday === undefined)
      return tostify("Please Select Sunday Option", error);
    else if (onBoarding?.minExperienceYears === undefined)
      return tostify("Please Select Experience", error);
    else if (onBoarding?.gender === undefined)
      return tostify("Please Select Gender", error);
    else if (onBoarding?.workType === undefined)
      return tostify("Please Select Work Type Option", error);
    else if (onBoarding?.qualification === undefined)
      return tostify("Please Select Qualification", error);
    else if (
      onBoarding?.salaryRangeStart?.length === 0 ||
      onBoarding?.salaryRangeStart === undefined
    )
      return tostify("Please Enter Salary Range Start", error);
    else if (
      onBoarding?.salaryRangeEnd?.length === 0 ||
      onBoarding?.salaryRangeEnd === undefined
    )
      return tostify("Please Enter Salary Range End", error);
    else if (onBoarding?.negotiable === undefined)
      return tostify("Please Select Negotiable Option", error);
    else if (
      onBoarding?.jobLocation?.length === 0 ||
      onBoarding?.jobLocation === undefined
    )
      return tostify("Please Enter Job Location", error);
    else if (
      onBoarding?.basicSkill?.length === 0 ||
      onBoarding?.basicSkill === undefined
    )
      return tostify("Please Enter Basic Skill", error);
    else if (
      onBoarding?.keyRole?.length === 0 ||
      onBoarding?.keyRole === undefined
    )
      return tostify("Please Enter Key Role And Responsibilities", error);
    // else if (onBoarding?.jobDescriptionFile === undefined || onBoarding?.jobDescriptionFile === null) return tostify("Please Select JobDescriptionFile", error)
    else if (
      onBoarding?.userId?.length === 0 ||
      onBoarding?.userId === undefined
    )
      return tostify("Please select Recruiter", error);
    else if (
      onBoarding?.status?.length === 0 ||
      onBoarding?.status === undefined
    )
      return tostify("Please select status", error);

    return error;
  };

  const UserActionHandler = async () => {
    const err = await Validations();
    if (update === true && err === false) {
      onBoardingUpdateHandler();
    }
    if (create === true && err === false) {
      onBoardingCreateHandler();
    }
  };
  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    getOnBoarding(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    await dispatch({
      type: onBoardingActions.GET_ONBOARDING,
      payload: {
        filterData,
        page,
        perPage: newPerPage,
      },
    });
    setPerPage(newPerPage);
  };

  //filter
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

  useEffect(() => {
    if (filterData && Object.keys(filterData).length > 0) {
      getOnBoarding(1);
    }
  }, [filterData]);

  // useEffect(() => {
  //   if (clear) {
  //     setFilterData([]);
  //     setclear(false);
  //     dispatch({
  //       type: onBoardingActions.GET_ONBOARDING,
  //       payload: {
  //         filterData: [],
  //         page: 1,
  //         perPage: 10,
  //       },
  //     });
  //   }
  // }, [clear]);

  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(onBoardings?.results[0]);

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
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csvcharset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);

    // doc.autoPrint(csv)
    link.click();
  }
  const filterToggle = () => {
    setFilterToggleMode(!filterToggleMode);
  };
  useEffect(() => {
    setAnimation(false);
  }, []);

  const renderStates = (onBoarding) => {
    const statesArr = [
      {
        title: "Recruiter",
        value: onBoarding?.users?.name || "-",
      },
      {
        title: "Company name",
        value: onBoarding?.companyName || "-",
      },
      {
        title: "Company Owner",
        value: onBoarding?.companyOwner || "-",
      },
      {
        title: "Company Contact Number",
        value: onBoarding?.companyContactNo || "-",
      },
      {
        title: "Email",
        value: onBoarding?.companyEmail || "-",
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

  const renderStatesMore = (onBoarding) => {
    const statesArr = [
      {
        title: "State",
        value: onBoarding?.companyState || "-",
      },
      {
        title: "job Category",
        value: onBoarding?.jobCategory?.jobCategory || "-",
      },
      {
        title: "No. Of Vacancy",
        value: onBoarding?.numberOfVacancy || "-",
      },
      {
        title: "Experience",
        value: onBoarding?.minExperienceYears || "-",
      },
      {
        title: "Gender",
        value: onBoarding?.gender || "-",
      },
      {
        title: "Work",
        value: onBoarding?.workType || "-",
      },
      {
        title: "Qualification",
        value: onBoarding?.qualification || "-",
      },

      {
        title: "Salary Range Start",
        value: onBoarding?.salaryRangeStart || "-",
      },
      {
        title: "Salary Range End",
        value: onBoarding?.salaryRangeEnd || "-",
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
  const [onBoardingToDelete, setOnBoardingToDelete] = useState(null);

  const handleDeleteClick = (result) => {
    setOnBoardingToDelete(result);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    deleteOnBoarding(onBoardingToDelete);
    setShowDeleteModal(false);
  };

  const totalPages = Math.ceil(onBoardings?.total / perPage);
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
        <ReactCanvasConfetti
          fire={animation}
          particleCount={500}
          angle={90}
          spread={360}
          startVelocity={100}
          decay={0.8}
          gravity={-0.1}
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
        <h3 style={{ color: themecolor }}>
          <b>On Boarding</b>
        </h3>
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
                    className="w-100"
                    onClick={() => downloadCSV(onBoardings?.results)}
                    style={CSVStyle}
                    onMouseEnter={() => setHoverIndex(1)}
                    onMouseLeave={() => setHoverIndex(0)}
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
            filterData={filterData}
            setFilterToggleMode={setFilterToggleMode}
            setFilterData={setFilterData}
            handleFilter={handleFilter}
            users={users}
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
              {onBoardings?.results?.length > 0 ? (
                <>
                  {onBoardings?.results?.map((result, index) => {
                    let color = "light-warning";
                    if (result?.status === "following") color = "light-info";
                    else if (result?.status === "hold")
                      color = "light-secondary";
                    else if (result?.status === "fullField")
                      color = "light-success";
                    else if (result?.status === "sideBySide")
                      color = "light-primary";
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
                                pill
                                style={{
                                  fontSize: "12px",
                                }}
                                color={color}
                                className="column-action d-flex align-items-center"
                              >
                                {result?.status}
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
                          >
                            {result?.jobDescriptionFile && (
                              <div
                                style={{
                                  color: "#7F8487",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  window.open(result?.jobDescriptionFile)
                                }
                              >
                                <FileText className="mx-1" size={17} />
                              </div>
                            )}
                          </div>
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
                                  setOnBoarding(result);
                                  setUpdate(true);
                                  setShow(true);
                                }}
                              >
                                Edit
                              </DropdownItem>
                              <DropdownItem
                                className="w-100"
                                onClick={() => handleDeleteClick(result)}
                                style={deleteStyle}
                                onMouseEnter={() => setHoverIndex(3)}
                                onMouseLeave={() => setHoverIndex(0)}
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
            onBoardings?.results?.length > 0 && (
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
              {isRecruiter ? (
                <div
                  className="table-header-actions"
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    paddingTop: "15px",
                  }}
                >
                  <UncontrolledDropdown className="me-1">
                    <DropdownToggle color="secondary" caret outline>
                      <Share className="font-small-4 me-50" />
                      <span className="align-middle">Export</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        className="w-100"
                        onClick={() => downloadCSV(onBoardings?.results)}
                      >
                        <FileText className="font-small-4 me-50" />
                        <span className="align-middle">CSV</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              ) : null}
              {/* <Loader loading={loading} /> */}

              {/* <Loader loading={loading} /> */}
              <DataTable
                paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                fixedHeader={true}
                fixedHeaderScrollHeight="500px"
                noHeader
                subHeader
                sortServer
                pagination
                responsive
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
                customStyles={customStyles}
                highlightOnHover={true}
                columns={columns}
                className="react-dataTable"
                data={onBoardingList}
                subHeaderComponent={
                  isRecruiter ? null : (
                    <CustomHeader
                      setShow={setShow}
                      setCreate={setCreate}
                      store={onBoardings?.results}
                    />
                  )
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
        <ModalBody>Are you sure to delete this OnBoarding?</ModalBody>
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
          <OnBoardingDialog
            loading={loading}
            show={show}
            update={update}
            setShow={setShow}
            onBoarding={onBoarding}
            setOnBoarding={setOnBoarding}
            UserActionHandler={UserActionHandler}
            setUpdate={setUpdate}
            setCreate={setCreate}
            users={users}

            // setSelectCompany={setSelectCompany}
          />
        </>
      ) : null}
    </>
  );
};

export default OnBoarding;
