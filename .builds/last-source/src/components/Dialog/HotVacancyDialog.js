import React from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import JobCat from "../Forms/JobCate/JobCat";
import Attachment_File from "../Forms/User/Attachment_File";
import User from "../Forms/User/User";
import { Country, State, City } from "country-state-city";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import HotVacancyForm from "../Forms/hotVacancy/HotVacancyForm";

const HotVacancyDialog = ({
  user,
  show,
  setShow,
  loading,
}) => {
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
          }}
        ></ModalHeader>
        {loading == true ? (
          <Loader loading={loading} theamcolour={themecolor} />
        ) : null}
        <ModalBody className="px-sm-5 pt-50 pb-5">
          <HotVacancyForm
            user={user}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default HotVacancyDialog;
