import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InputPasswordToggle from "@components/input-password-toggle";
import Select from "react-select";
import { Row, Col, Input, Label } from "reactstrap";
import { selectThemeColors } from "../../../utility/Utils";

const User = ({
  user,
  setUser,
  setNameValidation,
  setEmailValidation,
  setRolevalidation,
  setPasswordValidation,
  setMobileValidation,
  setAddressValidation,
  cities,
  states,
  selectedState,
  setSelectedState,
  setSelectedCity,
  selectedCity,
  update,
  handleChange = () => {},
}) => {
  const [role, setRole] = useState();

  const getRole = useSelector((state) => state.roles);
  const { plans } = useSelector((state) => state.plans);
  const [selectedPlan, setSelectedPlan] = useState();

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
    if (
      user?.state &&
      (selectedCity != undefined || selectedState != undefined)
    ) {
      const updatedUserData = { ...user };
      delete updatedUserData.city;
      delete updatedUserData.cityId;
      setUser(updatedUserData);
      setSelectedCity(undefined);
    }
  }, [user?.state]);

  useEffect(() => {
    if (user?.subscription?.plan?.planName == selectedPlan?.planName) {
      delete user.paymentMethod;
    }
  }, [selectedPlan]);

  useEffect(() => {
    setSelectedPlan({
      value: user?.subscription?.plan?.id,
      label: user?.subscription?.plan?.planName,
      price: user?.subscription?.plan?.price,
      planName: user?.subscription?.plan?.planName,
    });
  }, []);

  useEffect(() => {
    if (user?.role?.name !== undefined) {
      setRole({ label: user?.role?.name });
    }
  }, [getRole]);

  const roleOptions = getRole.filter((ele) => {
    ele.label = ele.name;
    return ele.name !== "Client" && ele.name !== "Admin";
  });
  const themecolor = localStorage.getItem("themecolor");
  const [focus, setIsfocus] = useState(null);
  console.log("role", role);
  return (
    <>
      <Row className="gy-1 pt-75">
        <div>
          <h4>Basic</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          {role?.label == "Client" ? (
            <>
              {console.log("client")}
              <Label for="role-select">Role</Label>
              <Input
                value="Client"
                id="planPrice"
                name="planPrice"
                onFocus={() => setIsfocus("planPrice")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "planPrice" && themecolor,
                }}
                className="w-100"
                disabled
                maxLength={200}
              // placeholder={"Enter address"}
              />
            </>
          ) : (
            <>
              {console.log("non client")}
              <Label for="role-select">
                Select Role<span style={{ color: "red" }}>*</span>{" "}
              </Label>
              <Select
                id="recruiterId"
                value={role}
                placeholder="Select Role"
                options={roleOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setUser({ ...user, roleId: e.value });
                  // handleChange(e)
                  setRole(e);
                  setRolevalidation(e);
                }}
              />
            </>
          )}
          {/* <Label for="role-select">
            Select Role<span style={{ color: "red" }}>*</span>{" "}
          </Label>
          <Select
            id="recruiterId"
            value={role}
            placeholder="Select Role"
            options={roleOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setUser({ ...user, roleId: e.value });
              // handleChange(e)
              setRole(e);
              setRolevalidation(e);
            }}
          /> */}
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="name">
              Name<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="name"
              name="name"
              onFocus={() => setIsfocus("name")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "name" && themecolor,
              }}
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter Name"}
              value={user?.name}
              onChange={(e) => {
                setNameValidation(e.target.value);
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="mobile">
              Mobile<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="mobile"
              onFocus={() => setIsfocus("mobile")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "mobile" && themecolor,
              }}
              name="mobile"
              className="w-100"
              type="text"
              maxLength={10}
              placeholder={"Enter Mobile number"}
              value={user?.mobile}
              onChange={(e) => {
                setMobileValidation(e.target.value);
                setUser({
                  ...user,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="email">
              E-mail<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="email"
              onFocus={() => setIsfocus("email")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "email" && themecolor,
              }}
              name="email"
              maxLength={200}
              className="w-100"
              type="email"
              placeholder={"Enter E-mail"}
              value={user?.email}
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase();
                setEmailValidation(e.target.value);
                setUser({ ...user, [e.target.id]: e.target.value });
                // handleChange(e)
              }}
            />
          </div>
        </Col>
        {!update && (
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="password">
                Password<span style={{ color: "red" }}>*</span>
              </Label>
              <InputPasswordToggle
                id="password"
                name="password"
                onFocus={() => setIsfocus("password")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "password" && themecolor,
                }}
                className="input-group-merge"
                // type="password"

                placeholder={"Enter Password"}
                value={user?.password}
                onChange={(e) => {
                  setPasswordValidation(e.target.value);
                  setUser({ ...user, [e.target.id]: e.target.value });
                }}
              />
            </div>
          </Col>
        )}

        {user?.role?.name == "Client" ? (
          //  && user?.email == 'gunjan@growworkinfotech.com'
          <>
            <Col lg={6} xs={12} xl={4}>
              <div>
                <Label id="plan">
                  Plan<span style={{ color: "red" }}>*</span>
                </Label>
                <Select
                  style={{ cursor: "pointer" }}
                  id="plan"
                  name="plan"
                  value={selectedPlan}
                  placeholder="Select Plan"
                  options={
                    plans?.length > 0 &&
                    plans?.filter((ele) => {
                      ele.label = ele?.planName;
                      ele.value = ele?.id;
                      // if (ele?.planName !== 'free') {
                      return ele;
                      // }
                    })
                  }
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  onChange={(e) => {
                    setSelectedPlan(e);
                    setUser({ ...user, planId: e.id });
                  }}
                />
              </div>
            </Col>
            <Col lg={6} xs={12} xl={4}>
              <div>
                <Label id="planPrice">Plan Price</Label>
                <Input
                  id="planPrice"
                  name="planPrice"
                  onFocus={() => setIsfocus("planPrice")}
                  onBlur={() => setIsfocus(null)}
                  style={{
                    borderColor: focus === "planPrice" && themecolor,
                  }}
                  className="w-100"
                  type="number"
                  disabled
                  maxLength={200}
                  placeholder={"Enter address"}
                  value={selectedPlan?.price}
                />
              </div>
            </Col>
            {user?.subscription?.plan?.planName !== selectedPlan?.planName ? (
              <Col lg={6} xs={12} xl={4}>
                <div>
                  <Label id="paymentMethod">Payment Method</Label>
                  <Input
                    id="paymentMethod"
                    name="paymentMethod"
                    onFocus={() => setIsfocus("paymentMethod")}
                    onBlur={() => setIsfocus(null)}
                    style={{
                      borderColor: focus === "paymentMethod" && themecolor,
                    }}
                    className="w-100"
                    type="text"
                    maxLength={200}
                    placeholder={"Enter Payment Method"}
                    // value={selectedPlan?.price}
                    onChange={(e) => {
                      // setAddressValidation(e.target.value)
                      setUser({ ...user, [e.target.id]: e.target.value });
                    }}
                  />
                </div>
              </Col>
            ) : null}
          </>
        ) : null}
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="address">
              Address<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="address"
              name="address"
              onFocus={() => setIsfocus("address")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "address" && themecolor,
              }}
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter address"}
              value={user?.address}
              onChange={(e) => {
                setAddressValidation(e.target.value);
                setUser({ ...user, [e.target.id]: e.target.value });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="state">
              State<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              id="state"
              value={selectedState}
              placeholder={user?.state || "Select State"}
              options={states}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectedState(e);
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="address">
              City<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              id="city"
              value={selectedCity != undefined ? selectedCity : ""}
              placeholder={user?.city || "Select City"}
              options={cities}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectedCity(e);
                handleChange(e);
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default User;
