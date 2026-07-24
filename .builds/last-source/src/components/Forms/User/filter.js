import React, { Fragment, useEffect, useState } from "react";
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
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useDispatch, useSelector } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import { selectThemeColors } from "../../../utility/Utils";
import actions from "./../../../redux/user/actions";
import { Country, State, City } from "country-state-city";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";

const initialState = {
  planId: "",
  name: "",
  email: "",
  mobile: "",
  roleId: "",
  address: "",
  city: "",
  state: "",
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
  const dispatch = useDispatch();
  const getRole = useSelector((state) => state.roles);
  const { plans } = useSelector((state) => state.plans);
  const [filter, setFilter] = useState(initialState);
  const [role, setRole] = useState("");
  const [plan, setPlan] = useState("");
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const { width } = useBreakpoint();
  console.info("-------------------------------");
  console.info("getRole => ", getRole);
  console.info("-------------------------------");
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
  console.info("-------------------------------");
  console.info("getRole => ", getRole);
  console.info("-------------------------------");
  // useEffect(() => {
  //   getRole?.filter((ele) => {
  //     if (ele?.name != "Admin") {
  //       ele.label = ele.name;
  //       ele.value = ele.id;
  //       ele.key = "roleId";
  //     }
  //   });
  // }, [getRole]);

  useEffect(() => {
    plans?.map((ele) => {
      ele.label = ele.planName;
      ele.value = ele.id;
      ele.key = "planId";
    });
  }, [plans]);

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
    if (role?.value?.length > 0) {
      filterdata.roleId = role.value;
    }
    if (plan?.value?.length > 0) {
      filterdata.planId = plan.value;
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

  const handleClear = async () => {
    setFilter(initialState);
    setPlan("");
    setRole("");
    setSelectedState("");
    setSelectedCity("");
    await dispatch({
      type: actions.GET_USER,
      payload: {
        filterData: [],
        page: 1,
        perPage: 10,
      },
    });
    setFilterData([]);
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
            <Col md="12" className="mt-1">
              <Label id="plan">Plan</Label>
              <Select
                menuPlacement="auto"
                id="planId"
                value={plan}
                placeholder="Select Plan"
                options={plans}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setPlan(e);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="name">Name</Label>
              <Input
                id="name"
                name="name"
                onFocus={() => setIsfocus("name")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "name" && themecolor,
                }}
                className="w-100"
                type="text"
                maxLength={200}
                placeholder={"Enter Name"}
                value={filter?.name}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z ]/gi, "")
                  )
                }
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="Email">Email</Label>
              <Input
                id="email"
                name="email"
                onFocus={() => setIsfocus("email")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "email" && themecolor,
                }}
                className="w-100"
                type="email"
                maxLength={200}
                value={filter?.email}
                placeholder={"Enter Email"}
                onChange={(e) =>
                  handleFilterChange(e.target.id, e.target.value)
                }
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="mobile">Contact Number</Label>
              <Input
                id="mobile"
                onFocus={() => setIsfocus("mobile")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "mobile" && themecolor,
                }}
                name="mobile"
                className="w-100"
                type="text"
                maxLength={10}
                value={filter?.mobile}
                placeholder={"Enter Contact Number"}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label for="role-select">Select Role </Label>
              <Select
                menuPlacement="auto"
                id="recruiterId"
                value={role}
                placeholder="Select Role"
                options={getRole?.filter((ele) => {
                  if (ele?.name != "Admin") {
                    ele.label = ele.name;
                    ele.value = ele.id;
                    return ele;
                  }
                })}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setRole(e);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="address">Address</Label>
              <Input
                id="address"
                onFocus={() => setIsfocus("address")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "address" && themecolor,
                }}
                name="address"
                className="w-100"
                type="text"
                maxLength={200}
                value={filter?.address}
                placeholder={"Enter Address"}
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
          </Row>
        </Fragment>
      </Sidebar>
    </>
  );
};

export default Filter;
