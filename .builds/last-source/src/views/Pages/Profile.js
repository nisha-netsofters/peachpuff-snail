// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Third Party Components
import { City, State } from "country-state-city";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { selectThemeColors } from "@utils";

import { User, Anchor } from "react-feather";

// ** Demo Components
import Tabs from "../../components/Profile/Tabs";
import Breadcrumbs from "@components/breadcrumbs";
import Profile from "../../components/Profile/Profile";
import Security from "../../components/Profile/Security";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { useDispatch, useSelector } from "react-redux";
import roleActions from "../../redux/role/actions";
import jobCategoryActions from "../../redux/jobCategory/actions";
import industriesActions from "../../redux/industries/actions";
import authActions from "../../redux/auth/actions";
import userActions from "../../redux/user/actions";

import Select from "react-select";
import clientActions from "../../redux/client/actions";
import Loader from "../../components/Dialog/Loader";
import moment from "moment/moment";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
import actions from "../../redux/user/actions";
import { tostify } from "../../components/Tostify";

const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: roleActions.ROLES });
  }, []);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const CustomBreadcrumbItem = ({ title, color, fontWeight }) => (
    <span
      style={{
        fontFamily: "Montserrat, Helvetica, Arial, serif",
        fontWeight: fontWeight,
        color,
      }}
    >
      {title}
    </span>
  );
  return (
    <Fragment>
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <h3 style={{ color: themecolor }}>
          <b>Profile</b>
        </h3>
      </div>

      {/* <Breadcrumbs
        breadCrumbTitle="Account Settings"
        breadCrumbParent="Pages"
        breadCrumbActive="Account Settings"
      /> */}
      <Row>
        <Col xs={12}>
          <Tabs
            className="mb-2"
            activeTab={activeTab}
            toggleTab={toggleTab}
            themecolor={themecolor}
          />

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Profile />
            </TabPane>
            <TabPane tabId="2">
              <Security />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Fragment>
  );
};

