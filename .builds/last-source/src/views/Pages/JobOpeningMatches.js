import React, { useEffect, useState } from "react";
import { ArrowLeft, Menu } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
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
import subscriptionActions from "../../redux/subscription/actions";
import InterviewDialog from "../../components/Dialog/interviewDialog";
import interviewActions from "../../redux/interview/actions";
import candidateActions from "../../redux/candidate/actions";
import onBoardingActions from "../../redux/onBoarding/actions";
import clientActions from "../../redux/client/actions";
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

const JobOpeningMatches = () => {
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
  const { isLoading, jobOpeningMatchCandidate, jobOpeningRow } = useSelector(
    (state) => state?.jobOpeningMatches
  );
  const { resumeCountFinishError } = useSelector(
    (state) => state?.subscription
  );

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("newToOld");
  const [matchScore, setMatchScore] = useState("");
  const [matchDuration, setMatchDuration] = useState("");
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
  // Local gate so first paint never shows "no records" before saga sets isLoading
  const [initialLoad, setInitialLoad] = useState(true);
  const sawLoadingRef = React.useRef(false);

  console.info("--------------------");
  console.info("jobOpeningMatchCandidate => ", jobOpeningMatchCandidate);
  console.info("jobOpeningRow => ", jobOpeningRow);
  console.info("--------------------");

  const showTableLoader = isLoading || interviewLoading || initialLoad;

  const getJobOpeningRow = async () => {
    await dispatch({
      type: jobOpeningMatchesActions.GET_JOB_OPENING_ROW,
      payload: params?.id,
    });
  };

  const getJobOpeningMatchCandidate = async (
    pageNum,
    perPageNum,
    sort = sortBy,
    score = matchScore,
    duration = matchDuration
  ) => {
    // Sync loader before saga runs so empty table never flashes
    dispatch({
      type: jobOpeningMatchesActions.JOB_MATCHES_LOADER,
      payload: true,
    });
    await dispatch({
      type: jobOpeningMatchesActions.GET_JOB_OPENING_MATCH_CANDIDATE,
      payload: {
        id: params?.id,
        page: pageNum,
        perPage: perPageNum,
        sortBy: sort,
        matchScore: score || undefined,
        matchDuration: duration || undefined,
      },
    });
  };

  useEffect(() => {
    if (isLoading) sawLoadingRef.current = true;
  }, [isLoading]);

  // Drop local gate only after we actually entered a loading cycle
  useEffect(() => {
    if (initialLoad && sawLoadingRef.current && !isLoading) {
      setInitialLoad(false);
    }
  }, [initialLoad, isLoading]);

  const reloadMatches = () =>
    getJobOpeningMatchCandidate(page, perPage, sortBy, matchScore, matchDuration);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleMatchScoreChange = (value) => {
    setMatchScore(value);
  };

  const handleMatchDurationChange = (value) => {
    setMatchDuration(value);
  };

  const handleFilterSearch = () => {
    setPage(1);
    getJobOpeningMatchCandidate(1, perPage, sortBy, matchScore, matchDuration);
    setFilterToggleMode(false);
  };

  const handleFilterClear = () => {
    setSortBy("newToOld");
    setMatchScore("");
    setMatchDuration("");
    setPage(1);
    getJobOpeningMatchCandidate(1, perPage, "newToOld", "", "");
    setFilterToggleMode(false);
  };

  useEffect(() => {
    (async () => {
      if (params?.id) {
        await getJobOpeningRow();
        await getJobOpeningMatchCandidate(page, perPage);
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
      // Interview company dropdown uses Clients (onBoardingId field stores client id)
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
      name: "First Name",
      selector: (row) => row?.firstname,
    },
    {
      name: "Last Name",
      selector: (row) => row?.lastname,
    },
    {
      name: "Match Score",
      selector: (row) =>
        row?.matchScore != null ? `${row.matchScore}%` : "0%",
      minWidth: "110px",
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
      name: "Job Category",
      selector: (row) => row?.professional?.jobCategory?.jobCategory,
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
    interviewStatusColumn,
    viewProfileColumn,
    interviewScheduleColumn,
  ];
  const subscriptionColumnsClients = [
    {
      name: "First Name",
      selector: (row) => row?.firstname,
    },
    {
      name: "Last Name",
      selector: (row) => row?.lastname,
    },
    {
      name: "Match Score",
      selector: (row) =>
        row?.matchScore != null ? `${row.matchScore}%` : "0%",
      minWidth: "110px",
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
    interviewStatusColumn,
    viewProfileColumn,
    interviewScheduleColumn,
  ];

  const handlePerRowsChange = async (newPerPage, pageNum) => {
    setPerPage(newPerPage);
    getJobOpeningMatchCandidate(pageNum, newPerPage, sortBy, matchScore, matchDuration);
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    getJobOpeningMatchCandidate(pageNum, perPage, sortBy, matchScore, matchDuration);
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
            color="default"
            className="btn-icon"
            title="Job Details"
            aria-label="Job Details"
            style={{
              color: themeColor,
              border: `1px solid ${themeColor || "#7367f0"}`,
              padding: "6px 10px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setDetailsOpen((prev) => !prev)}
          >
            <Menu size={18} />
          </Button>
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
            style={{ backgroundColor: themeColor, color: "white", width: "145px", marginLeft: "auto" }}
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
          matchScore={matchScore}
          matchDuration={matchDuration}
          onSortChange={handleSortChange}
          onMatchScoreChange={handleMatchScoreChange}
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
                  Job Description — Best Match
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
                  Best Matches Candidates
                </h5>
              </CardBody>
              <div className="react-dataTable job-opening-match-table">
                <DataTable
                  paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                  selectableRows={false}
                  fixedHeader={true}
                  progressPending={showTableLoader}
                  progressComponent={
                    <ComponentSpinner
                      isClientCandidate={true}
                      theamcolour={themeColor}
                    />
                  }
                  noDataComponent={
                    showTableLoader ? (
                      <ComponentSpinner
                        isClientCandidate={true}
                        theamcolour={themeColor}
                      />
                    ) : (
                      <div style={{ padding: "24px", color: "#6e6b7b" }}>
                        No candidates found
                      </div>
                    )
                  }
                  fixedHeaderScrollHeight="500px"
                  noHeader
                  sortServer
                  pagination
                  responsive
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  paginationTotalRows={jobOpeningMatchCandidate?.total || 0}
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
                  data={
                    showTableLoader
                      ? []
                      : jobOpeningMatchCandidate?.results || []
                  }
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
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

export default JobOpeningMatches;
