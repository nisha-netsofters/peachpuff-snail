import React, { useEffect, useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import JobCat from "../Forms/JobCate/JobCat";
import Attachment_File from "../Forms/User/Attachment_File";
import User from "../Forms/User/User";
import { Country, State, City } from "country-state-city";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const UserDialog = ({
  UserActionHandler = () => {},
  user,
  roles,
  setUser,
  update,
  setCreate,
  setUpdate,
  setRolevalidation,
  setNameValidation,
  setEmailValidation,
  setPasswordValidation,
  setMobileValidation,
  setAddressValidation,
  show,
  setShow,
  loading,
}) => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();

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
              ? user?.stateId
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
      setUser({ ...user, state: e.value, stateId: e.isoCode });
    } else if (e?.key == "city") {
      setUser({ ...user, city: e.value, cityId: e.value });
    } else {
      if (e?.target?.id === undefined) {
        setUser({ ...user, [e.id]: e.value });
      } else {
        setUser({
          ...user,
          [e.target.id]: e.target.value.replace(/[^a-z ]/gi, ""),
        });
      }
    }
  };

  const fileOnChangeHandler = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.files[0],
    });
  };
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
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
            setCreate(false);
            setUpdate(false);
          }}
        ></ModalHeader>
        {loading == true ? (
          <Loader loading={loading} theamcolour={themecolor} />
        ) : null}
        <ModalBody className="px-sm-5 pt-50 pb-5">
          <User
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={cities}
            states={states}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            handleChange={handleChange}
            user={user}
            roles={roles}
            setUser={setUser}
            setNameValidation={setNameValidation}
            setEmailValidation={setEmailValidation}
            setPasswordValidation={setPasswordValidation}
            setRolevalidation={setRolevalidation}
            setMobileValidation={setMobileValidation}
            setAddressValidation={setAddressValidation}
            UserActionHandler={UserActionHandler}
            update={update}
          />
          <Attachment_File fileOnChangeHandler={fileOnChangeHandler} />

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
              onClick={() => UserActionHandler()}
              style={{ backgroundColor: themecolor, color: "white" }}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default UserDialog;
