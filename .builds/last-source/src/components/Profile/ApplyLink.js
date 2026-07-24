// ** React Imports

import "cleave.js/dist/addons/cleave-phone.us";
import { Row, Col, Form, Input, Label, Button, CardBody } from "reactstrap";
// import { useSelector } from 'react-redux'

// import userActions from "../../redux/user/actions";

import { useSelector } from "react-redux";
import { tostifySuccess } from "../Tostify";
import { FaCopy } from "react-icons/fa";
import useBreakpoint from "../../utility/hooks/useBreakpoints";

const ApplyLink = () => {
  const currentUrl = window.origin;

  const slug = localStorage.getItem("slug");

  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const candidateurl = `${currentUrl}/${slug}/candidate/apply`;
  const clienturl = `${currentUrl}/${slug}/client-registration`;
  const { width } = useBreakpoint();

  const handleCopy = (link) => {
    const input = document.createElement("input");
    input.value = link;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    tostifySuccess("copied to clipboard");
  };
  return (
    <>
      <CardBody className="py-2 my-25">
        <Form className="pt-50" style={{ position: "relative" }}>
          <Row>
            <Col
              sm="10"
              className="mb-1"
              style={
                width < 470
                  ? {
                      width: "100%",
                    }
                  : {
                      width: "50%",
                    }
              }
            >
              <Label className="form-label" for="emailInput">
                Candidate Apply Link
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={candidateurl}
              />
            </Col>

            <Col
              sm="2"
              className=" d-flex align-items-center pt-1"
              style={
                width < 475
                  ? {
                      position: "absolute",
                      left: "80%",
                      top: "-10%",
                    }
                  : null
              }
            >
              <FaCopy
                size={25}
                color={themecolor}
                style={{ cursor: "pointer" }}
                onClick={() => handleCopy(candidateurl)}
              />
            </Col>

            <Col
              sm="10"
              className="mb-1"
              style={
                width < 481
                  ? {
                      width: "100%",
                    }
                  : {
                      width: "50%",
                    }
              }
            >
              <Label className="form-label" for="emailInput">
                Client Apply Link
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={clienturl}
              />
            </Col>

            <Col
              sm="2"
              className=" d-flex align-items-center pt-1"
              style={
                width < 481
                  ? {
                      position: "absolute",
                      left: "80%",
                      bottom: "36%",
                    }
                  : null
              }
            >
              <FaCopy
                size={25}
                color={themecolor}
                style={{ cursor: "pointer" }}
                onClick={() => handleCopy(clienturl)}
              />
            </Col>
          </Row>
        </Form>
      </CardBody>
    </>
  );
};

export default ApplyLink;
