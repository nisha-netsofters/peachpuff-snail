import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import CandidateActions from "../../../redux/candidate/actions";

function CandidateCheck({
  setDisabeled,
  mobile,
  email,
  setLoading,
  setVerified,
  stepper,
  setEmail,
  setMobile,
  setUpdate,
  setCandidate,
}) {
  const [isRegister, setIsRegister] = useState(false);
  const { candidate } = useSelector((state) => state);
  const [mobileError, setMobileError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (candidate?.msg === "Already registered") {
      setCandidate(candidate?.data);
      setUpdate(true);
      setLoading(false);
      setModalLoader(false);
      setVerified(true);
      setDisabeled(true);
      stepper?.next();
    } else if (candidate?.msg == false) {
      setUpdate(false);
      setVerified(true);
      setModalLoader(false);
      setDisabeled(true);
      stepper?.next();
    }
  }, [candidate]);

  const handleSubmit = () => {
    if (mobile?.length !== 10) {
      setMobileError(true);
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError(true);
    } else {
      setModalLoader(true);
      dispatch({
        type: CandidateActions.CHECK_CANDIDATE,
        payload: { mobile, email },
      });
    }
  };
  const [focus, setIsfocus] = useState(null);
  return (
    <>
      <Row style={{ justifyContent: "center" }}>
        <Col xl={6}>
          <div>
            <Label id="email">Email</Label>
            <Input
              // disabled={disabled}
              id="email"
              name="email"
              onFocus={() => setIsfocus("email")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "email" && "#105996",
              }}
              className="w-100"
              type="email"
              invalid={emailError}
              placeholder={"Enter Email"}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase());
              }}
            />
            {emailError === true ? (
              <p style={{ color: "red" }}>Enter valid Email</p>
            ) : null}
          </div>
        </Col>
      </Row>
      <Row style={{ justifyContent: "center", marginTop: "15px" }}>
        <Col xl={6}>
          <div>
            <Label id="mail">Mobile</Label>
            <Input
              id="mobile"
              onFocus={() => setIsfocus("mobile")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "mobile" && "#105996",
              }}
              className="w-100"
              type="text"
              maxLength={10}
              minLength={10}
              invalid={mobileError}
              placeholder={"Enter Mobile"}
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.replace(/\D/g, ""));
              }}
            />
            {mobileError === true ? (
              <p style={{ color: "red" }}>Enter valid Mobile</p>
            ) : null}
          </div>
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: "center", marginTop: "15px" }}>
          <Button
            type="button"
            className="add-new-user"
            color="defalt"
            style={{ backgroundColor: "#105996", color: "white" }}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </Col>
      </Row>

      <Modal isOpen={isRegister} className="modal-dialog-centered modal-md">
        <ModalHeader
          className="bg-transparent"
          toggle={() => {
            setIsRegister(false);
          }}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h1 className="text-center mb-1 text-primary">
            Already Registered!!
          </h1>
          <p className="text-center">
            {" "}
            If you want to apply for this job opportunity please feel free to
            visit UNIQUE WORLD PLACEMENTGMENT MANAGEMENT or contact us on
            +91-9974877260
          </p>
        </ModalBody>
      </Modal>
      <Modal
        className="modal-dialog-centered modal-xl modal-loader"
        isOpen={modalLoader}
      >
        <ModalBody>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ComponentSpinner />
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default CandidateCheck;
