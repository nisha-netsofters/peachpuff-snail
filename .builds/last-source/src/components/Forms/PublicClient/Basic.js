import React, { useState, useEffect } from "react";
import { Row, Col, Input, Label, Button } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
// import { ArrowLeft, ArrowRight } from 'react-feather'
import { useDispatch, useSelector } from "react-redux";
import industriesActions from "../../../redux/industries/actions";
import jobCategoryActions from "../../../redux/jobCategory/actions";

const Basic = ({
  cities,
  states,
  selectedState,
  setSelectedState,
  setSelectedCity,
  selectedCity,
  handleChange = () => { },
  setClient,
  setJobCategory_relation,
  setIndustries_relation,
  client,
  setCName,
  setCOwner,
  setEmail,
  setMobile,
}) => {
  const dispatch = useDispatch();
  const industries = useSelector((state) => state.industries);
  const [selectindustries, setSelectIndustries] = useState([]);
  const jobCategory = useSelector((state) => state.jobCategory.results);
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);

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
    if (client?.state && (selectedCity != undefined || selectedState != undefined)) {
      const updatedUserData = { ...client };
      delete updatedUserData.city;
      delete updatedUserData.cityId;
      setClient(updatedUserData);
      setSelectedCity(undefined)
    }
  }, [client?.state])

  useEffect(() => {
    dispatch({
      type: industriesActions.GET_ALL_INDUSTRIES,
    });
    dispatch({
      type: jobCategoryActions.GET_ALL_JOBCAT,
    });
  }, []);

  //   useEffect(() => {
  // if (jobCategory?.length > 0) {
  //     jobCategory.filter(item => {
  //         item.label = item.jobCategory
  //         return item
  //     })
  //     setJobCategoryOptions(jobCategory)
  // }
  //   }, [jobCategory]);
  const onIndustriesChange = (industry) => {
    const data = [];
    industry?.map((ele) => {
      data.push(ele?.value)
    });
    setClient({ ...client, industries_relation: data });
    setIndustries_relation(data);
  };

  const onjobCategoryChange = (jobCategory) => {
    const data = [];
    jobCategory?.map((ele) => {
      data.push(ele?.value)
    });

    setClient({ ...client, jobCategory_relation: data });
    setJobCategory_relation(data);
  };



  const [focus, setIsfocus] = useState(null);
  return (
    <div>
      <Row className="gy-1 pt-75">
        <div>
          <h4>Client Info</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyName">
              Company Name<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="companyName"
              name="companyName"
              onFocus={() => setIsfocus("companyName")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyName" && "#105996",
              }}
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter company name"}
              value={client?.companyName}
              onChange={(e) => {
                setCName(e.target.value);
                setClient({ ...client, [e.target.id]: e.target.value });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyowner">
              Company Owner<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              id="companyowner"
              name="companyowner"
              onFocus={() => setIsfocus("companyowner")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyowner" && "#105996",
              }}
              className="w-100"
              maxLength={200}
              type="text"
              value={client?.companyowner}
              placeholder={"Enter company owner"}
              onChange={(e) => {
                setCOwner(e.target.value);
                setClient({ ...client, [e.target.id]: e.target.value });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>
              Industries<span style={{ color: "red" }}>*</span>{" "}
            </Label>
            <Select
              style={{ cursor: "pointer" }}
              id="industries"
              name="industries"
              value={selectindustries}
              placeholder="Select Industries"
              options={
                industries?.length > 0 &&
                industries?.filter((ele) => {
                  ele.label = ele?.industryCategory;
                  ele.value = ele?.id;
                  return ele;
                })
              }
              isMulti
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
              
                setSelectIndustries(e);
                onIndustriesChange(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>
              Job Category<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              style={{ cursor: "pointer" }}
              isMulti
              id="jobCategoryId"
              name="jobCategoryId"
              value={jobCategoryOptions}
              placeholder="Select jobCategory"
              options={
                jobCategory?.length > 0 &&
                jobCategory?.filter((ele) => {
                  ele.label = ele?.jobCategory;
                  ele.value = ele?.id;
                  return ele;
                })
              }
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                console.info('----------------------------');
                console.info('e =>', e);
                console.info('----------------------------');
                onjobCategoryChange(e);
                setJobCategoryOptions(e);
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
              onFocus={() => setIsfocus("email")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "email" && "#105996",
              }}
              className="w-100"
              maxLength={200}
              type="email"
              placeholder={"Enter Email"}
              value={client?.email}
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase());
                e.target.value = e.target.value.toLowerCase();
                setClient({ ...client, email: e.target.value });
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
                borderColor: focus === "mobile" && "#105996",
              }}
              className="w-100"
              type="text"
              maxLength={10}
              placeholder={"Enter Mobile"}
              value={client?.mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                setClient({
                  ...client,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                });
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="website">Web Site</Label>
            <Input
              id="website"
              onFocus={() => setIsfocus("website")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "website" && "#105996",
              }}
              className="w-100"
              placeholder={"Web Site"}
              maxLength={250}
              type="text"
              value={client?.website}
              onChange={(e) =>
                setClient({ ...client, [e.target.id]: e.target.value })
              }
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="street">Address</Label>
            <Input
              id="street"
              name="street"
              onFocus={() => setIsfocus("street")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "street" && "#105996",
              }}
              className="w-100"
              type="text"
              maxLength={200}
              value={client?.street}
              placeholder={"Enter Address"}
              onChange={(e) => setClient({ ...client, street: e.target.value })}
            />
          </div>
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="state">State</Label>
            <Select
              id="state"
              value={selectedState}
              placeholder={"Select State"}
              options={states}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                handleChange(e);
                setSelectedState(e);
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="city">
              City<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              id="city"
              value={selectedCity != undefined ? selectedCity : ''}
              placeholder={"Select City"}
              options={cities}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                handleChange(e);
                setSelectedCity(e);
              }}
            />
          </div>
        </Col>
        {/* <Col lg={6} xs={12} xl={4}>
                <div>
                    <Label id="country">Country</Label>
                    <Input
                        id="country"
                        name="country"
                        className="w-100"
                        type="text"
                        value={client?.country}
                        placeholder={'Enter country'}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
            </Col> */}
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="zip">Pin code</Label>
            <Input
              id="zip"
              name="zip"
              onFocus={() => setIsfocus("zip")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "zip" && "#105996",
              }}
              className="w-100"
              maxLength={6}
              type="text"
              value={client?.zip}
              placeholder={"Enter PIN code"}
              onChange={(e) =>
                setClient({
                  ...client,
                  [e.target.id]: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="businessNature">About Us</Label>
            <Input
              id="businessNature"
              name="businessNature"
              onFocus={() => setIsfocus("businessNature")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "businessNature" && "#105996",
              }}
              className="w-100"
              maxLength={250}
              type="textarea"
              value={client?.businessNature}
              placeholder={"Business Nature"}
              onChange={(e) =>
                setClient({ ...client, [e.target.id]: e.target.value })
              }
            />
          </div>
        </Col>
        {/* <Col lg={6} xs={12} xl={4}>
                <div>
                    <Label id="comments">Comments</Label>
                    <Input
                        id="comments"
                        name="comments"
                        className="w-100"
                        type="text"
                        value={client?.comments}
                        placeholder={'Enter Comment'}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
            </Col> */}
      </Row>
    </div>
  );
};

export default Basic;
