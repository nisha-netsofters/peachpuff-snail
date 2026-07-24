/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  Download,
  User,
  Calendar,
  MapPin,
  Briefcase,
} from "react-feather";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Badge,
  Button,
  Row,
  Col,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import actions from "../../redux/resume/action";


const STATUS_FLOW = ["Requested", "In Review", "Completed", "Rejected"];

const ResumeList = () => {
  const dispatch = useDispatch();

  const resumeList = useSelector((state) => state?.resume?.resumeList || {});
  const loading = useSelector((state) => state?.resume?.isLoading || false);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );

  

  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState(null); // which row's dropdown is open
  const perPage = 5;
  

  // ----- helpers -----  
  const mapApiStatusToUi = (raw = "requested") => {
    switch (raw.toLowerCase()) {
      case "requested":
        return "Requested";
      case "inreview":
        return "In Review";
      case "completed":
        return "Completed";
      case "rejected":
        return "Rejected";
      default:
        return "Requested";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Requested":
        return "light-warning";
      case "In Review":
        return "light-info";
      case "Completed":
        return "light-success";
      case "Rejected":
        return "light-danger";
      default:
        return "light-secondary";
    }
  };

  // ----- fetch list -----
  useEffect(() => {
    dispatch({
      type: actions.POST_RESUME_LIST,
      payload: { page: currentPage, perPage, status: statusFilter },
    });
  }, [dispatch, currentPage, perPage, statusFilter]);

  // ----- list -----
  const list = resumeList.results || [];

  // ----- pagination -----
  const totalPages = resumeList?.totalPages || 1;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ----- status change -----
  const handleStatusChange = (rowId, newStatus) => {
    // newStatus is UI label ("Requested", "In Review"...)
    dispatch({
      type: actions.UPDATE_RESUME_STATUS,
      payload: {
        id: rowId,
        status: newStatus, // saga will map to API format
      },
    });

    setOpenId(null);
  };

  const API_BASE_URL = process.env.REACT_APP_LOCAL_API_BASE_URL || "https://8624a2717158.ngrok-free.app/api/";

  const handleDownload = (row) => {
   
    const resumePath = row?.candidate?.resume;
  
    if (!resumePath) {
      console.log("No resume found for row:", row);
      return;
    }
  
    const url = resumePath.startsWith("http")
      ? resumePath
      : `${API_BASE_URL}${resumePath.startsWith("/") ? "" : "/"}${resumePath}`;
  
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  

  return (
    <div>
      <Card>
        <CardHeader className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div>
            <CardTitle tag="h4">Resume Applications</CardTitle>
            <small className="text-muted">
              Candidates who applied via "Apply for Professional Resume" on their dashboard
            </small>
            <br />
            <small className="text-muted">
              <strong>Tip:</strong> Click on the status badge to update status
              (Requested → In Review → Completed → Rejected).
            </small>
          </div>

          {/* Status Filter buttons */}
          <Row className="mt-1 mt-md-0">
            <Col>
              <div className="d-flex flex-wrap gap-1">
                {["All", ...STATUS_FLOW].map((status) => (
                  <Button
                    key={status}
                    style={{ backgroundColor: statusFilter === status ? themecolor : "white", color: statusFilter === status ? "white" : themecolor , borderColor: statusFilter === status ? "" : themecolor }}
                    color="default"
                    size="sm"
                    className="mr-50 mb-50"
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </CardHeader>

        <CardBody>
          {loading ? (
            <div className="text-center text-muted py-2">Loading...</div>
          ) : list.length === 0 ? (
            <div className="text-center text-muted py-2">
              No resumes found for selected filter.
            </div>
          ) : (
            <>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Candidate</th>
                    <th>Position / Requirement</th>
                    <th>Location</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((row, index) => {
                    const candidate = row.candidate || {};
                    const rowId = row.id || row._id;

                    const fullName = `${candidate.firstname || ""} ${
                      candidate.lastname || ""
                    }`.trim();

                    const appliedDate = row.createdAt
                      ? row.createdAt.slice(0, 10)
                      : "";

                    const displayStatus = mapApiStatusToUi(
                      row.status || "requested"
                    );

                    return (
                      <tr key={rowId}>
                        {/* Sr. No. */}
                        <td>{(currentPage - 1) * perPage + index + 1}</td>

                        {/* Candidate */}
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <User size={20} className="mr-2 text-primary" />
                            <div>
                              <div className="font-weight-bold">
                                {fullName || "-"}
                              </div>
                              <small className="text-muted">
                                {candidate.email || "-"}
                              </small>
                              <br />
                              <small className="text-muted">
                                {candidate.mobile || "-"}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Position / requirement (message) */}
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <Briefcase size={16} className="mr-1 text-info" />
                            <div>
                              <div>{row.message || "-"}</div>
                              {/* <small className="text-muted">-</small> */}
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <MapPin size={16} className="mr-1 text-danger" />
                            <span>
                              {candidate.city || "-"}
                              {candidate.city && candidate.state ? ", " : ""}
                              {candidate.state || ""}
                            </span>
                          </div>
                        </td>

                        {/* Applied Date */}
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <Calendar size={16} className="mr-1 text-info" />
                            <span>{appliedDate || "-"}</span>
                          </div>
                        </td>

                        {/* Status with dropdown */}
                        <td>
                          <Dropdown
                            isOpen={openId === rowId}
                            toggle={() =>
                              setOpenId((prev) =>
                                prev === rowId ? null : rowId
                              )
                            }
                          >
                            <DropdownToggle
                              tag="span"
                              data-toggle="dropdown"
                              aria-expanded={openId === rowId}
                              style={{ cursor: "pointer" }}
                              disabled={["Rejected", "Completed"].includes(displayStatus)}
                            >
                              <Badge color={getStatusColor(displayStatus)} pill>
                                {displayStatus}
                              </Badge>
                            </DropdownToggle>

                            <DropdownMenu container="body">
                              {STATUS_FLOW.map((status) => (
                                <DropdownItem
                                  key={status}
                                  active={status === displayStatus}
                                  style={{ width: "100%" }}
                                  onClick={() =>
                                    handleStatusChange(rowId, status)
                                  }
                                >
                                  {status}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="d-flex gap-1">
                            <Button style={{ backgroundColor: themecolor, color: "white" }} 
                            color="default"
                            onClick={() => handleDownload(row)}
                            disabled={!row.candidate?.resume}
                            > 
                              View Resume
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {(currentPage - 1) * perPage + 1}-
                  {Math.min(currentPage * perPage, resumeList.total || 0)} of{" "}
                  {resumeList.total || 0} resumes
                </small>

                <Pagination className="mb-0">
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink
                      previous
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <PaginationItem
                      key={pageIndex}
                      active={pageIndex + 1 === resumeList.page}
                    >
                      <PaginationLink
                        onClick={() => handlePageChange(pageIndex + 1)}
                      >
                        {pageIndex + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem disabled={currentPage === totalPages}>
                    <PaginationLink
                      next
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>
                </Pagination>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ResumeList;
