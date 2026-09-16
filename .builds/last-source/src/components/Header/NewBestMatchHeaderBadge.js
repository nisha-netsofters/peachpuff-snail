import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
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

const SUMMARY_CACHE_KEY = "uw_new_best_match_summary_v1";

const readSummaryCache = () => {
  try {
    const raw = sessionStorage.getItem(SUMMARY_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.total === "number") return parsed;
  } catch (_) {
    /* ignore */
  }
  return null;
};

const writeSummaryCache = (total, jobs) => {
  try {
    sessionStorage.setItem(
      SUMMARY_CACHE_KEY,
      JSON.stringify({ total, jobs, at: Date.now() })
    );
  } catch (_) {
    /* ignore */
  }
};

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

  const cached = readSummaryCache();
  const [total, setTotal] = useState(() => cached?.total || 0);
  const [jobs, setJobs] = useState(() =>
    Array.isArray(cached?.jobs) ? cached.jobs : []
  );

  const canSee =
    Boolean(user?.id) && JOB_POSTING_ROLES.includes(roleName);

  const loadSummary = useCallback(async () => {
    if (!canSee) {
      setTotal(0);
      setJobs([]);
      return;
    }
    try {
      const res = await getNewBestMatchSummaryAPI();
      const body = res?.total !== undefined ? res : res?.data;
      const nextTotal = Number(body?.total) || 0;
      const nextJobs = Array.isArray(body?.jobs) ? body.jobs : [];
      setTotal(nextTotal);
      setJobs(nextJobs);
      writeSummaryCache(nextTotal, nextJobs);
    } catch (_) {
      /* keep last total (cache or prior fetch) */
    }
  }, [canSee]);

  useEffect(() => {
    if (!canSee) return undefined;
    loadSummary();
    const timer = setInterval(loadSummary, 45 * 1000);
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
    setTimeout(loadSummary, 300);
  };

  if (!canSee) return null;

  const displayTotal = total > 99 ? "99+" : String(total);

  return (
    <UncontrolledDropdown className="me-2">
      <DropdownToggle
        tag="button"
        type="button"
        className="btn btn-link nav-link p-0 border-0 bg-transparent d-flex align-items-center"
        style={{ color: themeColor || "#323D76", textDecoration: "none" }}
        title="New Best Match candidates (added after job create)"
      >
        <span
          className="d-inline-flex align-items-center justify-content-center"
          style={{ position: "relative", width: 28, height: 28 }}
        >
          <Bell size={20} strokeWidth={1.75} />
          {total > 0 ? (
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -4,
                minWidth: 18,
                height: 18,
                padding: "0 5px",
                borderRadius: 999,
                backgroundColor: "#ea5455",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                lineHeight: "18px",
                textAlign: "center",
                boxShadow: "0 0 0 2px #fff",
              }}
            >
              {displayTotal}
            </span>
          ) : null}
        </span>
      </DropdownToggle>
      <DropdownMenu
        end
        style={{
          minWidth: 300,
          maxWidth: 340,
          maxHeight: "min(420px, 70vh)",
          overflowY: "auto",
          paddingBottom: 8,
        }}
      >
        <DropdownItem header className="fw-bold text-truncate">
          New Best Match candidates
        </DropdownItem>
        <DropdownItem divider />
        {jobs.length === 0 ? (
          <DropdownItem disabled>No new best-match candidates</DropdownItem>
        ) : (
          jobs.map((job) => (
            <DropdownItem
              key={job.id}
              className="d-flex justify-content-between align-items-center"
              style={{ gap: 16, paddingTop: 10, paddingBottom: 10 }}
              onClick={() => openJobBestMatch(job.id)}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  paddingRight: 8,
                }}
                title={job.designation || "Job"}
              >
                {job.designation || "Job"}
              </span>
              <Badge
                color="danger"
                pill
                style={{ minWidth: 26, flexShrink: 0 }}
              >
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
