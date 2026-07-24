/*eslint-disable */
import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import Sidebar from "@components/sidebar";
import { Row, Col, Input, Label, Button } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useDispatch, useSelector } from "react-redux";
import agencyActions from "../../../redux/agency/actions";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";
import { City, State } from "country-state-city";
import { selectThemeColors } from "@utils";

const Filter = ({
  setFilterData,
  toggleSidebar,
  open,
  handleFilterToggleMode = () => {},
  // clear,
  setFilterToggleMode,
  setclear = () => {},
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // const getRole = useSelector((state) => state.roles);
  // const { plans } = useSelector((state) => state.plans);
  const { width } = useBreakpoint();

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [SelectedStatus, SetselectedStatus] = useState();
  const [invoiceTo, SetinvoiceTo] = useState();
  const [inputagency, setinputagency] = useState();
  const [transactionId, settransactionId] = useState();
  const [planId, setplanId] = useState();
  const handleFilterData = async () => {
    handleFilterToggleMode(true);
    const filterData = {
      status: SelectedStatus?.value,
      city: selectedCity?.name,
      invoiceTo,
      AgencyName: inputagency,
      transactionId,
      plan: planId?.map((item) => item?.value),
    };

    // Remove undefined and empty string values from filterData
    const cleanedFilterData = Object.fromEntries(
      Object.entries(filterData).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    setFilterToggleMode(!open);
    setFilterData(cleanedFilterData);
  };
  const handleClear = async () => {
    setFilterData({});
    setSelectedState("");
    setSelectedCity("");
    SetselectedStatus("");
    SetinvoiceTo("");
    setinputagency("");
    settransactionId("");
    await dispatch({
      type: agencyActions.GET_TRANSACTION,
      payload: {
        filterData: [],
        page: 0,
        perPage: 10,
      },
    });
    handleFilterToggleMode(false);
    setclear(false);
  };

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

  // useEffect(() => {
  //   if (clear == true) {
  //     handleClear();
  //   }
  // }, [clear]);

  const statusOptions = [
    { value: "PENDING", id: "Pending", label: "Pending" },
    { value: "COMPLETED", id: "Completed", label: "Completed" },
    { value: "FAILED", id: "Failed", label: "Failed" },
  ];
  const PlanOptions = [
    {
      value: "94791e55-83f7-43f7-95bb-0f6d13ed254d",
      id: "Pending",
      label: "Professionals",
    },
    {
      value: "1182bf42-be12-4327-892a-b4ef4f7af458",
      id: "interviewStatus",
      label: "Enterprises",
    },
  ];

  const { agency } = useSelector((state) => state);
  console.info("----------------------------");
  console.info("agencyagency =>", agency);
  console.info("----------------------------");

  useEffect(() => {
    if (agency?.allAgency?.length == 0) {
    }
  }, [agency?.allAgency]);

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
              <Label>Select Status</Label>
              <Select
                menuPlacement="auto"
                id="state"
                value={SelectedStatus}
                placeholder={"Select Status"}
                options={statusOptions}
                className="react-select"
                classNamePrefix="select"
                onChange={(e) => {
                  SetselectedStatus(e);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label id="plan">Invoice To</Label>
              <Input
                id="agencyCode"
                name="agencyCode"
                className="w-100"
                type="text"
                maxLength={200}
                placeholder={"Enter Invoice to"}
                value={invoiceTo}
                onChange={(e) => {
                  SetinvoiceTo(e.target.value);
                }}
              />
            </Col>
            {user?.email === "uniqueworldjobs@gmail.com" && (
              <Col md="12" className="mt-1">
                <Label id="name">Agency</Label>
                <Input
                  id="agency"
                  name="agency"
                  className="w-100"
                  type="text"
                  maxLength={200}
                  placeholder={"Enter Agency to"}
                  value={inputagency}
                  onChange={(e) => {
                    setinputagency(e.target.value);
                  }}
                />
              </Col>
            )}
            <Col md="12" className="mt-1">
              <Label id="Email">Transaction Id</Label>
              <Input
                id="email"
                name="email"
                className="w-100"
                type="email"
                maxLength={200}
                value={transactionId}
                placeholder={"Enter Transaction Id"}
                onChange={(e) => settransactionId(e.target.value)}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label>Plan</Label>
              <Select
                menuPlacement="auto"
                isMulti
                id="Planid"
                value={planId}
                placeholder="Select Plan"
                options={PlanOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setplanId(e);
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label>State</Label>
              <Select
                menuPlacement="auto"
                id="state"
                value={selectedState}
                placeholder={"Select State"}
                options={states}
                className="react-select"
                classNamePrefix="select"
                onChange={(e) => {
                  setSelectedState(e);
                  setSelectedCity("");
                }}
              />
            </Col>
            <Col md="12" className="mt-1">
              <Label for="role-select">City</Label>
              <Select
                menuPlacement="auto"
                id="city"
                value={selectedCity}
                placeholder={"Select City"}
                options={cities}
                className="react-select"
                classNamePrefix="select"
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
