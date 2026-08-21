import React from "react";
import { Col, Input, Label, Row } from "reactstrap";
import Select from "react-select";
import { City, State } from "country-state-city";
import { selectThemeColors } from "../../../utility/Utils";

const AreasForm = ({
  form,
  setForm,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  cities,
  setCities,
}) => {
  const states = State.getStatesOfCountry("IN").map((s) => ({
    ...s,
    label: s.name,
    value: s.name,
  }));

  return (
    <Row className="gy-1 pt-75">
      <div>
        <h4>Area</h4>
      </div>
      <Col xs={12}>
        <Label>
          State<span style={{ color: "red" }}>*</span>
        </Label>
        <Select
          className="react-select"
          classNamePrefix="select"
          theme={selectThemeColors}
          options={states}
          value={selectedState}
          placeholder="Select State"
          onChange={(e) => {
            setSelectedState(e);
            setSelectedCity(null);
            const cityList = City.getCitiesOfState("IN", e.isoCode).map(
              (c) => ({
                ...c,
                label: c.name,
                value: c.name,
              })
            );
            setCities(cityList);
            setForm({ ...form, state: e.value, city: "", name: form.name || "" });
          }}
        />
      </Col>
      <Col xs={12}>
        <Label>
          City<span style={{ color: "red" }}>*</span>
        </Label>
        <Select
          className="react-select"
          classNamePrefix="select"
          theme={selectThemeColors}
          options={cities}
          value={selectedCity}
          placeholder="Select City"
          isDisabled={!selectedState}
          onChange={(e) => {
            setSelectedCity(e);
            setForm({ ...form, city: e.value });
          }}
        />
      </Col>
      <Col xs={12}>
        <Label>
          Area / Locality<span style={{ color: "red" }}>*</span>
        </Label>
        <Input
          type="text"
          maxLength={120}
          placeholder="Enter Area Name"
          value={form?.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </Col>
    </Row>
  );
};

export default AreasForm;
