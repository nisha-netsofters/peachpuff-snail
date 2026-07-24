import React, { useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";

const Attachment_File = ({
  isRecruiter,
  onBoarding,
  update,
  fileOnChangeHandler = () => {},
}) => {
  const themecolor = localStorage.getItem("themecolor");
  const [focus, setIsfocus] = useState(null);
  return (
    <div>
      <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
        <div>
          <h4>Attachment Information</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <Label>
            Job Description<span style={{ color: "red" }}>*</span>
          </Label>
          <div style={{ display: "flex" }}>
            <Input
              disabled={isRecruiter}
              type="file"
              id="jobDescriptionFile"
              onFocus={() => setIsfocus("jobDescriptionFile")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "jobDescriptionFile" && themecolor,
              }}
              accept=".pdf"
              name="customFile"
              onChange={(e) => {
                fileOnChangeHandler(e);
              }}
            />
            {update && onBoarding?.jobDescriptionFile?.length > 0 ? (
              <Button
                type="button"
                className="add-new-user"
                color="link"
                onClick={() => window.open(onBoarding?.jobDescriptionFile)}
              >
                View
              </Button>
            ) : null}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Attachment_File;
