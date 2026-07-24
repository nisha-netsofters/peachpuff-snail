import React, { Fragment, useState, useEffect } from "react";
import Select from "react-select";
import Sidebar from "@components/sidebar";
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
} from "reactstrap";
import { selectThemeColors } from "@utils";

import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
// import PickerDefault from './../pickerDefalut'
import { useSelector } from "react-redux";
// import actions from '../../../redux/client/actions'
import { Scrollbars } from "react-custom-scrollbars";
// import actions from "../../../redux/industries/actions";
import { Country, State, City } from "country-state-city";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";

const initialState = {
  companyName: "",
  companyowner: "",
  mobile: "",
  email: "",
  street: "",
  city: "",
  state: "",
  country: "",
  zip: "",
};

const Filter = ({
  setFilterData,
  setFilterToggleMode,
  handleFilter = () => {},
  toggleSidebar,
  open,
  handleFilterToggleMode = () => {},
  clear,
  setclear = () => {},
}) => {
  const [filter, setFilter] = useState(initialState);
  const industries = useSelector((state) => state.industries);
  const [industry, setIndustry] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const { width } = useBreakpoint();
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
    const getStates = async () => {
      try {
        const result = await State.getStatesOfCountry("IN");
        setStates(result);
      } catch (error) {
        setStates([]);
      }
    };

    getStates();
  }, []);

  useEffect(() => {
    const getCities = async () => {
      try {
        const result = await City.getCitiesOfState(
          "IN",
          selectedState?.isoCode
        );
        setCities(result);
      } catch (error) {
        setCities([]);
      }
    };

    getCities();
  }, [selectedState]);

  const handleFilterChange = (id, value) => {
    setFilter({ ...filter, [id]: value });
  };

  const handleFilterData = () => {
    const filterdata = {};
    for (const key in filter) {
      if (filter[key].length > 0) {
        filterdata[key] = filter[key];
      }
    }
    if (industry?.length > 0) {
      filterdata.industriesId = industry.map((ele) => {
        return ele.value;
      });
    }
    if (selectedState?.value?.length > 0) {
      filterdata.state = selectedState?.value;
    }
    if (selectedCity?.value?.length > 0) {
      filterdata.city = selectedCity?.value;
    }
    handleFilter(filterdata);
    handleFilterToggleMode(false);
  };

  const handleClear = () => {
    setFilter(initialState);
    setIndustry([]);
    setFilterData([]);
    setSelectedState("");
    setSelectedCity("");
    handleFilterToggleMode(false);
    setclear(false);
  };
  useEffect(() => {
    if (clear == true) {
      handleClear();
    }
  }, [clear]);
  useEffect(() => {
    const keyDownHandler = async (event) => {
      if (event.key === "Escape") {
        setFilterToggleMode(false);
      }
      if (event.key === "Enter") {
        document.getElementById("handleFilterData")?.click();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );

  const [focus, setIsfocus] = useState(null);
  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title={
          <>
            <div>
              Filter
              <Button
                id="handleFilterData"
                className="add-new-user"
                color="link"
                onClick={handleFilterData}
                style={
                  width < 576
                    ? { marginLeft: "12px", color: themecolor }
                    : { marginLeft: "140px", color: themecolor }
                }
              >
                Search
              </Button>
              <Button
                className="add-new-user "
                color="link"
                onClick={handleClear}
                style={{ color: themecolor }}
              >
                Clear
              </Button>
            </div>
          </>
        }
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        // onClosed={handleFilterToggleMode(false)}
      >
        <Fragment>
          <Row noGutters>
            <Col md="12">
              <Label for="role-select">company Name</Label>
              <Input
                id="companyName"
                onFocus={() => setIsfocus("companyName")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "companyName" && themecolor,
                }}
                className="w-100"
                type="text"
                maxLength={200}
                placeholder="Enter company Name"
                value={filter.companyName}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  )
                }
              />
            </Col>
            <Col md="12">
              <Label for="role-select">company owner</Label>
              <Input
                id="companyowner"
                onFocus={() => setIsfocus("companyowner")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "companyowner" && themecolor,
                }}
                className="w-100"
                type="text"
                maxLength={200}
                placeholder="Enter Company Owner"
                value={filter.companyowner}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  )
                }
              />
            </Col>
            <Col md="12">
              <Label for="role-select">mobile</Label>
              <Input
                id="mobile"
                onFocus={() => setIsfocus("mobile")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "mobile" && themecolor,
                }}
                placeholder="Enter Contact Number"
                className="w-100"
                type="text"
                maxLength={200}
                value={filter.mobile}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            </Col>
            <Col md="12">
              <Label for="role-select">email</Label>
              <Input
                id="email"
                onFocus={() => setIsfocus("email")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "email" && themecolor,
                }}
                className="w-100"
                type="email"
                maxLength={200}
                placeholder="Enter Email"
                value={filter.email}
                onChange={(e) =>
                  handleFilterChange(e.target.id, e.target.value)
                }
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label>Industries</Label>
              <Select
                isMulti
                menuPlacement="auto"
                id="industriesId"
                value={industry}
                placeholder="Select Industry"
                options={
                  industries?.length &&
                  industries?.map((ele) => {
                    ele.value = ele.id;
                    ele.label = ele?.industryCategory;
                    return ele;
                  })
                }
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setIndustry(e);
                }}
              />
            </Col>
            <Col md="12">
              <Label for="role-select">street</Label>
              <Input
                id="street"
                onFocus={() => setIsfocus("street")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "street" && themecolor,
                }}
                className="w-100"
                maxLength={200}
                type="text"
                placeholder="Enter street"
                value={filter.street}
                onChange={(e) =>
                  handleFilterChange(e.target.id, e.target.value)
                }
              />
            </Col>
            <Col md="12">
              <Label for="role-select">state</Label>
              <Select
                menuPlacement="auto"
                id="state"
                value={selectedState}
                placeholder={"Select State"}
                options={states}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setSelectedState(e);
                }}
              />
            </Col>
            <Col md="12">
              <Label for="role-select">city</Label>
              <Select
                menuPlacement="auto"
                id="city"
                value={selectedCity}
                placeholder={"Select City"}
                options={cities}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setSelectedCity(e);
                }}
              />
            </Col>

            {/* <Col md="12">
                                    <Label for="role-select">country</Label>
                                    <Input
                                        id="country"
                                        className="w-100"
                                        type="text"
                                        placeholder='Enter country'
                                        value={filter.country}
                                        onChange={e => handleFilterChange(e.target.id, e.target.value)}
                                    />
                                </Col> */}
            <Col md="12">
              <Label for="role-select">Pin</Label>
              <Input
                id="zip"
                onFocus={() => setIsfocus("zip")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "zip" && themecolor,
                }}
                className="w-100"
                type="text"
                maxLength={6}
                placeholder="Enter zip"
                value={filter.zip}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            </Col>
          </Row>
        </Fragment>
      </Sidebar>
    </>
  );
};

export default Filter;
