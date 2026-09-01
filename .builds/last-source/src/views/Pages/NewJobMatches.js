import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Collapse,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import jobOpeningMatchesActions from "../../redux/jobOpeningMatches/actions";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import DataTable from "react-data-table-component";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import moment from "moment/moment";
import whatsapp from "../../assets/images/whatsapp-svgrepo-com.svg";
import clientActions from "../../redux/client/actions";
import subscriptionActions from "../../redux/subscription/actions";
import InterviewDialog from "../../components/Dialog/interviewDialog";
import interviewActions from "../../redux/interview/actions";
import candidateActions from "../../redux/candidate/actions";
import onBoardingActions from "../../redux/onBoarding/actions";
import { tostify } from "../../components/Tostify";
import { getInterviewAPI } from "../../apis/interview";
import Avatar from "@components/avatar";
import { MdOutlineCategory } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineWorkHistory } from "react-icons/md";
import { BsGenderAmbiguous } from "react-icons/bs";
import { MdOutlinePlace } from "react-icons/md";
import { PiStudentLight } from "react-icons/pi";
import { MdOutlineAttachMoney } from "react-icons/md";
import WhatsappDialog from "../../components/Dialog/WhatsappDialog";
import JobOpeningMatchFilters from "../../components/JobOpening/JobOpeningMatchFilters";
import JobMatchProfileDialog from "../../components/JobOpening/JobMatchProfileDialog";
import {
  InterviewStatusCell,
  getInterviewButtonLabel,
  getViewProfileButtonLabel,
  buildInterviewEditState,
  buildInterviewUpdatePayload,
  fetchJobScopedInterview,
  isShortlistedInterview,
} from "../../components/JobOpening/jobMatchTableHelpers";

