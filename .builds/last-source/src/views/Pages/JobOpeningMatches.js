import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
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
// import clientActions from "../../redux/client/actions";
import subscriptionActions from "../../redux/subscription/actions";
import { interviewRequest } from "../../apis/client";
import Avatar from "@components/avatar";
import { MdOutlineCategory } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineWorkHistory } from "react-icons/md";
import { BsGenderAmbiguous } from "react-icons/bs";
import { MdOutlinePlace } from "react-icons/md";
import { PiStudentLight } from "react-icons/pi";
import { MdOutlineAttachMoney } from "react-icons/md";
import WhatsappDialog from "../../components/Dialog/WhatsappDialog";

const JobOpeningMatches = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();
  const slug = localStorage.getItem("slug");
  const themeColor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const user = useSelector((state) => state?.auth?.user);
  const { isLoading, jobOpeningMatchCandidate, jobOpeningRow } = useSelector(
    (state) => state?.jobOpeningMatches
  );
  const { currentPlan, currentSubscription, resumeCountFinishError } =
    useSelector((state) => state?.subscription);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [showWPModal, setShowWPModal] = useState(false);
  const [WPnumber, setWPnumber] = useState();
  const [clientData, setClientData] = useState([]);

  console.info("--------------------");
  console.info("jobOpeningMatchCandidate => ", jobOpeningMatchCandidate);
  console.info("jobOpeningRow => ", jobOpeningRow);
  console.info("--------------------");

  const getJobOpeningRow = async () => {
    await dispatch({
      type: jobOpeningMatchesActions.GET_JOB_OPENING_ROW,
      payload: params?.id,
    });
  };

  const getJobOpeningMatchCandidate = async (page, perPage) => {
    await dispatch({
      type: jobOpeningMatchesActions.GET_JOB_OPENING_MATCH_CANDIDATE,
      payload: {
        id: params?.id,
        page: page,
        perPage: perPage,
      },
    });
  };

  useEffect(() => {
    (async () => {
      if (params?.id) {
        await getJobOpeningRow();
        await getJobOpeningMatchCandidate(page, perPage);
      }
    })();
  }, []);

  const candidateInterviewRequest = async (candidate) => {
    setPageLoader(true);
    const payload = {
      candidate: candidate?.id,
      client: user?.clients?.id,
    };
    const resp = await interviewRequest(payload);
    if (resp?.msg == "success") {
      await getJobOpeningMatchCandidate(page, perPage);
      setPageLoader(false);
    } else {
      await setPageLoader(false);
    }
    await setPageLoader(false);
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
    {
      name: "Interview Shedule",
      selector: (row) => (
        <Button
          disabled={row?.interview_request?.isdisabled == true ? true : false}
          onClick={() => {
            candidateInterviewRequest(row);
          }}
          style={
            row?.interview_request?.isdisabled == true
              ? {
                  opacity: "0.5",
                  padding: "10px",
                  backgroundColor: themeColor,
                  color: "white",
                }
              : { padding: "10px", backgroundColor: themeColor, color: "white" }
          }
          color="default"
        >
          {row?.interview_request?.isdisabled == true
            ? "Req. Sent"
            : "Interview"}
        </Button>
      ),
    },
    {
      name: "resume",
      cell: (row) => {
        return row?.resume !== "null" ||
          row?.resume != undefined ||
          row?.resume !== null ? (
          <>
            <div
              style={{ color: "#7F8487", cursor: "pointer" }}
              onClick={() => handleOpenResume(row)}
            >
              <FileText />
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
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
    {
      name: "resume",
      cell: (row) => {
        console.info("--------------------");
        console.info("row => ", row);
        console.info("--------------------");
        return row?.resume !== "null" &&
          row?.resume != undefined &&
          row?.resume !== null ? (
          <>
            <div
              style={{ color: "#7F8487", cursor: "pointer" }}
              onClick={() => handleOpenResume(row)}
            >
              <FileText />
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
  ];

  const decreaseResumeDownload = (userId, subscriptionId, row) => {
    dispatch({
      type: subscriptionActions.DECREASE_RESUME_DOWNLOADING,
      payload: {
        userId,
        subscriptionId,
        candidateId: row?.id,
        url: row?.resume,
      },
    });
  };

  const handleOpenResume = (row) => {
    if (row?.saved_Candidates?.id) {
      window.open(row?.resume);
    } else {
      if (
        currentPlan?.price == null ||
        currentPlan?.planName == "free" ||
        currentPlan?.planFeature?.resume_download_count != -1
      ) {
        decreaseResumeDownload(user?.id, currentSubscription?.id, row);
      } else {
        decreaseResumeDownload(user?.id, currentSubscription?.id, row);
      }
    }
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    getJobOpeningMatchCandidate(page, newPerPage);
  };

  const handlePageChange = (page) => {
    setPage(page);
    getJobOpeningMatchCandidate(page, perPage);
  };

  return (
    <>
      <div>
        <Button
          style={{
            color: themeColor,
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          className="add-new-user mb-2"
          color="default"
          onClick={() => {
            history.push(`/${slug}/jobopening`);
          }}
        >
          <ArrowLeft size={17} />
          Back
        </Button>
        <Row>
          <Col sm={12} md={4} lg={4} xl={3}>
            <Card>
              <CardBody>
                <h5
                  className="fw-bolder border-bottom pb-50 mb-1"
                  style={{ color: themeColor }}
                >
                  Job Description
                  <div
                    style={{
                      color: "#5e5873",
                      fontWeight: "400",
                      fontSize: "12px",
                      marginTop: "1rem",
                    }}
                  >{`${jobOpeningMatchCandidate?.total} Matches Found`}</div>
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
          </Col>
          <Col sm={12} md={8} lg={8} xl={9}>
            <Card className="overflow-hidden">
              <div className="react-dataTable">
                <DataTable
                  paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                  selectableRows={false}
                  fixedHeader={true}
                  progressPending={isLoading || pageLoader}
                  progressComponent={
                    <ComponentSpinner
                      isClientCandidate={true}
                      theamcolour={themeColor}
                    />
                  }
                  fixedHeaderScrollHeight="500px"
                  noHeader
                  subHeader
                  subHeaderComponent={
                    <div style={{ width: "100%" }}>
                      <h5
                        style={{
                          color: themeColor,
                          fontWeight: "600",
                          margin: "0",
                        }}
                      >
                        Best Matches Candidates
                      </h5>
                    </div>
                  }
                  sortServer
                  pagination
                  responsive
                  // progressPending={getClientCandidateLoader}
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
                      : []
                  }
                  className="react-dataTable"
                  data={jobOpeningMatchCandidate?.results || []}
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
    </>
  );
};

export default JobOpeningMatches;
