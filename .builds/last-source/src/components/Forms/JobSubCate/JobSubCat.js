import React from "react";
import { Col, Input, Label, Row } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";

const JobSubCatForm = ({
  jobSubCat,
  categoryOptions = [],
  setNameValidation,
  handleChange = () => {},
  onCategoryChange = () => {},
}) => {
  const selectedCategory =
    categoryOptions.find((o) => o.value === jobSubCat?.jobCategoryId) || null;

  return (
    <div>
      <Row className="gy-1 pt-75">
        <div>
          <h4>Job Sub Category</h4>
        </div>
        <Col lg={12} xs={12} xl={12}>
          <Label>
            Job Category<span style={{ color: "red" }}>*</span>
          </Label>
          <Select
            value={selectedCategory}
            placeholder="Select Job Category"
            options={categoryOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => onCategoryChange(e)}
          />
        </Col>
        <Col lg={12} xs={12} xl={12}>
          <Label>
            Sub Category<span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            id="jobSubCategory"
            name="jobSubCategory"
            className="w-100"
            maxLength={200}
            type="text"
            placeholder="Enter Sub Category / Job Role"
            value={jobSubCat?.jobSubCategory || ""}
            onChange={(e) => {
              setNameValidation(e.target.value);
              handleChange(e);
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default JobSubCatForm;
