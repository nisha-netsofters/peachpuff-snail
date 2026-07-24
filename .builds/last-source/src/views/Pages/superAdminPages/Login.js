// import { useSkin } from "@hooks/useSkin"
import { Link, withRouter } from "react-router-dom";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import InputPasswordToggle from "@components/input-password-toggle";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
} from "reactstrap";
import unique from "../../../assets/images/logo/unique-logo.png";
import "@styles/react/pages/page-authentication.scss";
// import { Controller, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react"
import { useSkin } from "@hooks/useSkin";
import { useEffect, useState } from "react";
import Loader from "../../../components/Dialog/Loader";

const Login = (props) => {
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const hello = useSelector((state) => state.auth);
  const { token, user, isLoading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  console.info("--------------------");
  console.info("user => ", user);
  console.info("user => ", hello);
  console.info("--------------------");

  useEffect(() => {
    if (token) {
      if (user?.role?.name === "Client") {
        props.history.push("/candidate");
      } else if (user?.role?.name === "SuperAdmin") {
        props.history.push("/superadmin/dashboard");
      } else {
        props.history.push("/dashboard");
      }
    }
  }, [token, user]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch({
      type: "SUPERADMIN_SIGN_IN",
      payload: { email, password },
    });
  };

  let illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg";

  let source = require(`../../../assets/images/pages/${illustration}`);

  return (
    <>
      <Loader loading={loading} />
      <div className="auth-wrapper auth-cover">
        <Row className="auth-inner m-0">
          <Link
            className="brand-logo"
            to="/"
            onClick={(e) => e.preventDefault()}
          >
            <img src={unique} style={{ width: "200px" }} alt="logo" />
          </Link>
          <Col
            className="d-none d-lg-flex align-items-center p-5"
            lg="8"
            sm="12"
          >
            <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
              <img className="img-fluid" src={source} alt="Login Cover" />
            </div>
          </Col>
          <Col
            className="d-flex align-items-center auth-bg px-2 p-lg-5"
            lg="4"
            sm="12"
          >
            <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
              <CardTitle tag="h2" className="fw-bold mb-1">
                Login
              </CardTitle>

              <Form className="auth-login-form mt-2" onSubmit={onSubmit}>
                <div className="mb-1">
                  <Label className="form-label" for="login-email">
                    Email
                  </Label>

                  <Input
                    autoFocus
                    type="email"
                    value={email}
                    maxLength={200}
                    placeholder="Enter Email"
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  />
                </div>
                <div className="mb-1">
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" for="login-password">
                      Password
                    </Label>

                    <div style={{ cursor: "pointer" }}>
                      <a href="/forgotpassword" type="link">
                        {" "}
                        Forgot Password ?
                      </a>
                    </div>
                  </div>
                  <InputPasswordToggle
                    // type="password"
                    value={password}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-check mb-1">
                  <Input type="checkbox" id="remember-me" />
                  <Label className="form-check-label" for="remember-me">
                    Remember Me
                  </Label>
                </div>
                <Button color="primary" className="mt-2" type="submit" block>
                  Sign in
                </Button>
              </Form>
            </Col>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withRouter(Login);
