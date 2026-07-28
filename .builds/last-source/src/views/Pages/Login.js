import React from "react";
import { Link, withRouter } from "react-router-dom";
import InputPasswordToggle from "@components/input-password-toggle";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  InputGroup,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroupText,
  Spinner,
} from "reactstrap";
// import unique from "../../assets/images/logo/unique.png";
// import i1 from "../../assets/images/login/i1.jpg";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useSkin } from "@hooks/useSkin";
import { useEffect, useState } from "react";
import Loader from "../../components/Dialog/Loader";
import { loginEmailAPI } from "../../apis/auth/index";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import { tostifyError } from "../../components/Tostify";
import authActions from "../../redux/auth/actions";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
const LoginCover = (props) => {
  const { width } = useBreakpoint();
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const { token, user, isLoading, isOpenInactivePopup } = useSelector(
    (state) => state.auth
  );
  const [focus, setIsfocus] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const [isShowLoginForm, setIsShowLoginForm] = useState(false);
  const [selectAgency, setSelectAgency] = useState(null);
  // const [logourl, setLogourl] = useState(null);

  useEffect(() => {
    dispatch({
      type: authActions.SET_STATE,
      payload: {
        isOpenInactivePopup: false,
      },
    });
  }, []);

  useEffect(() => {
    if (token) {
      const slugId = localStorage.getItem("slug") || "uniqueworld";
      if (user?.role?.name === "Client") {
        props.history.push(`/${slugId}/candidate`);
      } else if (user?.role?.name === "SuperAdmin") {
        props.history.push("/superadmin/dashboard");
      } else {
        props.history.push(`/${slugId}/dashboard`);
      }
    }
  }, [token, user]);
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (isShowLoginForm) {
      if (email != "" && password != "") {
        dispatch({
          type: "SIGN_IN",
          payload: {
            email,
            password,
            agencyId: selectAgency.value ? selectAgency.value : selectAgency,
          },
        });
      }
    } else {
      if (email != "") {
        handleSubmitEmail();
      }
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []); // Run only once on component mount

  const handleSubmitEmail = async () => {
    setLoading(true);
    const response = await loginEmailAPI({ email: email });
    if (response) {
      setLoading(false);
    }
    if (response?.Total_Agency != 0 && response?.data?.length) {
      const firstAgency = response?.data?.[0]?.agency;
      if (firstAgency) {
        setSelectAgency(firstAgency.id);
        // setLogourl(firstAgency.logo);
      }
      setIsShowLoginForm(true);
    } else {
      setIsShowLoginForm(false);
      tostifyError("Email is not exits");
    }
  };

  let illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg";

  let source = require(`../../assets/images/pages/${illustration}`);
  console.info("----------------------------");
  console.info("source =>", source);
  console.info("----------------------------");
  return (
    <>
      <section
        style={{
          minHeight: "100vh",
          background: "rgb(11,60,101)",
          background:
            "linear-gradient(90deg, rgba(11,60,101,1) 0%, rgba(11,60,101,1) 35%, rgba(75,121,157,1) 100%)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container className="py-5 h-100" style={{ maxWidth: "none" }}>
          <Row className="d-flex justify-content-center align-items-center h-100">
            <Col
              sm="24"
              className="d-flex justify-content-center align-items-center"
              style={width < 786 ? { height: "100%", width: "100%" } : {}}
            >
              <Card
                style={{
                  borderRadius: "1rem",
                  maxHeight: "760px",
                  maxWidth: "1172px",
                  // minHeight: width < 426 && !isShowLoginForm && "661px",
                  // minWidth: width < 426 && !isShowLoginForm && "397px",
                  justifyContent: "center",
                  height: "85%",
                  width: "100%",
                }}
              >
                <Row className="g-0">
                  <Col
                    sm="24"
                    md="6"
                    lg="6"
                    className="d-none d-md-flex"
                    style={{ backgroundColor: "#10599630" }}
                  >
                    {/* <div style={{ backgroundColor: "#105996" }}></div> */}
                    <img
                      src="https://qa-agency-uniqueworld.web.app/static/media/login-v2.2198399dbc4d74f02e45.svg"
                      alt="login form"
                      className="img-fluid"
                      style={{ minHeight: "760px" }}
                    // style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                  </Col>
                  <Col
                    md="6"
                    lg="6"
                    sm="24"
                    className="d-flex align-items-center"
                  >
                    <CardBody
                      className="text-black"
                      style={{ padding: width < 340 && "1.5rem 0.5rem" }}
                    >
                      <Form onSubmit={onSubmit}>
                        {/* <div className="d-flex align-items-center mb-2 ">
                          {logourl && (
                            <Link
                              className="brand-logo"
                              to="/"
                              onClick={(e) => e.preventDefault()}
                            >
                              <img
                                src={logourl}
                                style={{
                                  width: "auto",
                                  height: "auto",
                                  maxWidth: "200px",
                                  maxHeight: "100px",
                                }}
                                alt="logo"
                              />
                            </Link>
                          )}
                        </div> */}
                        <div style={{ padding: width > 787 && "4rem" }}>
                          <h5
                            className="fw-normal mb-2 "
                            style={{
                              letterSpacing: "1px",
                              fontSize: "2rem",
                              textAlign: "center",
                            }}
                          >
                            Log In
                          </h5>
                          {isShowLoginForm ? (
                            <>
                              {/* <div className="d-flex justify-content-center align-items-center gap-1 mb-2">
                                <Button
                                  color="defalt"
                                  className="d-inline-flex align-items-center"
                                  style={{
                                    backgroundColor: "#10599620",
                                    color: "#105996",
                                  }}
                                >
                                  <FaFacebook />
                                </Button>
                                <Button
                                  color="defalt"
                                  className="d-inline-flex align-items-center "
                                  style={{
                                    backgroundColor: "#10599620",
                                    color: "#105996",
                                  }}
                                >
                                  <FaGoogle />
                                </Button>
                              </div> */}
                              <div className="mb-2">
                                <Label className="form-label" for="login-email">
                                  Email
                                </Label>
                                <Input
                                  type="email"
                                  value={email}
                                  maxLength={200}
                                  placeholder="Enter Email"
                                  onFocus={() => setIsfocus("email")}
                                  onBlur={() => setIsfocus(null)}
                                  style={{
                                    borderColor: focus === "email" && "#105996",
                                  }}
                                  disabled
                                // onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                />
                              </div>
                              <div className="mb-2">
                                <div className="d-flex justify-content-between">
                                  <Label
                                    className="form-label"
                                    for="login-password"
                                  >
                                    Password
                                  </Label>
                                  <div style={{ cursor: "pointer" }}>
                                    <Link
                                      to="/forgotpassword"
                                      color="defalt"
                                      style={{ color: "#105996" }}
                                    >
                                      {" "}
                                      Forgot Password
                                    </Link>
                                  </div>
                                </div>
                                <InputPasswordToggle
                                  // type="password"
                                  autoFocus
                                  focus={focus}
                                  value={password}
                                  placeholder="Enter Password"
                                  onChange={(e) => setPassword(e.target.value)}
                                  onFocus={() => setIsfocus("Password")}
                                  onBlur={() => setIsfocus(null)}
                                  style={{
                                    borderColor:
                                      focus === "Password" && "#105996",
                                  }}
                                />
                                {/* <Input
                                  autoFocus
                                  value={password}
                                  placeholder="Enter Password"
                                  onChange={(e) => setPassword(e.target.value)}
                                  onFocus={() => setIsfocus("Password")}
                                  onBlur={() => setIsfocus(null)}
                                  style={{
                                    borderColor:
                                      focus === "Password" && "#105996",
                                  }}
                                /> */}
                              </div>
                              <div className="pt-1 mb-4 d-flex justify-content-center">
                                <div style={{ width: "60%" }}>
                                  <Button
                                    color="defalt"
                                    block
                                    type="submit"
                                    style={
                                      email == "" || password == ""
                                        ? {
                                          backgroundColor: "#10599650",
                                          color: "white",
                                          cursor: "not-allowed",
                                          pointerEvents: "none",
                                        }
                                        : {
                                          backgroundColor: "#105996",
                                          color: "white",
                                        }
                                    }
                                  >
                                    Sign in
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {" "}
                              <div className="mb-2">
                                <Label
                                  className="form-label"
                                  for="login-email"
                                >
                                  Email
                                </Label>
                                <InputGroup>
                                  <Input
                                    autocomplete="username"
                                    autoFocus
                                    type="email"
                                    value={email}
                                    maxLength={200}
                                    placeholder="Enter Email"
                                    onChange={(e) =>
                                      setEmail(e.target.value.toLowerCase())
                                    }
                                    onFocus={() => setIsfocus("email1")}
                                    onBlur={() => setIsfocus(null)}
                                    style={{
                                      borderColor:
                                        focus === "email1" && "#105996",
                                    }}
                                  />
                                  {loading == true && (
                                    <InputGroupText>
                                      <Spinner style={{ color: "#105996" }}>
                                        Loading...
                                      </Spinner>
                                    </InputGroupText>
                                  )}
                                </InputGroup>
                              </div>
                              <div className="pt-1 mb-4 d-flex justify-content-center">
                                <div style={{ width: "60%" }}>
                                  <Button
                                    color="defalt"
                                    block
                                    type="submit"
                                    style={
                                      email == ""
                                        ? {
                                          backgroundColor: "#10599650",
                                          color: "white",
                                          cursor: "not-allowed",
                                          pointerEvents: "none",
                                        }
                                        : {
                                          backgroundColor: "#105996",
                                          color: "white",
                                        }
                                    }
                                  >
                                    Continue
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </Form>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </section >
      <Modal isOpen={isOpenInactivePopup} className="modal-dialog-centered">
        <ModalHeader
          toggle={() => {
            dispatch({
              type: authActions.SET_STATE,
              payload: {
                isOpenInactivePopup: false,
              },
            });
            setIsShowLoginForm(false);
            // setLogourl();
            setEmail("");
          }}
          className="bg-transparent"
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h3 className="text-center mb-1" style={{ color: "#105996" }}>
            Currently, Your Agency Status Is Inactive.
          </h3>
          <p className="text-center">
            {" "}
            Please Kindly Contact Unique World Jobs.
          </p>
        </ModalBody>
      </Modal>
    </>
  );
};

export default withRouter(LoginCover);
