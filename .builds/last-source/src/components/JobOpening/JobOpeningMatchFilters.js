import React from "react";
import Select from "react-select";
import Sidebar from "@components/sidebar";
import { Button, Col, Label, Row } from "reactstrap";
import { selectThemeColors } from "@utils";
import { useSelector } from "react-redux";
import useBreakpoint from "../../utility/hooks/useBreakpoints";

export const JOB_MATCH_SORT_OPTIONS = [
  { value: "newToOld", label: "New → Old" },
  { value: "oldToNew", label: "Old → New" },
];

export const JOB_MATCH_PROFILE_OPTIONS = [
  { value: "", label: "All Profiles" },
  { value: "100", label: "100% Complete" },
  { value: "above80", label: "Above 80%" },
  { value: "below50", label: "Below 50%" },
];

export const JOB_MATCH_DURATION_OPTIONS = [
  { value: "", label: "All Time" },
  { value: "1day", label: "1 Day" },
  { value: "7days", label: "7 Days" },
  { value: "30days", label: "30 Days" },
  { value: "3months", label: "3 Months" },
  { value: "6months", label: "6 Months" },
  { value: "9months", label: "9 Months" },
  { value: "12months", label: "12 Months" },
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

const SortSelect = ({ sortBy, onSortChange }) => {
  const sortValue =
    JOB_MATCH_SORT_OPTIONS.find((o) => o.value === sortBy) ||
    JOB_MATCH_SORT_OPTIONS[0];
  return (
    <>
      <Label className="mb-25" style={{ fontSize: "13px" }}>
        Sort By
      </Label>
      <Select
        value={sortValue}
        options={JOB_MATCH_SORT_OPTIONS}
        className="react-select"
        classNamePrefix="select"
        theme={selectThemeColors}
        onChange={(opt) => onSortChange(opt?.value || "newToOld")}
        {...selectMenuPortalProps}
      />
    </>
  );
};

const JobOpeningMatchFilters = ({
  sortBy,
  profileCompletion,
  matchScore,
  matchDuration,
  onSortChange,
  onProfileChange,
  onMatchScoreChange,
  onMatchDurationChange,
  open,
  toggleSidebar,
  onSearch,
  onClear,
  asSidebar = false,
}) => {
  const { width } = useBreakpoint();
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const profileValue =
    JOB_MATCH_PROFILE_OPTIONS.find((o) => o.value === (profileCompletion || "")) ||
    JOB_MATCH_PROFILE_OPTIONS[0];
  const matchScoreValue =
    JOB_MATCH_SCORE_OPTIONS.find((o) => o.value === (matchScore || "")) ||
    JOB_MATCH_SCORE_OPTIONS[0];
  const matchDurationValue =
    JOB_MATCH_DURATION_OPTIONS.find((o) => o.value === (matchDuration || "")) ||
    JOB_MATCH_DURATION_OPTIONS[0];

  if (asSidebar) {
    return (
      <Sidebar
        size="lg"
        open={open}
        title={
          <div>
            Filter
            <Button
              className="add-new-user"
              color="link"
              onClick={onSearch}
              style={
                width < 576
                  ? { marginLeft: "12px", color: themecolor }
                  : { marginLeft: "140px", color: themecolor }
              }
            >
              Search
            </Button>
            <Button
              className="add-new-user"
              color="link"
              onClick={onClear}
              style={{ color: themecolor }}
            >
              Clear
            </Button>
          </div>
        }
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
      >
        <Row noGutters>
          <Col md="12" className="mt-1">
            <SortSelect sortBy={sortBy} onSortChange={onSortChange} />
          </Col>
          {onMatchScoreChange ? (
            <Col md="12" className="mt-1">
              <Label className="mb-25" style={{ fontSize: "13px" }}>
                Match Score
              </Label>
              <Select
                value={matchScoreValue}
                options={JOB_MATCH_SCORE_OPTIONS}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(opt) => onMatchScoreChange(opt?.value || "")}
                {...selectMenuPortalProps}
              />
            </Col>
          ) : null}
          {onMatchDurationChange ? (
            <Col md="12" className="mt-1">
              <Label className="mb-25" style={{ fontSize: "13px" }}>
                Match Duration
              </Label>
              <Select
                value={matchDurationValue}
                options={JOB_MATCH_DURATION_OPTIONS}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(opt) => onMatchDurationChange(opt?.value || "")}
                {...selectMenuPortalProps}
              />
            </Col>
          ) : null}
          {onProfileChange ? (
            <Col md="12" className="mt-1">
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
                {...selectMenuPortalProps}
              />
            </Col>
          ) : null}
        </Row>
      </Sidebar>
    );
  }

  return (
    <Row className="mb-1 gx-2">
      <Col md={4} sm={6} xs={12} className="mb-1">
        <SortSelect sortBy={sortBy} onSortChange={onSortChange} />
      </Col>
      {onProfileChange ? (
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
            {...selectMenuPortalProps}
          />
        </Col>
      ) : null}
    </Row>
  );
};

export default JobOpeningMatchFilters;