const ClientProfile = () => {
  const { clients } = useSelector((state) => state.auth.user);

  const currentUser = useSelector((state) => state.auth?.user);
  const { auth } = useSelector((state) => state);
  const { user } = useSelector((state) => state.user);
  const { currentPlan } = useSelector((state) => state.subscription);
  const { loading, isSuccess } = useSelector((state) => state.client);
  const [shouldRefreshUser, setShouldRefreshUser] = useState(false);
  const jobCategory = useSelector((state) => state.jobCategory.results);
  const industries = useSelector((state) => state.industries);
  const [client, setClient] = useState({});
  const [selectindustries, setSelectIndustries] = useState([]);
  const dispatch = useDispatch();
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);
  const [selectedJobCategory, setSelectedJobCategory] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [showUpgradeplan, setShowUpgradePlan] = useState(false);
  const subscriptionDate = new Date(currentUser?.subscription?.createdAt);
  subscriptionDate?.setDate(
    subscriptionDate.getDate() + currentUser?.subscription?.timeDuration
  );
  console.log("selectedJobCategory", selectedJobCategory);
  const date = new Date(currentUser?.subscription?.createdAt);
  const day = Number(currentPlan?.plan_features?.validate_days);
  console.info("-------------------------------");
  console.info("user => ", user);
  console.info("-------------------------------");
  // const date = new Date(currentUser.subscription.createdAt);
  // const day = Number(currentPlan?.plan_features?.validate_days);
  const expireDate = new Date(date).setDate(new Date(date).getDate() + day);
  // const expireDate = new Date(date)?.toISOString();
  // const expireDate = new Date(
  //   date.getTime() + day * 24 * 60 * 60 * 1000
  // ).toISOString();
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
  // useEffect(() => {
  //   setCities(user?.BillingDetails?.city);
  //   setStates(user?.BillingDetails?.state);
  //   setfirstname(user?.BillingDetails?.firstname);
  //   setlastname(user?.BillingDetails?.lastname);
  //   setemail(user?.BillingDetails?.email);
  //   setMobilenumber(user?.BillingDetails?.Mobilenumber);
  //   setCompany(user?.BillingDetails?.Company);
  //   setgst(user?.BillingDetails?.gst);
  //   setpannumber(user?.BillingDetails?.pannumber);
  //   setStreet(user?.BillingDetails?.address);
  //   setzipcode(user?.BillingDetails?.pincode);
  // }, [user]);

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

  useEffect(() => {
    const getStates = async () => {
      try {
        const result = await State?.getStatesOfCountry("IN");
        setStates(result);
      } catch (error) {
        setStates([]);
      }
    };
    getStates();
  }, []);
  useEffect(() => {
    setSelectedCity(user?.BillingDetails?.city);
    setSelectedState(user?.BillingDetails?.state);
    setfirstname(user?.BillingDetails?.firstname);
    setlastname(user?.BillingDetails?.lastname);
    setemail(user?.BillingDetails?.email);
    setMobilenumber(user?.BillingDetails?.Mobilenumber);
    setCompany(user?.BillingDetails?.Company);
    setgst(user?.BillingDetails?.gst);
    setpannumber(user?.BillingDetails?.pannumber);
    setStreet(user?.BillingDetails?.address);
    setzipcode(user?.BillingDetails?.pincode);
  }, [user]);
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
  let BillingDetails = {
    pincode: zipcode,
    pannumber,
    gst,
    address: Street,
    Company,
    email,
    lastname,
    firstname,
    Mobilenumber,
    city: selectedCity,
    state: selectedState,
  };
  async function handleSavechanges() {
    const err = await Validations();
    if (err === false) {
      await dispatch({
        type: actions.UPDATE_USER,
        payload: {
          id: user.id,
          data: { BillingDetails: BillingDetails },
          page: 1,
          perPage: 10,
        },
      });
      // window.open(res?.data);
      // setIsOpenPaymentQR(true);
    }
  }

  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );

  useEffect(() => {
    dispatch({
      type: industriesActions.GET_ALL_INDUSTRIES,
    });
    dispatch({
      type: jobCategoryActions.GET_ALL_JOBCAT,
    });
  }, []);
  useEffect(() => {
    if (clients?.industries_relation?.length > 0) {
      const selected = [];
      clients?.industries_relation?.forEach((ele) => {
        ele.label = ele?.industries?.industryCategory;
        ele.value = ele?.industries?.id;
        selected.push(ele);
      });
      setSelectIndustries(selected);
    }
    if (clients?.jobCategory_relation?.length > 0) {
      const selected = [];
      clients.jobCategory_relation?.forEach((ele) => {
        ele.label = ele?.jobCategory?.jobCategory;
        ele.value = ele?.jobCategory?.id;
        selected.push(ele);
      });
      setJobCategoryOptions(selected);
    }
  }, [clients]);

  useEffect(() => {
    if (clients) {
      setClient((prev) => ({ ...prev, ...clients }));
    }
  }, [clients]);

  useEffect(() => {
    if (isSuccess && shouldRefreshUser) {
      // Profile update completed successfully, now fetch fresh user data
      dispatch({
        type: userActions.GET_LOGIN_USER_DETAIL,
        payload: currentUser?.id,
      });
      setShouldRefreshUser(false);
    }
  }, [isSuccess, shouldRefreshUser]);

  useEffect(() => {
    if (user?.clients) {
      auth.user.clients = user?.clients;
      dispatch({
        type: authActions.UPDATE_AUTH_STATE,
        payload: auth,
      });
    }
  }, [user]);

  const onjobCategoryChange = (jobCategory) => {
    const data = [];
    jobCategory?.map((ele) => {
      if (ele.c_Id === undefined) {
        data.push(ele.value);
      } else {
        data.push(ele);
      }
    });
    setClient((prev) => ({ ...prev, jobCategory_relation: data }));
  };

  const onIndustriesChange = (industry) => {
    const data = [];
    industry?.map((ele) => {
      if (ele.c_Id === undefined) {
        data.push(ele.value);
      } else {
        data.push(ele);
      }
    });
    setClient((prev) => ({ ...prev, industries_relation: data }));
  };

  const handleSaveChanges = async () => {
    const id = client?.id || clients?.id;
    if (!id) {
      tostify("Client details not loaded, please refresh and try again.", false);
      return;
    }

    const industriesData =
      client?.industries_relation?.length > 0
        ? client.industries_relation
        : selectindustries?.map((ele) =>
            ele?.c_Id !== undefined ? ele : ele?.value ?? ele
          );

    const jobCategoryData =
      client?.jobCategory_relation?.length > 0
        ? client.jobCategory_relation
        : jobCategoryOptions?.map((ele) =>
            ele?.c_Id !== undefined ? ele : ele?.value ?? ele
          );

    const fm = {
      ...clients,
      ...client,
      industries_relation: industriesData,
      jobCategory_relation: jobCategoryData,
    };
    delete fm.jobCategories;

    // // Ensure bannerImage is included if it exists
    // if (clients?.bannerImage && typeof clients.bannerImage === "string") {
    //   fm.bannerImage = clients.bannerImage;
    // } else if (clients?.banner && typeof clients.banner === "string") {
    //   fm.bannerImage = clients.banner;
    // }
    
    dispatch({
      type: clientActions.UPDATE_CLIENT_PROFILE,
      payload: { id, data: fm },
    });
    // Trigger user refresh after profile update completes
    setShouldRefreshUser(true);
  };

  const handleWhatsappNotificationStatus = (data) => {
    console.log("handleWhatsappNotificationStatus data", data);
    dispatch({
      type: clientActions.WHATSAPP_NOTIFICATION_STATUS,
      payload: { id: client.id, data: data },
    });
  };
  const handleMailNotificationStatus = (data) => {
    console.log("handleMailNotificationStatus data", data);
    dispatch({
      type: clientActions.MAIL_NOTIFICATION_STATUS,
      payload: { id: client.id, data: data },
    });
  };

  const [activeTab, setactiveTab] = useState("1");
  const { width } = useBreakpoint();

  //   const [focus, setIsfocus] = useState(null);
  return (
    <>
      <Loader loading={loading} />
      <Fragment>
        <Card>
          <CardHeader className="border-bottom">
            {width > 800 ? (
              <Nav
                pills
                style={{
                  display: "flex",
                  margin: "0",
                }}
              >
                <NavItem>
                  <NavLink
                    active={activeTab === "1"}
                    onClick={() => setactiveTab("1")}
                    style={
                      activeTab === "1"
                        ? {
                            backgroundColor: themecolor,
                            color: "white",
                            borderColor: themecolor,
                            boxShadow: "0 4px 18px -4px" + themecolor,
                          }
                        : {}
                    }
                  >
                    <User size={18} className="me-50" />
                    <span className="fw-bold">Profile Details</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={activeTab === "2"}
                    onClick={() => setactiveTab("2")}
                    style={
                      activeTab === "2"
                        ? {
                            backgroundColor: themecolor,
                            color: "white",
                            borderColor: themecolor,
                            boxShadow: "0 4px 18px -4px" + themecolor,
                          }
                        : {}
                    }
                  >
                    <Anchor size={18} className="me-50" />
                    <span className="fw-bold">Billing Details</span>
                  </NavLink>
                </NavItem>
              </Nav>
            ) : (
              <div
                style={{
                  display: "flex",
                  fontSize: "1rem",
                  gap: "2rem",
                  width: "25rem",
                }}
              >
                <div
                  active={activeTab === "1"}
                  onClick={() => setactiveTab("1")}
                  style={
                    activeTab === "1"
                      ? {
                          color: themecolor,
                          cursor: "pointer",
                        }
                      : { cursor: "pointer" }
                  }
                >
                  Profile Details
                </div>
                <div
                  active={activeTab === "2"}
                  onClick={() => setactiveTab("2")}
                  style={
                    activeTab === "2"
                      ? {
                          color: themecolor,
                          cursor: "pointer",
                          textWrap: "wrap",
                        }
                      : { cursor: "pointer" }
                  }
                >
                  Billing Address
                </div>
              </div>
            )}
          </CardHeader>
          <CardBody className="py-2 my-25">
            <div className="mt-2 pt-50">
              {activeTab == 1 ? (
                <Row>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="firstName">
                      Company Name
                    </Label>
                    <Input
                      id="name"
                      disabled
                      placeholder="John"
                      // onChange={(e) => onChangeHandler(e.target.id, e.target.value.replace(/[^a-z ]/gi, ''))}
                      value={clients?.companyName}
                    />
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="emailInput">
                      Owner Name
                    </Label>
                    <Input
                      id="id"
                      disabled
                      name="text"
                      placeholder="User ID"
                      value={clients?.companyowner}
                    />
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="emailInput">
                      Email
                    </Label>
                    <Input
                      id="role"
                      type="text"
                      name="text"
                      disabled
                      value={clients?.email}
                    />
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="emailInput">
                      Mobile
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      disabled
                      value={clients?.mobile}
                    />
                  </Col>
                  {/* {user?.email == "gunjan@growworkinfotech.com" ? ( */}
                  <>
                    <Col sm="6" className="mb-1">
                      <Label className="form-label" for="emailInput">
                        Plan
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        disabled
                        value={currentPlan?.planName}
                      />
                    </Col>
                    <Col sm="6" className="mb-1">
                      <Label className="form-label" for="emailInput">
                        Validity
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        disabled
                        value={
                          currentPlan?.planName == "free"
                            ? "-"
                            : moment(expireDate).format("DD-MM-YYYY")
                        }
                      />
                    </Col>
                  </>
                  {/* ) : null} */}
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="address">
                      Industries
                    </Label>
                    <Select
                      // isDisabled={update}
                      style={{ cursor: "pointer" }}
                      id="industries"
                      name="industries"
                      value={
                        selectedIndustries?.length
                          ? selectedIndustries
                          : selectindustries
                      }
                      placeholder="Select Industries"
                      options={
                        industries?.length > 0 &&
                        industries?.filter((ele) => {
                          ele.label = ele?.industryCategory;
                          ele.value = ele?.id;
                          return ele;
                        })
                      }
                      isMulti
                      className="react-select"
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      onChange={(e) => {
                        setSelectIndustries(e);
                        onIndustriesChange(e);
                        setSelectedIndustries(e);
                      }}
                    />
                    {selectindustries.length < 1 ? (
                      <p style={{ color: "red", fontSize: "12px" }}>
                        Please Select Any Industries
                      </p>
                    ) : null}
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="phNumber">
                      Job Category
                    </Label>
                    <Select
                      style={{ cursor: "pointer" }}
                      id="jobCategoryId"
                      name="jobCategoryId"
                      value={
                        selectedJobCategory?.length
                          ? selectedJobCategory
                          : jobCategoryOptions
                      }
                      isMulti
                      placeholder="Select jobCategory"
                      // options={jobCategoryOptions}
                      options={
                        jobCategory?.length > 0 &&
                        jobCategory?.filter((ele) => {
                          ele.label = ele?.jobCategory;
                          ele.value = ele?.id;
                          return ele;
                        })
                      }
                      className="react-select"
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      onChange={(e) => {
                        setJobCategoryOptions(e);
                        onjobCategoryChange(e);
                        setSelectedJobCategory(e);
                        // setFieldValue("jobCategoryId", e.value)
                      }}
                    />
                    {jobCategoryOptions.length < 1 ? (
                      <p style={{ color: "red", fontSize: "12px" }}>
                        Please Select Any Job Category
                      </p>
                    ) : null}
                  </Col>
                  <Col sm="6" className="mb-1" style={{ height: "75px" }}>
                    <Label className="form-label" for="emailInput">
                      Whatsapp Notification
                    </Label>
                    <div
                      className="form-switch form-check-primary"
                      onClick={() => setShowUpgradePlan(true)}
                    >
                      <Input
                        type="switch"
                        id="switch-primary"
                        disabled={
                          currentPlan?.planName == "free" ||
                          currentPlan?.planName == "Trial"
                        }
                        //   onFocus={() => setIsfocus("switch")}
                        //   onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor:
                            currentPlan?.planName != "free" &&
                            currentPlan?.planName != "Trial" &&
                            user?.clients?.whatsappNotification &&
                            themecolor,
                          backgroundColor:
                            currentPlan?.planName != "free" &&
                            currentPlan?.planName != "Trial" &&
                            user?.clients?.whatsappNotification &&
                            themecolor,
                          cursor: "pointer",
                        }}
                        checked={
                          currentPlan?.planName != "free" &&
                          currentPlan?.planName != "Trial" &&
                          user?.clients?.whatsappNotification
                        }
                        onChange={() => {
                          handleWhatsappNotificationStatus(
                            !user?.clients?.whatsappNotification
                          );
                        }}
                      />
                    </div>
                    <p style={{ fontSize: "11px", color: "red" }}>
                      {(currentPlan?.planName == "free" ||
                        currentPlan?.planName == "Trial") &&
                      showUpgradeplan
                        ? "You need to upgrade your plan to use this feature"
                        : ""}
                    </p>
                  </Col>

                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="emailInput">
                      Mail Notification
                    </Label>
                    <div className="form-switch form-check-primary">
                      <Input
                        type="switch"
                        id="switch-primary"
                        name="primary"
                        //   onFocus={() => setIsfocus("mailNotification")}
                        //   onBlur={() => setIsfocus(null)}
                        style={{
                          borderColor:
                            user?.clients?.mailNotification && themecolor,
                          backgroundColor:
                            user?.clients?.mailNotification && themecolor,
                          cursor: "pointer",
                        }}
                        checked={user?.clients?.mailNotification}
                        onChange={() => {
                          handleMailNotificationStatus(
                            !user?.clients?.mailNotification
                          );
                        }}
                      />
                    </div>
                  </Col>
                  <Col className="mt-2" sm="12" style={{ textAlign: "center" }}>
                    <Button
                      color="defult"
                      style={{ backgroundColor: themecolor, color: "white" }}
                      onClick={handleSaveChanges}
                      disabled={
                        jobCategoryOptions.length > 0 &&
                        selectindustries.length > 0
                          ? false
                          : true
                      }
                    >
                      Update changes
                    </Button>
                  </Col>
                </Row>
              ) : (
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
                    <Label id="lastname">ZIP code</Label>
                    <Input
                      id="zipcode"
                      name="zipcode"
                      maxLength={10}
                      className="w-100"
                      type="text"
                      value={zipcode}
                      placeholder={"Enter ZIP code"}
                      onChange={(e) => {
                        setzipcode(e.target.value.replace(/\D/g, ""));
                      }}
                    />
                  </Col>
                  <Col className="mt-2 text-center" sm="12">
                    <Button
                      className="me-1"
                      color="defult"
                      onClick={() => handleSavechanges()}
                      style={{ backgroundColor: themecolor, color: "white" }}
                      type="submit"
                    >
                      Save changes
                    </Button>
                  </Col>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </Fragment>
    </>
  );
};

const ProfilePage = () => {
  const [page, setPage] = useState(<AccountSettings />);
  const auth = useSelector((state) => state?.auth);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: userActions.GET_LOGIN_USER_DETAIL,
      payload: user?.id,
    });
  }, []);
  useEffect(() => {
    if (auth?.user?.clients) {
      if (auth?.user?.clients?.length == 0) {
        setPage(<AccountSettings />);
      } else {
        setPage(<ClientProfile />);
      }
    }
  }, [auth]);
  return page;
};

export default ProfilePage;
