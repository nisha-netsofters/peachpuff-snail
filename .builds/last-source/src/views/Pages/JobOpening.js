import DataTable from "react-data-table-component";
import {
  Edit,
  Trash,
  FileText,
  Filter as FilterIcon,
  MoreVertical,
  ChevronDown,
  RotateCw,
  Users,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import { FaSyncAlt } from "react-icons/fa";

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
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Tooltip,
  UncontrolledTooltip,
  UncontrolledDropdown,
} from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomHeader from "../../components/Header/CustomHeader";
import Filter from "../../components/Forms/JobOpening/filter";
import { tostify } from "../../components/Tostify";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";

import ReactCanvasConfetti from "react-canvas-confetti";
import jobcategoryActions from "./../../redux/jobCategory/actions";
import industriesActions from "./../../redux/industries/actions";
import JobOpeningDialog from "../../components/Dialog/JobOpeningDialog";
import actions from "../../redux/jobOpening/actions";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import Loader from "./../../components/Dialog/Loader";
import userActions from "../../redux/user/actions";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getJobApplyListAPI } from "../../apis/jobapplylist";
import {
  updateJobPostingStatusAPI,
} from "../../apis/jobOpening";

const getDefaultExpiryDateISO = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
};

const getNewJobOpeningDefaults = () => ({
  postingStatus: "open",
  expiryDate: getDefaultExpiryDateISO(),
});

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