const NewJobMatches = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();
  const slug = localStorage.getItem("slug");
  const themeColor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const user = useSelector((state) => state?.auth?.user);
  const loginUser = useSelector((state) => state?.auth?.user);
  const clientsState = useSelector((state) => state.client);
  const onboardingState = useSelector((state) => state.onBoarding);
  const clients = Array.isArray(clientsState?.results)
    ? clientsState.results
    : Array.isArray(onboardingState?.results)
      ? onboardingState.results
      : [];
  const candidates = useSelector((state) => state.candidate.results);
  const { isLoading, jobOpeningNewMatchCandidate, jobOpeningRow } = useSelector(
    (state) => state?.jobOpeningMatches
  );
  const { resumeCountFinishError } = useSelector(
    (state) => state?.subscription
  );

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("newToOld");
  const [profileCompletion, setProfileCompletion] = useState("");
  const [matchDuration, setMatchDuration] = useState("");
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const [interview, setInterview] = useState({});
  const [createInterview, setCreateInterview] = useState(false);
  const [updateInterview, setUpdateInterview] = useState(false);
  const [selectCandidateValidation, setSelectCandidateValidation] = useState(null);
  const [selectCompanyValidation, setSelectCompanyValidation] = useState(null);
  const [dateValidation, setDateValidation] = useState(null);
  const [interviewStartValidation, setInterviewStartValidation] = useState(null);
  const [interviewValidation, setInterviewValidation] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileCandidate, setProfileCandidate] = useState({});
  const [industriesData, setIndustriesData] = useState([]);
  const [gender, setGender] = useState("");
  const [, setProfileEmail] = useState("");
  const [viewedCandidateIds, setViewedCandidateIds] = useState(() => new Set());
  const [showWPModal, setShowWPModal] = useState(false);
  const [WPnumber, setWPnumber] = useState();
  const [clientData, setClientData] = useState([]);

  console.info("--------------------");
  console.info("jobOpeningNewMatchCandidate => ", jobOpeningNewMatchCandidate);
  console.info("jobOpeningRow => ", jobOpeningRow);
  console.info("--------------------");

  const getJobOpeningRow = async () => {
    await dispatch({
      type: jobOpeningMatchesActions.GET_JOB_OPENING_ROW,
      payload: params?.id,
    });
  };

  const getNewJobMatchCandidate = async (
    pageNum,
    perPageNum,
    sort = sortBy,
    profile = profileCompletion,
    duration = matchDuration
  ) => {
    await dispatch({
      type: jobOpeningMatchesActions.GET_JOB_OPENING_NEW_MATCH_CANDIDATE,
      payload: {
        id: params?.id,
        page: pageNum,
        perPage: perPageNum,
        sortBy: sort,
        profileCompletion: profile || undefined,
        matchDuration: duration || undefined,
      },
    });
  };

  const reloadMatches = () =>
    getNewJobMatchCandidate(page, perPage, sortBy, profileCompletion, matchDuration);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleProfileChange = (value) => {
    setProfileCompletion(value);
  };

  const handleMatchDurationChange = (value) => {
    setMatchDuration(value);
  };

  const handleFilterSearch = () => {
    setPage(1);
    getNewJobMatchCandidate(1, perPage, sortBy, profileCompletion, matchDuration);
    setFilterToggleMode(false);
  };

  const handleFilterClear = () => {
    setSortBy("newToOld");
    setProfileCompletion("");
    setMatchDuration("");
    setPage(1);
    getNewJobMatchCandidate(1, perPage, "newToOld", "", "");
    setFilterToggleMode(false);
  };

  useEffect(() => {
    (async () => {
      if (params?.id) {
        await getJobOpeningRow();
        await getNewJobMatchCandidate(page, perPage);
      }
    })();
  }, []);

  useEffect(() => {
    if (!showInterview) return;
    (async () => {
      await dispatch({
        type: candidateActions.GET_CANDIDATE,
        payload: { page: 1, perPage: 10, filterData: {} },
      });
      await dispatch({
        type: clientActions.GET_CLIENT,
        payload: {
          page: 1,
          perPage: 100,
          filterData: {},
        },
      });
      await dispatch({
        type: onBoardingActions.GET_ONBOARDING,
        payload: {
          filterData: {},
          userId: loginUser?.id,
          page: 1,
          perPage: 50,
        },
      });
    })();
  }, [showInterview, dispatch, loginUser?.id]);

  const openInterviewDialog = async (candidate) => {
    setInterviewLoading(true);
    const jobOpeningId = params?.id;
    const existing = await fetchJobScopedInterview(
      getInterviewAPI,
      candidate?.id,
      jobOpeningId
    );
    if (existing?.id) {
      setInterview(
        buildInterviewEditState(
          existing,
          candidate,
          jobOpeningId,
          loginUser?.id
        )
      );
      setCreateInterview(false);
      setUpdateInterview(true);
    } else {
      setInterview({
        candidateId: candidate?.id,
        userId: loginUser?.id,
        jobOpeningId,
        candidate: {
          firstname: candidate?.firstname,
          lastname: candidate?.lastname,
          interviewStatus: candidate?.interviewStatus,
        },
      });
      setSelectCompanyValidation(null);
      setCreateInterview(true);
      setUpdateInterview(false);
    }
    setShowInterview(true);
    setInterviewLoading(false);
  };

  const interviewCreateHandler = async () => {
    setInterviewLoading(true);
    const payload = {
      ...(Array.isArray(interview) ? {} : interview || {}),
      userId: interview?.userId || loginUser?.id,
      jobOpeningId: interview?.jobOpeningId || params?.id,
    };
    await dispatch({
      type: interviewActions.CREATE_INTERVIEW,
      payload: { data: payload, page: 1, perPage: 10 },
    });
    setInterviewLoading(false);
    setShowInterview(false);
    setCreateInterview(false);
    setUpdateInterview(false);
    setInterview({});
    reloadMatches();
  };

  const interviewUpdateHandler = async () => {
    const payload = buildInterviewUpdatePayload(interview);
    if (!payload?.id) {
      tostify("Interview not found — please close and try again");
      setInterviewLoading(false);
      return;
    }
    setInterviewLoading(true);
    await dispatch({
      type: interviewActions.UPDATE_INTERVIEW,
      payload: { data: payload, page: 1, perPage: 10 },
    });
    setInterviewLoading(false);
    setShowInterview(false);
    setCreateInterview(false);
    setUpdateInterview(false);
    setInterview({});
    reloadMatches();
  };

  const interviewHandler = async () => {
    if (updateInterview) {
      interviewUpdateHandler();
      return;
    }
    if (!createInterview) return;
    if (selectCandidateValidation === null) tostify("Please Select Candidate");
    else if (selectCompanyValidation === null) tostify("Please Select Company");
    else if (
      dateValidation === null &&
      !isShortlistedInterview(interview)
    )
      tostify("Please Select date");
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
    else interviewCreateHandler();
  };

  const openViewProfile = (row) => {
    if (!row?.id) return;
    const candidateId = String(row.id);
    dispatch({
      type: candidateActions.CANDIDATE_STATUS,
      payload: { id: candidateId },
    });
    setViewedCandidateIds((prev) => new Set(prev).add(candidateId));
    setProfileCandidate(row);
    setIndustriesData(row?.industries_relation || []);
    setGender(row?.gender || "");
    setProfileEmail(row?.email || "");
    setShowProfile(true);
  };

  const viewProfileColumn = {
    name: "View Profile",
    minWidth: "130px",
    cell: (row) => (
      <Button
        onClick={() => openViewProfile(row)}
        style={{ padding: "10px", backgroundColor: themeColor, color: "white" }}
        color="default"
      >
        {getViewProfileButtonLabel(row, viewedCandidateIds)}
      </Button>
    ),
  };

  const interviewScheduleColumn = {
    name: "Interview Shedule",
    minWidth: "150px",
    cell: (row) => (
      <Button
        onClick={() => openInterviewDialog(row)}
        style={{ padding: "10px", backgroundColor: themeColor, color: "white" }}
        color="default"
      >
        {getInterviewButtonLabel(row)}
      </Button>
    ),
  };

  const interviewStatusColumn = {
    name: "Interview Status",
    minWidth: "130px",
    cell: (row) => <InterviewStatusCell row={row} />,
  };

  const customStyles = {
    headCells: {
      style: {
        justifyContent: "center",
        backgroundColor: `${themeColor}10`,
      },
    },
    cells: {
      style: {
        justifyContent: "center",
        fontWeight: "bold",
      },
    },
  };

  const columnsClients = [
    {
      name: "Status",
      minWidth: "110px",
      cell: (row) => {
        const createdDate = moment(row.created_at);
        const fiveDaysAgo = moment().subtract(5, "days");

        // if (user?.email != 'gunjan@growworkinfotech.com') {
        //   return null
        // }

        if (createdDate.isAfter(fiveDaysAgo)) {
          return (
            <Badge
              pill
              color="default"
              style={{ backgroundColor: themeColor }}
              className="column-action d-flex align-items-center"
            >
              {"New"}
            </Badge>
          );
        } else {
          return null;
        }
      },
    },
    {
      name: "Match Score",
      selector: (row) => row?.matchScore ?? 0,
      minWidth: "100px",
    },
    {
      name: "Profile Completion",
      selector: (row) =>
        row?.profileCompleteness != null
          ? `${row.profileCompleteness}%`
          : "-",
      minWidth: "120px",
    },
    {
      name: "First Name",
      selector: (row) => row?.firstname,
    },
    {
      name: "Last Name",
      selector: (row) => row?.lastname,
    },
    {
      name: "Job Category",
      selector: (row) => row?.professional?.jobCategory?.jobCategory,
    },
    {
      name: "gender",
      selector: (row) => row?.gender,
    },
    {
      name: "Qualification Held",
      selector: (row) => row?.professional?.highestQualification,
    },
    {
      name: "Experience",
      selector: (row) => row?.professional?.experienceInyear,
    },

    {
      name: "Currant Salary",
      selector: (row) => row?.professional?.currentSalary,
    },
    {
      name: "Expected Salary",
      selector: (row) => row?.professional?.expectedsalary,
    },
    {
      name: "Preferable Job Location",
      selector: (row) => row?.professional?.preferedJobLocation,
    },
    {
      name: "Notice Period",
      selector: (row) => row?.professional?.noticePeriod,
    },
    {
      name: "Currently Working",
      selector: (row) => row?.professional?.currentlyWorking,
    },
    {
      name: "City",
      selector: (row) => row?.city,
    },
    {
      name: "Chat",
      cell: () => {
        return (
          <>
            <a
              onClick={() => setWhatsappOpen(true)}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <img src={whatsapp} style={{ height: "20%", width: "20%" }} />
            </a>
          </>
        );
      },
    },
    interviewStatusColumn,
    viewProfileColumn,
    interviewScheduleColumn,
  ];
  const subscriptionColumnsClients = [
    {
      name: "Status",
      minWidth: "110px",
      cell: (row) => {
        const createdDate = moment(row.created_at);
        const fiveDaysAgo = moment().subtract(5, "days");

        if (createdDate.isAfter(fiveDaysAgo)) {
          return (
            <Badge
              pill
              color="default"
              style={{ backgroundColor: themeColor }}
              className="column-action d-flex align-items-center"
            >
              {"New"}
            </Badge>
          );
        } else {
          return null;
        }
      },
    },
    {
      name: "Match Score",
      selector: (row) => row?.matchScore ?? 0,
      minWidth: "100px",
    },
    {
      name: "Profile Completion",
      selector: (row) =>
        row?.profileCompleteness != null
          ? `${row.profileCompleteness}%`
          : "-",
      minWidth: "120px",
    },
    {
      name: "First Name",
      selector: (row) => row?.firstname,
    },
    {
      name: "Last Name",
      selector: (row) => row?.lastname,
    },
    {
      name: "Email-id",
      selector: (row) => row?.email,
    },
    {
      name: "Contact number",
      selector: (row) => row?.mobile,
    },
    {
      name: "Job Category",
      selector: (row) => row?.professional?.jobCategory?.jobCategory,
    },
    {
      name: "gender",
      selector: (row) => row?.gender,
    },
    {
      name: "Qualification Held",
      selector: (row) => row?.professional?.highestQualification,
    },
    {
      name: "Experience",
      selector: (row) => row?.professional?.experienceInyear,
    },
    {
      name: "Currant Salary",
      selector: (row) => row?.professional?.currentSalary,
    },
    {
      name: "Expected Salary",
      selector: (row) => row?.professional?.expectedsalary,
    },
    {
      name: "Preferable Job Location",
      selector: (row) => row?.professional?.preferedJobLocation,
    },
    {
      name: "Notice Period",
      selector: (row) => row?.professional?.noticePeriod,
    },
    {
      name: "Currently Working",
      selector: (row) => row?.professional?.currentlyWorking,
    },
    {
      name: "City",
      selector: (row) => row?.city,
    },
    {
      name: "Chat",
      cell: (row) => {
        return (
          <>
            <a
              onClick={() => {
                setShowWPModal(true), setWPnumber(row?.mobile);
              }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <img src={whatsapp} style={{ height: "20%", width: "20%" }} />
            </a>
          </>
        );
      },
    },
    interviewStatusColumn,
    viewProfileColumn,
    interviewScheduleColumn,
  ];

  const handlePerRowsChange = async (newPerPage, pageNum) => {
    setPerPage(newPerPage);
    getNewJobMatchCandidate(pageNum, newPerPage, sortBy, profileCompletion, matchDuration);
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    getNewJobMatchCandidate(pageNum, perPage, sortBy, profileCompletion, matchDuration);
  };

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <Button
            style={{
              color: themeColor,
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            className="add-new-user"
            color="default"
            onClick={() => {
              history.push(`/${slug}/jobopening`);
            }}
          >
            <ArrowLeft size={17} />
            Back
          </Button>
          <Button
            color="default"
            style={{
              backgroundColor: themeColor,
              color: "white",
              marginLeft: "auto",
            }}
            onClick={() => setDetailsOpen((prev) => !prev)}
          >
            Job Details {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          <Button
            color="default"
            style={{ backgroundColor: themeColor, color: "white", width: "145px" }}
            onClick={() => setFilterToggleMode((prev) => !prev)}
          >
            Filter Data
          </Button>
        </div>
        <JobOpeningMatchFilters
          asSidebar
          open={filterToggleMode}
          toggleSidebar={() => setFilterToggleMode((prev) => !prev)}
          sortBy={sortBy}
          profileCompletion={profileCompletion}
          matchDuration={matchDuration}
          onSortChange={handleSortChange}
          onProfileChange={handleProfileChange}
          onMatchDurationChange={handleMatchDurationChange}
          onSearch={handleFilterSearch}
          onClear={handleFilterClear}
        />
        <Row>
          <Col sm={12} md={4} lg={4} xl={3} style={{ display: detailsOpen ? "block" : "none" }}>
            <Collapse isOpen={detailsOpen}>
            <Card>
              <CardBody>
                <h5
                  className="fw-bolder border-bottom pb-50 mb-1"
                  style={{ color: themeColor }}
                >
                  New Matches
                  <div
                    style={{
                      color: "#5e5873",
                      fontWeight: "400",
                      fontSize: "12px",
                      marginTop: "1rem",
                    }}
                  >{`${jobOpeningNewMatchCandidate?.total} Matches Found`}</div>
                </h5>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div key={"item.title"} className="transaction-item">
                    <div className="d-flex gap-1">
                      <Avatar
                        className="rounded"
                        color={"light-primary"}
                        contentStyles={{ width: "44px", height: "44px" }}
                        icon={<MdOutlineCategory size={18} />}
                      />
                      <div>
                        <h6 className="transaction-title">Job Category</h6>
                        <small style={{ fontWeight: "400" }}>
                          {" "}
                          {jobOpeningRow?.jobCategory?.jobCategory}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div key={"item.title"} className="transaction-item">
                    <div className="d-flex gap-1">
                      <Avatar
                        className="rounded"
                        color={"light-success"}
                        contentStyles={{ width: "44px", height: "44px" }}
                        icon={<BsPersonWorkspace size={18} />}
                      />
                      <div>
                        <h6 className="transaction-title">No. Of Vacancy</h6>
                        <small style={{ fontWeight: "400" }}>
                          {" "}
                          {jobOpeningRow.numberOfVacancy}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div key={"item.title"} className="transaction-item">
                    <div className="d-flex gap-1">
                      <Avatar
                        className="rounded"
                        color={"light-danger"}
                        contentStyles={{ width: "44px", height: "44px" }}
                        icon={<MdOutlineWorkHistory size={18} />}
                      />
                      <div>
                        <h6 className="transaction-title">Experience</h6>
                        <small style={{ fontWeight: "400" }}>
                          {" "}
                          {jobOpeningRow.minExperienceYears}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div key={"item.title"} className="transaction-item">
                    <div className="d-flex gap-1">
                      <Avatar
                        className="rounded"
                        color={"light-warning"}
                        contentStyles={{ width: "44px", height: "44px" }}
                        icon={<BsGenderAmbiguous size={18} />}
                      />
                      <div>
                        <h6 className="transaction-title">Gender</h6>
                        <small style={{ fontWeight: "400" }}>
                          {" "}
                          {jobOpeningRow.gender}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div key={"item.title"} className="transaction-item">
                    <div className="d-flex gap-1">
                      <Avatar
                        className="rounded"
                        color={"light-info"}
                        contentStyles={{ width: "44px", height: "44px" }}
                        icon={<MdOutlinePlace size={18} />}
                      />
                      <div>
                        <h6 className="transaction-title">Work</h6>
                        <small style={{ fontWeight: "400" }}>
                          {" "}
                          {jobOpeningRow.workType}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div key={"item.title"} className="transaction-item">
                    <div className="d-flex gap-1">
                      <Avatar
                        className="rounded"
                        color={"light-primary"}
                        contentStyles={{ width: "44px", height: "44px" }}
                        icon={<PiStudentLight size={18} />}
                      />
                      <div>
                        <h6 className="transaction-title">Qualification</h6>
                        <small style={{ fontWeight: "400" }}>
                          {" "}
                          {jobOpeningRow.qualification}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div key={"item.title"} className="transaction-item">
                    <div className="d-flex gap-1">
                      <Avatar
                        className="rounded"
                        color={"light-success"}
                        contentStyles={{ width: "44px", height: "44px" }}
                        icon={<MdOutlineAttachMoney size={18} />}
                      />
                      <div>
                        <h6 className="transaction-title">Salary range</h6>
                        <small style={{ fontWeight: "400" }}>
                          {" "}
                          {`${jobOpeningRow.salaryRangeStart} to ${jobOpeningRow.salaryRangeEnd}`}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            </Collapse>
          </Col>
          <Col sm={12} md={detailsOpen ? 8 : 12} lg={detailsOpen ? 8 : 12} xl={detailsOpen ? 9 : 12}>
            <Card>
              <CardBody className="pb-0">
                <h5
                  style={{
                    color: themeColor,
                    fontWeight: "600",
                    margin: "0 0 8px 0",
                  }}
                >
                  New Matches Candidates
                  <span
                    style={{
                      color: "#5e5873",
                      fontWeight: "400",
                      fontSize: "13px",
                      marginLeft: "8px",
                    }}
                  >
                    {`${jobOpeningNewMatchCandidate?.total || 0} Matches Found`}
                  </span>
                </h5>
              </CardBody>
              <div className="react-dataTable job-opening-match-table">
                <DataTable
                  paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                  selectableRows={false}
                  fixedHeader={true}
                  progressPending={isLoading || interviewLoading}
                  progressComponent={
                    <ComponentSpinner
                      isClientCandidate={true}
                      theamcolour={themeColor}
                    />
                  }
                  fixedHeaderScrollHeight="500px"
                  noHeader
                  sortServer
                  pagination
                  responsive
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  paginationTotalRows={jobOpeningNewMatchCandidate?.total || 0}
                  paginationServer
                  allowRowEvents
                  customStyles={customStyles}
                  highlightOnHover={true}
                  columns={
                    user?.clients?.id
                      ? user?.subscription?.plan?.planName == "free" ||
                        user?.subscription?.plan?.planName == "Trial"
                        ? columnsClients
                        : subscriptionColumnsClients
                      : columnsClients
                  }
                  className="react-dataTable"
                  data={jobOpeningNewMatchCandidate?.results || []}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      {showWPModal === true ? (
        <WhatsappDialog
          WPnumber={WPnumber}
          loading={isLoading}
          showWPModal={showWPModal}
          setShowWPModal={setShowWPModal}
          clientData={clientData}
          setClientData={setClientData}
        />
      ) : null}
      <Modal
        className="modal-dialog-centered"
        isOpen={whatsappOpen}
        toggle={() => setWhatsappOpen(!whatsappOpen)}
      >
        <ModalHeader
          toggle={() => setWhatsappOpen(!whatsappOpen)}
          style={{ textAlign: "center" }}
        >
          {" "}
          Attention !!
        </ModalHeader>
        <ModalBody>
          To access this feature kindly Contact Uniqueworld Management Team: +91
          9974877260
        </ModalBody>
      </Modal>
      <Modal className="modal-dialog-centered" isOpen={resumeCountFinishError}>
        <ModalHeader
          toggle={() => {
            dispatch({
              type: subscriptionActions.RESUME_COUNT_FINISH,
              payload: false,
            });
          }}
        />
        <ModalBody>
          You Can't Download Resume More Than 5, Please Upgrade Your Plan!!
          {/* <br />
          Contact :{` ${user?.agency?.phoneNumber}`} */}
        </ModalBody>
        <ModalFooter>
          <Button
            color="link"
            onClick={() => {
              dispatch({
                type: subscriptionActions.RESUME_COUNT_FINISH,
                payload: false,
              });
            }}
          >
            Close
          </Button>
          <Button
            color="default"
            style={{ backgroundColor: themeColor, color: "white" }}
            onClick={() => {
              dispatch({
                type: subscriptionActions.RESUME_COUNT_FINISH,
                payload: false,
              });
              history.push(`${slug}/pricing`);
            }}
          >
            Upgrade Plan
          </Button>
        </ModalFooter>
      </Modal>
      {showInterview ? (
        <InterviewDialog
          loading={interviewLoading}
          setCreate={setCreateInterview}
          create={createInterview}
          setUpdate={setUpdateInterview}
          interviewHandler={interviewHandler}
          interview={interview}
          setInterview={setInterview}
          show={showInterview}
          setShow={setShowInterview}
          clients={clients}
          candidates={candidates}
          update={updateInterview}
          loginUser={loginUser}
          setSelectCandidateValidation={setSelectCandidateValidation}
          setSelectCompanyValidation={setSelectCompanyValidation}
          setDateValidation={setDateValidation}
          setInterviewStartValidation={setInterviewStartValidation}
          setInterviewValidation={setInterviewValidation}
        />
      ) : null}
      <JobMatchProfileDialog
        show={showProfile}
        setShow={setShowProfile}
        candidate={profileCandidate}
        setCandidate={setProfileCandidate}
        industriesData={industriesData}
        setIndustriesData={setIndustriesData}
        gender={gender}
        setGender={setGender}
        setEmail={setProfileEmail}
      />
    </>
  );
};

export default NewJobMatches;
