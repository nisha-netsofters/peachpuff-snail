import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import { Bell } from "react-feather";
import {
  getNewBestMatchSummaryAPI,
  markNewBestMatchSeenAPI,
} from "../../apis/jobOpening";

const JOB_POSTING_ROLES = [
  "Admin",
  "Team Leader",
  "BDM",
  "Recruiter",
  "Staff",
  "Client",
];

/**
 * Header badge: Best Match candidates added after job create.
 * Count respects job list visibility (Admin = all, Staff = own/assigned, Client = own).
 */
const NewBestMatchHeaderBadge = () => {
  const history = useHistory();
  const themeColor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const user = useSelector((state) => state?.auth?.user);
  const roleName = user?.role?.name || "";
  const slug = localStorage.getItem("slug") || "";

  const [total, setTotal] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const canSee =
    Boolean(user?.id) && JOB_POSTING_ROLES.includes(roleName);

  const loadSummary = useCallback(async () => {
    if (!canSee) {
      setTotal(0);
      setJobs([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getNewBestMatchSummaryAPI();
      const body = res?.total !== undefined ? res : res?.data;
      setTotal(Number(body?.total) || 0);
      setJobs(Array.isArray(body?.jobs) ? body.jobs : []);
    } catch (_) {
      setTotal(0);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [canSee]);

  useEffect(() => {
    loadSummary();
    if (!canSee) return undefined;
    const timer = setInterval(loadSummary, 60 * 1000);
    const onFocus = () => loadSummary();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [canSee, loadSummary]);

  const openJobBestMatch = async (jobId) => {
    if (!jobId || !slug) return;
    try {
      await markNewBestMatchSeenAPI(jobId);
    } catch (_) {
      /* still navigate */
    }
    history.push(`/${slug}/jobopening-match/${jobId}`);
    // Refresh count after mark-seen
    setTimeout(loadSummary, 400);
  };

  if (!canSee) return null;

  return (
    <UncontrolledDropdown className="me-1">
      <DropdownToggle
        tag="button"
        type="button"
        className="btn btn-link nav-link p-0 border-0 bg-transparent d-flex align-items-center"
        style={{ color: themeColor || "#323D76", textDecoration: "none" }}
        title="New Best Match candidates (added after job create)"
      >
        <Bell size={18} />
        {loading && total === 0 ? (
          <Spinner size="sm" className="ms-50" />
        ) : total > 0 ? (
          <Badge
            color="danger"
            pill
            className="ms-50"
            style={{ fontSize: "11px", minWidth: 20 }}
          >
            {total > 99 ? "99+" : total}
          </Badge>
        ) : null}
      </DropdownToggle>
      <DropdownMenu end style={{ minWidth: 280, maxHeight: 360, overflowY: "auto" }}>
        <DropdownItem header className="fw-bold">
          New Best Match candidates
        </DropdownItem>
        <DropdownItem divider />
        {loading && jobs.length === 0 ? (
          <DropdownItem disabled>Loading…</DropdownItem>
        ) : jobs.length === 0 ? (
          <DropdownItem disabled>No new best-match candidates</DropdownItem>
        ) : (
          jobs.map((job) => (
            <DropdownItem
              key={job.id}
              className="d-flex justify-content-between align-items-center"
              onClick={() => openJobBestMatch(job.id)}
            >
              <span
                style={{
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {job.designation || "Job"}
              </span>
              <Badge color="primary" pill>
                {job.count}
              </Badge>
            </DropdownItem>
          ))
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default NewBestMatchHeaderBadge;
