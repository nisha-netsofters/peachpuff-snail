import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import Sidebar from "@components/sidebar";
import { Row, Col, Label, Button } from "reactstrap";
import { selectThemeColors } from "@utils";
import "@styles/react/libs/react-select/_react-select.scss";
import { useSelector } from "react-redux";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";

const Filter = ({
  users,
  handleFilter = () => {},
  handleFilterToggleMode = () => {},
  clear,
  setclear = () => {},
  setFilterToggleMode = () => {},
  toggleSidebar,
  open,
}) => {
  const { width } = useBreakpoint();
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const jobCategories = useSelector((state) => state.jobCategory.results);
  const [selectTempUser, setSelectTempUser] = useState(null);
  const [jobCategory, setjobCategory] = useState(null);
  const [createdWithin, setCreatedWithin] = useState(null);

  const createdWithinOptions = [
    { value: "1day", label: "Last 1 Day" },
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "12months", label: "Last 12 Months" },
  ];

  const jobCategoryOptions = (jobCategories || []).map((item) => ({
    label: item.jobCategory,
    value: item.id,
  }));

  const recruiterOptions = (users || []).map((u) => ({
    value: u.id,
    label: u.name,
  }));

  const handleFilterData = () => {
    const filterdata = {};
    if (selectTempUser?.value) {
      filterdata.recruiterId = selectTempUser.value;
    }
    if (jobCategory?.value) {
      filterdata.jobCategoryId = jobCategory.value;
    }
    if (createdWithin?.value) {
      filterdata.createdWithin = createdWithin.value;
    }
    handleFilter(filterdata);
    handleFilterToggleMode(false);
  };

  const handleClear = () => {
    setSelectTempUser(null);
    setjobCategory(null);
    setCreatedWithin(null);
    handleFilter({});
    handleFilterToggleMode(false);
    setclear(false);
  };

  useEffect(() => {
    if (clear === true) {
      setSelectTempUser(null);
      setjobCategory(null);
      setCreatedWithin(null);
      setclear(false);
    }
  }, [clear, setclear]);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Escape") {
        setFilterToggleMode(false);
      }
      if (event.key === "Enter") {
        document.getElementById("jobOpeningHandleFilterData")?.click();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [setFilterToggleMode]);

  return (
    <Sidebar
      size="lg"
      open={open}
      title={
        <div>
          Filter
          <Button
            id="jobOpeningHandleFilterData"
            className="add-new-user"
            color="link"
            onClick={handleFilterData}
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
            onClick={handleClear}
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
      <Fragment>
        <Row noGutters>
          <Col md="12" className="mt-1">
            <Label>Recruiter</Label>
            <Select
              menuPlacement="auto"
              value={selectTempUser}
              placeholder="Select Recruiter"
              options={recruiterOptions}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              isClearable
              onChange={(e) => setSelectTempUser(e)}
            />
          </Col>
          <Col md="12" className="mt-1">
            <Label>Job Category</Label>
            <Select
              menuPlacement="auto"
              value={jobCategory}
              placeholder="Select Job Category"
              options={jobCategoryOptions}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              isClearable
              onChange={(e) => setjobCategory(e)}
            />
          </Col>
          <Col md="12" className="mt-1">
            <Label>Created Within</Label>
            <Select
              menuPlacement="auto"
              value={createdWithin}
              placeholder="Select days / period"
              options={createdWithinOptions}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              isClearable
              onChange={(e) => setCreatedWithin(e)}
            />
          </Col>
        </Row>
      </Fragment>
    </Sidebar>
  );
};

export default Filter;
