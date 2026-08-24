import React from "react";
import Candidate from "../Dialog/Candidate";

const JobMatchProfileDialog = ({
  show,
  setShow,
  candidate,
  setCandidate,
  industriesData,
  setIndustriesData,
  gender,
  setGender,
  setEmail,
}) => {
  if (!show) return null;

  return (
    <Candidate
      loading={false}
      industriesData={industriesData}
      setIndustriesData={setIndustriesData}
      show={show}
      setGender={setGender}
      gender={gender}
      setShow={setShow}
      setCandidate={setCandidate}
      candidate={candidate}
      update
      setUpdate={() => {}}
      create={false}
      setCreate={() => {}}
      setEmail={setEmail}
      CandidateHandler={() => {}}
      isDisabledAllFields
      setIsDisabledAllFields={() => {}}
      hideProfileCompletion
    />
  );
};

export default JobMatchProfileDialog;
