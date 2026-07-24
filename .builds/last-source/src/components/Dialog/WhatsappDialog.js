import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { selectThemeColors } from "@utils";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
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
import Loader from "./Loader";
import moment from "moment";
import { tostifyError } from "../Tostify";

function WhatsappDialog({
  loading,
  setShowWPModal,
  showWPModal,
  setClientData,
  clientData,
  WPnumber,
}) {
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [focus, setIsfocus] = useState(null);
  const [selectindustries, setSelectIndustries] = useState([]);
  const [am, setAm] = useState();
  const [pm, setPm] = useState();

  const handleChange = (e) => {
    if (e?.target?.id === undefined) {
      if (e.key === undefined) {
        setClientData({ ...clientData, [e.id]: e.value });
      } else {
        setClientData({ ...clientData, [e.key]: e.id });
      }
    } else {
      setClientData({
        ...clientData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const [negotiable, setNegotiable] = useState();
  const [salaryRange, setSalaryRange] = useState("");
  const client = useSelector((state) => state?.auth?.user?.clients);

  const industries = useSelector((state) => state.industries);
  const negotiableOptions = [
    { value: "yes", id: "negotiable", label: "Yes" },
    { value: "no", id: "negotiable", label: "No" },
  ];
  const salaryRangeOptions = [
    {
      value: "10000 to 25000",
      id: "salaryRange",
      label: "10000 to 25000",
      start: "10000",
      end: "25000",
    },
    {
      value: "25000 to 50000",
      id: "salaryRange",
      label: "25000 to 50000",
      start: "25000",
      end: "50000",
    },
    {
      value: "50000 to 75000",
      id: "salaryRange",
      label: "50000 to 75000",
      start: "50000",
      end: "75000",
    },
    {
      value: "75000 to 100000",
      id: "salaryRange",
      label: "75000 to 100000",
      start: "75000",
      end: "100000",
    },
  ];

  useEffect(() => {
    if (client?.industries_relation) {
      const selectIndustriesArray = client.industries_relation.map(
        (relation) => ({
          label: relation.industries.industryCategory,
          value: relation.industries.id,
        })
      );

      setSelectIndustries(selectIndustriesArray);
    }
  }, [client]);
  useEffect(() => {
    if (client) {
      const firstRelation = client?.industries_relation[0];
      setClientData({
        companyName: client?.companyName,
        companyOwner: client?.companyowner,
        companyContactNo: client?.mobile,
        companyEmail: client?.email,
        companyWebsite: client?.website,
        industriesId: firstRelation.industries.id,
        industriesName: firstRelation.industries.industryCategory,
      });
    }
  }, [client]);

  const handleSubmit = () => {
    if (
      clientData?.companyName !== "" &&
      clientData?.companyOwner !== "" &&
      clientData?.companyContactNo !== "" &&
      clientData?.companyEmail !== "" &&
      clientData?.industriesName !== "" &&
      clientData?.basicSkill &&
      clientData?.jobEndTimeFormat &&
      clientData?.jobLocation &&
      clientData?.jobStartTimeFormat &&
      clientData?.keyRole &&
      clientData?.negotiable &&
      clientData?.salaryRange
    ) {
      const predefinedText = encodeURIComponent(
        `We Are Hiring.\n\n\n*Company Name:* ${
          clientData?.companyName
        }\n\n*Contact Person:* ${clientData?.companyOwner}\n\n*Email:* ${
          clientData?.companyEmail
        }\n\n*Contact Number:* ${clientData?.companyContactNo}\n\n*Website:* ${
          clientData?.companyWebsite || "N/A"
        }\n\n*Type of Industry:* ${clientData?.industriesName}\n\n*Job Time:* ${
          clientData?.jobStartTimeFormat
        } to ${clientData?.jobEndTimeFormat}\n\n*Salary Range:* ${
          clientData?.salaryRange
        }\n\n*Negotiable:* ${clientData?.negotiable}\n\n*Job Location:* ${
          clientData?.jobLocation
        }\n\n*Basic Skills Required:* ${
          clientData?.basicSkill
        }\n\n*Key Role and Responsibilities:* ${
          clientData?.keyRole
        }\n\n\n*Benefits from company for Employees :-* \n\n*Working Days:* ${
          clientData?.workingDays || "N/A"
        }\n\n*PL/SL/CL (Paid/Sick/Casual leave):* ${
          clientData?.PL_SL_CL || "N/A"
        }\n\n*Health Policy:* ${
          clientData?.healthPolicy || "N/A"
        }\n\n*PF/ESIC:* ${clientData?.pf_esic || "N/A"}\n\n*Other:* ${
          clientData?.other || "N/A"
        }`
      );
      window.open(`https://wa.me/91${WPnumber}?text=${predefinedText}`);
      setClientData([]);
    } else {
      tostifyError("Please Enter The Data");
    }
  };
  return (
    <Modal
      isOpen={showWPModal}
      toggle={() => setShowWPModal(!showWPModal)}
      className="modal-dialog-centered modal-xl"
    >
      <ModalHeader
        className="bg-transparent"
        toggle={() => {
          setShowWPModal(!showWPModal);
          setClientData([]);
        }}
      ></ModalHeader>
      {loading == true ? (
        <Loader loading={loading} theamcolour={themecolor} />
      ) : null}
      <ModalBody className="px-sm-5 pt-50 pb-5">
        <Row className="gy-1 pt-75">
          <div>
            <h4>Client Info</h4>
          </div>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="companyName">
                Company Name<span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                id="companyName"
                onFocus={() => setIsfocus("companyName")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "companyName" && themecolor,
                }}
                name="companyName"
                maxLength={200}
                className="w-100"
                type="text"
                placeholder={"Enter company name"}
                value={clientData?.companyName}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="companyowner">
                Company Owner<span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                id="companyOwner"
                onFocus={() => setIsfocus("companyOwner")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "companyOwner" && themecolor,
                }}
                name="companyOwner"
                className="w-100"
                maxLength={200}
                type="text"
                value={clientData?.companyOwner}
                placeholder={"Enter company owner"}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="companyContactNo">
                Contact Number<span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                id="companyContactNo"
                onFocus={() => setIsfocus("companyContactNo")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "companyContactNo" && themecolor,
                }}
                name="companyContactNo"
                className="w-100"
                type="text"
                maxLength={10}
                value={clientData?.companyContactNo}
                placeholder={"Enter contact number"}
                onChange={(e) => {
                  handleChange(e);
                  setClientData({
                    ...clientData,
                    [e.target.id]: e.target.value.replace(/\D/g, ""),
                  });
                }}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="companyEmail">
                Email<span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                id="companyEmail"
                onFocus={() => setIsfocus("companyEmail")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "companyEmail" && themecolor,
                }}
                name="companyEmail"
                maxLength={200}
                className="w-100"
                type="text"
                value={clientData?.companyEmail}
                placeholder={"Enter Email"}
                onChange={(e) => {
                  e.target.value = e.target.value.toLowerCase();
                  setClientData({
                    ...clientData,
                    [e.target.id]: e.target.value,
                  });
                }}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="companyWebsite">Web Site</Label>
              <Input
                id="companyWebsite"
                onFocus={() => setIsfocus("companyWebsite")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "companyWebsite" && themecolor,
                }}
                className="w-100"
                placeholder={"Web Site"}
                type="text"
                maxLength={250}
                value={clientData?.companyWebsite}
                onChange={(e) =>
                  setClientData({
                    ...clientData,
                    [e.target.id]: e.target.value,
                  })
                }
              />
            </div>
          </Col>
        </Row>
        <Row className="gy-1 pt-75 mt-75">
          <div>
            <h4>Job Description</h4>
          </div>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label>
                Industries <span style={{ color: "red" }}>*</span>
              </Label>
              <Select
                style={{ cursor: "pointer" }}
                id="industries"
                name="industries"
                value={selectindustries}
                placeholder="Select Industries"
                options={
                  industries?.length > 0 &&
                  industries?.filter((ele) => {
                    ele.label = ele?.industryCategory;
                    ele.value = ele?.id;
                    return ele;
                  })
                }
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setSelectIndustries(e);
                  if (clientData?.industries?.industryCategory) {
                    delete clientData?.industries;
                  }
                  setClientData({
                    ...clientData,
                    industriesId: e.value,
                    industriesName: e.label,
                  });
                }}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="noOfVacancy">
                Job Time Start <span style={{ color: "red" }}>*</span>
              </Label>
              <Flatpickr
                className="form-control"
                value={
                  clientData?.jobStartTime
                    ? new Date(clientData?.jobStartTime)
                    : new Date(am)
                }
                id="timepicker"
                onFocus={() => setIsfocus("timepicker")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "timepicker" && themecolor,
                }}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "h:i:K",
                }}
                onChange={(date) => {
                  setAm(date[0]);
                  setClientData({
                    ...clientData,
                    jobStartTimeFormat: moment(date[0]).format("h:mmA"),
                  });
                }}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="noOfVacancy">
                Job Time End <span style={{ color: "red" }}>*</span>
              </Label>
              <Flatpickr
                className="form-control"
                value={
                  clientData?.jobEndTime
                    ? new Date(clientData?.jobEndTime)
                    : new Date(pm)
                }
                id="timepicker"
                onFocus={() => setIsfocus("jobEndTime")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "jobEndTime" && themecolor,
                }}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "h:i:K",
                }}
                onChange={(date) => {
                  setPm(date[0]);
                  setClientData({
                    ...clientData,
                    jobEndTimeFormat: moment(date[0]).format("h:mmA"),
                  });
                }}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <Label id="salaryRangeStart">
              Salary Range<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              id="negotiable"
              value={salaryRange}
              placeholder="Select Salary Range"
              options={salaryRangeOptions}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                handleChange(e);
                setSalaryRange(e);
              }}
            />
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <Label for="role-select">
              Negotiable<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              id="negotiable"
              value={negotiable}
              placeholder="Select Negotiable"
              options={negotiableOptions}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setNegotiable(e);
                handleChange(e);
              }}
            />
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="jobLocation">
                Job Location (Full Address)
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                id="jobLocation"
                onFocus={() => setIsfocus("jobLocation")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "jobLocation" && themecolor,
                }}
                name="jobLocation"
                className="w-100"
                maxLength={200}
                type="textarea"
                placeholder={"Enter jobLocation"}
                value={clientData?.jobLocation}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="basicSkill">
                Basic Skills Required<span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                id="basicSkill"
                onFocus={() => setIsfocus("basicSkill")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "basicSkill" && themecolor,
                }}
                name="basicSkill"
                maxLength={500}
                className="w-100"
                type="textarea"
                placeholder={"Enter Basic Skill"}
                value={clientData?.basicSkill}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="keyRole">
                Key Role and Responsibilities
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                id="keyRole"
                onFocus={() => setIsfocus("keyRole")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "keyRole" && themecolor,
                }}
                name="keyRole"
                className="w-100"
                maxLength={500}
                type="textarea"
                placeholder={"Enter Key Role and Responsibilities"}
                value={clientData?.keyRole}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </Col>
        </Row>
        <Row className="gy-1 pt-75 mt-75">
          <div>
            <h4>If Any Benefits From Company For Employees </h4>
          </div>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="workingDays">Working Days</Label>
              <Input
                id="workingDays"
                onFocus={() => setIsfocus("workingDays")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "workingDays" && themecolor,
                }}
                name="workingDays"
                className="w-100"
                type="text"
                maxLength={7}
                placeholder={"Enter working days"}
                value={clientData?.workingDays}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="PL_SL_CL">PL/SL/CL (Paid/Sick/Casual leave)</Label>
              <Input
                id="PL_SL_CL"
                onFocus={() => setIsfocus("PL_SL_CL")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "PL_SL_CL" && themecolor,
                }}
                name="PL_SL_CL"
                className="w-100"
                maxLength={7}
                type="text"
                placeholder={"Enter leave"}
                value={clientData?.PL_SL_CL}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="healthPolicy">Health Policy</Label>
              <Input
                id="healthPolicy"
                onFocus={() => setIsfocus("healthPolicy")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "healthPolicy" && themecolor,
                }}
                name="healthPolicy"
                className="w-100"
                type="text"
                maxLength={200}
                placeholder={"Enter healthPolicy"}
                value={clientData?.healthPolicy}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="pf_esic">PF/ESIC</Label>
              <Input
                id="pf_esic"
                onFocus={() => setIsfocus("pf_esic")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "pf_esic" && themecolor,
                }}
                name="pf_esic"
                className="w-100"
                type="text"
                maxLength={8}
                placeholder={"Enter PF/ESIC"}
                value={clientData?.pf_esic}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </Col>
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="other">Other</Label>
              <Input
                id="other"
                onFocus={() => setIsfocus("other")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "other" && themecolor,
                }}
                name="other"
                className="w-100"
                maxLength={250}
                type="text"
                placeholder={"other"}
                value={clientData?.other}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <Button
            type="button"
            className="add-new-user"
            color="default"
            style={{ backgroundColor: themecolor, color: "white" }}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default WhatsappDialog;
