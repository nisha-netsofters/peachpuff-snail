import React, { useEffect, useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import { selectThemeColors } from "../../../utility/Utils";
import Select from "react-select";

export const Address = ({
  cities,
  states,
  selectedState,
  setSelectedState,
  setSelectedCity,
  selectedCity,
  candidate,
  stepper,
  setCandidate,
  handleChange = () => { },
}) => {
  const [streetError, setStreetError] = useState(false);
  const [cityerr, setcityerr] = useState(false);
  const [stateError, setStateError] = useState(false)
  // const [stateError, setStateError] = useState(false)
  const [zipError, setZipError] = useState(false);

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
    if (candidate?.state && (selectedCity != undefined || selectedState != undefined)) {
      const updatedUserData = { ...candidate };
      delete updatedUserData.city;
      delete updatedUserData.cityId;
      setCandidate(updatedUserData);
      setSelectedCity(undefined)
    }
  }, [candidate?.state])

  const onSubmit = async () => {
    if (
      candidate?.street === undefined ||
      candidate?.street?.length === 0 ||
      candidate?.city === undefined ||
      candidate?.city?.length === 0 ||
      candidate?.city == '' ||
      candidate?.zip === undefined ||
      candidate?.zip?.length !== 6 ||
      candidate?.state === undefined ||
      candidate?.state?.length === 0 ||
      candidate?.state == ''
    ) {
      if (candidate?.street === undefined || candidate?.street?.length === 0) {
        setStreetError(true);
      }
      if (candidate?.city === undefined || candidate?.city?.length === 0 || candidate?.city == '') {
        setcityerr(true);
      }
      if (candidate?.zip === undefined || candidate?.zip?.length !== 6) {
        setZipError(true);
      }
      if (candidate?.state === undefined || candidate?.state?.length === 0 || candidate?.state == '') {
        setStateError(true)
      }
    } else {
      stepper?.next();
    }
  };
  const [focus, setIsfocus] = useState(null);
  return (
    <div>
      <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
        <div>
          <h4>Address Information</h4>
        </div>
        <Col md={6} xs={12}>
          <div>
            <Label>Address</Label>
            <Input
              id="street"
              onFocus={() => setIsfocus("street")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "street" && "#105996",
              }}
              invalid={streetError}
              maxLength={230}
              className="w-100"
              type="text"
              placeholder={"Enter Street"}
              value={candidate?.street}
              onChange={(e) => {
                handleChange(e);
                setStreetError(false);
              }}
            />
            {streetError === true ? (
              <p style={{ color: "red" }}>Enter Street Name</p>
            ) : null}
          </div>
        </Col>
        <Col lg={6} xs={12}>
          <div>
            <Label id="state">
              State<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              id="state"
              value={selectedState}
              placeholder={candidate?.state || "Select State"}
              options={states}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectedState(e);
                handleChange(e);
                setStateError(false)
              }}
            />
            {stateError === true ? (
              <p style={{ color: "red" }}>Select Valid State</p>
            ) : null}
          </div>
        </Col>
        <Col md={6} xs={12}>
          <div>
            <Label>City</Label>
            {/* <Input
              id="city"
              className="w-100"
              invalid = {cityerr}
              type="text"
              placeholder={'Enter City'}
              value={candidate?.city}
               onChange={(e) => {
                handleChange(e)
                setcityerr(false)
              }}
            /> */}
            <Select

              value={selectedCity != undefined ? selectedCity : ''}
              placeholder={candidate?.city || "Select City"}
              options={cities}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectedCity(e);
                handleChange(e);
                setcityerr(false);
              }}
            />
            {cityerr === true ? (
              <p style={{ color: "red" }}>Enter City Name</p>
            ) : null}
          </div>
        </Col>
        {/* <Col md={6} xs={12}>
          <div>
            <Label>State</Label>
            <Input
              id="state"
              invalid={stateError}
              className="w-100"
              type="text"
              placeholder={'Enter State'}
              value={candidate?.state}
               onChange={(e) => {
                handleChange(e)
                setStateError(false)
              }}
            />
            {stateError === true ? <p style={{color:"red"}}>Enter State Name</p> : null}

          </div>
        </Col> */}
        <Col md={6} xs={12}>
          <div>
            <Label>Zip/Postal Code</Label>
            <Input
              id="zip"
              onFocus={() => setIsfocus("zip")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "zip" && "#105996",
              }}
              className="w-100"
              type="text"
              maxLength={6}
              minLength={6}
              invalid={zipError}
              placeholder={"Enter Zip"}
              value={candidate?.zip}
              onChange={(e) => {
                handleChange(e);
                setCandidate({
                  ...candidate,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                });
                setZipError(false);
              }}
            />
            {zipError === true ? (
              <p style={{ color: "red" }}>Enter Zip Code</p>
            ) : null}
          </div>
        </Col>
      </Row>
      <Row className="mt-2" style={{ display: "flex" }}>
        <Col style={{ textAlign: "left" }}>
          <Button
            type="submit"
            color="default"
            onClick={() => stepper.previous()}
            className="btn-next"
            style={{ color: 'white', backgroundColor: "#105996" }}
          >
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
            <ArrowLeft
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowLeft>
          </Button>
        </Col>
        <Col style={{ textAlign: "right" }}>
          <Button
            type="submit"
            color="default"
            onClick={() => onSubmit()}
            className="btn-next"
            style={{ color: 'white', backgroundColor: "#105996" }}
          >
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </Col>
      </Row>
    </div>
  );
};
