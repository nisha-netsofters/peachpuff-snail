/*eslint-disable*/
import DataTable from "react-data-table-component";
import Marquee from "react-fast-marquee";
import {
  Edit,
  Delete,
  FileText,
  Image,
  UserCheck,
  Trash,
  Share,
  Search,
  Filter as FilterIcon,
  MessageCircle,
  Star,
  Eye,
  UserPlus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  Clock,
  MapPin,
  DollarSign,
  Briefcase,
  User,
  Trash2,
  Download,
} from "react-feather";
import UserMaleIcon from "../../assets/images/avatars/Male-01.png";
import UserFemaleIcon from "../../assets/images/avatars/Female-01.png";
import {
  CardImg,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { selectThemeColors } from "@utils";
import { MoreVertical } from "react-feather";
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import Select from "react-select";
import { CardBody, CardText, CardTitle, CardHeader } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Component, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Candidate from "../../components/Dialog/Candidate";
import CandidateActions from "../../redux/candidate/actions";
import CustomHeader from "../../components/Header/CustomHeader";
import Filter from "../../components/Forms/Candidates/Filter";
import { tostify, tostifySuccess, tostifyError, tostifyInfo } from "../../components/Tostify";
import { useHistory, useLocation } from "react-router-dom";
import {
  checkCandidatePublicAPI,
  createCandidateAPI,
  getCandidateAPI,
  toggleFavoriteCandidateAPI,
  updateCandidateAPI,
} from "../../apis/candidate";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import ReactCanvasConfetti from "react-canvas-confetti";
import { calculateProfileCompleteness } from "../../utility/profileCompleteness";
import { resolveIndianAddress } from "../../utility/resolveIndianAddress";
import { normalizeExtractedResume } from "../../utility/normalizeResumeExtract";
import course from "../Forms/Course";
import { resolveAssetUrl } from "../../utility/resolveAssetUrl";
import apiCall from "../../utility/axiosInterceptor";
import clientactions from "../../redux/client/actions";
// import { uploadFiles } from './../../helper/fileUpload'
import Loader from "../../components/Dialog/Loader";
import whatsapp from "../../assets/images/whatsapp.png";
import { awsUploadAssetsWithResp } from "../../helper/awsUploadAssets";
import moment from "moment/moment";
import subscriptionActions from "../../redux/subscription/actions";
import authActions from "../../redux/auth/actions";
import actions from "../../redux/client/actions";
import userActions from "../../redux/user/actions";
import Rating from "react-rating";
import img from "../../assets/images/icons/annucment.png";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
import { allAccessEmail } from "../../constant/constant";
import jobcategoryActions from "./../../redux/jobCategory/actions";
import industriesActions from "./../../redux/industries/actions";
import WhatsappDialog from "../../components/Dialog/WhatsappDialog";
import CandidateQuickTabs from "./CandidateQuickTabs";
import { formatCommentDateTime } from "../Forms/Candidates/RecruiterInternalComments";
import _ from "lodash";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

const pageOptions = [
  { label: "10", value: 10, id: 10 },
  { label: "20", value: 20, id: 20 },
  { label: "50", value: 50, id: 50 },
  { label: "100", value: 100, id: 100 },
  { label: "200", value: 200, id: 200 },
];

const SecondPage = ({
  isSavedCandidates = false,
  bestMatchesCandidate = false,
  isAppliedCandidates = false,
  appliedCandidatesList = null,
  appliedCandidatesTotal = 0,
  jobId = null,
  isAppliedCandidatesLoading = false,
  appliedCandidatesError = null,
}) => {
  const { width } = useBreakpoint();
  const colRef = useRef(null);
  const history = useHistory();
  const params = useLocation();
  // const { isSent, isNotSent } = useSelector(state => state.candidate)
  const dispatch = useDispatch();
  const location = useLocation().search;
  const auth = useSelector((state) => state?.auth);
  const { client } = useSelector((state) => state);
  const {
    currentPlan,
    currentSubscription,
    isLoading,
    resumeCountFinishError,
  } = useSelector((state) => state?.subscription);
  const count = useSelector(
    (state) => state?.subscription?.currentSubscription
  );
  const clientUser = useSelector((state) => state?.auth?.user);
  const { user } = useSelector((state) => state.auth);
  const candidateId = new URLSearchParams(location).get("id");
  const dashboardSearchParams = new URLSearchParams(location);
  const urlQuickFilter = dashboardSearchParams.get("quickFilter");
  const urlInterviewStatus = dashboardSearchParams.get("interviewStatus");
  const urlStatsYear = dashboardSearchParams.get("year");
  const urlStatsMonth = dashboardSearchParams.get("month");

  const getFilterFromDashboardUrl = () => {
    const initial = {};
    if (urlInterviewStatus) {
      initial.interviewStatus = urlInterviewStatus;
    }
    if (urlStatsYear && Number(urlStatsYear) !== 0) {
      initial.statsYear = Number(urlStatsYear);
    }
    if (urlStatsMonth && Number(urlStatsMonth) !== 0) {
      initial.statsMonth = Number(urlStatsMonth);
    }
    return initial;
  };

  const [show, setShow] = useState(false);
  const candidates = useSelector((state) => state.candidate);
  const { bestMatchesCandidates } = useSelector((state) => state.candidate);
  const { getSavedCandidateLoader } = useSelector((state) => state.candidate);
  const [candidate, setCandidate] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [animation, setAnimation] = useState(false);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [industriesData, setIndustriesData] = useState([]);
  const [email, setEmail] = useState("");
  const [filterData, setFilterData] = useState(getFilterFromDashboardUrl);
  const [activeQuickFilter, setActiveQuickFilter] = useState(
    urlQuickFilter || null
  );
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState({
    active: false,
    current: 0,
    total: 0,
    label: "",
    phase: "",
  });
  const duplicateResolveRef = useRef(null);
  const [duplicateResumeModal, setDuplicateResumeModal] = useState({
    open: false,
    fileLabel: "",
    candidateName: "",
    mobile: "",
    email: "",
    matchOn: "",
  });
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [perPageSelect, setPerPageSelect] = useState(pageOptions[0]);
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [candidateList, setCandidateList] = useState();
  const [popUp, setPopUp] = useState(false);
  const [promiseLoading, setPromiseLoading] = useState(false);

  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [WPnumber, setWPnumber] = useState();
  const [filterJobCategory, setFilterJobCategory] = useState([]);
  const [jobCategoryId, setJobCategoryId] = useState([]);
  const [isPlanExpireModalOpen, setIsPlanExpireModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(
    candidates?.results?.map(() => false) ?? []
  );
  const slug = localStorage.getItem("slug");
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDisabledAllFields, setIsDisabledAllFields] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showWPModal, setShowWPModal] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [resumePreview, setResumePreview] = useState({
    open: false,
    url: null,
    previewUrl: null,
    blobUrl: null,
    fileName: "",
    loading: false,
    error: null,
  });

  // useLayoutEffect(() => {
  //   // if (bestMatchesCandidate) {
  //     dispatch({
  //       type: CandidateActions.SET_CANDIDATE,
  //       payload: [],
  //     });
  //   // }
  // }, [isBestMatches])

  const toggle = (index) => {
    const newCollapseStates = [...isOpen];
    newCollapseStates[index] = !newCollapseStates[index];
    setIsOpen(newCollapseStates);
  };
  useEffect(() => {
    if (user?.clients?.id) {
      dispatch({
        type: userActions.GET_LOGIN_USER_DETAIL,
        payload: user?.id,
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await dispatch({
        type: industriesActions.GET_ALL_INDUSTRIES,
      });
      await dispatch({
        type: jobcategoryActions.GET_ALL_JOBCAT,
      });
    })();
  }, []);

  // useEffect(() => {
  //   if (
  //     client?.msg == "success" &&
  //     client?.isOpenInterviewReqSentPopup == true
  //   ) {
  //     setPopUp(true);
  //     setLoading(false);
  //     setTimeout(() => {
  //       dispatch({
  //         type: actions.INTERVIEW_REQUEST_POPUP,
  //         payload: false,
  //       });
  //       setPopUp(false);
  //     }, 5000);
  //   } else {
  //     setPopUp(false);
  //   }
  // }, [client]);

  useEffect(() => {
    if (candidates?.isUpgradePlan) {
      setIsPlanExpireModalOpen(true);
    }
  }, [candidates]);

  useEffect(() => {
    if (bestMatchesCandidate || isAppliedCandidates) {
      return;
    }
    if (Array.isArray(candidates?.results)) {
      setCandidateList(candidates.results);
      setLoading(false);
      if (typeof candidates.total === "number") {
        setTotalRows(candidates.total);
      }
    } else if (candidates?.error || candidates?.results === null) {
      setCandidateList([]);
      setLoading(false);
    }
  }, [candidates?.results, candidates?.total, candidates?.error]);

  useEffect(() => {
    if (bestMatchesCandidates?.results && bestMatchesCandidate == true) {
      setCandidateList(bestMatchesCandidates?.results);
      setLoading(false);
    }
  }, [bestMatchesCandidates]);

  // Handle applied candidates list
  useEffect(() => {
    if (isAppliedCandidates && appliedCandidatesList) {
      // Convert applied candidates to the same format as regular candidates
      const formattedCandidates = Array.isArray(appliedCandidatesList)
        ? appliedCandidatesList.map((applied) => {
          // The applied candidate might be nested in a candidate object
          const candidate = applied.candidate || applied;

          // Ensure all required fields are properly mapped
          // Handle different possible data structures from API
          const formattedCandidate = {
            ...candidate,
            // Prefer real candidate id (applicants API returns application id as `id`)
            id:
              applied.candidateId ||
              candidate.candidateId ||
              candidate.id ||
              candidate._id ||
              applied.id ||
              applied._id,
            firstname:
              candidate.firstname ||
              candidate.firstName ||
              candidate.candidateName?.split(" ")[0] ||
              applied.candidateName?.split(" ")[0] ||
              "-",
            lastname:
              candidate.lastname ||
              candidate.lastName ||
              candidate.candidateName?.split(" ").slice(1).join(" ") ||
              applied.candidateName?.split(" ").slice(1).join(" ") ||
              "",
            email:
              candidate.email ||
              candidate.candidateEmail ||
              applied.email ||
              applied.candidateEmail ||
              "-",
            mobile:
              candidate.mobile ||
              candidate.phone ||
              candidate.candidateMobile ||
              applied.mobile ||
              applied.phone ||
              "-",
            city: candidate.city || candidate.candidateCity || applied.city || "-",
            gender:
              candidate.gender ||
              applied.gender ||
              applied.candidateGender ||
              "-",
            image: candidate.image || candidate.candidateImage || applied.image || null,
            resume:
              candidate.resume ||
              candidate.candidateResume ||
              applied.resume ||
              applied.candidateResume ||
              null,
            status: candidate.status || applied.status || "Applied",
            // Professional info - handle nested structure
            professional: {
              ...(candidate.professional ||
                candidate.candidateProfessional ||
                applied.candidateProfessional ||
                {}),
              jobCategory:
                candidate.professional?.jobCategory ||
                candidate.candidateProfessional?.jobCategory ||
                applied.candidateProfessional?.jobCategory ||
                (candidate.jobCategory || applied.jobCategory
                  ? {
                      jobCategory:
                        candidate.jobCategory?.jobCategory ||
                        applied.jobCategory?.jobCategory ||
                        candidate.jobCategory ||
                        applied.jobCategory ||
                        "-",
                    }
                  : null),
              highestQualification:
                candidate.professional?.highestQualification ||
                candidate.candidateProfessional?.highestQualification ||
                applied.candidateProfessional?.highestQualification ||
                candidate.highestQualification ||
                applied.highestQualification ||
                candidate.qualification ||
                applied.qualification ||
                "-",
              field:
                candidate.professional?.field ||
                candidate.candidateProfessional?.field ||
                applied.candidateProfessional?.field ||
                candidate.field ||
                applied.field ||
                "-",
              experienceInyear:
                candidate.professional?.experienceInyear ||
                candidate.candidateProfessional?.experienceInyear ||
                applied.candidateProfessional?.experienceInyear ||
                candidate.experienceInyear ||
                candidate.experience ||
                candidate.totalExperience ||
                applied.experience ||
                applied.totalExperience ||
                "-",
              currentSalary:
                candidate.professional?.currentSalary ||
                candidate.candidateProfessional?.currentSalary ||
                applied.candidateProfessional?.currentSalary ||
                candidate.currentSalary ||
                applied.currentSalary ||
                "-",
              expectedsalary:
                candidate.professional?.expectedsalary ||
                candidate.candidateProfessional?.expectedsalary ||
                applied.candidateProfessional?.expectedsalary ||
                candidate.expectedsalary ||
                candidate.expectedSalary ||
                applied.expectedSalary ||
                "-",
              currentlyWorking:
                candidate.professional?.currentlyWorking ||
                candidate.candidateProfessional?.currentlyWorking ||
                applied.candidateProfessional?.currentlyWorking ||
                candidate.currentlyWorking ||
                applied.currentlyWorking ||
                "-",
              noticePeriod:
                candidate.professional?.noticePeriod ||
                candidate.candidateProfessional?.noticePeriod ||
                applied.candidateProfessional?.noticePeriod ||
                candidate.noticePeriod ||
                applied.noticePeriod ||
                "-",
              preferedJobLocation:
                candidate.professional?.preferedJobLocation ||
                candidate.candidateProfessional?.preferedJobLocation ||
                applied.candidateProfessional?.preferedJobLocation ||
                candidate.preferedJobLocation ||
                candidate.preferredLocation ||
                applied.preferredLocation ||
                "-",
              skill:
                candidate.professional?.skill ||
                candidate.candidateProfessional?.skill ||
                applied.candidateProfessional?.skill ||
                candidate.skill ||
                candidate.skills ||
                applied.skill ||
                applied.skills ||
                "-",
            },

            // Education and Experience arrays
            education:
              candidate.education ||
              candidate.education_relation ||
              applied.education ||
              [],
            experience:
              candidate.experience ||
              candidate.experience_relation ||
              applied.experience ||
              [],
            // Industries (support multiple possible API shapes)
            industries_relation:
              candidate.industries_relation ||
              candidate.candidateIndustry ||
              applied.industries_relation ||
              applied.candidateIndustry ||
              [],
            // Skills
            skills: candidate.skills || candidate.skills_relation || applied.skills || [],
          };

          return formattedCandidate;
        })
        : [];
      setCandidateList(formattedCandidates);
      setTotalRows(formattedCandidates.length);
      setLoading(false);
      // Update isOpen state for collapse functionality
      setIsOpen(formattedCandidates.map(() => false));
    } else if (isAppliedCandidates && !appliedCandidatesList && !isAppliedCandidatesLoading) {
      // No candidates found
      setCandidateList([]);
      setTotalRows(0);
      setLoading(false);
      setIsOpen([]);
    }
  }, [appliedCandidatesList, isAppliedCandidates, isAppliedCandidatesLoading]);

  const getCandidates = async (page, quickFilterOverride) => {
    setLoading(true);
    const data = { ...filterData };
    const quickFilter =
      quickFilterOverride !== undefined
        ? quickFilterOverride
        : activeQuickFilter;
    if (quickFilter) {
      data.quickFilter = quickFilter;
    }
    if (auth?.user?.clients?.id) {
      const industriesId = [];
      // data.interviewStatus = "available"
      data.userId = auth?.user?.id;
      auth?.user?.clients?.industries_relation?.map((ele) => {
        industriesId.push(ele?.industriesId);
        data.industriesId = industriesId;
      });
      if (!filterData?.jobCategoryId && !filterData?.filterJobCategoryId) {
        const clientJobCategoryIds = [];
        auth?.user?.clients?.jobCategory_relation?.map((ele) => {
          clientJobCategoryIds.push(ele?.jobCategoryId);
          data.jobCategoryId = clientJobCategoryIds;
        });
      }
    }
    // Admin jobCategoryId comes only from filterData (Filter drawer Search)

    if (auth?.user?.clients?.id) {
      if (isSavedCandidates) {
        dispatch({
          type: CandidateActions.GET_SAVED_CANDIDATE,
          payload: {
            filterData: data,
            page,
            perPage,
            isSavedCandidates,
          },
        });
      } else {
        if (bestMatchesCandidate == true) {
          dispatch({
            type: CandidateActions.GET_BEST_MATCHES_CANDIDATE,
            payload: {
              filterData: data,
              page,
              perPage,
              isSavedCandidates,
            },
          });
        } else {
          dispatch({
            type: CandidateActions.GET_CLIENT_CANDIDATE,
            payload: {
              filterData: data,
              page,
              perPage,
              isSavedCandidates,
            },
          });
        }
      }
    } else {
      dispatch({
        type: CandidateActions.GET_CANDIDATE,
        payload: {
          filterData: data,
          page,
          perPage,
        },
      });
    }
  };

  useEffect(() => {
    if (!isAppliedCandidates) {
      getCandidates(currentPage);
    }
  }, [perPage]);

  useEffect(() => {
    if (!isAppliedCandidates) {
      if (auth?.user?.clients?.id) {
        if (
          create === false &&
          update === false &&
          show === false &&
          filterKey(filterData)?.length
        ) {
          getCandidates(1);
        }
      } else {
        if (
          create === false &&
          update === false &&
          show === false
        ) {
          // Always page 1 when filters change (avoids empty results on page 2+)
          getCandidates(1);
        }
      }
    }
  }, [filterData]);

  const handleQuickTabChange = (tabId) => {
    const next =
      tabId === "all"
        ? null
        : activeQuickFilter === tabId
          ? null
          : tabId;
    setActiveQuickFilter(next);
    setCurrentPage(1);
    getCandidates(1, next);
  };

  useEffect(() => {
    if (!show) {
      setCandidate({});
      setIndustriesData([]);
    }
  }, [show]);

  const clearStates = () => {
    if (candidates === "candidates_email_unique") {
      candidate.education = education;
      candidate.experience = experience;
      tostify("Email Already Exist");
    } else if (candidates === "candidates_mobile_unique") {
      candidate.education = education;
      candidate.experience = experience;
      tostify("Mobile Number Already Exist");
    } else {
      if (candidateId) {
        history.push(`/${slug}/candidate`);
      } else {
        setLoading(false);
        setEducation([]);
        setExperience([]);
        // setFilterData([]);
        setIndustriesData([]);
        setCreate(false);
        setUpdate(false);
        setIsDisabledAllFields(false);
        setCandidate([]);
        setShow(false);
        setAnimation({});
      }
    }
  };

  useEffect(() => {
    if (create === true) {
      clearStates();
    }
  }, [candidates]);

  // useEffect(() => {
  //   setTotalRows(candidates.total);
  // }, [candidates]);
  useEffect(() => {
    if (bestMatchesCandidates?.total && bestMatchesCandidate == true) {
      setTotalRows(bestMatchesCandidates.total);
    } else {
      setTotalRows(candidates.total);
    }
  }, [bestMatchesCandidates, candidates]);

  const interviewRequest = async (candidate) => {
    dispatch({
      type: clientactions.INTERVIEW_REQUEST,
      payload: {
        candidate: candidate?.id,
        client: auth?.user?.clients?.id,
        clientCandidateData: {
          filterData: filterData,
          page: 1,
          perPage,
        },
      },
    });
  };
  const deleteCandidate = (row) => {
    setLoading(true);
    dispatch({
      type: CandidateActions.DELETE_CANDIDATE,
      payload: { id: row.id },
      setLoading,
    });
  };
  const selectedCandidatesRef = useRef([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const candidateHeaderRef = useRef(null);
  const candidateListContainerRef = useRef(null);

  useLayoutEffect(() => {
    const updateListHeight = () => {
      const header = candidateHeaderRef.current;
      const listContainer = candidateListContainerRef.current;
      if (!header || !listContainer) return;

      const headerBottom = header.getBoundingClientRect().bottom;
      const availableHeight = window.innerHeight - headerBottom;
      listContainer.style.maxHeight = `${Math.max(availableHeight, 320)}px`;
    };

    updateListHeight();
    window.addEventListener("resize", updateListHeight);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateListHeight)
        : null;
    if (resizeObserver && candidateHeaderRef.current) {
      resizeObserver.observe(candidateHeaderRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateListHeight);
      resizeObserver?.disconnect();
    };
  }, [width, filterToggleMode, activeQuickFilter, filterData]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const appContent = document.querySelector(".app-content");

    html.classList.add("candidate-page-no-page-scroll");
    body.classList.add("candidate-page-no-page-scroll");
    appContent?.classList.add("candidate-page-no-page-scroll");

    return () => {
      html.classList.remove("candidate-page-no-page-scroll");
      body.classList.remove("candidate-page-no-page-scroll");
      appContent?.classList.remove("candidate-page-no-page-scroll");
    };
  }, []);

  const handleSelectedCard = (candidate, isChecked) => {
    if (isChecked) {
      selectedCandidatesRef.current = [
        ...selectedCandidatesRef.current.filter((item) => item.id !== candidate.id),
        candidate,
      ];
    } else {
      selectedCandidatesRef.current = selectedCandidatesRef.current.filter(
        (item) => item.id !== candidate.id
      );
    }
    setSelectedCandidateIds(selectedCandidatesRef.current.map((item) => item.id));
    handleselected(selectedCandidatesRef.current);
  };

  const clearAllSelectedCandidates = () => {
    selectedCandidatesRef.current = [];
    setSelectedCandidateIds([]);
    handleselected([]);
  };

  const getCurrentPageCandidates = () => candidateList || [];

  const selectAllPageCandidates = () => {
    const pageCandidates = getCurrentPageCandidates();
    if (!pageCandidates.length) return;
    const pageIds = new Set(pageCandidates.map((c) => c.id));
    const others = selectedCandidatesRef.current.filter(
      (item) => !pageIds.has(item.id)
    );
    selectedCandidatesRef.current = [...others, ...pageCandidates];
    setSelectedCandidateIds(selectedCandidatesRef.current.map((item) => item.id));
    handleselected(selectedCandidatesRef.current);
  };

  const isCandidateSelected = (candidateId) =>
    selectedCandidateIds.includes(candidateId);

  const pageCandidates = getCurrentPageCandidates();
  const selectedOnPageCount = pageCandidates.filter((c) =>
    selectedCandidateIds.includes(c.id)
  ).length;
  const isAllPageSelected =
    pageCandidates.length > 0 && selectedOnPageCount === pageCandidates.length;
  const isSomePageSelected =
    selectedOnPageCount > 0 && selectedOnPageCount < pageCandidates.length;

  const handleselected = (rows) => {
    const mails =
      rows?.map((ele) => ({
        label: `${ele?.firstname} ${ele?.lastname}`,
        email: ele.email,
      })) || [];

    dispatch({
      type: CandidateActions.SET_SELECTED_FOR_EMAIL_CANDIDATE,
      payload: { mails, totalRows: rows?.length },
    });
    setPromiseLoading(false);
  };

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };

  const statusUpdate = (row) => {
    dispatch({
      type: CandidateActions.CANDIDATE_STATUS,
      payload: { id: row.id },
    });
  };

  const decreaseResumeDownload = (userId, subscriptionId, row, extra = {}) => {
    dispatch({
      type: subscriptionActions.DECREASE_RESUME_DOWNLOADING,
      payload: {
        userId,
        subscriptionId,
        candidateId: row?.id,
        url: resolveAssetUrl(row?.resume) || row?.resume,
        ...extra,
      },
    });
  };
  const hasValidResume = (resume) => {
    if (!resume || typeof resume !== "string") return false;
    const value = resume.trim();
    return (
      value.length > 0 &&
      value !== "null" &&
      value !== "undefined" &&
      value !== "[object Object]" &&
      value !== "{}"
    );
  };

  const getResumeFileName = (resumePath) => {
    try {
      const decoded = decodeURIComponent(String(resumePath || ""));
      const name = decoded.split("?")[0].split("#")[0];
      const fileName = name.substring(name.lastIndexOf("/") + 1);
      return fileName || "resume";
    } catch (e) {
      return "resume";
    }
  };

  const isPdfResume = (path) => /\.pdf($|\?|#)/i.test(String(path || ""));
  const isOfficeResume = (path) =>
    /\.(doc|docx)($|\?|#)/i.test(String(path || ""));

  const closeResumePreview = () => {
    setResumePreview((prev) => {
      if (prev?.blobUrl) {
        URL.revokeObjectURL(prev.blobUrl);
      }
      return {
        open: false,
        url: null,
        previewUrl: null,
        blobUrl: null,
        fileName: "",
        loading: false,
        error: null,
      };
    });
  };

  const openCandidateResume = (resumePath) => {
    const url = resolveAssetUrl(resumePath);
    if (!url) {
      tostify("Resume file not available");
      return;
    }
    const fileName = getResumeFileName(resumePath || url);
    const agencySlug = localStorage.getItem("slug") || slug || "uniqueworld";
    // Open our viewer page synchronously on user click — avoids popup-blocker.
    const qs = new URLSearchParams({
      url,
      name: fileName,
    });
    window.open(
      `/${agencySlug}/resume-viewer?${qs.toString()}`,
      "_blank"
    );
  };

  const downloadResumeFromPreview = async () => {
    const fileName = resumePreview.fileName || "resume";
    try {
      if (resumePreview.blobUrl) {
        const a = document.createElement("a");
        a.href = resumePreview.blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
      const res = await fetch(resumePreview.url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    } catch (e) {
      if (resumePreview.url) {
        window.open(resumePreview.url, "_blank", "noopener,noreferrer");
      } else {
        tostify("Resume file not available");
      }
    }
  };

  const openViewProfile = (row) => {
    if (!row) return;
    setIsDisabledAllFields(true);
    setCandidate(row);
    setIndustriesData(row?.industries_relation);
    statusUpdate(row);
    setEmail(row?.email);
    setCreate(false);
    setUpdate(true);
    setShow(true);
  };

  const handleOpenResume = (row) => {
    if (!hasValidResume(row?.resume)) {
      tostify("Resume file not available");
      return;
    }

    // Already saved/viewed → open preview
    if (isSavedCandidates || row?.saved_Candidates?.id || row?.savedCandidates?.id) {
      openCandidateResume(row?.resume);
      return;
    }

    const userId = auth?.user?.id;
    const subscriptionId =
      currentSubscription?.id || auth?.user?.subscriptionId || auth?.user?.subscription?.id;

    if (!userId) {
      tostify("Please login again to view resume");
      return;
    }

    decreaseResumeDownload(userId, subscriptionId, row, { skipOpen: true });
    openCandidateResume(row?.resume);
  };

  const isCandidateFavorited = (row) =>
    Boolean(
      row?.savedCandidates?.id ||
        row?.savedCandidates?.candidateId ||
        row?.saved_Candidates?.id
    );

  const updateFavoriteInLists = (candidateId, savedRecord) => {
    const patchRow = (row) =>
      row?.id === candidateId
        ? { ...row, savedCandidates: savedRecord || null }
        : row;

    setCandidateList((prev) =>
      Array.isArray(prev) ? prev.map(patchRow) : prev
    );

    if (Array.isArray(candidates?.results)) {
      dispatch({
        type: CandidateActions.SET_CANDIDATE,
        payload: {
          ...candidates,
          results: candidates.results.map(patchRow),
        },
      });
    }
  };

  const handleToggleFavorite = async (row) => {
    if (!row?.id || auth?.user?.clients) return;

    try {
      const resp = await toggleFavoriteCandidateAPI({ candidateId: row.id });
      if (resp?.msg && resp?.isSaved === undefined) {
        tostifyError(resp.msg);
        return;
      }

      updateFavoriteInLists(
        row.id,
        resp?.isSaved ? resp?.savedCandidate || { candidateId: row.id } : null
      );
      tostifySuccess(
        resp?.isSaved ? "Added to favorites" : "Removed from favorites"
      );
    } catch (error) {
      const apiMsg =
        error?.response?.data?.msg ||
        error?.message ||
        "Could not update favorites";
      tostifyError(apiMsg);
    }
  };

  const renderFavoriteStar = (row, size = 17) => {
    if (auth?.user?.clients) return null;

    const favorited = isCandidateFavorited(row);
    const starColor = themecolor || "#323D76";

    return (
      <span
        style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
        onClick={(e) => {
          e.stopPropagation();
          handleToggleFavorite(row);
        }}
        title={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Star
          size={size}
          className="mx-1"
          fill={favorited ? starColor : "none"}
          stroke={favorited ? starColor : "#babfc7"}
        />
      </span>
    );
  };

  const getProfileCompletionBarColor = (pct) => {
    if (pct >= 100) return "success";
    if (pct > 80) return "info";
    if (pct >= 50) return "warning";
    return "danger";
  };

  const renderProfileCompletion = (row) => {
    const computed =
      row?.profileCompleteness === undefined ||
      row?.profileCompleteness === null
        ? calculateProfileCompleteness(row)
        : null;
    const pct = Number(
      row?.profileCompleteness ?? computed?.profileCompleteness ?? 0
    );
    const label =
      row?.profileCompletenessLabel ||
      computed?.profileCompletenessLabel ||
      `${pct}% Complete`;
    return (
      <div style={{ width: "100%", minWidth: "120px", padding: "6px 0" }}>
        <div
          className="d-flex justify-content-between align-items-center mb-25"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          <span>{label}</span>
        </div>
        <Progress
          value={Math.min(Math.max(pct, 0), 100)}
          color={getProfileCompletionBarColor(pct)}
          style={{ height: 8, borderRadius: 4 }}
        />
      </div>
    );
  };

  const columns = [
    {
      name: "Action",
      minWidth: "110px",
      cell: (row) => {
        return (
          <div div className="column-action d-flex align-items-center">
            {renderFavoriteStar(row)}
            <span
              style={{ cursor: "pointer" }}
              onClick={async () => {
                if (
                  row?.agency?.email == user?.agency?.email ||
                  user?.agency?.email == allAccessEmail
                ) {
                  setCandidate(row);
                  setIndustriesData(row?.industries_relation);
                  statusUpdate(row);
                  setEmail(row?.email);
                  setUpdate(true);
                  setShow(true);
                } else {
                  setIsDisabledAllFields(true);
                  setCandidate(row);
                  setIndustriesData(row?.industries_relation);
                  statusUpdate(row);
                  setEmail(row?.email);
                  setUpdate(true);
                  setShow(true);
                }
              }}
            >
              <Edit size={17} className="mx-1" />
            </span>
            <span
              style={
                row?.agency?.email == user?.agency?.email ||
                  user?.email == allAccessEmail
                  ? { cursor: "pointer" }
                  : { pointerEvents: "none", opacity: "0.6" }
              }
              onClick={() => {
                if (
                  row?.agency?.email == user?.agency?.email ||
                  user?.email == allAccessEmail
                ) {
                  handleDeleteClick(row);
                }
              }}
            >
              <Trash size={17} className="mx-1" />
            </span>
          </div>
        );
      },
    },
    {
      name: "Interview LineUp",
      selector: (row) => (
        <span
          onClick={() => {
            history.push(
              `/${slug}/interview?id=${row.id}&first=${row.firstname}&last=${row.lastname}`
            );
          }}
          style={{ cursor: "pointer" }}
        >
          <UserCheck size={17} className="mx-1" />
        </span>
      ),
    },
    {
      name: "Status",
      minWidth: "110px",
      cell: (row) => (
        <Badge
          Badge
          pill
          color="defult"
          className="column-action d-flex align-items-center"
          style={{
            textTransform: "capitalize",
            backgroundColor:
              row.status === "new" ? themecolor : `${themecolor}80`,
          }}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      name: "Profile Completion",
      minWidth: "160px",
      cell: (row) => renderProfileCompletion(row),
    },
    {
      name: "Interview Status",
      minWidth: "110px",
      cell: (row) => {
        let color = "light-success";
        if (row?.interviewStatus === "available") color = "light-warning";
        else if (row?.interviewStatus === "scheduled") color = "light-info";
        else if (row?.interviewStatus === "rejected") color = "light-danger";
        else if (row?.interviewStatus === "hold") color = "secondary";
        else if (row?.interviewStatus === "completed")
          color = "light-secondary";
        else if (row?.interviewStatus === "cv shared") color = "secondary";
        else if (row?.interviewStatus === "hired") color = "light-success";
        else if (row?.interviewStatus === "Not Joined It") color = "warning";
        else if (row?.interviewStatus === "Left") color = "light-info";
        else if (row?.interviewStatus === "shortlisted") color = "info";
        else if (row?.interviewStatus === "trail") color = "dark";
        else if (row?.interviewStatus === "reschedule") color = "warning";
        return (
          <Badge
            Badge
            pill
            color={color}
            className="column-action d-flex align-items-center"
            style={{ textTransform: "capitalize" }}
          >
            {row.interviewStatus}
          </Badge>
        );
      },
    },

    {
      name: "Interview Date",
      selector: (row) => (
        <>
          {row?.interviewStatus === "scheduled" ? row?.interviews?.date : null}
        </>
      ),
    },
    {
      name: "Scheduled By",
      selector: (row) => <>{row?.interviews?.users?.name}</>,
    },
    {
      name: "Create_AT",
      selector: (row) => row?.createdAt?.slice(0, 10),
    },
    {
      name: "Latest Comment",
      minWidth: "220px",
      cell: (row) => {
        const text = row?.latestInternalComment?.comment;
        if (!text) return "-";
        return (
          <span title={text}>
            {text.length > 60 ? `${text.slice(0, 60)}...` : text}
          </span>
        );
      },
    },
    {
      name: "Comment Date",
      minWidth: "140px",
      selector: (row) => {
        const createdAt = row?.latestInternalComment?.createdAt;
        if (!createdAt) return "-";
        const m = moment(createdAt);
        if (!m.isValid()) return "-";
        if (m.isSame(moment(), "day")) {
          return `Today ${m.format("h:mm A")}`;
        }
        return m.format("DD MMM YYYY h:mm A");
      },
    },
    {
      name: "Commented By",
      minWidth: "120px",
      selector: (row) =>
        row?.latestInternalComment?.authorName || "-",
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
      name: "gender",
      selector: (row) => row?.gender,
    },
    {
      name: "City",
      selector: (row) => row?.city,
    },
    {
      name: "Address",
      selector: (row) => row?.street,
    },
    {
      name: "Job Category",
      selector: (row) => row?.professional?.jobCategory?.jobCategory,
    },
    {
      name: "Experience",
      selector: (row) => row?.professional?.experienceInyear,
    },
    {
      name: "Qualification Held",
      selector: (row) => row?.professional?.highestQualification,
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
      name: "resume",
      cell: (row) => {
        return row?.resume !== null && row?.resume?.length > 0 ? (
          <>
            <div
              style={{ color: "#7F8487", cursor: "pointer" }}
              onClick={() => openCandidateResume(row?.resume)}
            >
              <FileText />
            </div>
          </>
        ) : (
          "-"
        );
      },
    },
    {
      name: "image",
      cell: (row) => {
        return row?.image?.length > 0 ? (
          <>
            <div
              style={{ color: "#7F8487", cursor: "pointer" }}
              onClick={() => window.open(row.image)}
            >
              <Image />
            </div>
          </>
        ) : (
          "null"
        );
      },
    },
    {
      name: "Whatsapp",
      cell: (row) => {
        return row?.mobile > 0 ? (
          <>
            <a
              onClick={() => window.open(`https://wa.me/91${row?.mobile}`)}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <img src={whatsapp} style={{ height: "20%", width: "20%" }} />
            </a>
          </>
        ) : (
          "null"
        );
      },
    },
  ];

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
              style={{ backgroundColor: themecolor }}
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
      name: "Profile Completion",
      minWidth: "160px",
      cell: (row) => renderProfileCompletion(row),
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
      cell: (row) => {
        return (
          <>
            <a
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://wa.me/91${row?.mobile}`);
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
      name: "Interview Shedule",
      cell: (row) => (
        <Button
          disabled={row?.interview_request?.isdisabled == true ? true : false}
          onClick={() => {
            setLoading(true);
            interviewRequest(row);
          }}
          style={
            row?.interview_request?.isdisabled == true
              ? {
                opacity: "0.5",
                padding: "10px",
                backgroundColor: themecolor,
                color: "white",
              }
              : { padding: "10px", backgroundColor: themecolor, color: "white" }
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
        // if (user?.email != 'gunjan@growworkinfotech.com') {
        //   return null
        // }

        return row?.resume !== "null" && row?.resume !== null ? (
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
              style={{ backgroundColor: themecolor }}
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
      name: "Profile Completion",
      minWidth: "160px",
      cell: (row) => renderProfileCompletion(row),
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
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://wa.me/91${row?.mobile}`);
              }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <img src={whatsapp} style={{ height: "20%", width: "20%" }} />
            </a>
          </>
        );
      },
    },
    // {
    //   auth.user.subscription.active_plan
    // }

    {
      name: "resume",
      cell: (row) => {
        return row?.resume !== "null" && row?.resume !== null ? (
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

  const resumeCacheKey = (file) =>
    `${file?.name || "resume"}_${file?.size || 0}`;

  const buildPayloadFromParsed = (parsed, file) => {
    const address = resolveIndianAddress({
      state: parsed.state || "",
      city: parsed.city || "",
      stateId: "",
      cityId: "",
    });
    return {
      firstname: parsed.firstname || "",
      lastname: parsed.lastname || "",
      mobile: parsed.mobile || "",
      alternateMobile: parsed.alternateMobile || "",
      email: parsed.email || "",
      gender: parsed.gender || "",
      dateOfBirth: parsed.dateOfBirth || "",
      street: parsed.street || "",
      area: parsed.area || "",
      city: address.city,
      cityId: address.cityId,
      state: address.state,
      stateId: address.stateId,
      linkedinProfile: parsed.linkedinProfile || "",
      portfolioWebsite: parsed.portfolioWebsite || "",
      languages: parsed.languages || "",
      certifications: parsed.certifications || "",
      industry: parsed.industry || "",
      education: parsed.education || [],
      professional: parsed.professional || {},
      industries_relation: [],
      resume: file,
      userId: candidate?.userId,
    };
  };

  const parseResumeFile = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const result = await apiCall.post("/candidate/parse-resume", formData);
      if (result?.success) return result.data || {};
    } catch (e) {
      try {
        const pubRes = await apiCall.post("/candidate/publicParseResume", formData);
        if (pubRes?.success) return pubRes.data || {};
      } catch (e2) {}
    }
    return null;
  };

  const hasResumeMergeValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") {
      if (value instanceof File || value instanceof Blob) return true;
      return Object.values(value).some(hasResumeMergeValue);
    }
    return true;
  };

  const mergeResumeObjects = (existing, incoming) => {
    const base =
      existing && typeof existing === "object" ? { ...existing } : {};
    if (!incoming || typeof incoming !== "object") return base;
    const merged = { ...base };
    for (const [key, value] of Object.entries(incoming)) {
      if (!hasResumeMergeValue(value)) continue;
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof File) &&
        !(value instanceof Blob) &&
        typeof merged[key] === "object" &&
        merged[key] !== null &&
        !Array.isArray(merged[key])
      ) {
        merged[key] = mergeResumeObjects(merged[key], value);
      } else {
        merged[key] = value;
      }
    }
    return merged;
  };

  const mergeResumeUpdateWithExisting = (existing, parsedPayload) => {
    if (!existing) return parsedPayload;
    const merged = mergeResumeObjects(existing, parsedPayload);
    if (parsedPayload?.resume) merged.resume = parsedPayload.resume;
    if (!hasResumeMergeValue(parsedPayload?.industries_relation)) {
      merged.industries_relation = existing.industries_relation || [];
    }
    if (!hasResumeMergeValue(parsedPayload?.education)) {
      merged.education = existing.education;
    }
    if (!hasResumeMergeValue(parsedPayload?.experience)) {
      merged.experience = existing.experience;
    }
    return merged;
  };

  const findExistingCandidateRecord = (existingId) => {
    const id = String(existingId || "").trim();
    if (!id) return null;
    const pools = [
      ...(candidates?.results || []),
      ...(candidateList || []),
    ];
    return (
      pools.find((row) => String(row?.id || row?._id || "") === id) || null
    );
  };

  const fetchExistingCandidateRecord = async (existingId) => {
    const cached = findExistingCandidateRecord(existingId);
    if (cached) return cached;
    try {
      const resp = await getCandidateAPI({
        page: 1,
        perPage: 1,
        filterData: { id: existingId },
      });
      return resp?.results?.[0] || null;
    } catch (err) {
      return null;
    }
  };

  const buildCandidateFormData = (data, resumeFile, options = {}) => {
    const isUpdate = options?.isUpdate === true;
    const fm = new FormData();
    const skipKeys = [
      "resumeFiles",
      "resumeParsedAt",
      "resumeParseCache",
      "userId",
      "education",
      "experience",
      "id",
      "_id",
      "resume",
      "professional",
      "industries_relation",
      "createdAt",
      "updatedAt",
      "agencyId",
      "interviewStatus",
      "interviewStatusUpdate",
      "interviewerId",
      "interviews",
      "whatsappMsg",
      "isdeleted",
      "status",
      "jobOpeningId",
      "appliedStatus",
      "matchScore",
      "client",
      "jobCategory",
      "industries",
      "agency",
      "role",
      "subscription",
    ];
    for (const key in data) {
      if (skipKeys.includes(key)) continue;
      if (data[key] === undefined || data[key] === null || data[key] === "") continue;
      // Avoid sending nested objects as "[object Object]"
      if (typeof data[key] === "object" && !(data[key] instanceof File) && !(data[key] instanceof Blob)) {
        continue;
      }
      fm.append(key, data[key]);
    }
    if (
      !isUpdate ||
      hasResumeMergeValue(
        data?.professional && typeof data.professional === "object"
          ? data.professional
          : null
      )
    ) {
      fm.append(
        "professional",
        JSON.stringify(
          data?.professional && typeof data.professional === "object"
            ? data.professional
            : {}
        )
      );
    }
    if (
      !isUpdate ||
      (Array.isArray(data?.industries_relation) &&
        data.industries_relation.length > 0)
    ) {
      fm.append(
        "industries_relation",
        JSON.stringify(
          Array.isArray(data?.industries_relation) ? data.industries_relation : []
        )
      );
    }
    if (Array.isArray(data?.education) && data.education.length > 0) {
      fm.append("education", JSON.stringify(data.education));
    }
    if (Array.isArray(data?.experience) && data.experience.length > 0) {
      fm.append("experience", JSON.stringify(data.experience));
    }
    if (resumeFile) {
      fm.append("resume", resumeFile);
    }
    return fm;
  };

  const buildCandidateUpdateFormData = (data, resumeFile, candidateId) => {
    const fm = buildCandidateFormData(data, resumeFile, { isUpdate: true });
    fm.append("id", candidateId);
    fm.append("status", "view");
    return fm;
  };

  const askDuplicateResumeAction = (fileLabel, existingCandidate) => {
    const name = `${existingCandidate?.firstname || ""} ${existingCandidate?.lastname || ""}`.trim();
    return new Promise((resolve) => {
      duplicateResolveRef.current = resolve;
      setDuplicateResumeModal({
        open: true,
        fileLabel,
        candidateName: name || "Existing candidate",
        mobile: existingCandidate?.mobile || "",
        email: existingCandidate?.email || "",
        matchOn: existingCandidate?.matchOn || "",
      });
    });
  };

  const closeDuplicateResumeModal = (action) => {
    setDuplicateResumeModal({
      open: false,
      fileLabel: "",
      candidateName: "",
      mobile: "",
      email: "",
      matchOn: "",
    });
    if (duplicateResolveRef.current) {
      duplicateResolveRef.current(action);
      duplicateResolveRef.current = null;
    }
  };

  const existingCandidateId = (existing) =>
    String(existing?.id || existing?._id || "").trim();

  const isDuplicateCreateResult = (result) =>
    Boolean(
      result?.duplicate ||
        /already in used|already exists|already registered/i.test(
          String(result?.error || result?.msg || "")
        )
    );

  const handleDuplicateCandidate = async (fileLabel, payloadData, file, existing) => {
    const existingId = existingCandidateId(existing);
    const action = await askDuplicateResumeAction(fileLabel, existing || {});
    if (action !== "update") {
      return { kind: "skip" };
    }
    if (!existingId) {
      return {
        kind: "fail",
        reason: `${fileLabel}: existing candidate id missing, cannot update`,
      };
    }
    const existingRecord = await fetchExistingCandidateRecord(existingId);
    const mergedPayload = mergeResumeUpdateWithExisting(
      existingRecord,
      payloadData
    );
    const updateFm = buildCandidateUpdateFormData(
      mergedPayload,
      file,
      existingId
    );
    const updateResult = await updateCandidateAPI({ data: updateFm });
    if (updateResult?.msg && !updateResult?.error) {
      return { kind: "update" };
    }
    return {
      kind: "fail",
      reason: `${fileLabel}: ${
        updateResult?.error ||
        updateResult?.constraint ||
        updateResult?.msg ||
        "update failed"
      }`,
    };
  };

  const CandidateCreateHandler = async () => {
    const isResumeUploadPage = params?.pathname === `/${slug}/candidate`;
    const resumeFiles =
      Array.isArray(candidate?.resumeFiles) && candidate.resumeFiles.length > 0
        ? candidate.resumeFiles.filter(Boolean)
        : candidate?.resume
          ? [candidate.resume]
          : [];

    // Resume upload page: create one candidate per file; skip duplicates
    if (isResumeUploadPage && resumeFiles.length > 0) {
      let successCount = 0;
      let updateCount = 0;
      let skipCount = 0;
      let failCount = 0;
      const failReasons = [];
      setBulkUploadProgress({
        active: true,
        current: 0,
        total: resumeFiles.length,
        label: "",
        phase: "",
      });

      for (let i = 0; i < resumeFiles.length; i++) {
        const file = resumeFiles[i];
        const fileLabel = file?.name || `Resume ${i + 1}`;
        setBulkUploadProgress({
          active: true,
          current: i + 1,
          total: resumeFiles.length,
          label: fileLabel,
          phase: "processing",
        });
        try {
          let payloadData;
          const cachedRaw = candidate?.resumeParseCache?.[resumeCacheKey(file)];
          if (i === 0 && candidate?.resumeParsedAt) {
            payloadData = { ...candidate, resume: file };
          } else if (cachedRaw) {
            const parsed = normalizeExtractedResume(cachedRaw, course);
            payloadData = buildPayloadFromParsed(parsed, file);
          } else {
            setBulkUploadProgress({
              active: true,
              current: i + 1,
              total: resumeFiles.length,
              label: fileLabel,
              phase: "parsing",
            });
            const parsedRaw = await parseResumeFile(file);
            if (!parsedRaw) {
              failCount += 1;
              failReasons.push(`${fileLabel}: could not extract data`);
              continue;
            }
            const parsed = normalizeExtractedResume(parsedRaw, course);
            payloadData = buildPayloadFromParsed(parsed, file);
          }

          const missingEmail = !String(payloadData?.email || "").trim();
          const missingPhone = !String(payloadData?.mobile || "").trim();
          if (missingEmail || missingPhone) {
            failCount += 1;
            if (missingEmail && missingPhone) {
              failReasons.push(
                `${fileLabel}: email is not in this resume and phone is not in this resume`
              );
            } else if (missingEmail) {
              failReasons.push(`${fileLabel}: email is not in this resume`);
            } else {
              failReasons.push(`${fileLabel}: phone is not in this resume`);
            }
            continue;
          }

          setBulkUploadProgress({
            active: true,
            current: i + 1,
            total: resumeFiles.length,
            label: fileLabel,
            phase: "uploading",
          });

          let existing = null;
          let isDuplicate = false;
          try {
            const check = await checkCandidatePublicAPI({
              email: payloadData?.email || "",
              mobile: payloadData?.mobile || "",
            });
            if (isDuplicateCreateResult(check)) {
              isDuplicate = true;
              existing = check?.existingCandidate || {
                email: payloadData?.email || "",
                mobile: payloadData?.mobile || "",
                matchOn: payloadData?.email ? "email" : "mobile",
              };
            }
          } catch (checkErr) {
            console.warn("duplicate check failed, falling back to create", checkErr);
          }

          if (isDuplicate) {
            const dupResult = await handleDuplicateCandidate(
              fileLabel,
              payloadData,
              file,
              existing
            );
            if (dupResult.kind === "update") updateCount += 1;
            else if (dupResult.kind === "skip") skipCount += 1;
            else {
              failCount += 1;
              failReasons.push(dupResult.reason);
            }
            continue;
          }

          const fm = buildCandidateFormData(payloadData, file);
          const result = await createCandidateAPI(fm);
          if (result?.id && !isDuplicateCreateResult(result)) {
            successCount += 1;
          } else if (isDuplicateCreateResult(result)) {
            const dupResult = await handleDuplicateCandidate(
              fileLabel,
              payloadData,
              file,
              result?.existingCandidate || {}
            );
            if (dupResult.kind === "update") updateCount += 1;
            else if (dupResult.kind === "skip") skipCount += 1;
            else {
              failCount += 1;
              failReasons.push(dupResult.reason);
            }
          } else {
            failCount += 1;
            failReasons.push(
              `${fileLabel}: ${result?.error || result?.constraint || "create failed"}`
            );
          }
        } catch (e) {
          failCount += 1;
          failReasons.push(
            `${fileLabel}: ${e?.response?.data?.error || e?.message || "create failed"}`
          );
        }
        setBulkUploadProgress({
          active: true,
          current: i + 1,
          total: resumeFiles.length,
          label: fileLabel,
          phase: "processing",
        });
      }

      setBulkUploadProgress({
        active: false,
        current: 0,
        total: 0,
        label: "",
        phase: "",
      });

      if (successCount > 0 || updateCount > 0) {
        if (successCount > 0) {
          tostifySuccess(
            `${successCount} candidate${successCount > 1 ? "s" : ""} added — welcome msg API called for each mobile`
          );
        }
        if (updateCount > 0) {
          tostifySuccess(
            `${updateCount} candidate resume${updateCount > 1 ? "s" : ""} updated`
          );
        }
        const resp = await getCandidateAPI({
          page: currentPage,
          perPage: perPage,
          filterData: [],
        });
        dispatch({
          type: CandidateActions.SET_CANDIDATE,
          payload: resp,
        });
        setShow(false);
        setCreate(false);
        setUpdate(false);
      }
      if (skipCount > 0) {
        tostifyInfo(
          `${skipCount} resume${skipCount > 1 ? "s" : ""} skipped`
        );
      }
      if (failCount > 0) {
        tostifyError(
          failReasons.length
            ? failReasons.slice(0, 2).join(" | ")
            : `${failCount} resume${failCount > 1 ? "s" : ""} failed to add`
        );
      }
      // All skipped / none created — still close popup after feedback
      if (successCount === 0 && updateCount === 0) {
        setShow(false);
        setCreate(false);
        setUpdate(false);
      }
      return;
    }

    setLoading(true);
    let education = [];
    if (candidate?.education) {
      education = candidate?.education?.filter((items) => {
        delete items.eng;
        return items;
      });
    }
    const experience = [];

    candidate?.experience?.map((ele) => {
      if (
        ele.occupation !== "" ||
        ele.summary !== "" ||
        ele.workduration !== "" ||
        ele.companyName !== "" ||
        ele.companyAddress !== "" ||
        ele.companyMobile !== "" ||
        ele.companyLink !== ""
      ) {
        experience.push(ele);
      }
    });
    setEducation(candidate?.education);
    setExperience(candidate?.experience);
    delete candidate.education;
    delete candidate.experience;

    // Only use AWS upload if bucket is configured; otherwise pass files directly to backend FormData
    const awsBucket = process.env.REACT_APP_AWS_BUCKET_NAME;
    if (awsBucket && candidate?.image && typeof candidate.image === 'object') {
      const resp = await awsUploadAssetsWithResp(candidate?.image);
      candidate.image = `${resp.url}`;
    }
    if (awsBucket && candidate?.resume && typeof candidate.resume === 'object') {
      const resp = await awsUploadAssetsWithResp(candidate?.resume);
      candidate.resume = `${resp.url}`;
    }
    const fm = new FormData();
    for (const key in candidate) {
      if (key === "professional") {
        fm.append("professional", JSON.stringify(candidate[key]));
      } else if (key === "industries_relation") {
        fm.append("industries_relation", JSON.stringify(candidate[key]));
      } else if (key === "userId") {
        // Skip appending userId to FormData
        continue;
      } else if (key === "resumeParsedAt") {
        // Skip internal tracking fields
        continue;
      } else if (key === "resumeFiles") {
        continue;
      } else {
        fm.append(key, candidate[key]);
      }
    }

    if (education?.length > 0)
      fm.append("education", JSON.stringify(education));
    if (experience?.length > 0)
      fm.append("experience", JSON.stringify(experience));

    // Applied Candidates page: attach job so backend creates JobApplication link
    if (isAppliedCandidates && jobId) {
      fm.append("jobOpeningId", jobId);
    }

    setLoading(true);
    await dispatch({
      type: CandidateActions.CREATE_CANDIDATE,
      payload: {
        data: fm,
        setLoading,
        page: currentPage,
        perPage: perPage,
        ...(isAppliedCandidates && jobId ? { jobId } : {}),
      },
    });
  };

  const CandidateUpdateHandler = async () => {
    setLoading(true);
    delete candidate.interviews;

    const data = candidates?.results?.filter(
      (item) => item?.id == candidate?.id
    );
    const ObjData = Object.assign({}, ...data);
    console.info("--------------------");
    console.info("ObjDataObjDataObjData => ", ObjData);
    console.info("--------------------");
    console.info("--------------------");
    console.info("ObjDataObjDataObjData => ", candidate);
    console.info("--------------------");
    const isMatch = _.isMatch(ObjData, candidate);

    if (isMatch == false) {
      const typeResume = typeof candidate?.resume;
      const typeImage = typeof candidate?.image;

      const awsBucketUpdate = process.env.REACT_APP_AWS_BUCKET_NAME;

      if (typeImage === "object" && candidate?.image !== null) {
        if (awsBucketUpdate) {
          const resp = await awsUploadAssetsWithResp(candidate?.image);
          candidate.image = `${resp.url}`;
        }
        // if no bucket configured, leave as File object for FormData to send to backend
      }

      if (typeResume === "object" && candidate?.resume !== null) {
        if (awsBucketUpdate) {
          const resp = await awsUploadAssetsWithResp(candidate?.resume);
          candidate.resume = `${resp.url}`;
        }
        // if no bucket configured, leave as File object for FormData to send to backend
      }

      const fm = new FormData();
      for (const key in candidate) {
        if (key === "professional") {
          fm.append("professional", JSON.stringify(candidate[key]));
        } else if (key === "industries_relation") {
          fm.append("industries_relation", JSON.stringify(candidate[key]));
        } else if (key === "status") {
          fm.append(key, "view");
        } else if (key === "resumeParsedAt") {
          continue;
        } else if (key === "resumeFiles") {
          continue;
        } else {
          fm.append(key, candidate[key]);
        }
      }

      await dispatch({
        type: CandidateActions.UPDATE_CANDIDATE,
        payload: {
          id: candidate.id,
          data: fm,
          page: currentPage,
          perPage: perPage,
        },
      });
      setShow(false);
    } else {
      setLoading(false);
    }
  };

  const Validations = async () => {
    const error = false;
    if (params?.pathname === `/${slug}/candidate`) {
      const hasResume =
        (Array.isArray(candidate?.resumeFiles) &&
          candidate.resumeFiles.length > 0) ||
        !!candidate?.resume;
      if (!hasResume) {
        return tostify("Please select at least one resume file");
      }
      return error;
    }
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    // Resume autofill often sets state/city names without IDs — resolve before checks
    const resolvedAddress = resolveIndianAddress({
      state: candidate?.state,
      stateId: candidate?.stateId,
      city: candidate?.city,
      cityId: candidate?.cityId,
    });
    if (
      resolvedAddress.stateId &&
      (candidate?.stateId !== resolvedAddress.stateId ||
        candidate?.cityId !== resolvedAddress.cityId)
    ) {
      setCandidate((prev) => {
        const base = Array.isArray(prev) ? {} : prev || {};
        return { ...base, ...resolvedAddress };
      });
    }

    if (candidate?.firstname?.length < 2 || candidate?.firstname === undefined)
      return tostify("Please Enter Valid First Name", error);
    else if (
      candidate?.lastname?.length < 2 ||
      candidate?.lastname === undefined
    )
      return tostify(" Please Enter Valid Last Name", error);
    else if (!email || regex.test(email) === false)
      return tostify("  Please Enter Valid Email", error);
    else if (
      candidate?.mobile?.replace(/\D/g, "")?.length !== 10 ||
      candidate?.mobile === undefined
    )
      return tostify("Please Enter Valid Contact Number", error);
    else if (
      candidate?.alternateMobile?.replace(/\D/g, "")?.length !== 10 ||
      candidate?.alternateMobile === undefined
    )
      return tostify("Please Enter Valid Alternative Number", error);
    else if (gender === null || candidate?.gender === undefined)
      return tostify("Please Select Gender", error);
    else if (
      !resolvedAddress.state ||
      !resolvedAddress.stateId ||
      resolvedAddress.state.length === 0 ||
      resolvedAddress.stateId.length === 0
    )
      return tostify("Please Enter Valid State", error);
    else if (
      !resolvedAddress.city ||
      !resolvedAddress.cityId ||
      resolvedAddress.city.length === 0 ||
      resolvedAddress.cityId.length === 0
    )
      return tostify("Please Enter Valid City", error);
    else if (
      candidate?.industries_relation?.length === 0 ||
      candidate?.industries_relation === undefined
    )
      return tostify(" Please Select Industries", error);
    else if (
      candidate?.professional?.highestQualification === undefined ||
      candidate?.professional?.highestQualification?.length === 0
    )
      return tostify("Please Enter Qualification", error);
    else if (
      candidate?.professional?.field === undefined ||
      candidate?.professional?.field?.length === 0
    )
      return tostify("Please Enter Education", error);
    else if (
      candidate?.professional?.designation === undefined ||
      candidate?.professional?.designation?.length === 0
    )
      return tostify("Please Enter Designation", error);
    else if (
      candidate?.professional?.jobCategoryId === undefined ||
      candidate?.professional?.jobCategoryId?.length === 0
    )
      return tostify("Please Enter Job Category", error);
    else if (
      candidate?.professional?.english === undefined ||
      candidate?.professional?.english?.length === 0
    )
      return tostify("Please Enter Speaking Level", error);
    else if (
      candidate?.professional?.preferedJobLocation === undefined ||
      candidate?.professional?.preferedJobLocation?.length === 0
    )
      return tostify("Please Enter Prefered Job Location", error);
    return error;
  };
  const CandidateActionHandler = async () => {
    if (isDisabledAllFields == false) {
      const err = await Validations();
      if (update && err === false) {
        CandidateUpdateHandler();
      }
      if (create && err === false) {
        CandidateCreateHandler();
      }
    }
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    getCandidates(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    const data = { ...filterData };
    if (activeQuickFilter) {
      data.quickFilter = activeQuickFilter;
    }
    if (auth?.user?.clients?.industries?.id) {
      data.industriesId = auth?.user?.clients?.industries?.id;
      // data.interviewStatus = "available"
    }
    // await dispatch({
    //   type: CandidateActions.GET_CANDIDATE,
    //   payload: {
    //     filterData: data,
    //     page,
    //     perPage: newPerPage,
    //     isSavedCandidates: isSavedCandidates,
    //   },
    // });
    if (auth?.user?.clients?.id) {
      if (isSavedCandidates) {
        dispatch({
          type: CandidateActions.GET_SAVED_CANDIDATE,
          payload: {
            filterData: data,
            page,
            perPage,
            isSavedCandidates,
          },
        });
      } else {
        if (bestMatchesCandidate == true) {
          dispatch({
            type: CandidateActions.GET_BEST_MATCHES_CANDIDATE,
            payload: {
              filterData: data,
              page,
              perPage,
              isSavedCandidates,
            },
          });
        } else {
          dispatch({
            type: CandidateActions.GET_CLIENT_CANDIDATE,
            payload: {
              filterData: data,
              page,
              perPage,
              isSavedCandidates,
            },
          });
        }
      }
    } else {
      await dispatch({
        type: CandidateActions.GET_CANDIDATE,
        payload: {
          filterData: data,
          page,
          perPage: newPerPage,
        },
      });
    }
    setPerPage(newPerPage);
  };

  const handleFilter = (filter) => {
    setCurrentPage(1);
    setFilterData(filter || {});
    if (width < 769) {
      filterToggle();
    }
  };

  const handleFilterToggleMode = (filter) => {
    setFilterToggleMode(filter);
  };
  const [clear, setclear] = useState(false);
  const handleClear = () => {
    setCurrentPage(1);
    setJobCategoryId([]);
    setFilterJobCategory([]);
    setclear(true);
  };
  const setclearstate = (clear) => {
    setclear(clear);
  };
  const customStyles = {
    headCells: {
      style: {
        justifyContent: "center",
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

  const filterToggle = () => {
    setFilterToggleMode(!filterToggleMode);
  };

  useEffect(() => {
    if (candidateId) {
      setShow(true);
      setUpdate(true);
      setIndustriesData(candidates?.industries_relation);
      setCandidate(candidates);
      setEmail(candidates?.email);
    }
  }, [candidateId]);

  useEffect(() => {
    setAnimation(false);
  }, [animation]);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Escape") {
        setFilterToggleMode(false);
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  const [hasMore, setHasMore] = useState(true);
  const fetchMoreData = () => {
    const nextPage = 1;
    const perpage1 = perPage + 10;
    handlePerRowsChange(perpage1, nextPage);
  };
  const renderStates = (candidate) => {
    const statesArr = [
      {
        title: "Name",
        value: `${candidate?.firstname} ${candidate?.lastname}` || "-",
      },
      count?.plan?.planName !== "free" &&
      count?.plan?.planName !== "Trial"
        ? {
          title: "Email",
          value: candidate?.email || "-",
        }
        : null,
      count?.plan?.planName !== "free" &&
      count?.plan?.planName !== "Trial"
        ? {
          title: "Contact",
          value: candidate?.mobile || "-",
        }
        : null,
      {
        title: "City",
        value: candidate?.city || "-",
      },
      {
        title: "Job Category",
        value: candidate?.professional?.jobCategory?.jobCategory || "-",
      },
    ].filter(Boolean);

    return statesArr.map((state, index) => (
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
            <strong
              style={{
                fontSize: "12px",
                ...(state.title === "Name"
                  ? {
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                      color: themecolor || "#323D76",
                    }
                  : {}),
              }}
              onClick={
                state.title === "Name"
                  ? () => openViewProfile(candidate)
                  : undefined
              }
              title={state.title === "Name" ? "View Profile" : undefined}
            >
              {state.value}
            </strong>
          </div>
        </div>
        {/* <div
          key={state.title}
          className="browser-states"
          style={{ marginTop: "5px" }}
        >
          <div className="d-flex">
            <h6
              className="align-self-center mb-0 "
              style={{ fontSize: "12px", color: "black", fontWeight: "bold" }}
            >
              {state.title}
            </h6>
          </div>
          <div className="d-flex align-items-center">
            <div
              className="fw-bold text-body-heading "
              style={{ fontSize: "12px" }}
            >
              {state.value}
            </div>
          </div>
        </div> */}
        {/* <hr
          className="invoice-spacing"
          style={{ margin: 0, height: "0.5px" }}
        /> */}
      </>
    ));
  };

  const renderStatesMore = (candidate) => {
    const statesArr = [
      {
        title: "Qualification Held",
        value: candidate?.professional?.highestQualification || "-",
      },
      {
        title: "Experience",
        value: candidate?.professional?.experienceInyear || "-",
      },
      {
        title: "Currant Salary",
        value: candidate?.professional?.currentSalary || "-",
      },
      {
        title: "Expected Salary",
        value: candidate?.professional?.expectedsalary || "-",
      },
      {
        title: "Currently Working",
        value: candidate?.professional?.currentlyWorking || "-",
      },
      {
        title: "Notice Period",
        value: candidate?.professional?.noticePeriod || "-",
      },
      {
        title: "Gender",
        value: candidate?.gender || "-",
      },
      {
        title: "Address",
        value: candidate?.street || "-",
      },
      {
        title: "Preferable Job Location",
        value: candidate?.professional?.preferedJobLocation || "-",
      },
    ];

    return statesArr.map((state, index) => (
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
        {/* <div
          key={state.title}
          className="browser-states"
          style={{ marginTop: "5px" }}
        >
          <div className="d-flex">
            <h6
              className="align-self-center mb-0 "
              style={{ fontSize: "12px", color: "black", fontWeight: "bold" }}
            >
              {state.title}
            </h6>
          </div>
          <div className="d-flex align-items-center">
            <div
              className="fw-bold text-body-heading "
              style={{ fontSize: "12px" }}
            >
              {state.value}
            </div>
          </div>
        </div> */}
      </>
    ));
  };

  const getClientVisibleComments = (candidate) => {
    if (Array.isArray(candidate?.clientVisibleComments)) {
      return candidate.clientVisibleComments.filter((item) => item?.comment);
    }
    if (candidate?.latestInternalComment?.comment) {
      return [candidate.latestInternalComment];
    }
    return [];
  };

  const renderClientVisibleComments = (candidate) => {
    if (!auth?.user?.clients) return null;

    const comments = getClientVisibleComments(candidate);
    if (!comments.length) return null;

    return (
      <div
        style={{
          marginTop: "12px",
          paddingTop: "10px",
          borderTop: "1px solid #eee",
        }}
      >
        <strong style={{ fontSize: "13px", color: "#323D76" }}>
          Recruiter Notes
        </strong>
        {comments.map((item) => (
          <div
            key={item.id || `${item.createdAt}-${item.comment}`}
            style={{
              marginTop: "8px",
              padding: "10px 12px",
              backgroundColor: "#f8f8fc",
              borderRadius: "6px",
            }}
          >
            <p
              style={{
                marginBottom: "4px",
                whiteSpace: "pre-wrap",
                fontSize: "13px",
              }}
            >
              {item.comment}
            </p>
            <span style={{ fontSize: "12px", color: "#6e6b7b" }}>
              - {item.authorName || "Recruiter"}
              {" · "}
              {formatCommentDateTime(item.createdAt)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderStatesTable = (candidate) => {
    const industryCategories =
      candidate?.industries_relation
        ?.map((relation) => relation.industries?.industryCategory)
        .filter(Boolean)
        .join(" | ") || "-";

    const statesArr = [
      {
        title: "Industries",
        value: industryCategories,
      },
      {
        title: "Job Category",
        value: candidate?.professional?.jobCategory?.jobCategory || "-",
      },
      {
        title: "Education",
        value:
          `${candidate?.professional?.field} [${candidate?.professional?.highestQualification}]` ||
          "-",
      },
      {
        title: "Pref. Location",
        value: candidate?.professional?.preferedJobLocation || "-",
      },
      {
        title: "Skills",
        value: candidate?.professional?.skill || "-",
      },
    ];

    return statesArr.map((state, index) => (
      <>
        <div
          key={state.title}
          className="browser-states"
          style={{ marginTop: "10px" }}
        >
          <div className="state-col">
            <Row>
              <Col md={3}>
                <strong
                  style={{
                    fontSize: "16px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  {state.title}:{" "}
                </strong>
              </Col>
              <Col md={9}>
                <strong style={{ fontSize: "16px" }}>{state.value}</strong>
              </Col>
            </Row>
          </div>
        </div>
      </>
    ));
  };

  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const handleDeleteClick = (result) => {
    setCandidateToDelete(result);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    deleteCandidate(candidateToDelete);
    setShowDeleteModal(false);
  };
  const resolvedTotal = bestMatchesCandidate
    ? bestMatchesCandidates?.total
    : isAppliedCandidates
      ? appliedCandidatesTotal || appliedCandidatesList?.length
      : candidates?.total;
  const fallbackTotal =
    bestMatchesCandidate || isAppliedCandidates
      ? candidateList?.length
      : candidates?.results?.length;
  const totalRecords = resolvedTotal ?? fallbackTotal ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / perPage));
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  function filterKey(data) {
    const notIncludedKeys = [
      "industriesId",
      "userId",
      "dataMergePermission",
      "salaryRangeEnd",
      "quickFilter",
    ];
    if (auth?.user?.clients) {
      notIncludedKeys.push("jobCategoryId");
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return [];
    }
    return Object.keys(data).filter((key) => !notIncludedKeys.includes(key));
  }
  const [hoverIndex, setHoverIndex] = useState(0);
  const editStyle = {
    backgroundColor: hoverIndex == 1 && `${themecolor}30`,
    color: hoverIndex == 1 && themecolor,
  };

  const imageStyle = {
    backgroundColor: hoverIndex == 3 && `${themecolor}30`,
    color: hoverIndex == 3 && themecolor,
  };

  const [clientData, setClientData] = useState([]);

  const ProfileImage = ({ imageUrl, gender, email, mobile, candidate }) => {
    const defaultIcon = gender === "female" ? UserPlus : User;

    const [imgError, setImgError] = useState(false);

    useEffect(() => {
      setImgError(false)
    }, [imageUrl])

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          flexDirection: "column",
        }}
      >
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            onError={() => setImgError(true)}
            alt="Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <img
            src={String(gender).toLowerCase() === "male" ? UserMaleIcon : UserFemaleIcon}
            alt="profile icon"
            style={{ height: "100px", width: "100px", borderRadius: "50%" }}
          />
          // <User
          //   size={100}
          //   style={{
          //     borderRadius: "50%",
          //     backgroundColor: "#f0f0f0",
          //     padding: "10px",
          //   }}
          // />
        )}

        {auth?.user?.clients ? (
          count?.plan?.planName === "free" ||
            count?.plan?.planName === "Trial" ? (
            <>
              {" "}
              <Button
                color="light-primary"
                style={{
                  backgroundColor: `${themecolor}`,
                  color: "white",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
                onClick={() => setShowContactDetails(true)}
              >
                Show Contact Details
              </Button>
            </>
          ) : (
            <>
              <div
                // key={state.title}
                className="browser-states"
                style={{ marginTop: "25px" }}
              >
                <div className="state-col">
                  <strong
                    style={{
                      fontSize: "16px",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {email}
                  </strong>
                </div>
                <div
                  className="state-col"
                  style={{ textAlign: "center", marginTop: "10px" }}
                >
                  <strong
                    style={{
                      fontSize: "16px",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {mobile}
                  </strong>
                </div>
              </div>
            </>
          )
        ) : (
          <>
            <div
              // key={state.title}
              className="browser-states"
              style={{ marginTop: "25px" }}
            >
              <div className="state-col">
                <strong
                  style={{
                    fontSize: "16px",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {email}
                </strong>
              </div>
              <div
                className="state-col"
                style={{ textAlign: "center", marginTop: "10px" }}
              >
                <strong
                  style={{
                    fontSize: "16px",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {mobile}
                </strong>
              </div>
            </div>
          </>
        )}

        {hasValidResume(candidate?.resume) ? (
          <Button
            color="defult"
            style={{
              marginTop: "20px",
              backgroundColor: themecolor,
              color: "white",
            }}
            onClick={() => {
              auth?.user?.clients
                ? handleOpenResume(candidate)
                : openCandidateResume(candidate?.resume);
            }}
          >
            View Resume
          </Button>
        ) : (
          <>
            {" "}
            <Button
              color="light-primary"
              style={{
                backgroundColor: `${themecolor}80`,
                color: "white",
                marginTop: "20px",
              }}
            >
              View Resume
            </Button>
          </>
        )}

        {candidate?.createdAt && (
          <div
            className="state-col"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            <strong
              style={{
                fontSize: "16px",
                color: "black",
                fontWeight: "bold",
              }}
            >
              Applied On: {moment(candidate?.createdAt).format("DD-MM-YYYY")}
            </strong>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
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
            To access this feature kindly Contact Uniqueworld Management Team:
            +91 9974877260
          </ModalBody>
        </Modal>
        <Modal
          className="modal-dialog-centered"
          isOpen={isPlanExpireModalOpen}
          onClosed={() => setIsPlanExpireModalOpen(false)}
          on
        >
          <ModalHeader style={{ textAlign: "center" }}>
            {" "}
            Attention !!
          </ModalHeader>
          <ModalBody>Your plan has expire..</ModalBody>
          <ModalFooter>
            <Button
              color="default"
              style={{ backgroundColor: themecolor, color: "white" }}
              onClick={() => {
                setIsPlanExpireModalOpen(false);
                window.localStorage.clear();
                dispatch({
                  type: authActions.SIGN_OUT,
                });
              }}
            >
              Okay
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          className="modal-dialog-centered"
          isOpen={resumeCountFinishError}
        >
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
            <br />
            Contact :{` ${auth?.user?.agency?.phoneNumber}`}
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
              style={{ backgroundColor: themecolor, color: "white" }}
              onClick={() => {
                dispatch({
                  type: subscriptionActions.RESUME_COUNT_FINISH,
                  payload: false,
                });
                history.push(`/${slug}/pricing`);
              }}
            >
              Upgrade Plan
            </Button>
          </ModalFooter>
        </Modal>

        <Modal className="modal-dialog-centered" isOpen={showContactDetails}>
          <ModalHeader toggle={() => setShowContactDetails(false)} />
          <ModalBody>
            You Can't See Contact Details, Please Upgrade Your Plan!!
          </ModalBody>
          <ModalFooter>
            <Button color="link" onClick={() => setShowContactDetails(false)}>
              Close
            </Button>
            <Button
              color="default"
              style={{ backgroundColor: themecolor, color: "white" }}
              onClick={() => {
                setShowContactDetails(false);
                history.push(`/${slug}/pricing`);
              }}
            >
              Upgrade Plan
            </Button>
          </ModalFooter>
        </Modal>
        {/* <Loader loading={promiseLoading || isLoading || loading} /> */}
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
      <div ref={candidateHeaderRef} className="candidate-page-fixed-header">
        <div
          className="filterDataButton"
          style={{
            display: "flex",
            alignItems: "end",
          }}
        >
        <h3 style={{ color: themecolor }}>
          <b>
            {isSavedCandidates
              ? "Saved Candidates"
              : bestMatchesCandidate == true
                ? "Best Matches Candidates"
                : isAppliedCandidates
                  ? "Applied Candidates"
                  : "Candidates"}{" "}
          </b>
        </h3>
        {isAppliedCandidates && appliedCandidatesError && (
          <div className="alert alert-danger mt-2" role="alert">
            {appliedCandidatesError?.message ||
              appliedCandidatesError?.error ||
              (typeof appliedCandidatesError === 'string' ? appliedCandidatesError : 'Access denied')}
          </div>
        )}
        {/* <Marquee>
          <h1>hello</h1>
        </Marquee> */}
        {filterKey(filterData).length > 0 ? (
          <div
            style={{ marginLeft: "auto", display: "flex", alignItems: "end" }}
          >
            {width > 786 ? (
              <h3 style={{ fontSize: "16px", marginBottom: "9px" }}>
                No Of Filter Applied : {filterKey(filterData).length}
              </h3>
            ) : null}

            <Button
              className="add-new-user "
              color="link"
              style={{ color: themecolor }}
              onClick={handleClear}
            >
              {width > 786 ? "Clear" : "Clear Filter"}
            </Button>
            {/* <X size={17} className="mx-1" onClick={handleClear} /> */}
          </div>
        ) : null}
        {!isAppliedCandidates && (
          <Button
            style={
              width > 769
                ? {
                  width: "145px",
                  marginLeft:
                    filterKey(filterData).length > 0 ? "10px" : "auto",
                  backgroundColor: themecolor,
                  color: "white",
                }
                : {
                  width: "60px",
                  marginLeft:
                    filterKey(filterData).length > 0 ? "10px" : "auto",
                  backgroundColor: themecolor,
                  color: "white",
                }
            }
            color="default"
            onClick={() => {
              // setFilterData([]);
              filterToggle();
            }}
          >
            {width > 769 ? "Filter Data" : <FilterIcon size={17} />}
          </Button>
        )}
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
              setCandidate({});
              setIndustriesData([]);
              setCreate(true);
              setUpdate(false);
              setShow(true);
            }}
          >
            <UserPlus size={17} />
          </Button>
        )}
      </div>
      {!isSavedCandidates &&
        !bestMatchesCandidate &&
        !isAppliedCandidates && (
          <CandidateQuickTabs
            activeTab={activeQuickFilter}
            onChange={handleQuickTabChange}
            themecolor={themecolor}
          />
        )}
      <div style={width > 768 ? { display: "none" } : {}}>
        {auth?.user?.clients ? (
          (clientUser?.clients?.id && count?.plan?.planName == "free") ||
            count?.plan?.planName == "Trial" ? (
            //  && user?.email == 'gunjan@growworkinfotech.com'
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div>
                Free Resume Download Remain : {5 - count?.resume_download_count}
              </div>
              <Rating
                readonly
                initialRating={5 - count?.resume_download_count}
                emptySymbol={<Star size={20} fill="#babfc7" stroke="#babfc7" />}
                fullSymbol={
                  <Star size={20} fill={"#323D76"} stroke={"#323D76"} />
                }
              />
            </div>
          ) : null
        ) : (
          <CustomHeader
            filterData={filterData}
            setFilterData={setFilterData}
            setShow={setShow}
            setCreate={setCreate}
            store={candidates?.results}
            onAddNew={() => {
              setCandidate({});
              setIndustriesData([]);
              setCreate(true);
              setUpdate(false);
              setShow(true);
            }}
          />
        )}
      </div>
      {width > 768 ? (
        <div className="candidate-page-search-row">
          <div className="candidate-page-content-width">
            {auth?.user?.clients ? (
              (clientUser?.clients?.id && count?.plan?.planName == "free") ||
                count?.plan?.planName == "Trial" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    Free Resume Download Remain :{" "}
                    {5 - count?.resume_download_count}
                  </div>
                  <Rating
                    readonly
                    initialRating={5 - count?.resume_download_count}
                    emptySymbol={
                      <Star size={20} fill="#babfc7" stroke="#babfc7" />
                    }
                    fullSymbol={
                      <Star size={20} fill={"#323D76"} stroke={"#323D76"} />
                    }
                  />
                </div>
              ) : null
            ) : (
              <CustomHeader
                filterData={filterData}
                setFilterData={setFilterData}
                setShow={setShow}
                setCreate={setCreate}
                store={candidates?.results}
                onAddNew={() => {
                  setCandidate({});
                  setIndustriesData([]);
                  setCreate(true);
                  setUpdate(false);
                  setShow(true);
                }}
              />
            )}
          </div>
        </div>
      ) : null}
      </div>

      <div ref={candidateListContainerRef} className="candidate-page-list-container">
      <Row
        className="candidate-page-row"
        style={{ height: "100%", transition: "all 0.5s ease-in-out" }}
      >
        {!isAppliedCandidates && (
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
              filterJobCategory={filterJobCategory}
              isSavedCandidates={isSavedCandidates}
              handleFilterToggleMode={handleFilterToggleMode}
              clear={clear}
              setclear={setclearstate}
              open={filterToggleMode}
              toggleSidebar={filterToggle}
              setJobCategoryId={setJobCategoryId}
              setFilterJobCategory={setFilterJobCategory}
              setLoading={setLoading}
              filterData={filterData}
              setFilterToggleMode={setFilterToggleMode}
              setFilterData={setFilterData}
              handleFilter={handleFilter}
              filterKey={filterKey}
            />
          </Col>
        )}

        <Col
          sm={12}
          md={isAppliedCandidates ? 12 : 9}
          lg={12}
          xl={12}
          style={
            width <= 768
              ? {
                paddingLeft: 0,
                paddingRight: 0,
              }
              : { paddingLeft: 0, paddingRight: 0 }
          }
        >
          {" "}
          {width < 786 && (isAppliedCandidates ? isAppliedCandidatesLoading : loading == true) ? (
            <ComponentSpinner
              isClientCandidate={true}
              theamcolour={themecolor}
            />
          ) : (
            <>
              {(isAppliedCandidates ? candidateList?.length > 0 : candidates?.results?.length > 0) ? (
                <>
                  {(isAppliedCandidates ? candidateList : candidates?.results)?.map((result, index) => {
                    let color = "light-success";
                    if (result?.interviewStatus === "available")
                      color = "light-warning";
                    else if (result?.interviewStatus === "scheduled")
                      color = "light-info";
                    else if (result?.interviewStatus === "rejected")
                      color = "light-danger";
                    else if (result?.interviewStatus === "hold")
                      color = "secondary";
                    else if (result?.interviewStatus === "completed")
                      color = "light-secondary";
                    else if (result?.interviewStatus === "cv shared")
                      color = "secondary";
                    else if (result?.interviewStatus === "hired")
                      color = "light-success";
                    else if (result?.interviewStatus === "Not Joined It")
                      color = "warning";
                    else if (result?.interviewStatus === "Left")
                      color = "light-info";
                    else if (result?.interviewStatus === "shortlisted")
                      color = "info";
                    else if (result?.interviewStatus === "trail")
                      color = "dark";
                    else if (result?.interviewStatus === "reschedule")
                      color = "warning";

                    return (
                      <>
                        {/* <Loader loading={loading} /> */}

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
                                  pill
                                  color="defult"
                                  style={{
                                    fontSize: "12px",
                                    backgroundColor:
                                      result.status === "new"
                                        ? themecolor
                                        : `${themecolor}80`,
                                  }}
                                  className="column-action d-flex align-items-center"
                                >
                                  {result.status}
                                </Badge>
                                {auth?.user?.clients ? null : (
                                  <Badge
                                    Badge
                                    style={{
                                      fontSize: "12px",
                                    }}
                                    pill
                                    color={color}
                                    className="column-action d-flex align-items-center"
                                  >
                                    {result.interviewStatus}
                                  </Badge>
                                )}
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
                              {renderFavoriteStar(result, 17)}
                              {auth?.user?.clients ? (
                                result?.interview_request?.isdisabled == true ||
                                  count?.plan?.planName === "free" ||
                                  count?.plan?.planName === "Trial" ? null : (
                                  <div
                                    style={{
                                      color: "#7F8487",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setLoading(true);
                                      interviewRequest(result);
                                    }}
                                  >
                                    <Calendar className="mx-1" size={17} />
                                  </div>
                                )
                              ) : (
                                <div
                                  onClick={() => {
                                    history.push(
                                      `/${slug}/interview?id=${result.id}&first=${result.firstname}&last=${result.lastname}`
                                    );
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <UserCheck size={17} className="mx-1" />
                                </div>
                              )}

                              {result?.resume !== null &&
                                result?.resume?.length > 0 && (
                                  <div
                                    style={{
                                      color: "#7F8487",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      auth?.user?.clients
                                        ? handleOpenResume(result)
                                        : openCandidateResume(result?.resume);
                                    }}
                                  // onClick={() => openCandidateResume(result?.resume)}
                                  >
                                    <FileText className="mx-1" size={17} />
                                  </div>
                                )}
                              {result?.mobile && (
                                <a
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(
                                      `https://wa.me/91${result?.mobile}`
                                    );
                                  }}
                                >
                                  <img
                                    className="mx-1"
                                    src={whatsapp}
                                    style={{ height: "17px", width: "17px" }}
                                  />
                                </a>
                              )}
                            </div>
                            {auth?.user?.clients ? null : (
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
                                    style={editStyle}
                                    onMouseEnter={() => setHoverIndex(1)}
                                    onMouseLeave={() => setHoverIndex(0)}
                                    className="w-100"
                                    onClick={async () => {
                                      if (
                                        result?.agency?.email ==
                                        user?.agency?.email ||
                                        user?.email == allAccessEmail
                                      ) {
                                        setCandidate(result);
                                        setIndustriesData(
                                          result?.industries_relation
                                        );
                                        statusUpdate(result);
                                        setEmail(result?.email);
                                        setUpdate(true);
                                        setShow(true);
                                      } else {
                                        setIsDisabledAllFields(true);
                                        setCandidate(result);
                                        setIndustriesData(
                                          result?.industries_relation
                                        );
                                        statusUpdate(result);
                                        setEmail(result?.email);
                                        setUpdate(true);
                                        setShow(true);
                                      }
                                    }}
                                  >
                                    Edit
                                  </DropdownItem>
                                  <DropdownItem
                                    className="w-100"
                                    // style={deleteStyleStyle}
                                    onMouseEnter={() => setHoverIndex(2)}
                                    onMouseLeave={() => setHoverIndex(0)}
                                    style={
                                      result?.agency?.email ==
                                        user?.agency?.email ||
                                        user?.email == allAccessEmail
                                        ? {
                                          cursor: "pointer",
                                          backgroundColor:
                                            hoverIndex == 2 &&
                                            `${themecolor}30`,
                                          color:
                                            hoverIndex == 2 && themecolor,
                                        }
                                        : {
                                          pointerEvents: "none",
                                          opacity: "0.6",
                                          backgroundColor:
                                            hoverIndex == 2 &&
                                            `${themecolor}30`,
                                          color:
                                            hoverIndex == 2 && themecolor,
                                        }
                                    }
                                    onClick={() => {
                                      if (
                                        result?.agency?.email ==
                                        user?.agency?.email ||
                                        user?.email == allAccessEmail
                                      ) {
                                        handleDeleteClick(result);
                                      }
                                    }}
                                  >
                                    Delete
                                  </DropdownItem>
                                  {result?.image?.length > 0 && (
                                    <DropdownItem
                                      style={imageStyle}
                                      onMouseEnter={() => setHoverIndex(3)}
                                      onMouseLeave={() => setHoverIndex(0)}
                                      className="w-100"
                                      onClick={() => window.open(result?.image)}
                                    >
                                      Image
                                    </DropdownItem>
                                  )}
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            )}
                          </CardHeader>
                          <CardBody
                            style={{
                              padding: "0.5rem 0.5rem",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {renderStates(result)}{" "}
                            {renderClientVisibleComments(result)}
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
                      </>
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
            (isAppliedCandidates || bestMatchesCandidate ? candidateList?.length > 0 : candidates?.results?.length > 0) && (
              <Pagination className="d-flex mt-3 align-items-center justify-content-center">
                <PaginationItem disabled={!hasPrevPage}>
                  <PaginationLink
                    previous
                    href="#"
                    onClick={() =>
                      hasPrevPage && handlePageChange(currentPage - 1)
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

                <PaginationItem disabled={!hasNextPage}>
                  <PaginationLink
                    next
                    href="#"
                    onClick={() =>
                      hasNextPage && handlePageChange(currentPage + 1)
                    }
                  >
                    Next <ChevronRight size={15} />
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            )}
          <div
            className="react-dataTable"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div className="candidate-page-content-width">
            {width > 768 && selectedCandidateIds.length > 0 && (
              <div className="candidate-selection-bar">
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomePageSelected;
                    }}
                    onChange={(e) => {
                      if (e.target.checked) selectAllPageCandidates();
                      else clearAllSelectedCandidates();
                    }}
                    style={{ cursor: "pointer", width: 18, height: 18 }}
                  />
                  <UncontrolledDropdown>
                    <DropdownToggle
                      tag="button"
                      type="button"
                      className="candidate-selection-menu-toggle"
                    >
                      <ChevronDown size={14} />
                      <span className="candidate-selection-count">
                        {selectedCandidateIds.length} selected
                      </span>
                    </DropdownToggle>
                    <DropdownMenu className="candidate-selection-menu">
                      <DropdownItem onClick={selectAllPageCandidates}>
                        All
                      </DropdownItem>
                      <DropdownItem onClick={clearAllSelectedCandidates}>
                        None
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>
            )}
            {/* <Card
            className="overflow-hidden"
            style={width < 769 ? { display: "none" } : {}}
          > */}

            {/* <DataTable
                paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                // paginationComponentOptions={paginationComponentOptions}
                selectableRows={auth?.user?.role?.name === "Admin" && true}
                // selectableRowsNoSelectAll={true}
                selectableRowsHighlight
                // clearSelectedRows={isSent || isNotSent}
                onSelectedRowsChange={(e) => {
                  handleselected(e);
                  // setTimeout(() => {
                  setPromiseLoading(true);
                  // }, 10);
                }}
                fixedHeader={true}
                progressPending={
                  isAppliedCandidates
                    ? isAppliedCandidatesLoading
                    : (loading && !bulkUploadProgress.active) || getSavedCandidateLoader
                }
                progressComponent={
                  <ComponentSpinner
                    isClientCandidate={true}
                    theamcolour={themecolor}
                  />
                }
                fixedHeaderScrollHeight="500px"
                noHeader
                subHeader
                sortServer
                pagination
                responsive
                // progressPending={getClientCandidateLoader}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                paginationTotalRows={totalRows}
                paginationServer
                allowRowEvents
                customStyles={customStyles}
                highlightOnHover={true}
                columns={
                  auth?.user?.clients
                    ? count?.plan?.planName == "free" ||
                      count?.plan?.planName == "Trial"
                      ? columnsClients
                      : subscriptionColumnsClients
                    : columns
                }
                className="react-dataTable"
                data={candidateList}
                subHeaderComponent={
                  auth?.user?.clients ? (
                    (clientUser?.clients?.id &&
                      count?.plan?.planName == "free") ||
                    count?.plan?.planName == "Trial" ? (
                      //  && user?.email == 'gunjan@growworkinfotech.com'
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        <div>
                          Free Resume Download Remain :{" "}
                          {5 - count?.resume_download_count}
                        </div>
                        <Rating
                          readonly
                          initialRating={5 - count?.resume_download_count}
                          emptySymbol={
                            <Star size={20} fill="#babfc7" stroke="#babfc7" />
                          }
                          fullSymbol={
                            <Star
                              size={20}
                              fill={"#323D76"}
                              stroke={"#323D76"}
                            />
                          }
                        />
                      </div>
                    ) : null
                  ) : (
                    <CustomHeader
                      filterData={filterData}
                      setFilterData={setFilterData}
                      setShow={setShow}
                      setCreate={setCreate}
                      store={candidates?.results}
                      loading={loading}
                      isCandidate={true}
                    />
                  )
                }
              /> */}
            {loading === true && !bulkUploadProgress.active ? (
              <ComponentSpinner
                isClientCandidate={true}
                theamcolour={themecolor}
              />
            ) : (
              <>
                {(!candidateList || candidateList.length === 0) && (
                  <div
                    className="d-flex align-items-center justify-content-center text-muted"
                    style={{ minHeight: 200, width: "100%" }}
                  >
                    {isAppliedCandidates
                      ? "No candidates have applied to this job yet."
                      : activeQuickFilter
                        ? "No candidates found for this tab."
                        : "No candidates found."}
                  </div>
                )}
                {candidateList?.map((candidate, index) => {
                  let color = "light-success";
                  if (candidate?.interviewStatus === "available")
                    color = "light-warning";
                  else if (candidate?.interviewStatus === "scheduled")
                    color = "light-info";
                  else if (candidate?.interviewStatus === "rejected")
                    color = "light-danger";
                  else if (candidate?.interviewStatus === "hold")
                    color = "secondary";
                  else if (candidate?.interviewStatus === "completed")
                    color = "light-secondary";
                  else if (candidate?.interviewStatus === "cv shared")
                    color = "secondary";
                  else if (candidate?.interviewStatus === "hired")
                    color = "light-success";
                  else if (candidate?.interviewStatus === "Not Joined It")
                    color = "warning";
                  else if (candidate?.interviewStatus === "Left")
                    color = "light-info";
                  else if (candidate?.interviewStatus === "shortlisted")
                    color = "info";
                  else if (candidate?.interviewStatus === "trail")
                    color = "dark";
                  else if (candidate?.interviewStatus === "reschedule")
                    color = "warning";
                  return (
                    <Card
                      className={`mb-3 ${
                        isCandidateSelected(candidate.id)
                          ? "candidate-card-selected"
                          : ""
                      }`}
                      key={index}
                      style={{ width: "100%" }}
                    >
                      <CardBody>
                        <Row>
                          <Col
                            md="7"
                            style={{
                              borderRight: "1px solid #ccc",
                              paddingRight: "15px",
                            }}
                          >
                            <Row>
                              <Col>
                                <CardTitle
                                  tag="h4"
                                  className="d-flex align-items-center"
                                  style={{
                                    fontSize: "23px",
                                    borderBottom: "1px solid #ccc",
                                    paddingBottom: "15px",
                                  }}
                                >
                                  {" "}
                                  <input
                                    type="checkbox"
                                    checked={isCandidateSelected(candidate.id)}
                                    style={{ marginRight: "10px", cursor: "pointer" }}
                                    onChange={(e) => {
                                      handleSelectedCard(
                                        candidate,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <span
                                    title="View Profile"
                                    onClick={() => openViewProfile(candidate)}
                                    style={{
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                      textUnderlineOffset: "3px",
                                      color: themecolor || "#323D76",
                                    }}
                                  >
                                    {candidate?.firstname} {candidate?.lastname}
                                  </span>
                                  <Badge
                                    pill
                                    color="default"
                                    style={{
                                      fontSize: "12px",
                                      backgroundColor:
                                        candidate.status === "new"
                                          ? themecolor
                                          : `${themecolor}80`,
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {candidate?.status}
                                  </Badge>
                                  {auth?.user?.clients ? null : (
                                    <Badge
                                      style={{
                                        fontSize: "12px",
                                        marginLeft: "10px",
                                      }}
                                      pill
                                      color={color}
                                      className="column-action d-flex align-items-center"
                                    >
                                      {candidate?.interviewStatus}
                                    </Badge>
                                  )}
                                </CardTitle>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="d-flex align-items-center">
                                <Briefcase
                                  size={20}
                                  style={{ marginRight: "5px", color: "gray" }}
                                />
                                <span>
                                  {candidate?.professional?.experienceInyear ||
                                    "-"}
                                </span>
                              </Col>
                              <Col className="d-flex align-items-center">
                                <span
                                  style={{
                                    marginRight: "5px",
                                    color: "gray",
                                    fontSize: "20px",
                                  }}
                                >
                                  &#8377;
                                </span>
                                <span>
                                  {candidate?.professional?.currentSalary ||
                                    "-"}
                                </span>
                              </Col>
                              <Col className="d-flex align-items-center">
                                <MapPin
                                  size={20}
                                  style={{ marginRight: "5px", color: "gray" }}
                                />
                                <span>{candidate?.city || "-"}</span>
                              </Col>
                              <Col className="d-flex align-items-center">
                                <Clock
                                  size={20}
                                  style={{ marginRight: "5px", color: "gray" }}
                                />
                                <span>
                                  {candidate?.professional?.noticePeriod || "-"}
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-1">
                              <Col md="6">{renderProfileCompletion(candidate)}</Col>
                            </Row>
                            <Row>
                              <CardBody
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  paddingLeft: "1rem",
                                }}
                              >
                                {renderStatesTable(candidate)}{" "}
                                {renderClientVisibleComments(candidate)}
                              </CardBody>
                            </Row>
                          </Col>
                          <Col
                            md="4"
                            style={{
                              borderRight: "1px solid #ccc",
                              paddingRight: "15px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ProfileImage
                              candidate={candidate}
                              imageUrl={candidate?.image}
                              gender={candidate?.candidateGender || candidate?.gender}
                              email={candidate?.email}
                              mobile={candidate?.mobile}
                            />
                          </Col>
                          <Col
                            md="1"
                            className="d-flex align-items-center justify-content-center"
                            style={{ flexDirection: "column" }}
                          >
                            {auth?.user?.clients ? null : (
                              <>
                                <div
                                  style={{
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                    padding: "10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "40px",
                                    height: "40px",
                                    marginTop: "10px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(candidate);
                                  }}
                                  title={
                                    isCandidateFavorited(candidate)
                                      ? "Remove from favorites"
                                      : "Add to favorites"
                                  }
                                >
                                  <Star
                                    size={25}
                                    fill={
                                      isCandidateFavorited(candidate)
                                        ? themecolor || "#323D76"
                                        : "none"
                                    }
                                    stroke={
                                      isCandidateFavorited(candidate)
                                        ? themecolor || "#323D76"
                                        : "#babfc7"
                                    }
                                  />
                                </div>
                                <div
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                    padding: "10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "40px",
                                    height: "40px",
                                    marginTop: "10px",
                                  }}
                                  onClick={async () => {
                                    if (
                                      candidate?.agency?.email ==
                                      user?.agency?.email ||
                                      user?.email == allAccessEmail
                                    ) {
                                      setCandidate(candidate);
                                      setIndustriesData(
                                        candidate?.industries_relation
                                      );
                                      statusUpdate(candidate);
                                      setEmail(candidate?.email);
                                      setUpdate(true);
                                      setShow(true);
                                    } else {
                                      setIsDisabledAllFields(true);
                                      setCandidate(candidate);
                                      setIndustriesData(
                                        candidate?.industries_relation
                                      );
                                      statusUpdate(candidate);
                                      setEmail(candidate?.email);
                                      setUpdate(true);
                                      setShow(true);
                                    }
                                  }}
                                >
                                  <Edit size={25} color="black" />
                                </div>
                                <div
                                  style={{
                                    color: "#dc3545",
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                    padding: "10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "40px",
                                    height: "40px",
                                    marginTop: "10px",
                                  }}
                                  onClick={() => {
                                    if (
                                      candidate?.agency?.email ==
                                      user?.agency?.email ||
                                      user?.email == allAccessEmail
                                    ) {
                                      handleDeleteClick(candidate);
                                    }
                                  }}
                                >
                                  <Trash2 size={25} color="black" />
                                </div>
                              </>
                            )}

                            {auth?.user?.clients ? (
                              candidate?.interview_request?.isdisabled ==
                                true ||
                                count?.plan?.planName === "free" ||
                                count?.plan?.planName === "Trial" ? null : (
                                <div
                                  style={{
                                    color: "#7F8487",
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                    padding: "10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "40px",
                                    height: "40px",
                                  }}
                                  onClick={() => {
                                    setLoading(true);
                                    interviewRequest(candidate);
                                  }}
                                >
                                  <Calendar size={25} color="black" />
                                </div>
                              )
                            ) : (
                              <div
                                onClick={() => {
                                  history.push(
                                    `/${slug}/interview?id=${candidate.id}&first=${candidate.firstname}&last=${candidate.lastname}`
                                  );
                                }}
                                style={{
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                  backgroundColor: "white",
                                  padding: "10px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "40px",
                                  height: "40px",
                                }}
                              >
                                <UserCheck size={25} color="black" />
                              </div>
                            )}

                            {candidate?.mobile && (
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    `https://wa.me/91${candidate?.mobile}`
                                  );
                                }}
                                style={{
                                  borderRadius: "50%",
                                  backgroundColor: "white",
                                  padding: "10px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "40px",
                                  height: "40px",
                                  marginTop: "10px",
                                }}
                              >
                                <img
                                  src={whatsapp}
                                  style={{
                                    height: "20px",
                                    width: "20px",
                                    color: "white",
                                  }}
                                />
                              </a>
                            )}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  );
                })}
              </>
            )}

            {!filterToggleMode && (bestMatchesCandidate || isAppliedCandidates ? candidateList?.length > 0 : candidates?.results?.length > 0) && (
              <>
                <Pagination className="d-flex mt-3 align-items-center justify-content-center position-relative">
                  <Select
                    // isDisabled={update}
                    menuPlacement="top"
                    style={{ cursor: "pointer" }}
                    id="perPage"
                    name="perPage"
                    defaultValue={pageOptions[0]}
                    value={perPageSelect}
                    options={pageOptions}
                    className="react-select mr-3"
                    classNamePrefix="pagination-select select"
                    theme={selectThemeColors}
                    onChange={(e) => {
                      setPerPageSelect(e);
                      setPerPage(parseInt(e.value));
                    }}
                  />
                  <PaginationItem disabled={!hasPrevPage}>
                    <PaginationLink
                      previous
                      href="#"
                      onClick={() =>
                        hasPrevPage && handlePageChange(currentPage - 1)
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

                  <PaginationItem disabled={!hasNextPage}>
                    <PaginationLink
                      next
                      href="#"
                      onClick={() =>
                        hasNextPage && handlePageChange(currentPage + 1)
                      }
                    >
                      Next <ChevronRight size={15} />
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </>
            )}
            </div>
          </div>
          {/* </Card> */}
        </Col>
      </Row>
      </div>
      <Modal
        className="modal-dialog-centered modal-xl"
        isOpen={resumePreview.open}
        toggle={closeResumePreview}
      >
        <ModalHeader toggle={closeResumePreview}>
          <div className="d-flex align-items-center justify-content-between w-100">
            <span>View Resume</span>
          </div>
        </ModalHeader>
        <ModalBody>
          {resumePreview.loading ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "40vh" }}
            >
              <ComponentSpinner
                isClientCandidate={true}
                theamcolour={themecolor}
              />
            </div>
          ) : resumePreview.error ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center"
              style={{ minHeight: "30vh" }}
            >
              <FileText size={42} className="mb-1" />
              <p className="mb-0 text-danger">{resumePreview.error}</p>
              {resumePreview.fileName ? (
                <p className="mt-1 mb-0 text-muted">
                  {resumePreview.fileName}
                </p>
              ) : null}
            </div>
          ) : (isPdfResume(resumePreview.fileName) ||
              isPdfResume(resumePreview.url)) &&
            resumePreview.previewUrl ? (
            <iframe
              title="Resume preview"
              src={resumePreview.previewUrl}
              style={{
                width: "100%",
                height: "70vh",
                border: "none",
                background: "#f4f4f4",
              }}
            />
          ) : (isOfficeResume(resumePreview.fileName) ||
              isOfficeResume(resumePreview.url)) &&
            resumePreview.url &&
            /^https:\/\//i.test(resumePreview.url) &&
            !/localhost|127\.0\.0\.1/.test(resumePreview.url) ? (
            <iframe
              title="Resume preview"
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                resumePreview.url
              )}`}
              style={{
                width: "100%",
                height: "70vh",
                border: "none",
                background: "#f4f4f4",
              }}
            />
          ) : (
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center"
              style={{ minHeight: "30vh", padding: "1rem" }}
            >
              <FileText size={42} className="mb-1" />
              <p className="mb-1">
                <strong>{resumePreview.fileName || "Resume"}</strong>
              </p>
              <p className="mb-0 text-muted">
                {isOfficeResume(resumePreview.fileName) ||
                isOfficeResume(resumePreview.url)
                  ? "Word (.doc/.docx) files cannot be previewed here. Use Download to open the file."
                  : "Preview is not available for this file type. Use Download to open the file."}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeResumePreview}>
            Close
          </Button>
          <Button
            color="default"
            style={{ backgroundColor: themecolor, color: "white" }}
            disabled={
              !!resumePreview.error ||
              (!resumePreview.url && !resumePreview.blobUrl)
            }
            onClick={downloadResumeFromPreview}
          >
            <Download size={16} className="me-50" /> Download
          </Button>
        </ModalFooter>
      </Modal>
      {show === true ? (
        <>
          <Candidate
            loading={loading}
            industriesData={industriesData}
            setIndustriesData={setIndustriesData}
            candidateId={candidateId}
            show={show}
            setGender={setGender}
            gender={gender}
            setFilterData={setFilterData}
            setShow={setShow}
            setCandidate={setCandidate}
            candidate={candidate}
            update={update}
            setUpdate={setUpdate}
            create={create}
            setCreate={setCreate}
            setEmail={setEmail}
            CandidateHandler={CandidateActionHandler}
            isDisabledAllFields={isDisabledAllFields}
            setIsDisabledAllFields={setIsDisabledAllFields}
            hideProfileCompletion={params?.pathname === `/${slug}/candidate`}
            allowMultipleResumeSelection={
              params?.pathname === `/${slug}/candidate` && create && !update
            }
            resumeUploadOnly={
              params?.pathname === `/${slug}/candidate` && create && !update
            }
            bulkUploadProgress={bulkUploadProgress}
          />
        </>
      ) : null}
      {showWPModal === true ? (
        <WhatsappDialog
          WPnumber={WPnumber}
          loading={loading}
          showWPModal={showWPModal}
          setShowWPModal={setShowWPModal}
          clientData={clientData}
          setClientData={setClientData}
        />
      ) : null}
      <Modal
        className="modal-dialog-centered"
        isOpen={duplicateResumeModal.open}
        toggle={() => closeDuplicateResumeModal("skip")}
        backdrop={false}
        zIndex={1060}
      >
        <ModalHeader toggle={() => closeDuplicateResumeModal("skip")}>
          Resume Already Exists
        </ModalHeader>
        <ModalBody>
          <p className="mb-1">
            <strong>{duplicateResumeModal.fileLabel}</strong>
          </p>
          <p className="mb-0">
            Candidate already exists
            {duplicateResumeModal.candidateName
              ? ` (${duplicateResumeModal.candidateName})`
              : ""}
            {duplicateResumeModal.matchOn === "email" && duplicateResumeModal.email
              ? ` — Email: ${duplicateResumeModal.email}`
              : ""}
            {duplicateResumeModal.mobile
              ? ` — Mobile: ${duplicateResumeModal.mobile}`
              : ""}
            .
          </p>
          <p className="mt-1 mb-0">
            Do you want to update this candidate, or skip this resume?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            style={{ backgroundColor: themecolor, color: "white" }}
            onClick={() => closeDuplicateResumeModal("update")}
          >
            Update
          </Button>
          <Button
            color="secondary"
            onClick={() => closeDuplicateResumeModal("skip")}
          >
            Skip
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        className="modal-dialog-centered"
        isOpen={showDeleteModal}
        toggle={() => setShowDeleteModal(!showDeleteModal)}
      >
        <ModalHeader toggle={() => setShowDeleteModal(!showDeleteModal)}>
          Confirm
        </ModalHeader>
        <ModalBody>Are you sure to delete this candidate?</ModalBody>
        <ModalFooter>
          <Button
            color="default"
            onClick={confirmDelete}
            style={{ backgroundColor: themecolor, color: "white" }}
          >
            Yes, Delete
          </Button>
          <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={popUp} className="modal-dialog-centered">
        <ModalHeader
          toggle={() => {
            dispatch({
              type: actions.INTERVIEW_REQUEST_POPUP,
              payload: false,
            });
            setPopUp(false);
          }}
          className="bg-transparent"
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h1 className="text-center mb-1" style={{ color: themecolor }}>
            Interview request sent!!
          </h1>
          <p className="text-center">
            {" "}
            Hey, we receive your request for Interview schedule. Our recruiter
            will call you soon.
          </p>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SecondPage;
