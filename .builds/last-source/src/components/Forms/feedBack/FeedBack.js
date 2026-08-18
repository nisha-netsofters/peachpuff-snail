import React, { useState, useEffect } from "react";
import { Row, Col, Input, Label } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSelector } from "react-redux";

const FeedBack = ({ feedBack, setFeedBack, handleChange = () => {} }) => {
  const getCompany = useSelector((state) => state.client);

  const onBoardings = useSelector((state) => state.onBoarding.results);

  const [selectCompany, setSelectCompany] = useState();

  const [company, setCompany] = useState();

  useEffect(() => {
    const test = [];
    if (onBoardings !== undefined) {
      onBoardings.forEach((item) => {
        test.push({
          value: item.id,
          id: "onBoardingId",
          label: item.companyName,
        });
      });
    }
    if (getCompany?.length > 0) {
      getCompany?.forEach((ele) => {
        test.push({
          ...ele,
          label: ele.companyName,
          key: "onBoardingId",
          value: ele.id,
        });
      });
    }
    setCompany(test);
  }, [onBoardings, getCompany]);

  useEffect(() => {
    if (feedBack?.onBoarding?.companyName !== undefined) {
      setSelectCompany({
        value: feedBack?.onBoardingId,
        label: feedBack?.onBoarding?.companyName,
      });
    }
    if (feedBack?.clients?.companyName !== undefined) {
      setSelectCompany({
        value: feedBack?.onBoardingId,
        label: feedBack?.clients?.companyName,
      });
    }
  }, [feedBack]);

  const themecolor = localStorage.getItem("themecolor");
  const [focus, setIsfocus] = useState(null);
  return (
    <div>
      <Row className="gy-1 pt-75">
        <div>
          <h4>Client FeedBack</h4>
        </div>
        <Col lg={12} xs={12} xl={12}>
          <Label id="companyName">Company Name</Label>
          <Select
            id="gender"
            value={selectCompany}
            placeholder="Select Company"
            options={company}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(e) => {
              setSelectCompany(e);
              setFeedBack({ ...feedBack, onBoardingId: e?.value });
              // handleChange(e)
            }}
          />
        </Col>
        <Col lg={12} xs={12} xl={12}>
          <Label id="feedBack">Feedback</Label>
          <Input
            type="textarea"
            name="feedBack"
            onFocus={() => setIsfocus("feedBack")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "feedBack" && themecolor,
            }}
            id="feedback"
            // rows='2'
            value={feedBack?.feedback}
            placeholder="Enter FeedBack"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default FeedBack;
