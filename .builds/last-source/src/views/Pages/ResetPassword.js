// ** Custom Components

// ** Reactstrap Imports
import {
  Card,
  CardText,
  Label,
  Form,
  Button,
  CardBody,
  CardTitle,
  FormFeedback,
  Row,
  Col,
} from "reactstrap";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// import unique from "../../../src/assets/images/logo/unique.png";
import { Fragment, useState } from "react";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import actions from "../../redux/auth/actions";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const defaultValues = {
  newPassword: "",
  retypeNewPassword: "",
};

const ForgotPassword = () => {
  const location = useLocation().search;
  const query = new URLSearchParams(location);
  const token = query.get("token");
  const id = query.get("id");
  const dispatch = useDispatch();

  // const [password, setPassword] = useState("")

  const SignupSchema = yup.object().shape({
    newPassword: yup
      .string()
      .min(8, (obj) => showErrors("New Password", obj.value.length, obj.min))
      .required(),
    retypeNewPassword: yup
      .string()
      .min(8, (obj) =>
        showErrors("Retype New Password", obj.value.length, obj.min)
      )
      .required()
      .oneOf([yup.ref(`newPassword`), null], "Passwords must match"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = async (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      await dispatch({
        type: actions.RESET_PASSWORD,
        payload: { id, token, password: data.newPassword },
      });

      return null;
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
          });
        }
      }
    }
  };
  const [focus, setIsfocus] = useState(null);
  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Fragment>
          <Card className="mb-0">
            <CardBody>
              <CardTitle tag="h4" className="mb-1">
                Reset Password 🔒
              </CardTitle>
              <CardText className="mb-2">
                Your new password must be different from previously used
                passwords
              </CardText>
              <Form
                className="auth-reset-password-form mt-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Row>
                  <Col sm="12" className="mb-1">
                    <Controller
                      control={control}
                      id="newPassword"
                      name="newPassword"
                      render={({ field }) => (
                        <InputPasswordToggle
                          label="New Password"
                          htmlFor="newPassword"
                          className="input-group-merge"
                          onFocus={() => setIsfocus("newPassword")}
                          onBlur={() => setIsfocus(null)}
                          style={{
                            borderColor: focus === "newPassword" && "#105996",
                          }}
                          invalid={errors.newPassword && true}
                          {...field}
                        />
                      )}
                    />
                    {errors.newPassword && (
                      <FormFeedback className="d-block">
                        {errors.newPassword.message}
                      </FormFeedback>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col sm="12" className="mb-1">
                    <Controller
                      control={control}
                      id="retypeNewPassword"
                      name="retypeNewPassword"
                      render={({ field }) => (
                        <InputPasswordToggle
                          label="Retype New Password"
                          htmlFor="retypeNewPassword"
                          className="input-group-merge"
                          onFocus={() => setIsfocus("retypeNewPassword")}
                          onBlur={() => setIsfocus(null)}
                          style={{
                            borderColor:
                              focus === "retypeNewPassword" && "#105996",
                          }}
                          invalid={errors.newPassword && true}
                          {...field}
                        />
                      )}
                    />
                    {errors.retypeNewPassword && (
                      <FormFeedback className="d-block">
                        {errors.retypeNewPassword.message}
                      </FormFeedback>
                    )}
                  </Col>
                  <Col xs={12}>
                    <p className="fw-bolder">Password requirements:</p>
                    <ul className="ps-1 ms-25">
                      <li className="mb-50">
                        Minimum 8 characters long - the more, the better
                      </li>
                      <li className="mb-50">
                        At least one lowercase character
                      </li>
                      <li>
                        At least one number, symbol, or whitespace character
                      </li>
                    </ul>
                  </Col>

                  <Col className="mt-1" sm="12">
                    <Button
                      type="submit"
                      className="me-1"
                      color="defalt"
                      style={{ backgroundColor: "#105996", color: "white" }}
                    >
                      Save changes
                    </Button>
                    <Button color="secondary" outline>
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Fragment>
      </div>
    </div>
  );
};

export default ForgotPassword;
