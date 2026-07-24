// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
} from "reactstrap";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
import actions from "../../../redux/auth/actions";
import { useDispatch, useSelector } from "react-redux";

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
  currentPassword: "",
  retypeNewPassword: "",
};

const SuperAdminSecurity = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const [focus, setIsfocus] = useState(null);

  const themecolor = "#323D76";

  const SignupSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .min(8, (obj) =>
        showErrors("Current Password", obj.value.length, obj.min)
      )
      .required(),
    newPassword: yup
      .string()
      .min(8, "requirements not met")
      .matches(/[a-z]/, "requirements not met")
      .matches(/[0-9\W]/, "requirements not met")
      .required(),
    retypeNewPassword: yup
      .string()
      .min(8, "requirements not met")
      .matches(/[a-z]/, "requirements not met")
      .matches(/[0-9\W]/, "requirements not met")
      .required()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });
  // ** Hooks
  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  function forgotPassword() {
    dispatch({
      type: actions.FORGOT_PASSWORD_LINK,
      payload: user,
    });
  }

  const handleCancel = () => {
    reset(defaultValues);
  };

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      dispatch({
        type: actions.CHANGE_PASSWORD,
        payload: {
          id: user.id,
          password: data.newPassword,
          currentPassword: data.currentPassword,
        },
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

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Change Password</CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="6" className="mb-1">
                <Controller
                  control={control}
                  id="currentPassword"
                  name="currentPassword"
                  render={({ field }) => (
                    <InputPasswordToggle
                      label="Current Password"
                      onFocus={() => setIsfocus("currentPassword")}
                      onBlur={() => setIsfocus(null)}
                      style={{
                        borderColor: focus === "currentPassword" && themecolor,
                      }}
                      htmlFor="currentPassword"
                      className="input-group-merge"
                      invalid={errors.currentPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.currentPassword && (
                  <FormFeedback className="d-block" style={{ color: "red" }}>
                    {errors.currentPassword.message}
                  </FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              <Col sm="6" className="mb-1">
                <Controller
                  control={control}
                  id="newPassword"
                  name="newPassword"
                  render={({ field }) => (
                    <InputPasswordToggle
                      label="New Password"
                      onFocus={() => setIsfocus("newPassword")}
                      onBlur={() => setIsfocus(null)}
                      style={{
                        borderColor: focus === "newPassword" && themecolor,
                      }}
                      htmlFor="newPassword"
                      className="input-group-merge"
                      invalid={errors.newPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.newPassword && (
                  <FormFeedback className="d-block" style={{ color: "red" }}>
                    {errors.newPassword.message}
                  </FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Controller
                  control={control}
                  id="retypeNewPassword"
                  name="retypeNewPassword"
                  render={({ field }) => (
                    <InputPasswordToggle
                      label="Retype New Password"
                      onFocus={() => setIsfocus("retypeNewPassword")}
                      onBlur={() => setIsfocus(null)}
                      style={{
                        borderColor:
                          focus === "retypeNewPassword" && themecolor,
                      }}
                      htmlFor="retypeNewPassword"
                      className="input-group-merge"
                      invalid={errors.retypeNewPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.retypeNewPassword && (
                  <FormFeedback className="d-block" style={{ color: "red" }}>
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
                  <li className="mb-50">At least one lowercase character</li>
                  <li>At least one number, symbol, or whitespace character</li>
                </ul>
              </Col>
              <Col className="mt-1" sm="12">
                <Button
                  onClick={() => {
                    forgotPassword();
                  }}
                  className="me-1"
                  color="defult"
                  style={{ backgroundColor: themecolor, color: "white" }}
                >
                  Forgot password
                </Button>
              </Col>
              <Col className="mt-1" sm="12">
                <Button
                  type="submit"
                  className="me-1"
                  color="defult"
                  style={{ backgroundColor: themecolor, color: "white" }}
                >
                  Save changes
                </Button>
                <Button
                  color="secondary"
                  outline
                  type="button"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default SuperAdminSecurity;
