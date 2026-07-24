import { useState, useEffect } from "react";
import Select from "react-select";
import { Row, Col, Input, Label } from "reactstrap";
import { selectThemeColors } from "@utils";
import {
  // useDispatch,
  useSelector
} from "react-redux";
// import actions from "../../../redux/industries/actions";
// import jobCategoryActions from "../../../redux/jobCategory/actions";

const ClientDetails = ({
  cities,
  states,
  selectedState,
  setSelectedState,
  setSelectedCity,
  selectedCity,
  client,
  industriesData,
  setClient,
  setEmail,
  jobCategoryData,
  handleChange = () => {},
}) => {
  const jobCategory = useSelector((state) => state.jobCategory.results);

  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);
  const [selectindustries, setSelectIndustries] = useState([]);

  const industries = useSelector((state) => state.industries);
  // const dispatch = useDispatch();
console.info('----------------------------');
console.info('jobCategoryOptions =>', jobCategoryOptions);
console.info('----------------------------');
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
    if (industriesData?.length > 0) {
      const selected = [];
      industriesData.forEach((ele) => {
        ele.label = ele?.industries?.industryCategory;
        ele.value = ele?.industries?.id;
        selected.push(ele);
      });
      setSelectIndustries(selected);
    }
    if (jobCategoryData?.length > 0) {
      const selected = [];
      jobCategoryData.forEach((ele) => {
        ele.label = ele?.jobCategory?.jobCategory;
        ele.value = ele?.jobCategory?.id;
        selected.push(ele);
      });
      setJobCategoryOptions(selected);
    }
  }, [industriesData, jobCategoryData]);

  // useEffect(() => {
  //     // if (jobCategory?.length > 0) {
  //     //     jobCategory.filter(item => {
  //     //         item.label = item.jobCategory
  //     //         item.value = item.id
  //     //         return item
  //     //     })
  //     //     setJobCategoryOptions(jobCategory)
  //     // }
  // }, [jobCategory])

  const onIndustriesChange = (industry) => {
    const data = [];
    industry?.map((ele) => {
     data.push(ele?.value)
    });
    setClient({ ...client, industries_relation: data });
  };

  const onjobCategoryChange = (jobCategory) => {
    const data = [];
    jobCategory?.map((ele) => {
     data.push(ele?.value)
    });

    setClient({ ...client, jobCategory_relation: data });
  };
  const themecolor = localStorage.getItem("themecolor");
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
              // disabled={update}
              id="companyName"
              onFocus={() => setIsfocus("companyName")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyName" && themecolor,
              }}
              name="companyName"
              className="w-100"
              type="text"
              maxLength={200}
              placeholder={"Enter company name"}
              value={client?.companyName}
              onChange={(e) => {
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
              // disabled={update}
              id="companyowner"
              name="companyowner"
              onFocus={() => setIsfocus("companyowner")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "companyowner" && themecolor,
              }}
              className="w-100"
              type="text"
              maxLength={200}
              value={client?.companyowner}
              placeholder={"Enter company owner"}
              onChange={(e) => {
                setClient({ ...client, [e.target.id]: e.target.value });
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
              // disabled={update}
              id="mobile"
              onFocus={() => setIsfocus("mobile")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "mobile" && themecolor,
              }}
              className="w-100"
              type="text"
              maxLength={10}
              placeholder={"Enter Mobile"}
              value={client?.mobile}
              onChange={(e) => {
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
            <Label id="email">
              Email<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              // disabled={update}
              id="email"
              name="email"
              onFocus={() => setIsfocus("email")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "email" && themecolor,
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
            <Label>
              Industries<span style={{ color: "red" }}>*</span>{" "}
            </Label>
            <Select
              // isDisabled={update}
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
              id="jobCategoryId"
              name="jobCategoryId"
              value={jobCategoryOptions}
              isMulti
              placeholder="Select jobCategory"
              // options={jobCategoryOptions}
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
                setJobCategoryOptions(e);
                onjobCategoryChange(e);
                // setFieldValue("jobCategoryId", e.value)
              }}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="street">Address</Label>
            <Input
              // disabled={update}
              id="street"
              name="street"
              onFocus={() => setIsfocus("street")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "street" && themecolor,
              }}
              className="w-100"
              type="text"
              value={client?.street}
              maxLength={200}
              placeholder={"Enter Address"}
              onChange={(e) => setClient({ ...client, street: e.target.value })}
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
              placeholder={client?.state || "Select State"}
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
            <Label id="city">
              City<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              id="city"
              value={selectedCity != undefined ? selectedCity : ''}
              placeholder={client?.city || "Select City"}
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
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="zip">Pin code</Label>
            <Input
              // disabled={update}
              id="zip"
              name="zip"
              onFocus={() => setIsfocus("zip")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "zip" && themecolor,
              }}
              className="w-100"
              type="text"
              maxLength={6}
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
            <Label id="website">Web Site</Label>
            <Input
              // disabled={update}
              id="website"
              onFocus={() => setIsfocus("website")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "website" && themecolor,
              }}
              className="w-100"
              placeholder={"Web Site"}
              type="text"
              maxLength={250}
              value={client?.website}
              onChange={(e) =>
                setClient({ ...client, [e.target.id]: e.target.value })
              }
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="businessNature">Business Nature(About Us)</Label>
            <Input
              // disabled={update}
              id="businessNature"
              onFocus={() => setIsfocus("businessNature")}
              onBlur={() => setIsfocus(null)}
              style={{
                borderColor: focus === "businessNature" && themecolor,
              }}
              name="businessNature"
              className="w-100"
              type="textarea"
              maxLength={250}
              value={client?.businessNature}
              placeholder={"Business Nature"}
              onChange={(e) =>
                setClient({ ...client, [e.target.id]: e.target.value })
              }
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ClientDetails;
