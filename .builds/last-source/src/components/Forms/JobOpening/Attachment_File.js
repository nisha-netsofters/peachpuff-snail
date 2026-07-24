import React, { useState } from "react";
import { Col, Input, Label, Row } from "reactstrap";

const Attachment_File = ({
  setJobDescriptionFileValidation,
  isRecruiter,
  fileOnChangeHandler = () => {},
}) => {
  const [focus, setIsfocus] = useState(null);
  const themecolor = localStorage.getItem("themecolor");
  return (
    <div>
      <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
        <div>
          <h4>Attachment Information</h4>
        </div>

        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>Job Description</Label>
            <Input
              disabled={isRecruiter}
              type="file"
              id="jobDescriptionFile"
              accept=".pdf"
              name="customFile"
              onFocus={() => setIsfocus("customFile")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "customFile" && themecolor,
              }}
              onChange={(e) => {
                setJobDescriptionFileValidation(e);
                fileOnChangeHandler(e);
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Attachment_File;
