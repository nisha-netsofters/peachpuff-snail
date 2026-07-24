import React, { useEffect, useState } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "../../../utility/Utils";
import { resolveIndianAddress } from "../../../utility/resolveIndianAddress";

export const Address = ({
  cities,
  states,
  selectedState,
  setSelectedState,
  setSelectedCity,
  selectedCity,
  candidate,
  setCandidate,
  isDisabledAllFields,
  handleChange = () => {},
}) => {
  useEffect(() => {
    states?.forEach((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = "state";
    });
  }, [states]);

  useEffect(() => {
    cities?.forEach((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = "city";
    });
  }, [cities]);

  const themecolor = localStorage.getItem("themecolor");
  const [focus, setIsfocus] = useState(null);

  // Resolve state dropdown + stateId when resume / autofill sets state name only
  useEffect(() => {
    if ((!candidate?.state && !candidate?.stateId) || !states?.length) return;

    const resolved = resolveIndianAddress({
      state: candidate.state,
      stateId: candidate.stateId,
      city: candidate.city,
      cityId: candidate.cityId,
    });
    if (!resolved.stateId) return;

    const match = states.find((s) => s.isoCode === resolved.stateId);
    if (!match) return;

    const option = {
      ...match,
      label: match.name,
      value: match.name,
      key: "state",
    };

    if (!selectedState || selectedState.isoCode !== match.isoCode) {
      setSelectedState(option);
    }

    if (
      candidate.stateId !== resolved.stateId ||
      candidate.state !== resolved.state
    ) {
      setCandidate((prev) => {
        const base = Array.isArray(prev) ? {} : prev || {};
        return {
          ...base,
          state: resolved.state,
          stateId: resolved.stateId,
        };
      });
    }
  }, [candidate?.state, candidate?.stateId, candidate?.resumeParsedAt, states]);

  // Resolve city dropdown + cityId when autofill sets city name
  useEffect(() => {
    if (!candidate?.city || !cities?.length) return;

    const resolved = resolveIndianAddress({
      state: candidate.state,
      stateId: candidate.stateId,
      city: candidate.city,
      cityId: candidate.cityId,
    });

    const match =
      cities.find(
        (c) => c.name?.toLowerCase() === String(resolved.city).toLowerCase()
      ) ||
      cities.find(
        (c) => c.name?.toLowerCase() === String(candidate.city).toLowerCase()
      );
    if (!match) return;

    const option = {
      ...match,
      label: match.name,
      value: match.name,
      key: "city",
    };

    if (!selectedCity || selectedCity.value !== match.name) {
      setSelectedCity(option);
    }

    if (candidate.cityId !== match.name || candidate.city !== match.name) {
      setCandidate((prev) => {
        const base = Array.isArray(prev) ? {} : prev || {};
        return {
          ...base,
          city: match.name,
          cityId: match.name,
        };
      });
    }
  }, [candidate?.city, candidate?.resumeParsedAt, cities]);

  return (
    <div>
      <Row className="gy-1 pt-75" style={{ marginTop: "10px" }}>
        <div>
          <h4>Address Information</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>Address</Label>
            <Input
              maxLength={230}
              id="street"
              onFocus={() => setIsfocus("street")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "street" && themecolor,
              }}
              className="w-100"
              type="text"
              placeholder={"Enter Street"}
              value={candidate?.street || ""}
              disabled={isDisabledAllFields}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>State</Label>
            <Select
              id="state"
              value={selectedState || null}
              placeholder={candidate?.state || "Select State"}
              options={states}
              className="react-select"
              isDisabled={isDisabledAllFields}
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectedState(e);
                setSelectedCity(undefined);
                setCandidate((prev) => {
                  const next = { ...prev, state: e.value, stateId: e.isoCode };
                  delete next.city;
                  delete next.cityId;
                  return next;
                });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>City</Label>
            <Select
              id="city"
              value={selectedCity || null}
              placeholder={candidate?.city || "Select City"}
              options={cities}
              isDisabled={isDisabledAllFields}
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
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>Zip/Postal Code</Label>
            <Input
              id="zip"
              onFocus={() => setIsfocus("zip")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "zip" && themecolor,
              }}
              className="w-100"
              type="text"
              disabled={isDisabledAllFields}
              maxLength={6}
              placeholder={"Enter Zip"}
              value={candidate?.zip || ""}
              onChange={(e) =>
                setCandidate({
                  ...candidate,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
