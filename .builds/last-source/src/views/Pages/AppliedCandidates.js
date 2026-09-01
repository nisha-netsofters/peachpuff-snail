import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ArrowLeft } from "react-feather";
import { Button } from "reactstrap";
import CandidateListPage from "../../components/CandidateList/CandidateListPage";
import jobApplyListActions from "../../redux/jobapplylist/actions";

const AppliedCandidates = () => {
  const { jobId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const slug = localStorage.getItem("slug");
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const jobApplyList = useSelector(
    (state) => state.jobApplyList.jobApplyList
  );
  const jobApplyListTotal = useSelector(
    (state) => state.jobApplyList.jobApplyListTotal
  );
  const jobApplyListLoader = useSelector(
    (state) => state.jobApplyList.jobApplyListLoader
  );
  const jobApplyListError = useSelector(
    (state) => state.jobApplyList.jobApplyListError
  );

  useEffect(() => {
    if (jobId) {
      dispatch({
        type: jobApplyListActions.SET_JOB_APPLY_LIST_LOADER,
        payload: true,
      });
      dispatch({
        type: jobApplyListActions.GET_JOB_APPLY_LIST,
        payload: { jobId },
      });
    }

    return () => {
      dispatch({
        type: jobApplyListActions.RESET_JOB_APPLY_LIST_STATE,
      });
    };
  }, [jobId, dispatch]);

  return (
    <>
      <Button
        style={{
          color: themecolor,
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
        className="add-new-user mb-2"
        color="default"
        onClick={() => history.push(`/${slug}/jobopening`)}
      >
        <ArrowLeft size={17} />
        Back
      </Button>

      <CandidateListPage
        isAppliedCandidates={true}
        appliedCandidatesList={jobApplyList}
        appliedCandidatesTotal={jobApplyListTotal}
        jobId={jobId}
        isAppliedCandidatesLoading={jobApplyListLoader}
        appliedCandidatesError={jobApplyListError}
      />
    </>
  );
};

export default AppliedCandidates;
