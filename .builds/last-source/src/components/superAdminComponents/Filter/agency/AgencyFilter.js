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
import { useDispatch } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import { selectThemeColors } from "../../../../utility/Utils";
import { Country, State, City } from "country-state-city";
import agencyActions from "../../../../redux/agency/actions";
import useBreakpoint from "../../../../utility/hooks/useBreakpoints";

const initialState = {
  name: "",
  email: "",
  mobile: "",
  address: "",
  city: "",
  state: "",
};

const AgencyFilter = ({
  // filterData,
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
  // const getRole = useSelector((state) => state.roles);
  // const { plans } = useSelector((state) => state.plans);
  const [filter, setFilter] = useState(initialState);
    const { width } = useBreakpoint();
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [permissionState, setPermissionState] = useState([]);
  const [permissionCity, setPermissionCity] = useState([]);
  const [permissionSelectedState, setPermissionSelectedState] =
    useState(undefined);
  const [permissionSelectedCity, setPermissionSelectedCity] =
    useState(undefined);
  const [dataMerge, setDataMerge] = useState([]);

  useEffect(() => {
    if (
      permissionSelectedState == undefined ||
      permissionSelectedState?.length == 0 ||
      permissionSelectedState == null
    ) {
      setPermissionCity([]);
    }
  }, [permissionSelectedState]);

  const organizeData = (selectedStates, selectedCities) => {
    const result = [];
    selectedStates?.forEach((state) => {
      const stateData = {
        state: state?.name,
        stateId: state?.isoCode,
        cities: [],
      };
      selectedCities?.forEach((city) => {
        if (city?.stateCode === state?.isoCode) {
          stateData?.cities?.push({
            city: city?.name,
            cityId: city?.value,
          });
        }
      });
      result.push(stateData);
    });
    return result;
  };

  useEffect(() => {
    const getCities = async (code = "") => {
      try {
        const result = await City.getCitiesOfState("IN", code);
        setPermissionCity((prevCities) => {
          const uniqueCities = new Set([...prevCities, ...result]);
          return [...uniqueCities];
        });
      } catch (error) {
        setPermissionCity([]);
      }
    };
    if (permissionSelectedState != undefined) {
      permissionSelectedState?.map((item) => {
        getCities(item?.isoCode);
      });
    }
  }, [permissionSelectedState]);

  useEffect(() => {
    countries?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = ele?.name;
    });
  }, [countries]);
  useEffect(() => {
    states?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = ele?.name;
    });
  }, [states]);
  useEffect(() => {
    cities?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = ele?.name;
    });
  }, [cities]);
  useEffect(() => {
    permissionState?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = ele?.name;
    });
  }, [permissionState]);
  useEffect(() => {
    permissionCity?.map((ele) => {
      ele.label = ele.name;
      ele.value = ele.name;
      ele.key = ele?.name;
    });
  }, [permissionCity]);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const result = await Country.getAllCountries();
        setCountries(result);
      } catch (error) {
        setCountries([]);
      }
    };

    getCountries();
  }, []);

  useEffect(() => {
    const getStates = async () => {
      try {
        const result = await State.getStatesOfCountry("IN");
        setStates(result);
        setPermissionState(result);
      } catch (error) {
        setStates([]);
        setPermissionState(result);
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

  const handleFilterData = async () => {
    const filterdata = {};
    for (const key in filter) {
      if (filter[key].length > 0) {
        filterdata[key] = filter[key];
      }
    }
    if (selectedCountry?.value?.length > 0) {
      filterdata.country = selectedCountry?.value;
    }
    if (selectedState?.value?.length > 0) {
      filterdata.state = selectedState?.value;
    }
    if (selectedCity?.value?.length > 0) {
      filterdata.city = selectedCity?.value;
    }
    if (dataMerge?.length > 0) {
      filterdata.permission = {
        dataMerge: {
          uniqueworld: dataMerge?.includes("uniqueworld"),
          allAgency: dataMerge?.includes("allAgency"),
        },
      };
    }
    if (
      permissionSelectedState != undefined ||
      permissionSelectedCity != undefined
    ) {
      const result = await organizeData(
        permissionSelectedState,
        permissionSelectedCity
      );
      filterdata.permission = {
        areas: result,
      };
    }
    handleFilter(filterdata);
       handleFilterToggleMode(false);
  };

  const handleClear = async () => {
    setFilter(initialState);
    setSelectedState("");
    setSelectedCity("");
    setSelectedCountry("");
    setPermissionSelectedCity(undefined);
    setPermissionSelectedState(undefined);
    await dispatch({
      type: agencyActions.GET_AGENCY,
      payload: {
        filterData: [],
        page: 0,
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
  const dataMergeOptions = [
    { value: ["uniqueworld"], id: "uniqueworld", label: "Uniqueworld" },
    { value: ["allAgency"], id: "allAgency", label: "All Agency" },
    { value: ["uniqueworld", "allAgency"], id: "both", label: "Both" },
  ];

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
                  width < 576 ? { marginLeft: "12px" } : { marginLeft: "140px" }
                }
              >
                Search
              </Button>
              <Button
                className="add-new-user "
                color="link"
                onClick={handleClear}
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
              <Label id="plan">Agency Code</Label>
              <Input
                id="agencyCode"
                name="agencyCode"
                className="w-100"
                type="text"
                maxLength={200}
                placeholder={"Enter Agency Code"}
                value={filter?.agencyCode}
                onChange={(e) => {
                  handleFilterChange(e.target.id, e.target.value);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="name">Name</Label>
              <Input
                id="name"
                name="name"
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
              <Label id="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                className="w-100"
                type="text"
                maxLength={10}
                value={filter?.mobileNumber}
                placeholder={"Enter Mobile Number"}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                className="w-100"
                type="text"
                maxLength={10}
                value={filter?.phoneNumber}
                placeholder={"Enter Phone Number"}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="address">Address</Label>
              <Input
                id="address"
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
            <Col md="12" className="mt-1">
              <Label for="role-select">Country</Label>
              <Select
                id="country"
                value={selectedCountry}
                placeholder={"Select Country"}
                options={countries}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setSelectedCountry(e);
                }}
              />
            </Col>
            <Col md="12">
              <Label for="role-select">state</Label>
              <Select
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
            <Col md="12" className="mt-1">
              <Label id="whatsapp">Whatsapp Number</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                className="w-100"
                type="text"
                maxLength={10}
                value={filter?.whatsapp}
                placeholder={"Enter Whatsapp Number"}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            </Col>
            <div style={{ paddingTop: "2rem" }}>
              <h4>Permission</h4>
            </div>
            <Col md="12" className="mt-1">
              <Label id="whatsapp">State</Label>
              <Select
                isMulti
                id="statePermission"
                placeholder={"Select States"}
                options={permissionState}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setPermissionSelectedState(e);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="whatsapp">City Base Permission</Label>
              <Select
                isMulti
                id="cityBasePermission"
                placeholder={"Select Cities"}
                options={permissionCity}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setPermissionSelectedCity(e);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="dataMerge">Data Merge</Label>
              <Select
                id="dataMerge"
                placeholder={"Data Merge Option"}
                options={dataMergeOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setDataMerge(e.value);
                  console.info("--------------------");
                  console.info("e => ", e);
                  console.info("--------------------");
                }}
              />
            </Col>
          </Row>
        </Fragment>
      </Sidebar>
    </>
  );
};

export default AgencyFilter;