const JobOpening = () => {
  const { width } = useBreakpoint();
  const dispatch = useDispatch();
  const history = useHistory();

  const [show, setShow] = useState(false);
  const JobOpenings = useSelector((state) => state.jobOpening);
  const loginUser = useSelector((state) => state.auth.user);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [animation, setAnimation] = useState(false);
  const [jobOpening, setJobOpening] = useState({});
  const [create, setCreate] = useState(false);
  const [copy, setCopy] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restart, setrestart] = useState(false);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openingId, setopeningid] = useState("");
  const [jobOpeningList, setjobOpeningList] = useState();
  const { user } = useSelector((state) => state.auth);
  const roleName = user?.role?.name || loginUser?.role?.name || "";
  const canDeleteJob = roleName === "Admin";
  const canPublishJob = roleName === "Admin";
  const canAssignRecruiter = roleName === "Admin";
  const canCloseJob =
    roleName === "Admin" ||
    roleName === "Client" ||
    ["Team Leader", "BDM", "Recruiter", "Staff"].includes(roleName);
  const canOpenJob = canCloseJob;

  const assignableUsers = useSelector((state) => state?.user?.roleWise || []);
  const [filterData, setFilterData] = useState({});
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [clear, setClear] = useState(false);


  const { currentPlan } = useSelector((state) => state.subscription);

  const [isOpen, setIsOpen] = useState(
    JobOpenings?.results?.map(() => false) ?? []
  );
  const toggle = (index) => {
    const newCollapseStates = [...isOpen];
    newCollapseStates[index] = !newCollapseStates[index];
    setIsOpen(newCollapseStates);
  };
  // const slug = localStorage.getItem("slug");

  useEffect(() => {
    if (user?.clients?.id) {
      dispatch({
        type: userActions.GET_LOGIN_USER_DETAIL,
        payload: user?.id,
      });
    }
  }, []);

  const clearStates = () => {
    setJobOpening({});
    setShow(false);
    setLoading(false);
    setUpdate(false);
    setAnimation({});
    setCreate(false);
  };

  useEffect(() => {
    if (JobOpenings?.results?.length >= 0) {
      setjobOpeningList(JobOpenings?.results);
      setLoading(false);
    }

    if (JobOpenings?.isSuccess === true) {
      clearStates();
    }
  }, [JobOpenings?.results]);

  useEffect(() => {
    if (copy) {
      toast.success("Link Copied");
    } else {
      setCopy(false);
    }
  }, [copy]);

  const getjobOpening = async (page, filters = filterData) => {
    setLoading(true);
    await dispatch({
      type: actions.GET_JOBOPENING,
      payload: {
        page,
        perPage,
        userId: loginUser?.id,
        filterData: filters,
      },
    });
  };

  const handleFilter = (filter) => {
    setFilterData(filter);
    setCurrentPage(1);
    getjobOpening(1, filter);
  };

  const handleFilterToggleMode = (mode) => {
    setFilterToggleMode(mode);
  };

  const setclearstate = (value) => {
    setClear(value);
  };

  const handleClear = () => {
    setFilterData({});
    setCurrentPage(1);
    setClear(true);
    getjobOpening(1, {});
  };

  const filterToggle = () => {
    setFilterToggleMode(!filterToggleMode);
  };

  useEffect(() => {
    (async () => {
      await dispatch({
        type: industriesActions.GET_ALL_INDUSTRIES,
      });
      await dispatch({
        type: jobcategoryActions.GET_ALL_JOBCAT,
      });
      await dispatch({
        type: userActions.GET_USER_ROLE_WISE,
        payload: "JobAssign",
      });
    })();
  }, []);

  const handlePostingStatus = async (
    row,
    postingStatus,
    notifyOptions = {}
  ) => {
    if (!row?.id) return;
    try {
      setLoading(true);
      const res = await updateJobPostingStatusAPI({
        id: row.id,
        postingStatus,
        notifyEmail: notifyOptions.notifyEmail === true,
        notifyWhatsapp: notifyOptions.notifyWhatsapp === true,
      });
      // axios interceptor unwraps resp.data → body is { success, msg, postingStatus }
      const body = res?.success !== undefined ? res : res?.data;
      if (body?.success) {
        toast.success(body.msg || `Job ${postingStatus}`);
        // Optimistic UI update so badge changes immediately
        setjobOpeningList((prev) =>
          (prev || []).map((item) =>
            item.id === row.id
              ? { ...item, postingStatus: body.postingStatus || postingStatus }
              : item
          )
        );
        await getjobOpening(currentPage);
      } else {
        toast.error(body?.msg || "Failed to update status");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.msg ||
          err?.message ||
          "Failed to update status"
      );
    } finally {
      setLoading(false);
    }
  };

  const openPublishConfirm = (row) => {
    setPublishJobRow(row);
    setPublishNotifyEmail(true);
    setPublishNotifyWhatsapp(true);
    setShowPublishModal(true);
  };

  const confirmPublish = async () => {
    if (!publishJobRow) return;
    const row = publishJobRow;
    const notifyEmail = publishNotifyEmail;
    const notifyWhatsapp = publishNotifyWhatsapp;
    setShowPublishModal(false);
    setPublishJobRow(null);
    await handlePostingStatus(row, "published", {
      notifyEmail,
      notifyWhatsapp,
    });
  };

  const renderPostingActions = (row) => (
    <>
      {canOpenJob && row?.postingStatus !== "open" ? (
        <DropdownItem
          tag="a"
          href="/"
          className="w-100"
          onClick={(e) => {
            e.preventDefault();
            handlePostingStatus(row, "open");
          }}
        >
          <span className="align-middle">Open</span>
        </DropdownItem>
      ) : null}
      {canPublishJob && row?.postingStatus !== "published" ? (
        <DropdownItem
          tag="a"
          href="/"
          className="w-100"
          onClick={(e) => {
            e.preventDefault();
            openPublishConfirm(row);
          }}
        >
          <span className="align-middle">Publish</span>
        </DropdownItem>
      ) : null}
      {canCloseJob && row?.postingStatus !== "closed" ? (
        <DropdownItem
          tag="a"
          href="/"
          className="w-100"
          onClick={(e) => {
            e.preventDefault();
            handlePostingStatus(row, "closed");
          }}
        >
          <span className="align-middle">Close</span>
        </DropdownItem>
      ) : null}
    </>
  );

  console.info("----------------------------");
  console.info("create =>", create);
  console.info("----------------------------");

  useEffect(() => {
    console.log("hereeeeeeeeeee");
    getjobOpening(currentPage);
  }, []);

  useEffect(() => {
    if (!show) setJobOpening({});
  }, [show]);

  useEffect(() => {
    setTotalRows(JobOpenings.total);
  }, [JobOpenings]);

  const RestartjobOpening = async (id) => {
    setrestart(false);
    await dispatch({
      type: actions.RESTART_JOBOPENING,
      payload: { id: id },
    });
  };

  const deletejobOpening = async (row) => {
    setLoading(true);
    await dispatch({
      type: actions.DELETE_JOBOPENING,
      payload: { id: row.id, page: currentPage, perPage: perPage },
    });
  };


  // Best match candidates for this job opening
  const handleViewBestMatch = (job) => {
    const jobId = job.id || job._id;
    if (!jobId) return;

    const slug = localStorage.getItem("slug");
    window.open(
      `/${slug}/jobopening-match/${jobId}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Formal job applications (apply form)
  const handleViewCandidates = (job) => {
    const jobId = job.id || job._id;
    if (!jobId) return;

    const slug = localStorage.getItem("slug");
    history.push(`/${slug}/applied-candidates/${jobId}`);
  };

  // 🔹 Export CSV - Download all candidates for this job
  const handleExportCSV = async (job) => {
    try {
      setLoading(true);
      const jobId = job.id || job._id;
      if (!jobId) {
        toast.error("Job ID not found");
        return;
      }

      // Fetch all applicants for this job
      const response = await getJobApplyListAPI(jobId);

      if (response && response.results) {
        const applicants = response.results;

        if (applicants.length === 0) {
          toast.info("No candidates found for this job");
          return;
        }

        // Format data for CSV
        const csvData = applicants.map((app) => ({
          Name: app.candidateName || "-",
          Email: app.candidateEmail || "-",
          Mobile: app.candidateMobile || "-",
          Status: app.status || "-",
          AppliedAt: new Date(app.appliedAt).toLocaleDateString() || "-",
          Gender: app.candidateGender || "-",
          Experience: app.candidateProfessional?.experience || "-",
          JobCategory: app.candidateProfessional?.jobCategory?.jobCategory || "-",
        }));

        // Convert and Download
        const convertArrayOfObjectsToCSV = (array) => {
          let result;
          const columnDelimiter = ",";
          const lineDelimiter = "\n";
          const keys = Object.keys(array[0]);

          result = "";
          result += keys.join(columnDelimiter);
          result += lineDelimiter;

          array.forEach((item) => {
            let ctr = 0;
            keys.forEach((key) => {
              if (ctr > 0) result += columnDelimiter;
              // Handle commas in values by wrapping in quotes
              const val = String(item[key]).replace(/"/g, '""');
              result += `"${val}"`;
              ctr++;
            });
            result += lineDelimiter;
          });

          return result;
        };

        const downloadCSV = (array) => {
          const csv = convertArrayOfObjectsToCSV(array);
          if (!csv) return;

          const filename = `Candidates_${job.companyName || "Job"}_${new Date().toLocaleDateString()}.csv`;
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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
        };

        downloadCSV(csvData);
        toast.success("CSV Exported successfully");
      } else {
        toast.error("Failed to fetch candidates");
      }
    } catch (error) {
      console.error("Export CSV Error:", error);
      toast.error("An error occurred during export");
    } finally {
      setLoading(false);
    }
  };


  const columns = [
    {
      name: "Action",
      minWidth: "150px",
      cell: (row) => (
        <div className="column-action d-flex align-items-center">
          {(() => {
            const baseId =
              row?.id || row?._id || row?.createdAt || row?.jobCategory?.id;
            const editId = `job-opening-edit-${baseId}`;
            const viewId = `job-opening-applied-${baseId}`;

            return (
              <>
                <span
                  id={editId}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setJobOpening(row);
                    setUpdate(true);
                    setShow(true);
                  }}
                >
                  <Edit size={17} className="mx-1" />
                </span>
                <UncontrolledTooltip placement="top" target={editId}>
                  Edit job
                </UncontrolledTooltip>

                <span
                  id={viewId}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleViewCandidates(row)}
                >
                  <Users size={17} className="mx-1" />
                </span>
                <UncontrolledTooltip placement="top" target={viewId}>
                  Applied
                </UncontrolledTooltip>

                <UncontrolledDropdown
                  direction="down"
                  popperConfig={{
                    strategy: "fixed",
                    modifiers: [
                      { name: "flip", enabled: true },
                      {
                        name: "preventOverflow",
                        options: { boundary: "viewport", padding: 8 },
                      },
                    ],
                  }}
                >
                  <DropdownToggle
                    tag="span"
                    className="pe-1"
                    style={{ cursor: "pointer" }}
                  >
                    <MoreVertical size={17} />
                  </DropdownToggle>
                  <DropdownMenu
                    end
                    container="body"
                    style={{ zIndex: 999999, position: "fixed" }}
                  >
                    {currentPlan?.planName?.toLowerCase() !== "free" ? (
                      <DropdownItem
                        tag="a"
                        href="/"
                        className="w-100"
                        onClick={(e) => {
                          e.preventDefault();
                          handleExportCSV(row);
                        }}
                      >
                        <FileText size={15} className="me-50" />
                        <span className="align-middle">Export CSV</span>
                      </DropdownItem>
                    ) : null}
                    {renderPostingActions(row)}
                    {row.status != "Inactive" ? (
                      canDeleteJob ? (
                        <DropdownItem
                          tag="a"
                          href="/"
                          className="w-100"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteClick(row);
                          }}
                        >
                          <Trash size={15} className="me-50" />
                          <span className="align-middle">Delete</span>
                        </DropdownItem>
                      ) : null
                    ) : (
                      <DropdownItem
                        tag="a"
                        href="/"
                        className="w-100"
                        onClick={(e) => {
                          e.preventDefault();
                          setopeningid(row?.id);
                          setrestart(true);
                        }}
                      >
                        <RotateCw size={15} className="me-50" />
                        <span className="align-middle">Restart</span>
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </>
            );
          })()}
        </div>
      ),
    },

    {
      name: "Candidates",
      minWidth: "140px",
      cell: (row) => (
        <div className="d-flex flex-column align-items-center gap-50">
          <Button
            size="sm"
            color="default"
            style={{
              fontSize: "12px",
              minWidth: "110px",
              padding: "4px 10px",
              backgroundColor: themecolor,
              color: "white",
            }}
            onClick={() => handleViewBestMatch(row)}
          >
            Best Match
          </Button>
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.status == "Inactive",
          style: {
            opacity: "0.5",
          },
        },
      ],
    },

    {
      name: "Posting Status",
      selector: (row) => row?.postingStatus || "open",
      cell: (row) => {
        const status = row?.postingStatus || "open";
        const colorMap = {
          draft: "secondary",
          open: "info",
          published: "success",
          closed: "warning",
          archived: "dark",
        };
        return (
          <Badge color={colorMap[status] || "info"} pill>
            {status}
          </Badge>
        );
      },
    },

    {
      name: "Create_AT",
      selector: (row) => row?.createdAt?.slice(0, 10),
      conditionalCellStyles: [
        {
          when: (row) => row.status == "Inactive",
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "job Category",
      selector: (row) => row?.jobCategory?.jobCategory,
      conditionalCellStyles: [
        {
          when: (row) => row.status == "Inactive",
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "No. Of Vacancy",
      selector: (row) => row?.numberOfVacancy,
      conditionalCellStyles: [
        {
          when: (row) => row.status == "Inactive",
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Total Responses",
      minWidth: "150px",
      cell: (row) => (
        <span
          style={{
            fontWeight: "bolder",
            fontSize: "15px",
            cursor: "pointer",
            color: "inherit",
          }}
          onClick={() => handleViewCandidates(row)}
        >
          {row?.totalResponses || 0}
        </span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.status == "Inactive",
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Experience",
      selector: (row) => row?.minExperienceYears,
      conditionalCellStyles: [
        {
          when: (row) => row.status == "Inactive",
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Gender",
      selector: (row) => row?.gender,
      conditionalCellStyles: [
        {
          when: (row) => row.status == "Inactive",
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
  ];

  const jobOpeningCreateHandler = async () => {
    setLoading(true);
    const fm = new FormData();
    // Keep salary matching fields in sync with single Salary input
    const salaryNum = Number(jobOpening?.salary || jobOpening?.salaryRangeStart || 0);
    const payload = {
      ...jobOpening,
      expiryDate: jobOpening?.expiryDate || getDefaultExpiryDateISO(),
      salaryRangeStart:
        jobOpening?.salaryRangeStart || (salaryNum > 0 ? salaryNum : 0),
      salaryRangeEnd:
        jobOpening?.salaryRangeEnd || (salaryNum > 0 ? salaryNum : 0),
    };
    for (const key in payload) {
      if (payload[key] !== undefined && payload[key] !== null) {
        fm.append(key, payload[key]);
      }
    }
    fm.append("userId", loginUser?.id);
    fm.append("agencyId", user?.agencyId);
    if (!jobOpening?.postingStatus) {
      fm.append("postingStatus", "open");
    }
    setCreate(false);
    setLoading(true);

    await dispatch({
      type: actions.CREATE_JOBOPENING,
      payload: { data: fm, page: currentPage, perPage: perPage },
    });
  };

  const jobOpeningUpdateHandler = async () => {
    setLoading(true);
    const fm = new FormData();
    const salaryNum = Number(jobOpening?.salary || jobOpening?.salaryRangeStart || 0);
    const payload = {
      ...jobOpening,
      salaryRangeStart:
        jobOpening?.salaryRangeStart || (salaryNum > 0 ? salaryNum : 0),
      salaryRangeEnd:
        jobOpening?.salaryRangeEnd || (salaryNum > 0 ? salaryNum : 0),
    };
    for (const key in payload) {
      fm.append(key, payload[key]);
    }
    fm.delete("hotvacancy");
    await dispatch({
      type: actions.UPDATE_JOBOPENING,
      payload: {
        id: jobOpening.id,
        data: fm,
      },
    });
  };

  const Validations = async () => {
    const error = false;
    if (!String(jobOpening?.designation || "").trim())
      return tostify("Please Enter Job Title", error);
    if (!String(jobOpening?.jobCategoryId || "").trim())
      return tostify("Please Select Job Category", error);
    return error;
  };

  const UserActionHandler = async () => {
    const err = await Validations();
    if (update === true && err === false) {
      jobOpeningUpdateHandler();
    }
    if (create === true && err === false) {
      jobOpeningCreateHandler();
    }
    if (restart == true) {
      RestartjobOpening(openingId);
    }
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    getjobOpening(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    await dispatch({
      type: actions.GET_JOBOPENING,
      payload: {
        filterData,
        page,
        perPage: newPerPage,
      },
    });
    setPerPage(newPerPage);
  };

  useEffect(() => {
    setAnimation(false);
  }, []);

  const renderStates = (JobOpenings) => {
    const statesArr = [
      {
        title: "job Category",
        value: JobOpenings?.jobCategory?.jobCategory || "-",
      },
      {
        title: "No. Of Vacancy",
        value: JobOpenings?.numberOfVacancy || "-",
      },
      {
        title: "Experience",
        value: JobOpenings?.minExperienceYears || "-",
      },
      {
        title: "Gender",
        value: JobOpenings?.gender || "-",
      },
    ];

    return statesArr.map((state) => (
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
    ));
  };

  const renderStatesMore = (JobOpenings) => {
    const statesArr = [
      {
        title: "Work",
        value: JobOpenings?.workType || "-",
      },
      {
        title: "Qualification",
        value: JobOpenings?.qualification || "-",
      },
      {
        title: "No. Of Vacancy",
        value: JobOpenings?.numberOfVacancy || "-",
      },
      {
        title: "Salary Range Start",
        value: JobOpenings?.salaryRangeStart || "-",
      },
      {
        title: "Salary Range End",
        value: JobOpenings?.salaryRangeEnd || "-",
      },
    ];

    return statesArr.map((state) => (
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
    ));
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishJobRow, setPublishJobRow] = useState(null);
  const [publishNotifyEmail, setPublishNotifyEmail] = useState(true);
  const [publishNotifyWhatsapp, setPublishNotifyWhatsapp] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [onBoardingToDelete, setOnBoardingToDelete] = useState(null);

  const handleDeleteClick = (result) => {
    setOnBoardingToDelete(result);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    deletejobOpening(onBoardingToDelete);
    setShowDeleteModal(false);
  };

  const totalPages = Math.ceil(JobOpenings?.total / perPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);
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
          height={window.innerHeight}
          width={window.innerWidth}
          style={canvasStyles}
        />
        <h3 style={{ color: themecolor }}>
          <b>Job Opening</b>
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
              className="add-new-user"
              color="link"
              onClick={handleClear}
              style={{ color: themecolor }}
            >
              {width > 786 ? "Clear" : "Clear Filter"}
            </Button>
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
            filterToggle();
          }}
        >
          {width > 769 ? "Filter Data" : <FilterIcon size={17} />}
        </Button>
        <Button
          style={
            width > 769
              ? { display: "none", backgroundColor: themecolor, color: "white" }
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
            setJobOpening(getNewJobOpeningDefaults());
            setCreate(true);
            setShow(true);
          }}
        >
          <UserPlus size={17} />
        </Button>
      </div>

      <Filter
        handleFilterToggleMode={handleFilterToggleMode}
        clear={clear}
        setclear={setclearstate}
        setFilterToggleMode={setFilterToggleMode}
        setFilterData={setFilterData}
        handleFilter={handleFilter}
        users={assignableUsers}
        open={filterToggleMode}
        toggleSidebar={filterToggle}
      />

      <Row className="mt-1" style={{ transition: "all 0.5s ease-in-out" }}>
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
              {JobOpenings?.results?.length > 0 ? (
                <>
                  {JobOpenings?.results?.map((result, index) => {
                    return (
                      <Card
                        key={index}
                        className={`card-browser-states`}
                        style={
                          width > 769
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
                            ></CardTitle>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginLeft: "auto",
                            }}
                          >
                            <div
                              style={{
                                color: "#7F8487",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setJobOpening(result);
                                setUpdate(true);
                                setShow(true);
                              }}
                            >
                              <Edit size={17} className="mx-1" />
                            </div>
                            <Button
                              size="sm"
                              color="default"
                              style={{
                                fontSize: "11px",
                                padding: "2px 8px",
                                backgroundColor: themecolor,
                                color: "white",
                              }}
                              onClick={() => handleViewBestMatch(result)}
                            >
                              Best Match
                            </Button>
                            <div
                              style={{
                                color: "#7F8487",
                                cursor: "pointer",
                              }}
                              onClick={() => handleViewCandidates(result)}
                            >
                              <Users size={17} className="mx-1" />
                            </div>
                            <UncontrolledDropdown
                              direction="down"
                              popperConfig={{
                                strategy: "fixed",
                                modifiers: [
                                  { name: "flip", enabled: true },
                                  {
                                    name: "preventOverflow",
                                    options: { boundary: "viewport", padding: 8 },
                                  },
                                ],
                              }}
                              className="chart-dropdown"
                            >
                              <DropdownToggle
                                color=""
                                className="bg-transparent btn-sm border-0 p-50"
                              >
                                <MoreVertical
                                  size={18}
                                  className="cursor-pointer"
                                />
                              </DropdownToggle>
                              <DropdownMenu
                                end
                                container="body"
                                style={{ zIndex: 999999, position: "fixed" }}
                              >
                                <DropdownItem
                                  className="w-100"
                                  onClick={() => handleExportCSV(result)}
                                >
                                  <FileText size={15} className="me-50" />
                                  <span className="align-middle">Export CSV</span>
                                </DropdownItem>
                                {renderPostingActions(result)}
                                {result.status != "Inactive" ? (
                                  canDeleteJob ? (
                                    <DropdownItem
                                      className="w-100"
                                      style={deleteStyle}
                                      onMouseEnter={() => setHoverIndex(3)}
                                      onMouseLeave={() => setHoverIndex(0)}
                                      onClick={() => handleDeleteClick(result)}
                                    >
                                      <Trash size={15} className="me-50" />
                                      <span className="align-middle">Delete</span>
                                    </DropdownItem>
                                  ) : null
                                ) : (
                                  <DropdownItem
                                    tag="a"
                                    href="/"
                                    className="w-100"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setopeningid(result?.id);
                                      setrestart(true);
                                    }}
                                  >
                                    <RotateCw size={15} className="me-50" />
                                    <span className="align-middle">Restart</span>
                                  </DropdownItem>
                                )}
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </div>
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

          {width <= 768 && JobOpenings?.results?.length > 0 && (
            <Pagination className="d-flex mt-3 align-items-center justify-content-center">
              <PaginationItem>
                <PaginationLink
                  previous
                  href="#"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                data={jobOpeningList}
                subHeaderComponent={
                  <CustomHeader
                    setShow={setShow}
                    setCreate={(val) => {
                      if (val) setJobOpening(getNewJobOpeningDefaults());
                      setCreate(val);
                    }}
                    store={JobOpenings?.results}
                  />
                }
              />
            </div>
          </Card>
        </Col>
      </Row >

      {/* Delete Job Opening Modal */}
      < Modal
        className="modal-dialog-centered"
        isOpen={showDeleteModal}
        toggle={() => setShowDeleteModal(!showDeleteModal)}
      >
        <ModalHeader toggle={() => setShowDeleteModal(!showDeleteModal)}>
          Confirm
        </ModalHeader>
        <ModalBody>Are you sure to delete this Job Opening?</ModalBody>
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
      </Modal >

      {/* Publish Job — notify Best Match? */}
      <Modal
        className="modal-dialog-centered"
        isOpen={showPublishModal}
        toggle={() => {
          setShowPublishModal(false);
          setPublishJobRow(null);
        }}
      >
        <ModalHeader
          toggle={() => {
            setShowPublishModal(false);
            setPublishJobRow(null);
          }}
        >
          Publish Job
        </ModalHeader>
        <ModalBody>
          <p className="mb-1">
            Publish{" "}
            <strong>{publishJobRow?.designation || "this job"}</strong>?
          </p>
          <p className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
            Best Match candidates ne email / WhatsApp moklva mango cho?
          </p>
          <FormGroup check className="mb-1">
            <Input
              type="checkbox"
              id="publish-notify-email"
              checked={publishNotifyEmail}
              onChange={(e) => setPublishNotifyEmail(e.target.checked)}
            />
            <Label check for="publish-notify-email">
              Email moklo
            </Label>
          </FormGroup>
          <FormGroup check>
            <Input
              type="checkbox"
              id="publish-notify-whatsapp"
              checked={publishNotifyWhatsapp}
              onChange={(e) => setPublishNotifyWhatsapp(e.target.checked)}
            />
            <Label check for="publish-notify-whatsapp">
              WhatsApp moklo
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            style={{ backgroundColor: themecolor, color: "white" }}
            onClick={confirmPublish}
          >
            Publish
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setShowPublishModal(false);
              setPublishJobRow(null);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>


      {show === true ? (
        <JobOpeningDialog
          loading={loading}
          show={show}
          update={update}
          RestartjobOpening={RestartjobOpening}
          restart={restart}
          setShow={setShow}
          jobOpening={jobOpening}
          setJobOpening={setJobOpening}
          UserActionHandler={UserActionHandler}
          setUpdate={setUpdate}
          setCreate={setCreate}
          assignableUsers={assignableUsers}
          canAssignRecruiter={canAssignRecruiter}
        />
      ) : null}
    </>
  );
};

export default JobOpening;
