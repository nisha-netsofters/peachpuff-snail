import React, { useState, useEffect } from "react";
import { Row, Col, Input, Label } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "../../../utility/Utils";

const Lead = ({ lead, setLead, handleChange = () => {} }) => {
  const [plan, setPlan] = useState();

  useEffect(() => {
    if (lead?.plan?.length > 0) {
      let label = "Enterprise";
      if (lead?.plan === "standard ") label = "Standard ";
      if (lead?.plan === "professional ") label = "Professional ";
      setPlan({ value: [lead?.plan], label });
    }
  }, []);

  const planOptions = [
    { value: "enterprise", id: "plan", label: "Enterprise" },
    { value: "standard", id: "plan", label: "Standard" },
    { value: "professional", id: "plan", label: "Professional" },
  ];
  const themecolor = localStorage.getItem("themecolor");
  const [focus, setIsfocus] = useState(null);
  return (
    <div>
      <Row className="gy-1 pt-75">
        <div>
          <h4>Lead</h4>
        </div>

        <Col lg={6} xs={12} xl={4}>
          <Label id="companyName">Company Name</Label>
          <Input
            type="text"
            name="companyName"
            onFocus={() => setIsfocus("companyName")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "companyName" && themecolor,
            }}
            id="companyName"
            maxLength={200}
            value={lead?.companyName}
            placeholder="Enter Company Name"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="contactPersonName">Contact Person Name</Label>
          <Input
            type="text"
            name="contactPersonName"
            id="contactPersonName"
            onFocus={() => setIsfocus("contactPersonName")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "contactPersonName" && themecolor,
            }}
            maxLength={200}
            value={lead?.contactPersonName}
            placeholder="Enter Contact Person Name"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="contactNumber">Contact Number</Label>
          <Input
            type="text"
            name="contactNumber"
            onFocus={() => setIsfocus("contactNumber")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "contactNumber" && themecolor,
            }}
            id="contactNumber"
            maxLength={10}
            value={lead?.contactNumber}
            placeholder="Enter Contact Number"
            onChange={(e) => {
              // handleChange(e)
              setLead({
                ...lead,
                [e.target.id]: e.target.value.replace(/\D/g, ""),
              });
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            onFocus={() => setIsfocus("email")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "email" && themecolor,
            }}
            value={lead?.email}
            maxLength={200}
            placeholder="Enter Email"
            onChange={(e) => {
              e.target.value = e.target.value.toLowerCase();
              setLead({ ...lead, [e.target.id]: e.target.value });
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="address">Address</Label>
          <Input
            type="text"
            name="address"
            id="address"
            onFocus={() => setIsfocus("address")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "address" && themecolor,
            }}
            value={lead?.address}
            maxLength={250}
            placeholder="Enter Address"
            onChange={(e) => {
              setLead({ ...lead, [e.target.id]: e.target.value });
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="city">City</Label>
          <Input
            type="text"
            name="city"
            id="city"
            onFocus={() => setIsfocus("city")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "city" && themecolor,
            }}
            value={lead?.city}
            maxLength={200}
            placeholder="Enter City"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="industries">Industries</Label>
          <Input
            type="text"
            name="industries"
            id="industries"
            onFocus={() => setIsfocus("industries")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "industries" && themecolor,
            }}
            maxLength={210}
            value={lead?.industries}
            placeholder="Enter Industries"
            onChange={(e) => {
              setLead({ ...lead, [e.target.id]: e.target.value });
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="profile">Profile</Label>
          <Input
            type="text"
            name="profile"
            id="profile"
            onFocus={() => setIsfocus("profile")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "profile" && themecolor,
            }}
            maxLength={200}
            value={lead?.profile}
            placeholder="Enter Profile"
            onChange={(e) => {
              setLead({ ...lead, [e.target.id]: e.target.value });
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label for="role-select">Plan</Label>
          <Select
            id="plan"
            value={plan}
            placeholder="Select Plan"
            options={planOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setPlan(e);
              handleChange(e);
              // setGenderValidation(e.value)
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="replacementDays">Replacement Days</Label>
          <Input
            type="text"
            name="replacementDays"
            onFocus={() => setIsfocus("replacementDays")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "replacementDays" && themecolor,
            }}
            id="replacementDays"
            maxLength={200}
            value={lead?.replacementDays}
            placeholder="Enter Replacement Days"
            onChange={(e) => {
              // handleChange(e)
              setLead({
                ...lead,
                [e.target.id]: e.target.value.replace(/\D/g, ""),
              });
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="annualCTC">Annual CTC</Label>
          <Input
            type="text"
            name="annualCTC"
            id="annualCTC"
            onFocus={() => setIsfocus("annualCTC")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "annualCTC" && themecolor,
            }}
            maxLength={200}
            value={lead?.annualCTC}
            placeholder="Enter Annual CTC"
            onChange={(e) => {
              setLead({
                ...lead,
                [e.target.id]: e.target.value.replace(/\D/g, ""),
              });
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="term">Term</Label>
          <Input
            type="text"
            name="term"
            id="term"
            onFocus={() => setIsfocus("term")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "term" && themecolor,
            }}
            value={lead?.term}
            placeholder="Enter Term"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="deposit">Deposit</Label>
          <Input
            type="text"
            name="deposit"
            onFocus={() => setIsfocus("deposit")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "deposit" && themecolor,
            }}
            id="deposit"
            maxLength={200}
            value={lead?.deposit}
            placeholder="Enter Deposit"
            onChange={(e) => {
              setLead({
                ...lead,
                [e.target.id]: e.target.value.replace(/\D/g, ""),
              });
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="mode">Mode</Label>
          <Input
            type="text"
            name="mode"
            id="mode"
            onFocus={() => setIsfocus("mode")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "mode" && themecolor,
            }}
            maxLength={200}
            value={lead?.mode}
            placeholder="Enter Mode"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="hr">HR</Label>
          <Input
            type="text"
            name="hr"
            id="hr"
            onFocus={() => setIsfocus("hr")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "hr" && themecolor,
            }}
            value={lead?.hr}
            maxLength={200}
            placeholder="Enter HR"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="requirements">Requirements</Label>
          <Input
            type="text"
            name="requirements"
            id="requirements"
            onFocus={() => setIsfocus("requirements")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "requirements" && themecolor,
            }}
            maxLength={200}
            value={lead?.requirements}
            placeholder="Enter Requirements"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="starRating">Star Rating</Label>
          <Input
            type="number"
            name="starRating"
            onFocus={() => setIsfocus("starRating")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "starRating" && themecolor,
            }}
            id="starRating"
            maxLength={200}
            value={lead?.starRating}
            placeholder="Enter Start Rating"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="remark1">Remark-1</Label>
          <Input
            type="text"
            name="remark1"
            id="remark1"
            onFocus={() => setIsfocus("remark1")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "remark1" && themecolor,
            }}
            maxLength={200}
            value={lead?.remark1}
            placeholder="Enter Remark"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="remark2">Remark-2</Label>
          <Input
            type="text"
            name="remark2"
            id="remark2"
            onFocus={() => setIsfocus("remark2")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "remark2" && themecolor,
            }}
            maxLength={200}
            value={lead?.remark2}
            placeholder="Enter Remark"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="remark3">Remark-3</Label>
          <Input
            type="text"
            name="remark3"
            id="remark3"
            onFocus={() => setIsfocus("remark3")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "remark3" && themecolor,
            }}
            maxLength={200}
            value={lead?.remark3}
            placeholder="Enter Remark"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Lead;
