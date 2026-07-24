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
import Select from "react-select";
import { selectThemeColors } from "../../../../utility/Utils";

import Loader from "../../../Dialog/Loader";
import moment from "moment/moment";
// import agencyActions from "../../../../redux/agency/actions";
// import { useDispatch } from "react-redux";
import { updateAgencyValidity } from "../../../../apis/agency";
// import useSelection from "antd/es/table/hooks/useSelection";
// import { awsUploadAssetsWithResp } from "../../../../helper/awsUploadAssets";

const UpdatePlan = ({
  agency,
  setAgency,
  //   update,
  setCreate,
  setUpdate,
  show,
  setShow,
  loading,
  getAgency = () => {},
}) => {
  const [DrowpdownTime, setDropdownTime] = useState([]);
  const [selectTime, setSelectTime] = useState();
  console.info("----------------------------");
  console.info("agency =>", agency);
  console.info("----------------------------");

  // const agencySelect = useSelection((state) => state);
  async function handleValidity() {
    const endDay = moment()
      .add(Number(selectTime?.value), "days")
      .startOf("day")
      .set({ hour: 0, minute: 5 })
      .format("YYYY-MM-DD HH:mm:ss");
    const enddate = moment(endDay).format();
    setShow(false);
    const resp = await updateAgencyValidity({
      months: selectTime?.label,
      date: enddate,
      id: agency?.id,
    });
    if (resp?.msg == "success") {
      await getAgency(0);
    }
  }
  useEffect(() => {
    setDropdownTime([
      {
        label: "7 day",
        name: "7 day",
        value: "7",
      },
      {
        label: "15 day",
        name: "15 day",
        value: "15",
      },
      {
        label: "1 month",
        name: "1 month",
        value: "30",
      },
      {
        label: "3 month",
        name: "3 month",
        value: "90",
      },
      {
        label: "6 month",
        name: "6 month",
        value: "180",
      },
      {
        label: "12 month",
        name: "12 month",
        value: "360",
      },
    ]);
  }, []);
  let presentDay = new Date();
  let inputDate = new Date(agency?.exprireDate);
  let timeDiff = inputDate.getTime() - presentDay.getTime();
  let daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const remainingDate = daysRemaining;
  useEffect(() => {
    if (selectTime?.value != undefined) {
      const endDay = moment().add(Number(selectTime?.value), "days").calendar();
      console.log("endDay", endDay);
    }
  }, [selectTime]);

  //   const handleChange = (e, text = "") => {
  //     if (text == "state") {
  //       setAgency({ ...agency, state: e.value, stateId: e.isoCode });
  //     } else if (text == "country") {
  //       setAgency({ ...agency, country: e.value, countryId: e.isoCode });
  //     } else if (text == "city") {
  //       setAgency({ ...agency, city: e.value, cityId: e.value });
  //     } else {
  //       if (e?.target?.id == undefined) {
  //         setAgency({ ...agency, [e.id]: e.value });
  //       } else {
  //         if (
  //           e.target.id == "mobileNumber" ||
  //           e.target.id == "phoneNumber" ||
  //           e.target.id == "whatsapp"
  //         ) {
  //           setAgency({
  //             ...agency,
  //             [e.target.id]: e.target.value.replace(/\D/g, ""),
  //           });
  //         } else {
  //           setAgency({
  //             ...agency,
  //             [e.target.id]: e.target.value,
  //           });
  //         }
  //       }
  //     }
  //   };

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
            setAgency([]);
            setShow(!show);
            setCreate(false);
            setUpdate(false);
          }}
        ></ModalHeader>
        {loading == true ? <Loader loading={loading} /> : null}
        <ModalBody className="px-sm-5 pt-50 pb-5">
          {agency?.expirable == false ? (
            <h4>You can change the plan of this agency</h4>
          ) : (
            <>
              {" "}
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
                  </div>
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
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default UpdatePlan;
