import React, { Fragment, useState, useEffect } from "react";
import Select from "react-select";
import Sidebar from "@components/sidebar";
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
} from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useDispatch, useSelector } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import { selectThemeColors } from "../../../utility/Utils";
import actions from "./../../../redux/lead/actions";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";

const initialState = {
  companyName: "",
  contactPersonName: "",
  contactNumber: "",
  email: "",
  address: "",
  city: "",
  industries: "",
  profile: "",
  plan: "",
  replacementDays: "",
  annualCTC: "",
  term: "",
  deposit: "",
  mode: "",
  hr: "",
  requirements: "",
  starRating: "",
  remark1: "",
  remark2: "",
  remark3: "",
};

const Filter = ({
  setFilterData,
  setFilterToggleMode,
  handleFilter = () => {},
  toggleSidebar,
  open,
  handleFilterToggleMode = () => {},
  clear,
  setclear = () => {},
}) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(initialState);
  const [plan, setPlan] = useState();
  // const [inquiry, setInquiry] = useState()
  const { width } = useBreakpoint();
  const planOptions = [
    { value: "enterprise", id: "plan", label: "Enterprise" },
    { value: "standard", id: "plan", label: "Standard" },
    { value: "professional", id: "plan", label: "Professional" },
  ];

  const handleFilterChange = (id, value) => {
    setFilter({ ...filter, [id]: value });
  };

  const handleFilterData = async () => {
    const filterdata = {};
    for (const key in filter) {
      if (filter[key].length > 0) {
        filterdata[key] = filter[key];
      }
    }
    if (plan?.value?.length > 0) {
      filterdata.plan = plan.value;
    }
    handleFilter(filterdata);
    handleFilterToggleMode(false);
  };

  const handleClear = async () => {
    setPlan({ value: "", label: "Select Plan" });
    setFilter(initialState);
    await dispatch({
      type: actions.GET_LEAD,
      payload: {
        filterData: [],
        page: 1,
        perPage: 10,
      },
    });
    setFilterData([]);
    handleFilterToggleMode(false);
    setclear(false);
  };
  useEffect(() => {
    if (clear == true) {
      handleClear();
    }
  }, [clear]);
  useEffect(() => {
    const keyDownHandler = async (event) => {
      if (event.key === "Escape") {
        setFilterToggleMode(false);
      }
      if (event.key === "Enter") {
        document.getElementById("handleFilterData")?.click();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );

  const [focus, setIsfocus] = useState(null);
  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title={
          <>
            <div>
              Filter
              <Button
                id="handleFilterData"
                className="add-new-user"
                color="link"
                onClick={handleFilterData}
                style={
                  width < 576
                    ? { marginLeft: "12px", color: themecolor }
                    : { marginLeft: "140px", color: themecolor }
                }
              >
                Search
              </Button>
              <Button
                className="add-new-user "
                color="link"
                onClick={handleClear}
                style={{ color: themecolor }}
              >
                Clear
              </Button>
            </div>
          </>
        }
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        // onClosed={handleFilterToggleMode(false)}
      >
        <Fragment>
          <Row noGutters>
            <Col md="12" className="mt-1">
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
                value={filter?.companyName}
                placeholder="Enter Company Name"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="contactPersonName">Contact Person Name</Label>
              <Input
                type="text"
                name="contactPersonName"
                onFocus={() => setIsfocus("contactPersonName")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "contactPersonName" && themecolor,
                }}
                id="contactPersonName"
                maxLength={200}
                value={filter?.contactPersonName}
                placeholder="Enter Contact Person Name"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="contactNumber">Contact Number</Label>
              <Input
                type="text"
                maxLength={10}
                name="contactNumber"
                onFocus={() => setIsfocus("contactNumber")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "contactNumber" && themecolor,
                }}
                id="contactNumber"
                value={filter?.contactNumber}
                placeholder="Enter Contact Number"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="email">Email</Label>
              <Input
                type="email"
                name="email"
                onFocus={() => setIsfocus("email")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "email" && themecolor,
                }}
                maxLength={200}
                id="email"
                value={filter?.email}
                placeholder="Enter Email"
                onChange={(e) => {
                  handleFilterChange(e.target.id, e.target.value);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="address">Address</Label>
              <Input
                type="text"
                name="address"
                onFocus={() => setIsfocus("address")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "address" && themecolor,
                }}
                id="address"
                maxLength={200}
                value={filter?.address}
                placeholder="Enter Address"
                onChange={(e) => {
                  handleFilterChange(e.target.id, e.target.value);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
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
                maxLength={200}
                value={filter?.city}
                placeholder="Enter City"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="industries">Industries</Label>
              <Input
                type="text"
                name="industries"
                onFocus={() => setIsfocus("industries")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "industries" && themecolor,
                }}
                id="industries"
                maxLength={200}
                value={filter?.industries}
                placeholder="Enter Industries"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
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
                value={filter?.profile}
                placeholder="Enter Profile"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label for="role-select">Plan</Label>
              <Select
                menuPlacement="auto"
                id="plan"
                value={plan}
                placeholder="Select Plan"
                options={planOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setPlan(e);
                  handleFilterChange(e.target.id, e.target.value);
                  // setGenderValidation(e.value)
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
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
                maxLength={15}
                value={filter?.replacementDays}
                placeholder="Enter Replacement Days"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="annualCTC">Annual CTC</Label>
              <Input
                type="text"
                name="annualCTC"
                onFocus={() => setIsfocus("annualCTC")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "annualCTC" && themecolor,
                }}
                id="annualCTC"
                maxLength={15}
                value={filter?.annualCTC}
                placeholder="Enter Annual CTC"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
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
                maxLength={200}
                value={filter?.term}
                placeholder="Enter Term"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="deposit">Deposit</Label>
              <Input
                type="text"
                maxLength={15}
                name="deposit"
                id="deposit"
                onFocus={() => setIsfocus("deposit")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "deposit" && themecolor,
                }}
                value={filter?.deposit}
                placeholder="Enter Deposit"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
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
                value={filter?.mode}
                placeholder="Enter Mode"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
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
                maxLength={200}
                value={filter?.hr}
                placeholder="Enter HR"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
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
                value={filter?.requirements}
                placeholder="Enter Requirements"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="starRating">Star Rating</Label>
              <Input
                type="text"
                name="starRating"
                id="starRating"
                onFocus={() => setIsfocus("starRating")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "starRating" && themecolor,
                }}
                maxLength={20}
                value={filter?.starRating}
                placeholder="Enter Start Rating"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
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
                value={filter?.remark1}
                placeholder="Enter Remark"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
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
                value={filter?.remark2}
                placeholder="Enter Remark"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
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
                value={filter?.remark3}
                placeholder="Enter Remark"
                onChange={(e) => {
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  );
                }}
              />
            </Col>
          </Row>
        </Fragment>
      </Sidebar>
    </>
  );
};

export default Filter;
