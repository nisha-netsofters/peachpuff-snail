import React, { useMemo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "@styles/react/libs/charts/apex-charts.scss";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { todayInterviewAPI } from "../../../apis/dashBoard";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
  Badge,
  CardText,
  Button,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import Avatar from "@components/avatar";
import CandidateActions from "../../../redux/candidate/actions";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import CandidateJobChart from "./CandidateJobChart";
import "@styles/react/libs/charts/apex-charts.scss";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Target,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Award,
  AlertCircle
} from "react-feather";


const statusColorMap = {
  "Onboarded Job": "info",
  "Interview Scheduled": "primary",
  Hired: "success",
  Rejected: "danger",
  Rescheduled: "warning"
};

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const candidateUser = useSelector((state) => state?.auth?.user);
  const candidate = useSelector((state) => state?.candidate);
  const jobMatches = useSelector((state) => state?.candidate?.jobMatches);

  const [todayInterviews, setTodayInterviews] = useState([]);
  const [todayInterviewsLoading, setTodayInterviewsLoading] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState("");

  const themeColor = useSelector((state) => state?.agency?.agencyDetail?.themecolor);
  // 📊 stats API
  useEffect(() => {
    if (candidateUser?.id) {
      dispatch({
        type: CandidateActions.GET_CANDIDATE_STATISTICS,
        payload: {}
      });
    }
  }, [candidateUser?.id, dispatch]);

  // 🎯 job matches API
  useEffect(() => {
    if (candidateUser?.id) {
      dispatch({
        type: CandidateActions.GET_CANDIDATE_JOB_MATCHING,
        payload: { page: 1, perPage: 5 }
      });
    }
  }, [candidateUser?.id, dispatch]);

  // 📅 today's interviews API
  useEffect(() => {
    const fetchTodayInterviews = async () => {
      if (!candidateUser?.id) return;

      try {
        setTodayInterviewsLoading(true);
        const data = await todayInterviewAPI({ candidateId: candidateUser.id });
        setTodayInterviews(data || []);
      } catch (error) {
        console.error("Error fetching today's interviews:", error);
        setTodayInterviews([]);
      } finally {
        setTodayInterviewsLoading(false);
      }
    };

    fetchTodayInterviews();
  }, [candidateUser?.id]);

  const aggregatedStats = useMemo(() => {
    const stats = candidate?.statistics || {
      profileCompleteness: 0,
      totalInterviews: 0,
      interviewsScheduled: 0,
      interviewsAttended: 0,
      jobsApplied: 0,
      jobMatches: 0,
      pendingInterviewRequests: 0,
      onboardedJobs: 0,
      hired: 0,
      rejected: 0,
      reviewPending: 0
    };

    return {
      profileCompleteness: stats.profileCompleteness || 0,
      totalInterviews: stats.totalInterviews || 0,
      interviewsScheduled: stats.interviewsScheduled || 0,
      interviewsAttended: stats.interviewsAttended || 0,
      jobsApplied: stats.jobsApplied || 0,
      jobMatches: stats.jobMatches || 0,
      pendingInterviewRequests: stats.pendingInterviewRequests || 0,
      onboardedJobs: stats.onboardedJobs || 0,
      hired: stats.hired || 0,
      rejected: stats.rejected || 0,
      reviewPending: stats.reviewPending || 0
    };
  }, [candidate?.statistics]);

  const getTruncatedComment = (text = "", wordLimit = 10) => {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= wordLimit) {
      return {
        truncatedText: text,
        isTruncated: false
      };
    }
    return {
      truncatedText: `${words.slice(0, wordLimit).join(" ")} `,
      isTruncated: true
    };
  };

  // 🔝 TOP 5 job matches from API
  const top5Matches = useMemo(() => {
    if (!jobMatches) return [];
    const list = jobMatches.results || jobMatches; // handle {results: []} OR []
    return list.slice(0, 5);
  }, [jobMatches]);

  // —— UI ——
  return (
    <>
      {/* TOP STAT + JOB CHART */}
      <Row className="match-height mb-2">
        <Col lg="4" md="6" xs="12">
          <Card className="card-statistics h-100">
            <CardHeader className="border-0 pb-0">
              <div className="d-flex flex-column flex-sm-row justify-content-between w-100">
                <div>
                  <CardTitle tag="h4">Your Statistics</CardTitle>
                  <CardText className="font-small-2 mb-0 text-muted">
                    Snapshot of your application journey
                  </CardText>
                </div>
              </div>
            </CardHeader>
            <CardBody className="statistics-body pt-1">
              {candidate?.getCandidateStatisticsLoader ? (
                <ComponentSpinner isClientCandidate={true} />
              ) : (
                <Row>
                  {/* Profile Completeness */}
                  <Col
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                    className="mb-2 d-flex align-items-center"
                  >
                    <Avatar
                      color="light-success"
                      icon={<TrendingUp size={20} />}
                      className="me-1"
                    />
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">
                        {aggregatedStats.profileCompleteness}% Complete
                      </h4>
                      <CardText className="font-small-3 mb-0">
                        Profile Completeness
                      </CardText>
                    </div>
                  </Col>

                  {/* Job Matches */}
                  <Col
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                    className="mb-2 d-flex align-items-center"
                  >
                    <Avatar
                      color="light-primary"
                      icon={<Target size={20} />}
                      className="me-1"
                    />
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">
                        {aggregatedStats.jobMatches || 0}
                      </h4>
                      <CardText className="font-small-3 mb-0">
                        Total Job Matches
                      </CardText>
                    </div>
                  </Col>

                  {/* Jobs Applied */}
                  <Col
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                    className="mb-2 d-flex align-items-center"
                  >
                    <Avatar
                      color="light-info"
                      icon={<Briefcase size={20} />}
                      className="me-1"
                    />
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">
                        {aggregatedStats.jobsApplied}
                      </h4>
                      <CardText className="font-small-3 mb-0">
                        Jobs Applied
                      </CardText>
                    </div>
                  </Col>

                  {/* Total Interviews */}
                  <Col
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                    className="mb-2 d-flex align-items-center"
                  >
                    <Avatar
                      color="light-warning"
                      icon={<Users size={20} />}
                      className="me-1"
                    />
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">
                        {aggregatedStats.totalInterviews}
                      </h4>
                      <CardText className="font-small-3 mb-0">
                        Total Interviews
                      </CardText>
                    </div>
                  </Col>

                  {/* Interviews Scheduled */}
                  <Col
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                    className="mb-2 d-flex align-items-center"
                  >
                    <Avatar
                      color="light-primary"
                      icon={<Calendar size={20} />}
                      className="me-1"
                    />
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">
                        {aggregatedStats.interviewsScheduled}
                      </h4>
                      <CardText className="font-small-3 mb-0">
                        Interviews Scheduled
                      </CardText>
                    </div>
                  </Col>

                  {/* Interviews Attended */}
                  <Col
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                    className="mb-2 d-flex align-items-center"
                  >
                    <Avatar
                      color="light-success"
                      icon={<CheckCircle size={20} />}
                      className="me-1"
                    />
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">
                        {aggregatedStats.interviewsAttended}
                      </h4>
                      <CardText className="font-small-3 mb-0">
                        Interviews Attended
                      </CardText>
                    </div>
                  </Col>

                  {/* Pending Interview Requests */}
                  <Col
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                    className="mb-2 d-flex align-items-center"
                  >
                    <Avatar
                      color="light-secondary"
                      icon={<Clock size={20} />}
                      className="me-1"
                    />
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">
                        {aggregatedStats.pendingInterviewRequests}
                      </h4>
                      <CardText className="font-small-3 mb-0">
                        Pending Requests
                      </CardText>
                    </div>
                  </Col>

                  {/* Onboarded Jobs */}


                  {/* Hired */}
                  <Col
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                    className="mb-2 d-flex align-items-center"
                  >
                    <Avatar
                      color="light-success"
                      icon={<CheckCircle size={20} />}
                      className="me-1"
                    />
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">
                        {aggregatedStats.hired}
                      </h4>
                      <CardText className="font-small-3 mb-0">Hired</CardText>
                    </div>
                  </Col>

                  {/* Rejected */}
                  <Col
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                    className="mb-2 d-flex align-items-center"
                  >
                    <Avatar
                      color="light-danger"
                      icon={<XCircle size={20} />}
                      className="me-1"
                    />
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">
                        {aggregatedStats.rejected}
                      </h4>
                      <CardText className="font-small-3 mb-0">Rejected</CardText>
                    </div>
                  </Col>

                  {/* Review Pending */}

                </Row>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col lg="8" md="6" xs="12">
          <CandidateJobChart
            aggregatedStats={aggregatedStats}
            loading={candidate?.getCandidateStatisticsLoader}
          />
        </Col>
      </Row>

      {/* 👉 BOTTOM ROW LIKE ADMIN DASHBOARD */}
      <Row className="match-height mt-2">
        {/* MIDDLE: Today's Interviews card */}
        <Col lg="6" md="6" xs="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Today&apos;s Interviews</CardTitle>
            </CardHeader>
            <CardBody>
              {todayInterviewsLoading ? (
                <div className="d-flex align-items-center justify-content-center text-muted" style={{ minHeight: 180 }}>
                  Loading...
                </div>
              ) : !todayInterviews || todayInterviews.length === 0 ? (
                <div className="d-flex align-items-center justify-content-center text-muted" style={{ minHeight: 180 }}>
                  No Interview Today
                </div>
              ) : (
                <div>
                  {todayInterviews.map((item) => {
                    //Company Name
                    const company = item?.clientCompanyName || "";
                    //Virtual Link
                    const virtuallink = item?.link || "";
                    //Company Address
                    const companyAddress = [
                      item?.client?.street,
                      item?.client?.cityId, // note: key is cityId, not cityid
                    ].filter(Boolean).join(", ");
                    //Interview Comments
                    const interviewComments = item?.comments || "";
                    //Interview Time
                    let timeDisplay = "";
                    if (item?.time) {
                      try {
                        const timeDate = new Date(item.time);
                        timeDisplay = timeDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        });
                      } catch (e) {
                        timeDisplay = item.time;
                      }
                    }
                    //Interview Type
                    const interviewType = item?.interviewType || "";
                    //Interview Status
                    const interviewStatus = item?.candidates?.interviewStatus || "";
                    let status = interviewStatus;

                    return (
                      <div
                        key={item.id || item._id} 
                        className="d-flex justify-content-between align-items-center mb-1 border border-2 rounded-2 p-2"
                        style={{ backgroundColor: themeColor + "10" }}   
                      >
                        <div>
                          <h6 className="mb-25 fw-bold">{company ? 
                          `${company}${interviewType ? ` • ${interviewType}` : ""}` : interviewType || "Interview"}
                          </h6>

                          {virtuallink && (
                            <>
                              <small className="text-muted">
                                <a href={virtuallink} target="_blank" rel="noopener noreferrer">
                                  {virtuallink}
                                </a>
                              </small>
                              <br />
                            </>
                          )}

                          {interviewType !== "virtual" && (
                            <>
                              <small className="text-muted">
                                {companyAddress}
                              </small>
                              <br />
                            </>
                          )}

                          {(() => {
                            const { truncatedText, isTruncated } = getTruncatedComment(
                              interviewComments,
                              10
                            );
                            return (
                              <small className="text-muted">
                                {truncatedText}
                                {isTruncated && (
                                  <span
                                    className="text-primary ms-1"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setSelectedComment(interviewComments);
                                      setCommentModalOpen(true);
                                    }}
                                  >
                                    ...
                                  </span>
                                )}
                              </small>
                            );
                          })()}

                        </div>

                        <div className="text-end">

                          <Badge
                            color={statusColorMap[status] || "secondary"}
                            pill
                            style={{ marginBottom: "5px" }}
                          >
                            {status}
                          </Badge>

                          <span className="d-block fw-bolder mb-25">
                            Interview Time :
                            {timeDisplay}
                          </span>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* RIGHT: Jobs list instead of Candidates */}
        <Col lg="6" md="12" xs="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Jobs</CardTitle>
              <Link to="/uniqueworld/jobmatches">
                <Button
                  color="default"
                  size="sm"
                  style={{ backgroundColor: themeColor, color: "white" }}
                >
                  View
                </Button>
              </Link>
            </CardHeader>
            <CardBody>
              {top5Matches.length === 0 ? (
                <div className="d-flex align-items-center justify-content-center text-muted" style={{ minHeight: 180 }}>
                  No jobs available
                </div>
              ) : (
                <div>
                  {top5Matches.map((job, index) => {
                    const title =
                      job.designation ||
                      job.jobCategory?.jobCategory ||
                      "Job";
                    const company = job.client?.companyName || "";
                    const location = job.jobLocation || "";

                    const avatarText =
                      title?.charAt(0) ||
                      company?.charAt(0) ||
                      (index + 1).toString();

                    return (
                      <div
                        key={job.id || index}
                        className="d-flex justify-content-between align-items-center mb-1"
                      >
                        <div className="d-flex align-items-center">
                          <Avatar
                            color="light-primary"
                            content={avatarText.toUpperCase()}
                            className="me-1"
                          />
                          <div>
                            <h6 className="mb-25">{title}</h6>
                            <small className="text-muted">{company}</small>
                          </div>
                        </div>
                        <small className="text-muted text-end">
                          {location}
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        isOpen={commentModalOpen}
        toggle={() => setCommentModalOpen(!commentModalOpen)}
        size="lg"
        centered
      >
        <ModalHeader toggle={() => setCommentModalOpen(!commentModalOpen)}>
          Interview Comments
        </ModalHeader>
        <ModalBody>
          <p className="mb-0">{selectedComment}</p>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CandidateDashboard;
