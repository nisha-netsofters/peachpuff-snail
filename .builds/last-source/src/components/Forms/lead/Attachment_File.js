import React, { useState } from "react";
import { Col, Input, Label, Row } from "reactstrap";

const Attachment_File = ({ fileOnChangeHandler = () => {} }) => {
  const themecolor = localStorage.getItem("themecolor");
  const [focus, setIsfocus] = useState(null);
  return (
    <div>
      <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
        <div>
          <h4>Attachment Information</h4>
        </div>

        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>Visiting card</Label>
            <Input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              id="visitingCard"
              name="customFile"
              onFocus={() => setIsfocus("customFile")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "customFile" && themecolor,
              }}
              onChange={(e) => fileOnChangeHandler(e)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Attachment_File;
