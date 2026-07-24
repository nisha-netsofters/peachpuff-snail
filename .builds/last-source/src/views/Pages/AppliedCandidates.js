import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CandidateListPage from "../../components/CandidateList/CandidateListPage";
import jobApplyListActions from "../../redux/jobapplylist/actions";

const AppliedCandidates = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const jobApplyList = useSelector(
    (state) => state.jobApplyList.jobApplyList
  );
  const jobApplyListLoader = useSelector(
    (state) => state.jobApplyList.jobApplyListLoader
  );
  const jobApplyListError = useSelector(
    (state) => state.jobApplyList.jobApplyListError
  );

  // Fetch applied candidates when component mounts or jobId changes
  useEffect(() => {
    if (jobId) {
      try {
        dispatch({
          type: jobApplyListActions.GET_JOB_APPLY_LIST,
          payload: { jobId },
        });
      } catch (error) {
        console.error("Error fetching applied candidates:", error);
      }
    }

    // Cleanup: reset state when component unmounts
    return () => {
      dispatch({
        type: jobApplyListActions.RESET_JOB_APPLY_LIST_STATE,
      });
    };
  }, [jobId, dispatch]);

  // Log error if present
  useEffect(() => {
    if (jobApplyListError) {
      console.error("Error fetching applied candidates:", jobApplyListError);
    }
  }, [jobApplyListError]);

  // Pass applied candidates data to shared CandidateListPage
  return (
    <CandidateListPage
      isAppliedCandidates={true}
      appliedCandidatesList={jobApplyList}
      jobId={jobId}
      isAppliedCandidatesLoading={jobApplyListLoader}
      appliedCandidatesError={jobApplyListError}
    />
  );
};

export default AppliedCandidates;
