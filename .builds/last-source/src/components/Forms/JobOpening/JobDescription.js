import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import CandidateActions from "../../../redux/candidate/actions";
import { useHistory } from "react-router-dom";

function JobDescription({
  jobOpening,
  open,
  mobile,
  setOpen,
  setVerified,
  verified,
  setMobile,
  setEmail,
  email,
}) {
  const { candidate } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const [interested, setInterested] = useState(false);

  useEffect(() => {
    if (candidate?.email === "error" || candidate?.mobile === "error") {
    } else if (JSON.stringify(candidate) === "{}") {
      setVerified(true);
    }
  }, [candidate]);

  useEffect(() => {
    if (verified === true) {
      setOpen(false);
    }
  }, [verified]);

  const handleSubmit = () => {
    dispatch({
      type: CandidateActions.CHECK_CANDIDATE,
      payload: { mobile, email },
    });
  };
  return (
    <>
      <Modal isOpen={open} className="modal-dialog-centered modal-xl">
        <ModalBody>
          <h2 style={{ textAlign: "center" }}>Job Description</h2>
          <Row>
            <Col lg="12" md="12" xs="12" sm="12">
              <h6
                style={{
                  backgroundColor: "#f9e4e4",
                  display: "flex",
                  color: "red",
                  justifyContent: "center",
                  borderRadius: "5px",
                  padding: "15px 5px 15px 5px",
                }}
              >
                *Note: Read the below job description. If your are willing to
                work with us, kindly provide your mobile number, email address
                and register yourself.
              </h6>
            </Col>
          </Row>
          <Row style={{ marginTop: "5px" }}>
            <Col md="12" lg="5">
              <Card className="mb-1">
                <CardBody>
                  <h5>
                    <b>Job Title</b>
                  </h5>
                  <h6>
                    {jobOpening?.jobCategory?.jobCategory} -{" "}
                    {jobOpening?.industries?.industryCategory}
                  </h6>
                </CardBody>
              </Card>

              <Card className="mb-1">
                <CardBody>
                  <h5>
                    <b>Salary Range</b>
                  </h5>
                  <h6>
                    UP TO {jobOpening?.salaryRangeStart}-
                    {jobOpening?.salaryRangeEnd}/-PER MONTH
                  </h6>
                </CardBody>
              </Card>

              <Card className="mb-1">
                <CardBody>
                  <h5>
                    <b>Gender</b>
                  </h5>
                  <h6>{jobOpening?.gender}</h6>
                </CardBody>
              </Card>

              <Card className="mb-1">
                <CardBody>
                  <h5>
                    <b>Experience</b>{" "}
                  </h5>
                  <h6>{jobOpening?.minExperienceYears}</h6>
                </CardBody>
              </Card>

              <Card className="mb-1">
                <CardBody>
                  <h5>
                    <b>Job Location</b>
                  </h5>
                  <h6>{jobOpening?.jobLocation}</h6>
                </CardBody>
              </Card>
            </Col>
            <Col lg={7} md={12} className="mb-1">
              <Card style={{ padding: "20px", height: "100%" }}>
                <h5>
                  <b>Description</b>
                </h5>
                <br></br>
                <h6>
                  <b>Job Timing</b>:{" "}
                  {moment(jobOpening?.jobStartTime).format("LT")} to{" "}
                  {moment(jobOpening?.jobEndTime).format("LT")}
                </h6>
                <h6>
                  <b>Key Role</b>: {jobOpening?.keyRole}
                </h6>
                <h6>
                  <b>Work type</b>: {jobOpening?.workType}
                </h6>
                <h6>
                  <b>Qualification</b>: {jobOpening?.qualification}
                </h6>
                <h6>
                  <b>Working days</b>: {jobOpening?.workingDays}
                </h6>
              </Card>
            </Col>
          </Row>
          <Card className="pb-2">
            {interested ? (
              <>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
                  }}
                >
                  Enter Email Id
                </Row>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
                  }}
                >
                  <Input
                    style={{ width: "250px" }}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    placeholder="Enter Email"
                    type="email"
                  />
                </Row>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
                  }}
                >
                  Enter Mobile Number
                </Row>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
                  }}
                >
                  <Input
                    value={mobile}
                    maxLength={10}
                    style={{ width: "250px" }}
                    onChange={(e) =>
                      setMobile(e.target?.value?.replace(/\D/g, ""))
                    }
                    placeholder="Enter Number"
                    type="text"
                  />
                </Row>
                <Row
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    color="primary"
                    style={{ width: "150px" }}
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Apply
                  </Button>
                </Row>
              </>
            ) : (
              <>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
                  }}
                >
                  Are you intrested in this profile?
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col
                    lg="6"
                    md="6"
                    xs="6"
                    sm="6"
                    style={{
                      display: "flex",
                      justifyContent: "right",
                    }}
                  >
                    <Button
                      color="primary"
                      style={{ width: "100px" }}
                      onClick={() => setInterested(true)}
                    >
                      Yes
                    </Button>
                  </Col>

                  <Col lg="6" md="6" xs="6" sm="6">
                    <Button
                      color="primary"
                      style={{ width: "100px" }}
                      onClick={() => history.goBack()}
                    >
                      No
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </ModalBody>
      </Modal>

      {/* <Modal
                isOpen={isregister}
                className='modal-dialog-centered'
            >
                <ModalHeader className='bg-transparent' ></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <h1 className='text-center mb-1' style={{ color: "#323D76" }} >Already Registered!!</h1>
                    <p className='text-center'> If you want to apply for this job opportunity please feel free to visit UNIQUE WORLD PLACEMENTGMENT MANAGEMENT or contact us on +91-9974877260</p>
                </ModalBody>
            </Modal> */}
    </>
  );
}

export default JobDescription;
