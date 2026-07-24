import React, { useState } from "react";
import { Row, Col, Input, Label, Button } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { ArrowLeft, ArrowRight } from "react-feather";

const Basic = ({
  candidate,
  stepper,
  disabled,
  setCandidate,
  gender,
  setGender,
  handleChange = () => { },
}) => {
  const [firstnameError, setFirstNameError] = useState(false);
  const [lastNameError, setlastNameError] = useState(false);
  const [mobileError, setmobileError] = useState(false);
  const [alternateMobileError, setAlternateMobileError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const genderOptions = [
    { value: "male", id: "gender", label: "Male" },
    { value: "female", id: "gender", label: "Female" },
  ];

  const onSubmit = async () => {
    if (
      candidate?.firstname === undefined ||
      candidate?.firstname?.length === 0 ||
      candidate?.lastname === undefined ||
      candidate?.lastname?.length === 0 ||
      candidate?.mobile === undefined ||
      candidate?.mobile?.length !== 10 ||
      candidate?.alternateMobile === undefined ||
      candidate?.alternateMobile?.length !== 10 ||
      candidate?.email === undefined ||
      candidate?.email?.length === 0
    ) {
      if (
        candidate?.firstname === undefined ||
        candidate?.firstname?.length === 0
      ) {
        setFirstNameError(true);
      }
      if (
        candidate?.lastname === undefined ||
        candidate?.lastname?.length === 0
      ) {
        setlastNameError(true);
      }
      if (candidate?.mobile === undefined || candidate?.mobile?.length !== 10) {
        setmobileError(true);
      }
      if (
        candidate?.alternateMobile === undefined ||
        candidate?.alternateMobile?.length !== 10
      ) {
        setAlternateMobileError(true);
      }
      if (candidate?.email === undefined || candidate?.email?.length === 0) {
        setEmailError(true);
      }
    } else {
      stepper?.next();
    }
  };
  const [focus, setIsfocus] = useState(null);
  return (
    <div>
      {/* BASIC INFO */}

      <Row className="gy-1 pt-75">
        <div>
          <h4>Basic Info</h4>
        </div>
        <Col md={6} xs={12}>
          <div>
            <Label id="firstname">First Name</Label>
            <Input
              id="firstname"
              name="firstname"
              onFocus={() => setIsfocus("firstname")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "firstname" && "#105996",
              }}
              className="w-100"
              invalid={firstnameError}
              type="text"
              placeholder={"Enter FirstName"}
              value={candidate?.firstname}
              onChange={(e) => {
                handleChange(e);
                setFirstNameError(false);
              }}
            />
            {firstnameError === true ? (
              <p style={{ color: "red" }}>Enter valid Name</p>
            ) : null}
          </div>
        </Col>
        <Col md={6} xs={12}>
          <div>
            <Label id="lastname">Last Name</Label>
            <Input
              id="lastname"
              name="lastname"
              onFocus={() => setIsfocus("lastname")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "lastname" && "#105996",
              }}
              className="w-100"
              type="text"
              invalid={lastNameError}
              value={candidate?.lastname}
              // value={searchTerm}
              placeholder={"Enter Lastname"}
              onChange={(e) => {
                handleChange(e);
                setlastNameError(false);
              }}
            />
            {lastNameError === true ? (
              <p style={{ color: "red" }}>Enter valid Name</p>
            ) : null}
          </div>
        </Col>
        <Col md={6} xs={12}>
          <div>
            <Label id="email">Email</Label>
            <Input
              disabled={disabled}
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
              value={candidate?.email}
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase();
                handleChange(e);
                setEmailError(false);
              }}
            />
            {emailError === true ? (
              <p style={{ color: "red" }}>Enter valid Email</p>
            ) : null}
          </div>
        </Col>
        <Col md={6} xs={12}>
          <div>
            <Label id="mail">Mobile</Label>
            <Input
              disabled={disabled}
              id="mobile"
              onFocus={() => setIsfocus("mobile")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "mobile" && "#105996",
              }}
              className="w-100"
              type="number"
              invalid={mobileError}
              placeholder={"Enter Mobile"}
              value={candidate?.mobile}
              onChange={(e) => {
                handleChange(e);
                setmobileError(false);
              }}
            />
            {mobileError === true ? (
              <p style={{ color: "red" }}>Enter valid Mobile</p>
            ) : null}
          </div>
        </Col>
        <Col md={6} xs={12}>
          <div>
            <Label id="number">Father / Mother Contact</Label>
            <Input
              id="alternateMobile"
              onFocus={() => setIsfocus("alternateMobile")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "alternateMobile" && "#105996",
              }}
              className="w-100"
              placeholder={"Enter Father/Mother"}
              type="text"
              invalid={alternateMobileError}
              minLength={10}
              maxLength={10}
              value={candidate?.alternateMobile}
              onChange={(e) => {
                setCandidate({
                  ...candidate,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                });
                setAlternateMobileError(false);
              }}
            />
            {alternateMobileError === true ? (
              <p style={{ color: "red" }}>
                Enter valid Alternate Mobile Number
              </p>
            ) : null}
          </div>
        </Col>

        <Col md={6} xs={12}>
          <Label for="role-select">Gender</Label>
          <Select
            id="gender"
            value={gender}
            placeholder="Select Gender"
            options={genderOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setGender(e);
              handleChange(e);
            }}
          />
        </Col>
      </Row>
      <Row className="mt-2" style={{ display: "flex" }}>
        <Col style={{ textAlign: "right" }}>
          <Button
            type="submit"
            color="defult"
            style={{ color: 'white', backgroundColor: "#105996" }}
            onClick={() => onSubmit()}
            className="btn-next"
          >
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Basic;
