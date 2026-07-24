import React, { useEffect, useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
// import Attachment_File from '../Forms/Clients/Attachment_File'
import ClientDetails from "../Forms/Clients/ClientDetails";
import { Country, State, City } from "country-state-city";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const Client = ({
  industriesData,
  ClientHandler = () => {},
  client,
  setClient,
  setCreate,
  setUpdate,
  jobCategoryData,
  update,
  setEmail,
  show,
  setShow,
  loading,
}) => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
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
          update == true
            ? selectedState == undefined
              ? client?.stateId
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

  const handleChange = (e) => {
    if (e?.key == "state") {
      setClient({ ...client, state: e.value, stateId: e.isoCode });
    } else if (e?.key == "city") {
      setClient({ ...client, city: e.value, cityId: e.value });
    } else {
      if (e?.target?.id === undefined) {
        setClient({ ...client, [e.id]: e.value });
      } else {
        setClient({
          ...client,
          [e.target.id]: e.target.value.replace(/[^a-z ]/gi, ""),
        });
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-xl"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => {
            setShow(!show);
            setUpdate(false);
            setCreate(false);
          }}
        ></ModalHeader>
        {loading == true ? (
          <Loader loading={loading} theamcolour={themecolor} />
        ) : null}
        <ModalBody className="px-sm-5 pt-50 pb-5">
          <ClientDetails
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={cities}
            states={states}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            industriesData={industriesData}
            update={update}
            setClient={setClient}
            client={client}
            handleChange={handleChange}
            jobCategoryData={jobCategoryData}
            setEmail={setEmail}
          />
          {/* <Attachment_File fileOnChangeHandler={fileOnChangeHandler} /> */}
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
              color="default"
              style={{ backgroundColor: themecolor, color: "white" }}
              onClick={() => ClientHandler()}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Client;
