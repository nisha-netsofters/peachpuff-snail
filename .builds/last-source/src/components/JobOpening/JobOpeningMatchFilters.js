import React from "react";
import Select from "react-select";
import { Col, Label, Row } from "reactstrap";
import { selectThemeColors } from "@utils";

export const JOB_MATCH_SORT_OPTIONS = [
  { value: "bestMatch", label: "Best Match" },
  { value: "newToOld", label: "New → Old" },
  { value: "oldToNew", label: "Old → New" },
];

export const JOB_MATCH_PROFILE_OPTIONS = [
  { value: "", label: "All Profiles" },
  { value: "100", label: "100% Complete" },
  { value: "above80", label: "Above 80%" },
  { value: "below50", label: "Below 50%" },
];

export const JOB_MATCH_SCORE_OPTIONS = [
  { value: "", label: "All Match Scores" },
  { value: "100", label: "100% Match" },
  { value: "above90", label: "Above 90%" },
  { value: "above80", label: "Above 80%" },
  { value: "above70", label: "Above 70%" },
  { value: "above60", label: "Above 60%" },
  { value: "below50", label: "Below 50%" },
  { value: "below30", label: "Below 30%" },
];

const selectMenuPortalProps = {
  menuPortalTarget: typeof document !== "undefined" ? document.body : null,
  menuPosition: "fixed",
  styles: {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  },
};

const JobOpeningMatchFilters = ({
  sortBy,
  profileCompletion,
  matchScore,
  onSortChange,
  onProfileChange,
  onMatchScoreChange,
  useMatchScoreFilter = false,
}) => {
  const sortValue =
    JOB_MATCH_SORT_OPTIONS.find((o) => o.value === sortBy) ||
    JOB_MATCH_SORT_OPTIONS[0];

  const secondaryOptions = useMatchScoreFilter
    ? JOB_MATCH_SCORE_OPTIONS
    : JOB_MATCH_PROFILE_OPTIONS;
  const secondaryValue =
    secondaryOptions.find(
      (o) =>
        o.value ===
        (useMatchScoreFilter ? matchScore || "" : profileCompletion || "")
    ) || secondaryOptions[0];
  const secondaryLabel = useMatchScoreFilter ? "Match Score" : "Profile Completion";
  const onSecondaryChange = useMatchScoreFilter
    ? onMatchScoreChange
    : onProfileChange;

  return (
    <Row className="mb-1 gx-2">
      <Col md={4} sm={6} xs={12} className="mb-1">
        <Label className="mb-25" style={{ fontSize: "13px" }}>Sort By</Label>
        <Select
          value={sortValue}
          options={JOB_MATCH_SORT_OPTIONS}
          className="react-select"
          classNamePrefix="select"
          theme={selectThemeColors}
          onChange={(opt) => onSortChange(opt?.value || "bestMatch")}
          {...selectMenuPortalProps}
        />
      </Col>
      <Col md={4} sm={6} xs={12} className="mb-1">
        <Label className="mb-25" style={{ fontSize: "13px" }}>
          {secondaryLabel}
        </Label>
        <Select
          value={secondaryValue}
          options={secondaryOptions}
          className="react-select"
          classNamePrefix="select"
          theme={selectThemeColors}
          onChange={(opt) => onSecondaryChange(opt?.value || "")}
          {...selectMenuPortalProps}
        />
      </Col>
    </Row>
  );
};

export default JobOpeningMatchFilters;
