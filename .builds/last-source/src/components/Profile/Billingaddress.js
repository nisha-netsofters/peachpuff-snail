// ** React Imports

import "cleave.js/dist/addons/cleave-phone.us";
import { Row, Col, Form, Input, Label, Button, CardBody } from "reactstrap";
import { City, State } from "country-state-city";
import Select from "react-select";

// import { useSelector } from 'react-redux'

// import userActions from "../../redux/user/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { tostify } from "../Tostify";
import actions from "../../redux/user/actions";

const Billingaddress = () => {
  // const role = useSelector(state => state.role)
  // const [user, setUser] = useState({});
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   setUser(userDetails);
  // }, [userData]);

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
  const user = useSelector((state) => state?.user?.user);
  console.info("-------------------------------");
  console.info("user => ", user);
  console.info("-------------------------------");
  const dispatch = useDispatch();
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
        const result = await State.getStatesOfCountry("IN");
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
    }
  }

  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );

  return (
    <>
      <CardBody className="py-2 my-25">
        <div className="mt-2 pt-50">
          <Row>
            <Col md="6" className="mt-1">
              <Label id="firstname">First Name</Label>
              <Input
                id="firstname"
                name="firstname"
                maxLength={50}
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
                maxLength={50}
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
              <Label id="lastname">Pin code</Label>
              <Input
                id="zipcode"
                name="zipcode"
                maxLength={10}
                className="w-100"
                type="text"
                value={zipcode}
                placeholder={"Enter Pin code"}
                onChange={(e) => {
                  setzipcode(e.target.value.replace(/\D/g, ""));
                }}
              />
            </Col>
            <Col className="mt-2" sm="12">
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
          </Row>
        </div>
      </CardBody>
    </>
  );
};

export default Billingaddress;
