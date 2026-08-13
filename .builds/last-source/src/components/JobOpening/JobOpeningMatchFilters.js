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

const JobOpeningMatchFilters = ({
  sortBy,
  profileCompletion,
  onSortChange,
  onProfileChange,
  themecolor,
}) => {
  const sortValue =
    JOB_MATCH_SORT_OPTIONS.find((o) => o.value === sortBy) ||
    JOB_MATCH_SORT_OPTIONS[0];
  const profileValue =
    JOB_MATCH_PROFILE_OPTIONS.find(
      (o) => o.value === (profileCompletion || "")
    ) || JOB_MATCH_PROFILE_OPTIONS[0];

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
        />
      </Col>
      <Col md={4} sm={6} xs={12} className="mb-1">
        <Label className="mb-25" style={{ fontSize: "13px" }}>
          Profile Completion
        </Label>
        <Select
          value={profileValue}
          options={JOB_MATCH_PROFILE_OPTIONS}
          className="react-select"
          classNamePrefix="select"
          theme={selectThemeColors}
          onChange={(opt) => onProfileChange(opt?.value || "")}
        />
      </Col>
    </Row>
  );
};

export default JobOpeningMatchFilters;
