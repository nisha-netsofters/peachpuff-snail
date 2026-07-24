import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import InputPasswordToggle from "@components/input-password-toggle";
import Select from "react-select";
import { Row, Col, Input, Label, Button } from "reactstrap";
import { selectThemeColors } from "../../../../utility/Utils";

import { ReactComponent as Cancel } from "../../../../assets/images/x.svg";
import { SketchPicker } from "react-color";
const AgencyForm = ({
  agency,
  cities,
  states,
  selectedState,
  setSelectedState,
  setSelectedCity,
  selectedCity,
  selectedCountry,
  countries,
  setAgency,
  setSelectedCountry,
  update,
  handleChange = () => {},
  fileOnChangeHandler = () => {},
}) => {
  const [colorHex, setColorHex] = useState("");

  const [isShowLogoName, setIsShowLogoName] = useState(true);
  useEffect(() => {
    setAgency({
      ...agency,
      themecolor: colorHex,
    });
  }, [colorHex]);
  useEffect(() => {
    if (colorHex == "") {
      setColorHex(agency?.themecolor ? agency?.themecolor : "#000");
    }
    if (
      agency?.themecolor == "" ||
      agency?.themecolor == null ||
      agency?.themecolor == undefined
    ) {
      setAgency({
        ...agency,
        themecolor: agency?.themecolor
          ? agency?.themecolor
          : colorHex == "#000" || colorHex == ""
          ? "#000"
          : colorHex,
      });
    }
  }, [agency]);

  useEffect(() => {
    countries?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = ele?.name;
    });
  }, [countries]);

  useEffect(() => {
    states?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = ele?.name;
    });
  }, [states]);

  useEffect(() => {
    cities?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = ele?.name;
    });
  }, [cities]);

  useEffect(() => {
    if (
      agency?.state &&
      (selectedCity != undefined || selectedState != undefined)
    ) {
      const updatedUserData = { ...agency };
      delete updatedUserData.city;
      delete updatedUserData.cityId;
      setAgency(updatedUserData);
      setSelectedCity(undefined);
    }
  }, [agency?.state]);

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  // const [DrowpdownTime,setDropdownTime] = useState([])

  const HexCase = () => {
    return (
      <>
        <div
          style={{
            padding: "3px",
            background: "#fff",
            borderRadius: "1px",
            boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
            display: "inline-block",
            cursor: "pointer",
          }}
          onClick={() => {
            setDisplayColorPicker(!displayColorPicker);
          }}
        >
          <div
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "2px",
              background: colorHex,
            }}
          />
        </div>
        {displayColorPicker ? (
          <div style={{ position: "absolute", zIndex: "2" }}>
            <div
              style={{
                position: "fixed",
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px",
              }}
              onClick={() => {
                setDisplayColorPicker(false);
              }}
            />
            <SketchPicker
              color={colorHex}
              onChange={(newColor) => {
                setColorHex(newColor.hex);
              }}
            />
          </div>
        ) : null}
        <span>HEX: {colorHex}</span>
      </>
    );
  };
  const decodedUrl = decodeURIComponent(agency?.logo);
  const logoName = decodedUrl.substring(decodedUrl.lastIndexOf("/") + 1);

  return (
    <>
      <Row className="gy-1 pt-75 pb-4">
        <div>
          <h4>Slug</h4>
        </div>
        <Col lg={6} xs={12} xl={6}>
          <div>
            <Label id="name">
              Slug<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="slug"
              name="slug"
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter Slug"}
              value={agency?.slug}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
      </Row>
      <Row className="gy-1 pt-10 pb-4">
        <div>
          <h4>Logo</h4>
        </div>
        <Col lg={6} xs={12} xl={6}>
          <Label>Logo</Label>
          <div style={{ display: "flex", alignItems: "center" }}>
            {update &&
            agency?.logo != null &&
            agency?.logo != undefined &&
            isShowLogoName ? (
              <Label>{logoName != "undefined" ? logoName : ""}</Label>
            ) : (
              <Input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                id="logo"
                name="logo"
                onChange={(e) => fileOnChangeHandler(e)}
              />
            )}
            {update && agency?.logo != null && agency?.logo != undefined ? (
              <Button
                type="button"
                className="add-new-user"
                color="link"
                onClick={() => setIsShowLogoName(!isShowLogoName)}
              >
                <Cancel height={16} width={16} />
              </Button>
            ) : null}

            {update && agency?.logo != null && agency?.logo != undefined ? (
              <Button
                type="button"
                className="add-new-user"
                color="link"
                onClick={() => window.open(agency?.logo)}
              >
                View
              </Button>
            ) : null}
          </div>
        </Col>
      </Row>
      <Row className="gy-1 pt-24">
        <div>
          <h4>Agency</h4>
        </div>
        {/* <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="agencyCode">
              Agency Code<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="agencyCode"
              name="agencyCode"
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter Agency Code"}
              value={agency?.agencyCode}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col> */}
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="name">
              Agency Name<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="name"
              name="name"
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter Agency Name"}
              value={agency?.name}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="name">
              Owner Name<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="ownersName"
              name="ownersName"
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter Owner Name"}
              value={agency?.ownersName}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="mobileNumber">
              Mobile Number<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              className="w-100"
              type="text"
              maxLength="10"
              placeholder={"Enter Mobile Number"}
              value={agency?.mobileNumber}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              className="w-100"
              type="text"
              maxLength="10"
              placeholder={"Enter Phone Number"}
              value={agency?.phoneNumber}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="email">
              Email<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="email"
              name="email"
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter Email"}
              value={agency?.email}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="password">
              Password<span style={{ color: "red" }}>*</span>
            </Label>
            <InputPasswordToggle
              id="password"
              name="password"
              className="input-group-merge"
              placeholder={"Enter Password"}
              value={agency?.password}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="address">
              Address<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="address"
              name="address"
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter Address"}
              value={agency?.address}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="country">
              Country<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              id="country"
              value={selectedCountry}
              placeholder={
                selectedCountry?.value ? selectedCountry?.value : "India"
              }
              options={countries}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectedCountry(e);
                handleChange(e, "country");
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
              placeholder={agency?.state ? agency?.state : "Select State"}
              options={states}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectedState(e);
                handleChange(e, "state");
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
              placeholder={agency?.city ? agency?.city : "Select City"}
              options={cities}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectedCity(e);
                handleChange(e, "city");
              }}
            />
          </div>
        </Col>

        <Col
          lg={6}
          xs={12}
          xl={4}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <Label id="themeColor">
              Theme Color<span style={{ color: "red" }}>*</span>
            </Label>
            {HexCase()}
          </div>
        </Col>
        {/* <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="emailAppPassword">
              Email App Password<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="emailAppPassword"
              name="emailAppPassword"
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter Email App Password"}
              value={agency?.emailAppPassword}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col> */}
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="whatsapp">
              Whatsapp Number<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              className="w-100"
              type="text"
              maxLength="10"
              placeholder={"Enter Whatsapp Number"}
              value={agency?.whatsapp}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="whatsappLink">WhatsApp Link</Label>
            <Input
              id="whatsappLink"
              name="whatsappLink"
              className="w-100"
              type="text"
              maxLength={500}
              placeholder={"Enter WhatsApp Link (e.g., https://wa.me/1234567890)"}
              value={agency?.whatsappLink}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="gstNo">GST Number</Label>
            <Input
              id="gstNo"
              name="gstNo"
              className="w-100"
              type="text"
              maxLength={20}
              placeholder={"Enter GST Number"}
              value={agency?.gstNo}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="pancardNo">Pan Card</Label>
            <Input
              id="pancardNo"
              name="pancardNo"
              className="w-100"
              type="text"
              maxLength={20}
              placeholder={"Enter Pan Card Number"}
              value={agency?.pancardNo}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="cinNumber">CIN Number</Label>
            <Input
              id="cinNumber"
              name="cinNumber"
              className="w-100"
              type="text"
              maxLength={20}
              placeholder={"Enter CIN Number"}
              value={agency?.cinNumber}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default AgencyForm;
