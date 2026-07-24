import React from "react";
import { Row, Col, Input, Label, Form, FormGroup } from "reactstrap";
import { selectThemeColors } from "../../../../utility/Utils";
import Select from "react-select";
import { Checkbox } from "antd";
import { useEffect } from "react";

const AgencyPermission = ({
  states,
  city,
  setDataMerge,
  dataMerge,
  update,
  agency,
  setPermissionSelectedState,
  setPermissionSelectedCity,
  // handleChange = () => {},
}) => {
  useEffect(() => {
    states?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = ele?.name;
    });
  }, [states]);

  useEffect(() => {
    city?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = ele?.name;
    });
  }, [city]);

  return (
    <>
      <Row className="gy-1 pt-4">
        <div>
          <h4>Permission</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="statePermission">
              State
              <span style={{ fontSize: "1rem" }}> (Optional)</span>
            </Label>
            <Select
              isMulti
              id="statePermission"
              defaultValue={
                update &&
                agency?.permission?.areas.map((area) => ({
                  label: area?.state,
                  isoCode: area?.stateId,
                }))
              }
              placeholder={"Select States"}
              options={states}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setPermissionSelectedState(e);
                // handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="cityBasePermission">
              City Base Permission
              <span style={{ fontSize: "1rem" }}> (Optional)</span>
            </Label>
            <Select
              isMulti
              id="cityBasePermission"
              defaultValue={
                update &&
                agency?.permission?.areas?.reduce((result, area) => {
                  area?.cities?.forEach((city) => {
                    result.push({ label: city?.city });
                  });
                  return result;
                }, [])
              }
              placeholder={"Select Cities"}
              options={city}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setPermissionSelectedCity(e);
                // handleChange(e);
              }}
            />
          </div>
        </Col>
        <Col
          lg={6}
          xs={12}
          xl={4}
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Label id="cityBasePermission">
              Data Merge<span style={{ color: "red" }}>*</span>
            </Label>
            <Checkbox.Group
              disabled={agency?.email === "uniqueworldjobs@gmail.com" && true}
              className="data-merge-options"
              value={dataMerge}
              style={{ width: "100%" }}
              onChange={(e) => {
                setDataMerge(e);
              }}
            >
              <Row>
                <Col span={6}>
                  <Checkbox value="uniqueworld">Uniqueworld</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="allAgency">All Agency</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default AgencyPermission;
