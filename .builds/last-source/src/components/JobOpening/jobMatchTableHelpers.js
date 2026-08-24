import React from "react";
import { Badge } from "reactstrap";

export const getInterviewStatusBadgeColor = (status) => {
  if (status === "available") return "light-warning";
  if (status === "scheduled") return "light-info";
  if (status === "rejected") return "light-danger";
  if (status === "hold") return "secondary";
  if (status === "completed") return "light-secondary";
  if (status === "cv shared") return "secondary";
  if (status === "hired") return "light-success";
  if (status === "Not Joined It") return "warning";
  if (status === "Left") return "light-info";
  if (status === "shortlisted") return "info";
  if (status === "trail") return "dark";
  if (status === "reschedule") return "warning";
  return "light-success";
};

export const InterviewStatusCell = ({ row }) => {
  const status = row?.interviewStatus || "available";
  return (
    <Badge
      pill
      color={getInterviewStatusBadgeColor(status)}
      className="column-action d-flex align-items-center"
      style={{ textTransform: "capitalize" }}
    >
      {status}
    </Badge>
  );
};

export const hasExistingInterview = (row) =>
  Boolean(row?.latestInterview?.id) ||
  Boolean(row?.interviews?.id) ||
  Boolean(row?.interviewerId) ||
  (row?.interviewStatus &&
    String(row.interviewStatus).toLowerCase() !== "available");

export const hasViewedByCurrentUser = (row) =>
  row?.viewedByCurrentUser === true;

export const getInterviewButtonLabel = (row) =>
  hasExistingInterview(row) ? "Edit Interview" : "Interview";

export const getViewProfileButtonLabel = (row, viewedIds = new Set()) => {
  const candidateId = row?.id ? String(row.id) : "";
  if (!candidateId) return "View Profile";
  if (viewedIds.has(candidateId)) return "View Again";
  if (hasViewedByCurrentUser(row)) return "View Again";
  return "View Profile";
};
