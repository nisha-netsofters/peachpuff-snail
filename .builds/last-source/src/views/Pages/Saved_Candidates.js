import React from "react";
import CandidateListPage from "../../components/CandidateList/CandidateListPage";

const Saved_Candidates = () => {
  return (
    <>
      <CandidateListPage isSavedCandidates={true} />
    </>
  );
};

export default Saved_Candidates;
