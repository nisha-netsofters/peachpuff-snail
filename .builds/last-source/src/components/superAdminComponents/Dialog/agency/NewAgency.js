import React, { useEffect, useState } from "react";
import {
  Label,
  Row,
  Col,
  Button,
  Form,
  Modal,
  ModalBody,
  Input,
  ModalHeader,
} from "reactstrap";

import { Country, State, City } from "country-state-city";
import AgencyForm from "../../Forms/agency/AgencyForm";
import AgencyPermission from "../../Forms/agency/AgencyPermission";
import Loader from "../../../Dialog/Loader";

// import agencyActions from "../../../../redux/agency/actions";
// import { useDispatch } from "react-redux";
// import useSelection from "antd/es/table/hooks/useSelection";
// import { awsUploadAssetsWithResp } from "../../../../helper/awsUploadAssets";

const NewAgency = ({
  agency,
  setAgency,
  update,
  setCreate,
  setUpdate,
  show,
  setShow,
  agencyActionHandler,
  loading,
  // getAgency = () => {},
}) => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [selectedCountry, setSelectedCountry] = useState();
  const [dataMerge, setDataMerge] = useState(["uniqueworld"]);
  const [permissionState, setPermissionState] = useState([]);
  const [permissionCity, setPermissionCity] = useState([]);
  const [permissionSelectedState, setPermissionSelectedState] = useState();
  const [permissionSelectedCity, setPermissionSelectedCity] = useState();
  const [DrowpdownTime, setDropdownTime] = useState([]);
  const [selectTime, setSelectTime] = useState();
  console.info("--------------------");
  console.info("permissionSelectedCity => ", permissionSelectedCity);
  console.info("--------------------");
  console.info("permissionSelectedState => ", permissionSelectedState);
  console.info("permissionCity => ", permissionCity);
  console.info("permissionState => ", permissionState);

  // const agencySelect = useSelection((state) => state);
  // async function handleValidity() {
  //   const endDay = moment()
  //     .add(Number(selectTime?.value), "days")
  //     .startOf("day")
  //     .set({ hour: 0, minute: 5 })
  //     .format("YYYY-MM-DD HH:mm:ss");
  //   const enddate = moment(endDay).format();
  //   setShow(false);
  //   const resp = await updateAgencyValidity({
  //     months: selectTime?.label,
  //     date: enddate,
  //     id: agency?.id,
  //   });
  //   if (resp?.msg == "success") {
  //     await getAgency(0);
  //   }
  // }
  // useEffect(() => {
  //   setDropdownTime([
  //     {
  //       label: "7 day",
  //       name: "7 day",
  //       value: "7",
  //     },
  //     {
  //       label: "15 day",
  //       name: "15 day",
  //       value: "15",
  //     },
  //     {
  //       label: "1 month",
  //       name: "1 month",
  //       value: "30",
  //     },
  //     {
  //       label: "3 month",
  //       name: "3 month",
  //       value: "90",
  //     },
  //     {
  //       label: "6 month",
  //       name: "6 month",
  //       value: "180",
  //     },
  //     {
  //       label: "12 month",
  //       name: "12 month",
  //       value: "360",
  //     },
  //   ]);
  // }, []);
  // let presentDay = new Date();
  // let inputDate = new Date(agency?.exprireDate);
  // let timeDiff = inputDate.getTime() - presentDay.getTime();
  // let daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  // const remainingDate = daysRemaining;
  // useEffect(() => {
  //   if (selectTime?.value != undefined) {
  //     const endDay = moment().add(Number(selectTime?.value), "days").calendar();
  //     console.log("endDay", endDay);
  //   }
  // }, [selectTime]);

  useEffect(() => {
    setAgency({
      ...agency,
      permission: {
        ...agency?.permission,
        dataMerge: {
          allAgency: dataMerge?.includes("allAgency"),
          uniqueworld: dataMerge?.includes("uniqueworld"),
        },
      },
    });
  }, [dataMerge]);

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
        state: state?.label,
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
    (async () => {
      if (
        permissionSelectedState != undefined &&
        permissionSelectedState?.length &&
        permissionSelectedState != null
      ) {
        const result = await organizeData(
          permissionSelectedState,
          permissionSelectedCity
        );
        console.info("--------------------");
        console.info("result => ", result);
        console.info("--------------------");
        setAgency({
          ...agency,
          permission: {
            ...agency?.permission,
            areas: result,
          },
        });
      } else if (
        permissionSelectedState?.length == 0 ||
        permissionSelectedCity?.length == 0
      ) {
        setAgency({
          ...agency,
          permission: {
            ...agency?.permission,
            areas: [],
          },
        });
      }
    })();
  }, [permissionSelectedState, permissionSelectedCity]);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const result = await Country.getAllCountries();
        setCountries(result);
        setStates([]);
        setCities([]);
      } catch (error) {
        setCountries([]);
        setStates([]);
        setCities([]);
      }
    };

    getCountries();

    setDataMerge(
      update
        ? agency?.permission?.dataMerge?.uniqueworld == true &&
          agency?.permission?.dataMerge?.allAgency == false
          ? ["uniqueworld"]
          : agency?.permission?.dataMerge?.uniqueworld == false &&
            agency?.permission?.dataMerge?.allAgency == true
          ? ["allAgency"]
          : agency?.permission?.dataMerge?.uniqueworld == true &&
            agency?.permission?.dataMerge?.allAgency == true
          ? ["uniqueworld", "allAgency"]
          : agency?.permission?.dataMerge?.uniqueworld == false &&
            agency?.permission?.dataMerge?.allAgency == false
          ? [""]
          : [""]
        : ["uniqueworld"]
    );
  }, []);

  useEffect(() => {
    const getStates = async () => {
      try {
        const result = await State.getStatesOfCountry(
          selectedCountry?.isoCode ? selectedCountry?.isoCode : "IN"
        );
        setStates(result);
        setPermissionState(result);
        setCities([]);
      } catch (error) {
        setStates([]);
        setPermissionState([]);
        setCities([]);
      }
    };

    getStates();
  }, [selectedCountry]);

  useEffect(() => {
    const getCities = async () => {
      try {
        const result = await City.getCitiesOfState(
          selectedCountry?.isoCode ? selectedCountry?.isoCode : "IN",
          update == true
            ? selectedState == undefined
              ? agency?.stateId
              : selectedState?.isoCode
            : selectedState?.isoCode
        );
        setCities(result);
      } catch (error) {
        setCities([]);
      }
    };

    getCities();
  }, [selectedState]);

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
    permissionSelectedState?.map((item) => {
      getCities(item?.isoCode);
    });
  }, [permissionSelectedState]);

  useEffect(() => {
    if (agency?.country == undefined) {
      setAgency({ ...agency, country: "India", countryId: "IN" });
    }
    if (
      agency?.permission?.dataMerge == undefined ||
      agency?.permission?.dataMerge == []
    ) {
      setAgency({
        ...agency,
        permission: {
          ...agency?.permission,
          dataMerge: {
            allAgency: dataMerge?.includes("allAgency"),
            uniqueworld: true,
          },
        },
      });
    }
  }, [agency]);

  const handleChange = (e, text = "") => {
    if (text == "state") {
      setAgency({ ...agency, state: e.value, stateId: e.isoCode });
    } else if (text == "country") {
      setAgency({ ...agency, country: e.value, countryId: e.isoCode });
    } else if (text == "city") {
      setAgency({ ...agency, city: e.value, cityId: e.value });
    } else {
      if (e?.target?.id == undefined) {
        setAgency({ ...agency, [e.id]: e.value });
      } else {
        if (
          e.target.id == "mobileNumber" ||
          e.target.id == "phoneNumber" ||
          e.target.id == "whatsapp"
        ) {
          setAgency({
            ...agency,
            [e.target.id]: e.target.value.replace(/\D/g, ""),
          });
        } else {
          setAgency({
            ...agency,
            [e.target.id]: e.target.value,
          });
        }
      }
    }
  };

  const fileOnChangeHandler = (e) => {
    setAgency({
      ...agency,
      [e.target.id]: e.target.files[0],
    });
  };

  return (
    <>
      <Modal
        isOpen={show}
        toggle={() => {
          setUpdate(false);
          setShow(!show);
        }}
        className="modal-dialog-centered modal-xl"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => {
            setShow(!show);
            setCreate(false);
            setUpdate(false);
          }}
        ></ModalHeader>
        {loading == true ? <Loader loading={loading} /> : null}
        <ModalBody className="px-sm-5 pt-50 pb-5">
          <AgencyForm
            selectTime={selectTime}
            setSelectTime={setSelectTime}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={cities}
            states={states}
            countries={countries}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            handleChange={handleChange}
            agency={agency}
            setAgency={setAgency}
            setDropdownTime={setDropdownTime}
            DrowpdownTime={DrowpdownTime}
            update={update}
            fileOnChangeHandler={fileOnChangeHandler}
          />
          <AgencyPermission
            states={permissionState}
            city={permissionCity}
            setDataMerge={setDataMerge}
            dataMerge={dataMerge}
            agency={agency}
            update={update}
            handleChange={handleChange}
            setPermissionSelectedState={setPermissionSelectedState}
            setPermissionSelectedCity={setPermissionSelectedCity}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Button
              type="button"
              className="add-new-user"
              color="primary"
              onClick={() => agencyActionHandler()}
            >
              Submit
            </Button>
          </div>
          {/* {agency?.email != "uniqueworldjobs@gmail.com" && (
            <>
              <hr />
              <Row className="gy-1">
                <Col lg={6} xs={12} xl={4}>
                  <div>
                    <Label id="state">
                      Agency Validity<span style={{ color: "red" }}>*</span>
                    </Label>
                    <Select
                      id="state"
                      value={selectTime}
                      placeholder={
                        agency?.months
                          ? agency?.months
                          : selectTime
                          ? selectTime
                          : "Select Validity for agency"
                      }
                      options={DrowpdownTime}
                      className="react-select"
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      onChange={(e) => {
                        setSelectTime(e);
                        handleChange(e);
                      }}
                    />
                  </div>
                </Col>
                <Col lg={6} xs={12} xl={4}>
                  <div>
                    <Label id="state">Valid to</Label>
                    <br />
                    <Input
                      id=""
                      name=""
                      className="w-100"
                      type="text"
                      disabled={true}
                      maxLength={200}
                      placeholder={moment(agency?.exprireDate)
                        .format("DD-MM-YYYY")
                        .slice(0, 10)}
                      // value={agency?.exprireDate?.slice(0, 10)}
                      value={moment(agency?.exprireDate)
                        .format("DD-MM-YYYY")
                        .slice(0, 10)}
                    />
                    {/* <h4>{agency?.exprireDate?.slice(0, 10)}</h4> */}
          {/* </div>
                </Col>
                <Col lg={6} xs={12} xl={4}>
                  <div>
                    <Label id="state">Remaining Days</Label>
                    <br />
                    <Input
                      id=""
                      name=""
                      className="w-100"
                      type="text"
                      disabled={true}
                      maxLength={200}
                      placeholder={remainingDate}
                      value={`${remainingDate ? remainingDate : ""} Days`}
                    />
                  </div>
                </Col>
              </Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "30px",
                }}
              >
                <Button
                  type="button"
                  className="add-new-user"
                  color="primary"
                  onClick={() => handleValidity()}
                >
                  Update Agency Validity
                </Button>
              </div>
            </>
          )} */}{" "}
        </ModalBody>
      </Modal>
    </>
  );
};

export default NewAgency;
