import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
// import logo from "../../assets/images/logo/unique.png";
import ReactCanvasConfetti from "react-canvas-confetti";

import { useDispatch, useSelector } from "react-redux";
import { tostify } from "../../components/Tostify";
import Basic from "../../components/Forms/ClientRegistration/Basic";
import Marquee from "react-fast-marquee";
import { Country, State, City } from "country-state-city";
import leadActions from "../../redux/lead/actions";
const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};
const ClientRegistration = () => {
  const leads = useSelector((state) => state.lead);
  const dispatch = useDispatch();
  const [client, setClient] = useState([]);
  const [popup, setPopup] = useState(false);
  const [cName, setCName] = useState("");
  const [cOwner, setCOwner] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [register, setRegister] = useState(false);
  const [industries_relation, setIndustries_relation] = useState([]);
  const [jobCategory_relation, setJobCategory_relation] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();

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

  const handleChange = (e) => {
    if (e?.key == "state") {
      setClient({ ...client, state: e.value, stateId: e.isoCode });
    } else if (e?.key == "city") {
      setClient({ ...client, city: e.value, cityId: e.value });
    } else {
      if (e?.target?.id === undefined) {
        setClient({ ...client, [e.id]: e.value });
      } else {
        setClient({
          ...client,
          [e.target.id]: e.target.value.replace(/[^a-z ]/gi, ""),
        });
      }
    }
  };
  useEffect(() => {
    if (leads?.constraint) {
      setRegister(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 12000);
    }
    if (leads?.id) {
      setPopup(true);
    }
  }, [leads]);

  const ClientActionHandler = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (cName.length < 2) tostify("Please Enter Valid Company Name");
    else if (cOwner.length < 2)
      tostify(" Please Enter Valid Company Owner Name");
    else if (
      industries_relation?.length === 0 ||
      industries_relation === undefined
    )
      tostify(" Please Select Industries");
    else if (
      jobCategory_relation?.length === 0 ||
      jobCategory_relation === undefined
    )
      tostify(" Please Select Job Category");
    else if (!email || regex.test(email) === false)
      tostify("Please Enter Valid Email");
    else if (mobile.length !== 10) tostify("Please Enter Valid Contact Number");
    else if (client?.city === undefined || client?.city?.length < 2)
      tostify("Please Enter City");
    else {
      // client.industries_relation = JSON.stringify(industries_relation);
      // client.jobCategory_relation = JSON.stringify(client.jobCategory_relation);

      dispatch({
        type: leadActions.CREATE_LEAD,
        payload: client,
      });
    }
  };

  // function importAll(r) {
  //   return r.keys().map(r);
  // }

  // const images = importAll(
  //   require.context("../../assets/images/Clients", false, /\.(png|jpe?g|svg)$/)
  // );

  return (
    <>
      <div className="container-sm container-md container-lg container-xl">
        <ReactCanvasConfetti
          // fire={animation}
          particleCount={500}
          angle={90}
          spread={360}
          startVelocity={100}
          decay={0.8}
          gravity={-0.1}
          origin={{ x: 0.5, y: 0.5 }}
          shapes={"circle"}
          scalar={1}
          zIndex={-1}
          disableForReducedMotion={false}
          resize={true}
          useWorker={true}
          height={window.innerHeight}
          width={window.innerWidth}
          style={canvasStyles}
        />
        <Row className="gy-1 pt-100 mt-2">
          <Col className="col" style={{ textAlign: "center" }}>
            <h1 style={{ color: "#105996" }}>Client Registration</h1>
          </Col>
        </Row>
        <Card
          style={{
            paddingLeft: "2rem",
            paddingRight: "2rem",
            marginTop: "2rem",
          }}
        >
          <Row>
            <Basic
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              cities={cities}
              states={states}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              industries_relation={industries_relation}
              setIndustries_relation={setIndustries_relation}
              jobCategory_relation={jobCategory_relation}
              setJobCategory_relation={setJobCategory_relation}
              setClient={setClient}
              client={client}
              handleChange={handleChange}
              setCName={setCName}
              setCOwner={setCOwner}
              setEmail={setEmail}
              setMobile={setMobile}
            />
          </Row>
          <Row
            style={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              marginTop: "30px",
              paddingBottom: "20px",
            }}
          >
            <Button
              style={{
                width: "111px",
                backgroundColor: "#105996",
                color: "white",
              }}
              className="add-new-user"
              color="defalt"
              onClick={() => ClientActionHandler()}
            >
              Submit
            </Button>
          </Row>
        </Card>
      </div>
      {/* <div className="mb-2 mt-2 p-1 container-sm container-md container-lg container-xl">
        <div
          style={{
            fontWeight: "800",
            fontSize: "20px",
            display: "flex",
            justifyContent: "center",
            marginBottom: "25px",
          }}
        >
          Our Clients
        </div>
        <Marquee className="marquee-slider">
          {images?.map((ele) => (
            <img src={ele} alt="client-photo" style={{ height: "100px" }} />
          ))}
        </Marquee>
      </div> */}

      {/* <Modal isOpen={popup}>
                <h1>Congratulations!!</h1>
                <h2>
                    Your registration with us is completed. Thank you for choosing to register with us.
                    We appreciate your interest in our services and look forward to assist you in the business. You will receive your credentials on your registered email shortly with approval.
                    If you have any further queries, feel free to contact us.
                </h2>
            </Modal> */}
      <Modal isOpen={register} className="modal-dialog-centered">
        <ModalHeader className="bg-transparent"></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h1 className="text-center mb-1" style={{ color: "#105996" }}>
            Registered!!
          </h1>
          <p className="text-center">
            {" "}
            We’re sorry, it appears that you have already registered with us. If
            you have forgotten your login credentials, please click on “Forgot
            Password” on login page and follow the instructions to reset your
            password.{" "}
          </p>
          <p className="text-center">
            If you believe this is an error or need any assistance , please feel
            free to contact us.
          </p>
          <p className="text-center">
            {" "}
            Thank you for choosing us as your job search partner.
          </p>
        </ModalBody>
      </Modal>
       <Modal
          className="modal-dialog-centered"
          isOpen={popup}
        >
          <ModalHeader
            toggle={() => {
              setPopup(false);
              window.location.href = "/login";
            }}
          >
             Congratulations!!
          </ModalHeader>
          <ModalBody>
          <p className="text-center">
            {" "}
            Your registration with us is completed. Thank you for choosing to
            register with us.
          </p>
          <p className="text-center">
            We appreciate your interest in our services and look forward to
            assist you in the business.
          </p>
          <p className="text-center">
            {" "}
            You will receive your credentials on your registered email shortly
            with approval. If you have any further queries, feel free to contact
            us.
          </p>
          </ModalBody>
        </Modal>
    </>
  );
};

export default ClientRegistration;
