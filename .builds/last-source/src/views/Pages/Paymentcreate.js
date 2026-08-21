import { City, State } from "country-state-city";
import React, { useEffect, useState } from "react";
import Select from "react-select";
// import planActions from "../../../redux/plan/actions";
import planActions from "../../redux/plan/actions";
import { tostify } from "../../components/Tostify";
import actions from "../../redux/payment/actions";

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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import userActions from "../../redux/user/actions";

const splitName = (fullName) => {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return {
    first: parts[0] || "",
    last: parts.slice(1).join(" ") || "",
  };
};

const normalizeMobile = (value) =>
  String(value || "").replace(/\D/g, "").slice(-10);

const Paymentcreate = () => {
  const slug = localStorage.getItem("slug");
  const params = useParams();
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setemail] = useState("");
  const [Mobilenumber, setMobilenumber] = useState("");
  const [Company, setCompany] = useState("");
  const [gst, setgst] = useState("");
  const [pannumber, setpannumber] = useState("");
  const [Street, setStreet] = useState("");
  const [zipcode, setzipcode] = useState("");
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const { planbyid } = useSelector((state) => state?.plans);
  const storeUser = useSelector((state) => state?.user?.user);
  const authUser = useSelector((state) => state?.auth?.user);
  const user = storeUser || authUser;

  // Load latest logged-in user (includes BillingDetails + clients)
  useEffect(() => {
    const userId = authUser?.id || storeUser?.id;
    if (userId) {
      dispatch({
        type: userActions.GET_LOGIN_USER_DETAIL,
        payload: userId,
      });
    }
  }, [authUser?.id, storeUser?.id, dispatch]);

  useEffect(() => {
    if (!user) return;

    const billing = user?.BillingDetails || {};
    const client = user?.clients || {};
    const fromName = splitName(
      user?.name || client?.companyowner || client?.companyOwner || ""
    );

    setfirstname(billing?.firstname || fromName.first || "");
    setlastname(billing?.lastname || fromName.last || "");
    setemail(billing?.email || user?.email || client?.email || "");
    setMobilenumber(
      normalizeMobile(
        billing?.Mobilenumber || user?.mobile || client?.mobile || ""
      )
    );
    setCompany(billing?.Company || client?.companyName || "");
    setgst(billing?.gst || "");
    setpannumber(billing?.pannumber || "");
    setStreet(billing?.address || user?.address || "");
    setzipcode(billing?.pincode || "");

    // Prefer saved billing select objects; else match string against states list later
    if (billing?.state && typeof billing.state === "object") {
      setSelectedState({
        ...billing.state,
        label: billing.state.label || billing.state.name,
        value: billing.state.value || billing.state.name,
        key: "state",
      });
    } else if (billing?.state || user?.state) {
      setSelectedState(billing?.state || user?.state);
    }

    if (billing?.city && typeof billing.city === "object") {
      setSelectedCity({
        ...billing.city,
        label: billing.city.label || billing.city.name,
        value: billing.city.value || billing.city.name,
        key: "city",
      });
    } else if (billing?.city || user?.city) {
      setSelectedCity(billing?.city || user?.city);
    }
  }, [user]);

  // If state was saved as a string name, resolve full State object (needs isoCode)
  useEffect(() => {
    if (!states?.length) return;
    const stateVal = selectedState;
    if (!stateVal) return;
    if (typeof stateVal === "object" && stateVal.isoCode) return;

    const name =
      typeof stateVal === "string"
        ? stateVal
        : stateVal?.name || stateVal?.label || stateVal?.value || "";
    const matched = states.find(
      (s) =>
        String(s.name).toLowerCase() === String(name).toLowerCase() ||
        String(s.isoCode).toLowerCase() === String(name).toLowerCase()
    );
    if (matched) {
      setSelectedState({
        ...matched,
        label: matched.name,
        value: matched.name,
        key: "state",
      });
    }
  }, [states, selectedState]);

  // Resolve city string after cities load for selected state
  useEffect(() => {
    if (!cities?.length) return;
    const cityVal = selectedCity;
    if (!cityVal) return;
    if (typeof cityVal === "object" && cityVal.stateCode) return;

    const name =
      typeof cityVal === "string"
        ? cityVal
        : cityVal?.name || cityVal?.label || cityVal?.value || "";
    const matched = cities.find(
      (c) => String(c.name).toLowerCase() === String(name).toLowerCase()
    );
    if (matched) {
      setSelectedCity({
        ...matched,
        label: matched.name,
        value: matched.name,
        key: "city",
      });
    }
  }, [cities, selectedCity]);

  const theamcolour = localStorage.getItem("themecolor");
  useEffect(() => {
    dispatch({
      type: planActions.GET_PLAN_BY_ID,
      payload: params,
    });
  }, []);

  useEffect(() => {
    states?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = "state";
    });
  }, [states]);
  useEffect(() => {
    cities?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = "city";
    });
  }, [cities]);
  useEffect(() => {
    const getStates = async () => {
      try {
        const result = await State.getStatesOfCountry("IN");
        setStates(result);
      } catch (error) {
        setStates([]);
      }
    };

    getStates();
  }, []);

  const Validations = async () => {
    const error = false;
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (firstname?.length < 2 || firstname === undefined)
      return tostify("Please Enter Valid First Name", error);
    else if (lastname?.length < 2 || lastname === undefined)
      return tostify(" Please Enter Valid Last Name", error);
    else if (!email || regex.test(email) === false)
      return tostify("  Please Enter Valid Email", error);
    else if (Mobilenumber?.length !== 10 || Mobilenumber === undefined)
      return tostify("Please Enter Valid Mobile Number", error);
    else if (
      selectedState?.value == undefined ||
      selectedState?.isoCode == undefined ||
      selectedState?.label == undefined ||
      selectedState?.length === 0 ||
      selectedState == ""
    )
      return tostify("Please Enter Valid State", error);
    else if (
      selectedCity?.value == undefined ||
      selectedCity?.stateCode == undefined ||
      selectedCity?.label == undefined ||
      selectedCity?.length === 0 ||
      selectedCity == ""
    )
      return tostify("Please Enter Valid City", error);
    else if (Street === undefined || Street?.length === 0)
      return tostify("Please Enter Street Address", error);
    else if (zipcode?.length < 5 || zipcode === undefined)
      return tostify("Please Enter Valid zipcode", error);

    return error;
  };
  async function handlecreatepayment() {
    const err = await Validations();
    if (err === false) {
      await dispatch({
        type: actions.CREATE_PAYMENT,
        payload: {
          totalAmountWithTax,
          price: planbyid?.price,
          tax: planbyid?.Tax,
          slug: slug,
          // planId: planbyid?.id,
          pincode: zipcode,
          pannumber,
          gst,
          address: Street,
          Company,
          email,
          lastname,
          planId: params?.id,
          firstname,
          Mobilenumber,
          city: selectedCity?.value,
          state: selectedState?.value,
        },
      });
      // window.open(res?.data);
      // setIsOpenPaymentQR(true);
    }
  }

  const totalTaxAmount = Math.round(planbyid?.taxAmount);
  const totalAmountWithTax =
    Number(totalTaxAmount) + Number(planbyid?.priceNumeric);

  useEffect(() => {
    const getCities = async () => {
      try {
        const result = await City.getCitiesOfState(
          "IN",
          selectedState?.isoCode
        );
        setCities(result);
      } catch (error) {
        setCities([]);
      }
    };

    getCities();
  }, [selectedState]);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          borderRadius: "1rem",
        }}
        className="mt-2"
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 4px 24px 0 rgba(34, 41, 47, 0.1)",
          }}
          className="px-3"
        >
          <div className="row">
            <div className="col-lg-7 card-body border-end">
              <h4 className=" mb-4">Billing Details</h4>
              <form>
                <div className="row g-3">
                  <Col md="6" className="mt-1">
                    <Label id="firstname">First Name</Label>
                    <Input
                      id="firstname"
                      name="firstname"
                      maxLength={200}
                      className="w-100"
                      type="text"
                      value={firstname}
                      placeholder={"Enter FirstName"}
                      onChange={(e) => {
                        setfirstname(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md="6" className="mt-1">
                    <Label id="lastname">Last Name</Label>
                    <Input
                      id="lastname"
                      name="lastname"
                      maxLength={200}
                      className="w-100"
                      type="text"
                      value={lastname}
                      placeholder={"Enter lastname"}
                      onChange={(e) => {
                        setlastname(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md="6" className="mt-1">
                    <Label id="lastname">Email Address</Label>
                    <Input
                      id="Email"
                      name="Email"
                      maxLength={200}
                      className="w-100"
                      type="email"
                      value={email}
                      placeholder={"Enter Email"}
                      onChange={(e) => {
                        setemail(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md="6" className="mt-1">
                    <Label id="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      maxLength={200}
                      className="w-100"
                      type="text"
                      value={Mobilenumber}
                      placeholder={"Enter Mobile Number"}
                      onChange={(e) => {
                        setMobilenumber(e.target.value.replace(/\D/g, ""));
                      }}
                    />
                  </Col>
                  <Col md="6" className="mt-1">
                    <Label id="lastname">Company name (Optional)</Label>
                    <Input
                      id="Companyname"
                      name="Companyname"
                      maxLength={200}
                      className="w-100"
                      type="text"
                      value={Company}
                      placeholder={"Enter Companyname"}
                      onChange={(e) => {
                        setCompany(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md="6" className="mt-1">
                    <Label id="gstnumber">GST Number (Optional)</Label>
                    <Input
                      id="gstnumber"
                      name="gstnumber"
                      maxLength={200}
                      className="w-100"
                      type="text"
                      value={gst}
                      placeholder={"Enter Your gst Number"}
                      onChange={(e) => {
                        setgst(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md="6" className="mt-1">
                    <Label id="pannumber">Pan number (Optional)</Label>
                    <Input
                      id="pannumber"
                      name="pannumber"
                      maxLength={200}
                      className="w-100"
                      type="text"
                      value={pannumber}
                      placeholder={"Enter Your gst Number"}
                      onChange={(e) => {
                        setpannumber(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md="6" className="mt-1">
                    <Label>State</Label>
                    <Select
                      menuPlacement="top"
                      id="state"
                      value={selectedState}
                      placeholder={"Select State"}
                      options={states}
                      className="react-select"
                      classNamePrefix="select"
                      onChange={(e) => {
                        setSelectedState(e);
                        setSelectedCity("");
                      }}
                    />
                  </Col>
                  <Col md="6" className="mt-1">
                    <Label for="role-select">City</Label>
                    <Select
                      menuPlacement="top"
                      id="city"
                      value={selectedCity}
                      placeholder={"Select City"}
                      options={cities}
                      className="react-select"
                      classNamePrefix="select"
                      onChange={(e) => {
                        setSelectedCity(e);
                      }}
                    />
                  </Col>
                  <Col md="6" className="mt-1">
                    <Label id="address">Address</Label>
                    <Input
                      id="StreetAddress"
                      name="StreetAddress"
                      maxLength={200}
                      className="w-100"
                      type="text"
                      value={Street}
                      placeholder={"Enter Address"}
                      onChange={(e) => {
                        setStreet(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md="6" className="mt-1">
                    <Label id="lastname">Pin Code</Label>
                    <Input
                      id="zipcode"
                      name="zipcode"
                      maxLength={10}
                      className="w-100"
                      type="text"
                      value={zipcode}
                      placeholder={"Enter Pin Code"}
                      onChange={(e) => {
                        setzipcode(e.target.value.replace(/\D/g, ""));
                      }}
                    />
                  </Col>
                </div>
              </form>
            </div>
            <div className="col-lg-5 card-body">
              <h4 className="mb-2">Order Summary</h4>
              <div
                style={{
                  backgroundColor: "#F9F9FA",
                  borderRadius: "1rem",
                }}
                className="bg-lighter p-3 mt-4"
              >
                <div className="d-flex flex-column justify-content-center text-left">
                  <h3 className="mb-2 bold">{planbyid?.planName}</h3>
                  <h1
                    style={{
                      color: theamcolour,
                    }}
                    className="text-heading display-5 mb-1"
                  >
                    {`₹ ${planbyid?.price}`}
                  </h1>
                  <ul>
                    <li>Unlimited Interview Request</li>
                    <li>
                      {" "}
                      {`Validate For ${planbyid?.planFeature?.validate_days} Days`}
                    </li>
                    <li>New Upgrade Profile Shown On Top Priority</li>
                    <li>Downloading With Saved Profile</li>
                    <li>
                      Unlimited New Candidates Response By Mail Notification
                    </li>
                  </ul>
                  {/* <p className="fs-6">Unlimited Interview Request</p>
                  <p className="fs-6">
                    {`Validate For ${planbyid?.planFeature?.validate_days} Days`}
                  </p>
                  <p className="fs-6">
                    New Upgrade Profile Shown On Top Priority
                  </p>
                  <p className="fs-6">Downloading With Saved Profile</p>
                  <p className="fs-6">
                    Unlimited New Candidates Response By Mail Notification
                  </p>
                  <p className="fs-6">
                    Unlimited New Candidates Response By WhatsApp Notification
                  </p> */}
                  {/* <p
                    className=".fs-6 text"
                    style={{
                      marginTop: "1rem",
                      marginLeft: "5px",
                    }}
                  >{` for ${planbyid?.planFeature?.validate_days} days`}</p> */}
                </div>
                {/* <div className="d-grid">
                  <button
                    style={{
                      backgroundColor: "#E9E7FD",
                    }}
                    type="button"
                    data-bs-target="#pricingModal"
                    data-bs-toggle="modal"
                    className="btn btn-label-primary waves-effect"
                  >
                    Change Plan
                  </button>
                </div>
                   */}
              </div>
              <div>
                <div
                  style={{
                    margin: "10px",
                  }}
                  className="d-flex justify-content-between align-items-center"
                >
                  <p className="mb-0">Subtotal</p>
                  <h4 className="mb-0">{`₹ ${planbyid?.price}`}</h4>
                </div>
                <div
                  style={{
                    margin: "10px",
                  }}
                  className="d-flex justify-content-between align-items-center m-[10px]"
                >
                  <p className="mb-0">
                    Tax
                    <span
                      style={{
                        fontSize: "12px",
                      }}
                      className="bold justify-content-between align-items-center"
                    >{` ( ${planbyid?.Tax}% ) `}</span>
                  </p>
                  <h4 className="mb-0">{`₹ ${totalTaxAmount}`}</h4>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center pb-1">
                  <p className="mb-0">Total</p>
                  <h4 className="mb-0">{`₹ ${totalAmountWithTax}`}</h4>
                </div>
                <div className="d-grid mt-3">
                  <button
                    style={{
                      backgroundColor: theamcolour,
                      color: "white",
                    }}
                    onClick={() => handlecreatepayment()}
                    className="btn waves-effect waves-light"
                  >
                    <span className="me-2">Proceed with Payment</span>
                    <i className="ti ti-arrow-right scaleX-n1-rtl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Paymentcreate;
