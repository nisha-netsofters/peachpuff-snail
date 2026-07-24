import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  Badge,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  ButtonGroup,
  UncontrolledTooltip
} from "reactstrap";
import { Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import candidateActions from "../../redux/candidate/actions";
import { Info } from "react-feather";
import jobsApplyActions from "../../redux/jobsapply/actions";
import Professional from "../../components/Forms/Candidates/Professional";
import industriesActions from "../../redux/industries/actions";
import agencyActions from "../../redux/agency/actions";
import { tostify } from "../../components/Tostify";
import ResumeThankYouPopup from "../resume/ResumeThankYouPopup";
import { IMAGE_URL } from "../../configs/config";
import { awsUploadAssetsWithResp } from "../../helper/awsUploadAssets";

// Helper to safely build full banner image URL for client/company
const getBannerImageUrl = (client = {}) => {
  const raw =
    client.bannerImage ||
    client.banner ||
    client.bannerUrl ||
    client.banner_image;

  if (!raw) return "";

  // If backend already returns full URL, use it directly
  if (typeof raw === "string" && /^https?:\/\//i.test(raw)) {
    return raw;
  }

  // Fallback: prefix with IMAGE_URL base
  if (typeof raw === "string") {
    return `${IMAGE_URL}${raw.replace(/^\//, "")}`;
  }

  return "";
};

const getAgencyBannerImageUrl = (agency = {}) => {
  const source = agency?.agency || agency;
  const raw =
    source?.bannerImage ||
    source?.banner ||
    source?.bannerUrl ||
    source?.banner_image;

  if (!raw) return "";

  if (typeof raw === "string" && /^https?:\/\//i.test(raw)) {
    return raw;
  }

  if (typeof raw === "string") {
    return `${IMAGE_URL}${raw.replace(/^\//, "")}`;
  }

  return "";
};
// const statusColorMap = {
//   "Onboarded Job": "info",
//   "Interview Scheduled": "primary",
//   Hired: "success",
//   Rejected: "danger",
//   Matched: "success"
// };

const JobMatches = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const jobMatches = useSelector((state) => state.candidate.jobMatches);
  const loading = useSelector(
    (state) => state.candidate.getCandidateJobMatchingLoader
  );
  const jobApplyLoader = useSelector(
    (state) => state.jobsApply.jobApplyLoader
  );
  const jobApplyResponse = useSelector(
    (state) => state.jobsApply.jobApplyResponse
  );
  const jobApplyError = useSelector(
    (state) => state.jobsApply.jobApplyError
  );
  const candidateProfile = useSelector((state) => state?.candidate?.candidateProfile);
  const isLoadingProfile = useSelector((state) => state?.candidate?.getCandidateProfileLoader);
  const resumeEnquiryStatus = useSelector(
    (state) => state.candidate.resumeEnquiryStatus
  );
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id || user?.id;
  const agencyFromSlug = useSelector((state) => state?.agency?.agencyDetail);

  const [applyStatusModalOpen, setApplyStatusModalOpen] = useState(false);
  const [applyStatusMessage, setApplyStatusMessage] = useState("");
  const [applyStatusType, setApplyStatusType] = useState("success"); // success | info | error

  const toggleApplyStatusModal = () =>
    setApplyStatusModalOpen((prev) => !prev);

  // from API object
  const results = jobMatches?.results || [];
  const page = jobMatches?.page || 1;
  const perPage = jobMatches?.perPage || 10;
  const totalPages = jobMatches?.totalPages || 1;
  const total = jobMatches?.total || 0;
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [candidate, setCandidate] = useState({ professional: {} });
  const [industriesData, setIndustriesData] = useState([]);
  const [isSavingProfessional, setIsSavingProfessional] = useState(false);
  const [showResumeThankYouPopup, setShowResumeThankYouPopup] = useState(false);
  const [showResumeApplyConfirmModal, setShowResumeApplyConfirmModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [showResumeFileName, setShowResumeFileName] = useState(true);
  const [shouldApplyAfterThankYou, setShouldApplyAfterThankYou] = useState(false);
  const [showApplyConfirmModal, setShowApplyConfirmModal] = useState(false);
  // const [appliedTooltipOpen, setAppliedTooltipOpen] = useState({});
  const askBeforeApply = () => {
    setShowApplyConfirmModal(true);
  };

  const toggleJobModal = () => {
    setJobModalOpen(!jobModalOpen);
  };

  // Ensure agency detail (with banner image) is loaded for current slug
  useEffect(() => {
    if (
      slug &&
      (!agencyFromSlug?.slug || agencyFromSlug?.slug !== slug)
    ) {
      dispatch({
        type: agencyActions.GET_AGENCY_DETAIL_BY_SLUG,
        payload: slug
      });
    }
  }, [dispatch, slug, agencyFromSlug?.slug]);

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setJobModalOpen(true);
    // Fetch candidate profile when opening modal
    dispatch({
      type: candidateActions.GET_CANDIDATE_PROFILE,
    });
    // Fetch resume enquiry status
    if (userId) {
      dispatch({
        type: candidateActions.GET_RESUME_ENQUIRY_STATUS,
        payload: { userId, role: user?.role?.name },
      });
    }
    // Fetch industries
    dispatch({
      type: industriesActions.GET_ALL_INDUSTRIES,
    });
  };

  // const handleApply = () => {
  //   if (!selectedJob) return;

  //   // Always prefer `id` – backend should receive this instead of `_id`
  //   const jobOpeningId = selectedJob.id;

  //   if (!jobOpeningId) return;

  //   dispatch({
  //     type: jobsApplyActions.POST_JOB_APPLY,
  //     payload: { jobOpeningId }
  //   });
  // };

  useEffect(() => {
    if (jobApplyResponse) {
      // Try to take message from API, otherwise fallback
      const apiMsg =
        jobApplyResponse?.message ||
        jobApplyResponse?.msg ||
        "Thank you for applying. We’ll update you once your profile is reviewed.";//First time apply alert message

      setApplyStatusMessage(apiMsg);
      setApplyStatusType("success");
      setApplyStatusModalOpen(true);
      setJobModalOpen(false);

      // clear redux state so this doesn't fire again
      dispatch({
        type: jobsApplyActions.RESET_JOB_APPLY_STATE
      });
    }
  }, [jobApplyResponse, dispatch]);

  useEffect(() => {
    if (jobApplyError) {
      // Normalise error to string
      let errorText = "";
      if (typeof jobApplyError === "string") {
        errorText = jobApplyError;
      } else if (jobApplyError?.message) {
        errorText = jobApplyError.message;
      } else if (jobApplyError?.msg) {
        errorText = jobApplyError.msg;
      } else if (jobApplyError?.error) {
        errorText = jobApplyError.error;
      } else {
        errorText = "Something went wrong while applying for this job.";
      }

      const lower = errorText.toLowerCase();
      const isAlreadyApplied =
        lower.includes("already") && lower.includes("applied");

      setApplyStatusType(isAlreadyApplied ? "info" : "error");
      setApplyStatusMessage(
        isAlreadyApplied
          ? "Your profile is under evaluation. Please wait for further updates." // Re-apply alert message
          : errorText
      );
      setApplyStatusModalOpen(true);

      dispatch({
        type: jobsApplyActions.RESET_JOB_APPLY_STATE
      });
    }
  }, [jobApplyError, dispatch]);

  // Populate candidate data when profile is loaded
  useEffect(() => {
    if (candidateProfile && candidateProfile._id) {
      const professionalData = candidateProfile?.professional || {};
      const industriesRelation = candidateProfile?.industries_relation || [];

      // Map industries_relation to industriesData format expected by Professional form
      const mappedIndustries = industriesRelation.map((rel) => ({
        industries: {
          id: rel?.industries?.id || rel?.industriesId,
          industryCategory: rel?.industries?.industryCategory,
        },
        id: rel?.industries?.id || rel?.industriesId,
        industryCategory: rel?.industries?.industryCategory,
        label: rel?.industries?.industryCategory,
        value: rel?.industries?.id || rel?.industriesId,
        c_Id: rel?.cId || candidateProfile._id,
      }));

      setIndustriesData(mappedIndustries);

      // Ensure all string fields are properly converted to strings
      const ensureString = (val) => (val !== null && val !== undefined ? String(val) : "");

      // Set candidate data with professional information
      setCandidate({
        id: candidateProfile._id || candidateProfile.id,
        _id: candidateProfile._id,
        ...candidateProfile,
        professional: {
          ...professionalData,
          // Ensure all fields are strings for form validation
          experienceInyear: ensureString(professionalData.experienceInyear),
          highestQualification: ensureString(professionalData.highestQualification),
          field: ensureString(professionalData.field),
          designation: ensureString(professionalData.designation),
          currentEmployer: ensureString(professionalData.currentEmployer),
          currentSalary: ensureString(professionalData.currentSalary),
          expectedsalary: ensureString(professionalData.expectedsalary || professionalData.expectedSalary),
          noticePeriod: ensureString(professionalData.noticePeriod),
          currentlyWorking: ensureString(professionalData.currentlyWorking),
          english: ensureString(professionalData.english),
          preferedJobLocation: ensureString(professionalData.preferedJobLocation),
          course: ensureString(professionalData.course),
          skill: ensureString(professionalData.skill),
          jobCategoryId: ensureString(professionalData.jobCategoryId || professionalData.jobCategory?.id),
          jobCategory: professionalData.jobCategory || {},
        },
      });
    }
  }, [candidateProfile]);

  // Handle Apply For Professional Resume
  const handleApplyForResume = () => {
    const RESUME_ENQUIRY_STATUS = {
      REQUESTED: "requested",
      IN_REVIEW: "in_review"
    };

    if (
      !userId ||
      resumeEnquiryStatus === RESUME_ENQUIRY_STATUS.REQUESTED ||
      resumeEnquiryStatus === RESUME_ENQUIRY_STATUS.IN_REVIEW
    ) {
      tostify("You have already applied for a professional resume or user not found.", false);
      return;
    }
    const message = "Need a professional resume";
    dispatch({
      type: candidateActions.CREATE_RESUME_ENQUIRY,
      payload: { userId, message },
    });
    setShowResumeThankYouPopup(true);
  };

  // Handle resume file change (upload new file)
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        tostify("Please upload a PDF file only", false);
        return;
      }
      setResumeFile(file);
      setShowResumeFileName(false);
    }
  };

  // Apply for job and close modal
  const applyForJob = () => {
    if (!selectedJob) return;
    const jobOpeningId = selectedJob.id;
    if (!jobOpeningId) return;

    dispatch({
      type: jobsApplyActions.POST_JOB_APPLY,
      payload: { jobOpeningId }
    });
    // Close modal after applying
    setJobModalOpen(false);
  };

  // Handle Skip click in job modal - open resume popup if not already applied,
  // otherwise just apply for job directly
  const handleSkip = () => {
    const RESUME_ENQUIRY_STATUS = {
      REQUESTED: "requested",
      IN_REVIEW: "in_review"
    };

    // If user has already applied for resume, just apply for job directly
    if (
      !userId ||
      resumeEnquiryStatus === RESUME_ENQUIRY_STATUS.REQUESTED ||
      resumeEnquiryStatus === RESUME_ENQUIRY_STATUS.IN_REVIEW
    ) {
      askBeforeApply();
    } else {
      // Otherwise show the resume apply confirmation popup
      setShowResumeApplyConfirmModal(true);
    }
  };

  // Handle Save Changes - Save professional details and show resume apply confirmation
  const handleSaveChanges = async () => {
    if (!candidate?.id && !candidate?._id) {
      tostify("Candidate data not found. Please try again.", false);
      return;
    }

    // Validate that at least one industry is selected
    const hasIndustries =
      Array.isArray(candidate?.industries_relation) &&
      candidate.industries_relation.length > 0;

    if (!hasIndustries) {
      tostify("Please Select Industries", false);
      return;
    }

    try {
      setIsSavingProfessional(true);
      setIsResumeUploading(true);

      // Prepare FormData similar to CandidateProfessionalProfile
      const fm = new FormData();
      const candidateId = candidate.id || candidate._id;

      // Add basic candidate fields (preserve existing data)
      if (candidate.firstname) fm.append("firstname", candidate.firstname);
      if (candidate.lastname) fm.append("lastname", candidate.lastname);
      if (candidate.mobile) fm.append("mobile", candidate.mobile);
      if (candidate.email) fm.append("email", candidate.email);
      if (candidate.street) fm.append("street", candidate.street);
      if (candidate.city) fm.append("city", candidate.city);
      if (candidate.state) fm.append("state", candidate.state);
      if (candidate.zip) fm.append("zip", candidate.zip);
      if (candidate.cityId) fm.append("cityId", candidate.cityId);
      if (candidate.stateId) fm.append("stateId", candidate.stateId);
      if (candidate.alternateMobile) fm.append("alternateMobile", candidate.alternateMobile);
      if (candidate.gender) fm.append("gender", candidate.gender);
      if (candidate.whatsappMsg !== undefined) {
        fm.append("whatsappMsg", candidate.whatsappMsg);
      }

      // Handle resume upload if a new file is selected
      let resumeUrl = candidate.resume; // Keep existing resume URL by default
      if (resumeFile) {
        const uploadResp = await awsUploadAssetsWithResp(resumeFile);
        if (uploadResp.success && uploadResp.url) {
          resumeUrl = uploadResp.url;
        } else {
          tostify("Failed to upload resume. Please try again.", false);
          setIsSavingProfessional(false);
          setIsResumeUploading(false);
          return;
        }
      }

      // Add resume URL if it exists
      if (resumeUrl) {
        fm.append("resume", resumeUrl);
      }

      // Professional data should be sent as JSON string
      if (candidate.professional) {
        fm.append("professional", JSON.stringify(candidate.professional));
      }

      // Industries relation should be sent as JSON string
      if (candidate.industries_relation && candidate.industries_relation.length > 0) {
        // Always send only industriesId for each relation to avoid duplicate payload data
        const formattedIndustries = candidate.industries_relation
          .map((rel) => {
            const industriesId =
              rel?.industriesId ||
              rel?.industries?.id ||
              rel?.value ||
              rel;
            return industriesId ? { industriesId } : null;
          })
          .filter(Boolean);

        if (formattedIndustries.length > 0) {
          fm.append("industries_relation", JSON.stringify(formattedIndustries));
        }
      }

      // Ensure id is set
      fm.append("id", candidateId);

      dispatch({
        type: candidateActions.UPDATE_CANDIDATE,
        payload: {
          id: candidateId,
          data: fm,
          refreshProfile: true, // Flag to refresh profile instead of candidate list
        },
      });

      setIsSavingProfessional(false);
      setIsResumeUploading(false);
      setResumeFile(null);
      setShowResumeFileName(true);

      // Show confirmation modal for resume application only if candidate hasn't applied
      const RESUME_ENQUIRY_STATUS = {
        REQUESTED: "requested",
        IN_REVIEW: "in_review"
      };

      if (
        userId &&
        resumeEnquiryStatus !== RESUME_ENQUIRY_STATUS.REQUESTED &&
        resumeEnquiryStatus !== RESUME_ENQUIRY_STATUS.IN_REVIEW
      ) {
        setShowResumeApplyConfirmModal(true);
      } else {
        // If user has already applied for resume, just apply for the job directly
        askBeforeApply();
      }
    } catch (error) {
      console.error("Error updating professional details:", error);
      tostify("Error updating profile. Please try again.", false);
      setIsSavingProfessional(false);
      setIsResumeUploading(false);
    }
  };

  // Handle confirm resume apply from the popup
  const handleConfirmResumeApply = () => {
    setShowResumeApplyConfirmModal(false);
    // First create / request professional resume
    handleApplyForResume();
    // Set flag to apply for job after thank you modal closes
    setShouldApplyAfterThankYou(true);
    // Don't call applyForJob() here anymore
  };

  // Handle skip resume apply from the popup
  const handleSkipResumeApply = () => {
    setShowResumeApplyConfirmModal(false);
    // Wait for modal to close before applying for job
    setTimeout(() => {
      askBeforeApply();
    }, 300);
  };

  // Update the Thank You popup close handler
  const handleThankYouClose = () => {
    setShowResumeThankYouPopup(false);
    // If we need to apply for job, do it after a short delay
    if (shouldApplyAfterThankYou) {
      setTimeout(() => {
        askBeforeApply();
        setShouldApplyAfterThankYou(false);
      }, 300);
    }
  };


  // 🔹 call API on first load
  useEffect(() => {
    dispatch({
      type: candidateActions.GET_CANDIDATE_JOB_MATCHING,
      payload: { page: 1, perPage: 10 }
    });
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch({
      type: candidateActions.GET_CANDIDATE_JOB_MATCHING,
      payload: { page: newPage, perPage }
    });
  };

  const formatTime = (value) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return value; // fallback: raw string
    }
  };

  const agencyBannerUrl = getAgencyBannerImageUrl(agencyFromSlug);

  const bannerUrlToShow =
    agencyBannerUrl ||
    (selectedJob ? getBannerImageUrl(selectedJob.client) : "");

  return (
    <Row>
      <Col xs="12">
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <CardTitle tag="h4">Suggested Jobs for You</CardTitle>
            <small className="text-muted">
              Based on your profile & preferences
            </small>
          </CardHeader>

          <CardBody>
            <Table responsive borderless className="mb-1">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Number of vacancies</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="6">Loading suggested jobs...</td>
                  </tr>
                )}

                {!loading && results.length === 0 && (
                  <tr>
                    <td colSpan="6">No suggested jobs found.</td>
                  </tr>
                )}

                {!loading &&
                  results.map((job, index) => {
                    const jobTitle =
                      job.designation || "-"
                      ;

                    const companyName = job.client?.companyName || "-";
                    const location = job.jobLocation || "-";
                    const numberOfVacancies = job.numberOfVacancy || "-";

                    return (
                      <tr key={job.id || job._id}>
                        <td>{(page - 1) * perPage + index + 1}</td>
                        <td>{jobTitle}</td>
                        <td>{companyName}</td>
                        <td>{location}</td>
                        <td>
                          {numberOfVacancies}
                        </td>
                        <td>
                          {job.appliedStatus === "applied" ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Button
                                disabled
                                style={{
                                  backgroundColor: "#6c757d",
                                  color: "white",
                                  cursor: "not-allowed"
                                }}
                                color="secondary"
                              >
                                Applied
                              </Button>
                              <span
                                id={`applied-tooltip-${job.id || job._id}`}
                                style={{
                                  cursor: "pointer",
                                  color: themecolor,
                                  fontSize: "16px"
                                }}
                              >
                                <Info size={16} />
                              </span>


                              <UncontrolledTooltip
                                placement="top"
                                target={`applied-tooltip-${job.id || job._id}`}
                              >
                                Company will soon contact you for the interview.
                              </UncontrolledTooltip>
                            </div>
                          ) : (
                            <Button
                              style={{ backgroundColor: themecolor, color: "white" }}
                              color="default"
                              onClick={() => handleViewJob(job)}
                            >
                              View / Apply
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>

            </Table>

            {/* pagination footer */}
            {results.length > 0 && (
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {(page - 1) * perPage + 1}-
                  {Math.min(page * perPage, total)} of {total} jobs
                </small>

                <Pagination className="mb-0">
                  <PaginationItem disabled={page === 1}>
                    <PaginationLink
                      previous
                      onClick={() => handlePageChange(page - 1)}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <PaginationItem
                      key={idx}
                      active={page === idx + 1}
                    >
                      <PaginationLink
                        style={{ backgroundColor: page === idx + 1 ? themecolor : "white", color: page === idx + 1 ? "white" : themecolor }}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem disabled={page === totalPages}>
                    <PaginationLink
                      next
                      onClick={() => handlePageChange(page + 1)}
                    />
                  </PaginationItem>
                </Pagination>
              </div>
            )}

            <Modal
              isOpen={jobModalOpen}
              toggle={toggleJobModal}
              centered
              wrapClassName="job-detail-modal"
              className="modal-xl"
              style={{ maxWidth: "90%", width: "1200px", margin: "0 auto" }}
            >
              <ModalHeader toggle={toggleJobModal}>
                {selectedJob ? (selectedJob.designation ?? "-") : "Job Details"}
              </ModalHeader>

              <ModalBody style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {selectedJob && (
                  <>
                    {/* 🔹 TWO COLUMN LAYOUT WITH VERTICAL DIVIDER */}
                    <Row>
                      {/* LEFT COLUMN */}
                      <Col md="6" xs="12" className="pe-md-3 border-end">
                        <div className="mb-2"><strong>Company:</strong> {selectedJob.client?.companyName || "-"}</div>
                        <div className="mb-2"><strong>Industry:</strong> {selectedJob.industries?.industryCategory || "-"}</div>
                        <div className="mb-2"><strong>Location:</strong> {selectedJob.jobLocation || "-"}</div>
                        <div className="mb-2"><strong>Number of vacancies:</strong> {selectedJob.numberOfVacancy || "-"}</div>
                        {/* <div className="mb-2"><strong>Match Score:</strong> {selectedJob.matchScore ? `${selectedJob.matchScore}%` : "N/A"}</div> */}
                        <div className="mb-2"><strong>Experience:</strong> {selectedJob.minExperienceYears || "N/A"}</div>
                        <div className="mb-2"><strong>Qualification:</strong> {selectedJob.qualification || "-"}</div>
                        <div className="mb-2"><strong>Field:</strong> {selectedJob.field || "-"}</div>
                        <div className="mb-2"><strong>Course:</strong> {selectedJob.course || "-"}</div>
                      </Col>

                      {/* RIGHT COLUMN */}
                      <Col md="6" xs="12" className="ps-md-3">
                        <div className="mb-2"><strong>Job Start Time:</strong> {formatTime(selectedJob.jobStartTime)}</div>
                        <div className="mb-2"><strong>Job End Time:</strong> {formatTime(selectedJob.jobEndTime)}</div>
                        <div className="mb-2">
                          <strong>Working Days:</strong> {selectedJob.workingDays} {selectedJob.sunday === "off" && "(Sunday Off)"}
                        </div>
                        <div className="mb-2"><strong>Work Type:</strong> {selectedJob.workType || "-"}</div>

                        <div className="mb-2">
                          <strong>Salary Range:</strong>{" "}
                          {selectedJob.salaryRangeStart && selectedJob.salaryRangeEnd
                            ? `₹${selectedJob.salaryRangeStart} - ₹${selectedJob.salaryRangeEnd}`
                            : "N/A"}{" "}
                          {selectedJob.negotiable === "yes" && "(Negotiable)"}
                        </div>
                        <div className="mb-2"><strong>Gender:</strong> {selectedJob.gender || "-"}</div>
                        <div className="mb-2"><strong>Basic Skills:</strong> {selectedJob.basicSkill || "-"}</div>
                        <div className="mb-2"><strong>Key Role:</strong> {selectedJob.keyRole || "-"}</div>
                      </Col>
                    </Row>

                    {/* HORIZONTAL DIVIDER */}
                    <hr className="my-3" />

                    {/* 🔹 JOB DESCRIPTION (FULL WIDTH) */}
                    <Row>
                      <Col xs="12">
                        <p className="mb-1"><strong>Job Description:</strong></p>
                        <div
                          style={{
                            whiteSpace: "pre-line",
                            wordBreak: "break-word",
                            maxHeight: "180px",
                            overflowY: "auto",
                            border: "1px solid #dee2e6",
                            borderRadius: "0.5rem",
                            padding: "0.75rem 1rem",
                            backgroundColor: "#fafafa",
                            fontSize: "0.95rem",
                          }}
                        >
                          {selectedJob.jobDescription?.trim() || "No job description available"}
                        </div>
                      </Col>
                    </Row>

                    {/* HORIZONTAL DIVIDER */}
                    <hr className="my-4" />

                    {/* 🔹 PROFESSIONAL DETAILS SECTION */}
                    <Row>
                      <Col xs="12">
                        <h5 className="mb-3">Your Professional Details</h5>
                        {isLoadingProfile ? (
                          <div className="text-center py-4">
                            <p>Loading professional information...</p>
                          </div>
                        ) : (candidate?.id || candidate?._id) ? (
                          <Professional
                            key={candidate?.id || candidate?._id}
                            candidate={candidate}
                            industriesData={industriesData}
                            setCandidate={setCandidate}
                            setIndustriesData={setIndustriesData}
                            resumeFile={resumeFile}
                            isResumeUploading={isResumeUploading}
                            showResumeFileName={showResumeFileName}
                            setShowResumeFileName={setShowResumeFileName}
                            handleResumeChange={handleResumeChange}
                            update={true}
                            isDisabledAllFields={false}
                          />
                        ) : (
                          <div className="text-center py-4">
                            <p>No professional information available.</p>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </>
                )}
              </ModalBody>


              <ModalFooter>
                <Button
                  style={{ backgroundColor: themecolor, color: "white" }}
                  color="default"
                  disabled={!selectedJob || jobApplyLoader}
                  onClick={handleSkip}
                >
                  {jobApplyLoader ? "Applying..." : "Skip"}
                </Button>
                {(candidate?.id || candidate?._id) && (
                  <Button
                    style={{ backgroundColor: themecolor, color: "white" }}
                    color="default"
                    disabled={isSavingProfessional}
                    onClick={handleSaveChanges}
                  >
                    {isSavingProfessional ? "Saving..." : "Save & Continue"}
                  </Button>
                )}
              </ModalFooter>
            </Modal>

            {/* Apply status modal */}
            <Modal
              isOpen={applyStatusModalOpen}
              toggle={toggleApplyStatusModal}
              centered
            >
              <ModalHeader toggle={toggleApplyStatusModal}>
                {applyStatusType === "success"
                  ? "Application Submitted"
                  : applyStatusType === "info"
                    ? "Already Applied"
                    : "Application Error"}
              </ModalHeader>
              <ModalBody>
                <p className="mb-0">{applyStatusMessage}</p>
              </ModalBody>
              <ModalFooter>
                <Button style={{ backgroundColor: themecolor, color: "white" }} color="default" onClick={toggleApplyStatusModal}>
                  OK
                </Button>
              </ModalFooter>
            </Modal>

            {/* Resume Thank You Popup */}
            <ResumeThankYouPopup
              isOpen={showResumeThankYouPopup}
              onClose={handleThankYouClose}
            />

            {/* Resume Apply Confirmation Modal */}
            <Modal
              isOpen={showResumeApplyConfirmModal}
              toggle={() => setShowResumeApplyConfirmModal(false)}
              centered
            >
              <ModalHeader toggle={() => setShowResumeApplyConfirmModal(false)}>
                Apply For Professional Resume
              </ModalHeader>
              <ModalBody>
                <p className="mb-0">
                  Your professional details have been saved successfully. Would you like to apply for a professional resume?
                </p>
                {/* Company banner image inside the apply-for-resume popup */}
                {bannerUrlToShow && (
                  <div className="mb-2 text-center mt-2"

                    style={{
                      width: "100%",
                      maxWidth: "520px",
                      aspectRatio: "16/9",
                      border: "1px dashed #d8d6de",
                      borderRadius: "8px",
                      overflow: "hidden",
                      backgroundColor: "#f8f8f8",
                      position: "relative",
                    }}
                  >
                    {agencyFromSlug?.whatsappLink ? (
                      <a
                        href={agencyFromSlug.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "block", cursor: "pointer" }}
                      >
                        <img
                          src={bannerUrlToShow}
                          alt={
                            agencyFromSlug?.agencyName ||
                            agencyFromSlug?.name ||
                            selectedJob?.client?.companyName ||
                            "Company banner"
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            position: "relative",
                          }}
                        />
                      </a>
                    ) : (
                      <img
                        src={bannerUrlToShow}
                        alt={
                          agencyFromSlug?.agencyName ||
                          agencyFromSlug?.name ||
                          selectedJob?.client?.companyName ||
                          "Company banner"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          position: "relative",
                        }}
                      />
                    )}
                  </div>
                )}

              </ModalBody>
              <ModalFooter>
                <Button
                  style={{ backgroundColor: themecolor, color: "white" }}
                  color="default"
                  onClick={handleConfirmResumeApply}
                  disabled={resumeEnquiryStatus === "requested" || resumeEnquiryStatus === "in_review"}
                >
                  Apply
                </Button>
                <Button
                  style={{ backgroundColor: themecolor, color: "white" }}
                  color="default"
                  onClick={handleSkipResumeApply}
                >
                  Skip
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
              isOpen={showApplyConfirmModal}
              toggle={() => setShowApplyConfirmModal(false)}
              centered
            >
              <ModalHeader toggle={() => setShowApplyConfirmModal(false)}>
                Confirm Application
              </ModalHeader>

              <ModalBody>
                Do you want to apply for this job?
              </ModalBody>

              <ModalFooter>
                <Button
                  style={{ backgroundColor: themecolor, color: "white" }}
                  color="default"
                  onClick={() => {
                    setShowApplyConfirmModal(false);
                    applyForJob();
                  }}
                >
                  Apply for Job
                </Button>

                <Button
                  color="secondary"
                  onClick={() => setShowApplyConfirmModal(false)}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>

          </CardBody>
        </Card>
      </Col>
    </Row>

  );
};

export default JobMatches;
