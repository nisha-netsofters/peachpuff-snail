import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import Statistics from "./Statistics";
import {
  statisticsAPI,
  todayInterviewAPI,
  candidateAPI,
} from "../../../apis/dashBoard";
import "@styles/react/libs/charts/apex-charts.scss";
import CandidateCard from "./CandidateCard";
import TodayInterview from "./TodayInterview";
import { useSelector } from "react-redux";
import CardMeetup from "../adminDashBoard/CardMeetup";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";
const RecruiterDashBoard = () => {
  const { width } = useBreakpoint();
  const tempCandidate = useSelector((state) => state.candidate);
  const { agencyDetail } = useSelector((state) => state?.agency);
  // statistics
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [statistics, setStatistics] = useState();
  // todays interview
  const [todaysInterview, setTodaysInterview] = useState();

  // candidate card
  const [candidate, setCandidate] = useState();

  // statistics
  useEffect(() => {
    async function fetchData() {
      const payload = {
        year,
        month,
      };
      const data = await statisticsAPI(payload);
      setStatistics(data);
    }
    fetchData();
  }, [year, month]);

  // todays interview
  useEffect(() => {
    async function fetchData() {
      const data = await todayInterviewAPI();
      setTodaysInterview(data);
    }
    fetchData();
  }, [tempCandidate]);

  // candidate card
  useEffect(() => {
    async function fetchData() {
      const payload = {
        filterData: {
          dataMergePermission: agencyDetail?.permission?.dataMerge,
        },
      };
      const data = await candidateAPI(payload);
      setCandidate(data);
    }
    fetchData();
  }, [tempCandidate]);
  const themecolor = localStorage.getItem("themecolor");
  const name = useSelector((state) => state?.auth?.user?.name);
  return (
    <>
      <Row className="match-height">
        <Col xl="3" md="6" xs="12">
          <CardMeetup name={name} themecolor={themecolor} />
        </Col>
      </Row>
      <Row>
        <Col
          lg="4"
          md="4"
          sm="12"
          style={width < 768 ? { padding: "0px" } : {}}
        >
          <Statistics
            cols={{ md: "3", sm: "6", xs: "12" }}
            setYear={setYear}
            setMonth={setMonth}
            candidate={statistics}
            year={year}
            month={month}
          />
        </Col>
        <Col lg="4" sm="12" style={width < 768 ? { padding: "0px" } : {}}>
          <TodayInterview
            title={"Today's Interviews"}
            todaysInterview={todaysInterview}
          />
        </Col>
        <Col lg="4" sm="12" style={width < 768 ? { padding: "0px" } : {}}>
          <CandidateCard title={"Candidates"} candidate={candidate} />
        </Col>
      </Row>
    </>
  );
};

export default RecruiterDashBoard;
