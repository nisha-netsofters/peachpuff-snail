import React, { useEffect, useMemo, useState } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "../../../utility/Utils";
import { resolveIndianAddress } from "../../../utility/resolveIndianAddress";
import { cleanAreaValue } from "../../../utility/normalizeResumeExtract";
import { getAreasByCity } from "../../../apis/areas";

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
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [areasLoading, setAreasLoading] = useState(false);

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

  const cityName = useMemo(
    () => selectedCity?.value || selectedCity?.name || candidate?.city || "",
    [selectedCity, candidate?.city]
  );
  const stateName = useMemo(
    () => selectedState?.value || selectedState?.name || candidate?.state || "",
    [selectedState, candidate?.state]
  );

  // Load areas when city changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cityName) {
        setAreaOptions([]);
        setSelectedArea(null);
        return;
      }
      setAreasLoading(true);
      try {
        const resp = await getAreasByCity({
          state: stateName,
          city: cityName,
        });
        const list = Array.isArray(resp?.data)
          ? resp.data
          : Array.isArray(resp)
          ? resp
          : [];
        if (cancelled) return;
        const options = list.map((a) => ({
          label: a.name,
          value: a.name,
          key: "area",
          id: a.id,
        }));
        setAreaOptions(options);

        // Resume / saved area match (exact, then fuzzy contains)
        // Also recover Vesu from Address line when Area field empty
        let currentArea = cleanAreaValue(candidate?.area || "");
        if (!currentArea && candidate?.street) {
          const streetLower = String(candidate.street).toLowerCase();
          const fromStreet = options.find((o) => {
            const v = o.value.toLowerCase();
            return (
              v.length >= 3 &&
              new RegExp(
                `(?:^|[^a-z0-9])${v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:[^a-z0-9]|$)`,
                "i"
              ).test(streetLower)
            );
          });
          if (fromStreet) currentArea = fromStreet.value;
        }

        if (currentArea) {
          const lower = currentArea.toLowerCase();
          const match =
            options.find((o) => o.value.toLowerCase() === lower) ||
            options.find(
              (o) =>
                o.value.toLowerCase().includes(lower) ||
                lower.includes(o.value.toLowerCase())
            );
          if (match) {
            setSelectedArea(match);
            if (candidate?.area !== match.value) {
              setCandidate((prev) => ({
                ...(Array.isArray(prev) ? {} : prev || {}),
                area: match.value,
              }));
            }
          } else {
            // Keep parsed free-text visible until user picks from list
            setSelectedArea({
              label: currentArea,
              value: currentArea,
              key: "area",
            });
            if (!candidate?.area) {
              setCandidate((prev) => ({
                ...(Array.isArray(prev) ? {} : prev || {}),
                area: currentArea,
              }));
            }
          }
        } else {
          setSelectedArea(null);
        }
      } catch (err) {
        if (!cancelled) {
          setAreaOptions([]);
          setSelectedArea(null);
        }
      } finally {
        if (!cancelled) setAreasLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cityName, stateName, candidate?.area, candidate?.street, candidate?.resumeParsedAt]);

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
                setSelectedArea(null);
                setAreaOptions([]);
                setCandidate((prev) => {
                  const next = { ...prev, state: e.value, stateId: e.isoCode };
                  delete next.city;
                  delete next.cityId;
                  delete next.area;
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
                setSelectedArea(null);
                setCandidate((prev) => {
                  const next = {
                    ...prev,
                    city: e.value,
                    cityId: e.value,
                  };
                  delete next.area;
                  return next;
                });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>Area</Label>
            <Select
              id="area"
              value={selectedArea || null}
              placeholder={
                !cityName
                  ? "Select city first"
                  : areasLoading
                  ? "Loading areas..."
                  : areaOptions.length
                  ? "Select Area"
                  : "No areas for this city"
              }
              options={areaOptions}
              isDisabled={
                isDisabledAllFields || !cityName || areasLoading
              }
              isClearable
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectedArea(e || null);
                setCandidate((prev) => {
                  const next = { ...(prev || {}) };
                  if (e?.value) next.area = e.value;
                  else delete next.area;
                  return next;
                });
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
