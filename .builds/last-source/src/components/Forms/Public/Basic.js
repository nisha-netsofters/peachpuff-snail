import React, { useState, useEffect } from "react";
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
  email: emailProp = "",
  mobile: mobileProp = "",
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

  // Sync gender select from AI-extracted candidate.gender
  useEffect(() => {
    const g = String(candidate?.gender || "").trim().toLowerCase();
    if (!g) return;
    if (g === "female" || g === "f" || g.includes("female")) {
      setGender({ value: "female", id: "gender", label: "Female" });
    } else if (g === "male" || g === "m" || /\bmale\b/.test(g)) {
      setGender({ value: "male", id: "gender", label: "Male" });
    }
  }, [candidate?.gender, candidate?.resumeParsedAt]);

  const resolvedEmail = String(
    candidate?.email || emailProp || ""
  ).trim();
  const resolvedMobile = String(candidate?.mobile || mobileProp || "").replace(
    /\D/g,
    ""
  );

  const onSubmit = async () => {
    const email = String(candidate?.email || emailProp || "").trim();
    const mobile = String(candidate?.mobile || mobileProp || "").replace(
      /\D/g,
      ""
    );
    const alternateMobile = String(candidate?.alternateMobile || "").replace(
      /\D/g,
      ""
    );
    const firstname = String(candidate?.firstname || "").trim();
    const lastname = String(candidate?.lastname || "").trim();

    // Keep email/mobile on candidate before moving next
    if (email || mobile) {
      setCandidate((prev) => ({
        ...(Array.isArray(prev) ? {} : prev || {}),
        email: email || prev?.email,
        mobile: mobile || prev?.mobile,
      }));
    }

    const firstnameInvalid = !firstname;
    const lastnameInvalid = !lastname;
    const mobileInvalid = mobile.length !== 10;
    const alternateMobileInvalid = alternateMobile.length !== 10;
    const emailInvalid = !email;

    setFirstNameError(firstnameInvalid);
    setlastNameError(lastnameInvalid);
    setmobileError(mobileInvalid);
    setAlternateMobileError(alternateMobileInvalid);
    setEmailError(emailInvalid);

    if (
      firstnameInvalid ||
      lastnameInvalid ||
      mobileInvalid ||
      alternateMobileInvalid ||
      emailInvalid
    ) {
      return;
    }

    stepper?.next();
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
              value={resolvedEmail}
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                setCandidate((prev) => ({
                  ...(Array.isArray(prev) ? {} : prev || {}),
                  email: value,
                }));
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
              type="text"
              inputMode="numeric"
              maxLength={10}
              invalid={mobileError}
              placeholder={"Enter Mobile"}
              value={resolvedMobile}
              onChange={(e) => {
                setCandidate((prev) => ({
                  ...(Array.isArray(prev) ? {} : prev || {}),
                  mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                }));
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
                setCandidate((prev) => ({
                  ...(Array.isArray(prev) ? {} : prev || {}),
                  alternateMobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                }));
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
