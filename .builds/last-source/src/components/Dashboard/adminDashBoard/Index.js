import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import RecruiterWorkChart from "./RecruiterWorkChart";
import Statistics from "./Statistics";
import { useRTL } from "@hooks/useRTL";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import {
  statisticsAPI,
  recruiterWorkChartAPI,
  todayInterviewAPI,
  candidateAPI,
  interviewChartAPI,
} from "../../../apis/dashBoard";
import "@styles/react/libs/charts/apex-charts.scss";
import CandidateCard from "./candidateCard";
import TodayInterview from "./TodayInterview";
import InterviewsChart from "./InterviewsChart";
import { useSelector } from "react-redux";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";
import CardMeetup from "./CardMeetup";
const AdminDashBoard = () => {
  const themecolor = localStorage.getItem("themecolor");
  const name = useSelector((state) => state?.auth?.user?.name);
  const { width } = useBreakpoint();
  const [isRtl] = useRTL();
  const tempCandidate = useSelector((state) => state.candidate);
  const { agencyDetail } = useSelector((state) => state?.agency);

  // statistics
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [statistics, setStatistics] = useState();

  // recruiter chart
  const [recruiterYear, setrecruiterYear] = useState(0);

  const [recruiterMonth, setrecruiterMonth] = useState(0);
  const [recruiter, setRecruiter] = useState();

  // interview chart
  const [interviewYear, setInterviewYear] = useState(0);

  const [interviewChart, setInterviewChart] = useState([]);

  // todays interview
  const [todaysInterview, setTodaysInterview] = useState();

  // candidate card
  const [candidate, setCandidate] = useState();
  const [Statisticsloading, setStatisticsLoading] = useState(false);
  const [Recruiterloading, setRecruiterLoading] = useState(false);
  // statistics
  useEffect(() => {
    async function fetchData() {
      setStatisticsLoading(true);
      const payload = {
        year,
        month,
      };
      const data = await statisticsAPI(payload);
      if (data) {
        setStatisticsLoading(false);
      }
      setStatistics(data);
    }
    fetchData();
  }, [year, month]);

  // recruiter chart
  useEffect(() => {
    async function fetchData() {
      setRecruiterLoading(true);
      const payload = {
        recruiterYear,
        recruiterMonth,
      };
      const data = await recruiterWorkChartAPI(payload);
      if (data) {
        setRecruiterLoading(false);
      }
      setRecruiter(data);
    }
    fetchData();
  }, [recruiterYear, recruiterMonth]);

  // interview chart
  useEffect(() => {
    async function fetchData() {
      const payload = {
        interviewYear,
      };
      const data = await interviewChartAPI(payload);
      setInterviewChart(data);
    }
    fetchData();
  }, [interviewYear]);

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

  // recruiter chart category
  const RecruitersName = [];
  recruiter?.map((item) => {
    return RecruitersName.push(item.name);
  });

  // recruiter chart
  const RecruitersSeries = [
    {
      name: "Scheduled",
      data: recruiter?.map((ele) => {
        const val = ele?.scheduled;
        return Number(val);
      }),
    },
    {
      name: "Hired",
      data: recruiter?.map((ele) => {
        const val = ele?.hired;
        return Number(val);
      }),
    },
    {
      name: "Rejected",
      data: recruiter?.map((ele) => {
        const val = ele?.rejected;
        return Number(val);
      }),
    },
  ];

  // interview chart details
  const interviewMonth = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const interviewSeries = [
    {
      name: "Scheduled",
      data: interviewChart[0]?.scheduled,
    },
    {
      name: "Hired",
      data: interviewChart[1]?.hired,
    },
    {
      name: "Rejected",
      data: interviewChart[2]?.rejected,
    },
  ];

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
            loading={Statisticsloading}
          />
        </Col>
        <Col
          lg="8"
          md="8"
          sm="12"
          style={width < 768 ? { padding: "0px" } : {}}
        >
          <RecruiterWorkChart
            direction={isRtl ? "rtl" : "ltr"}
            title={"Recruiter's Work"}
            category={RecruitersName}
            RecruitersSeries={RecruitersSeries}
            year={recruiterYear}
            month={recruiterMonth}
            setYear={setrecruiterYear}
            setMonth={setrecruiterMonth}
            loading={Recruiterloading}
          />
        </Col>
      </Row>
      <Row>
        <Col xl="4" sm="12" style={width < 768 ? { padding: "0px" } : {}}>
          <InterviewsChart
            direction={isRtl ? "rtl" : "ltr"}
            interviewYear={interviewYear}
            setInterviewYear={setInterviewYear}
            title={"Interviews"}
            category={interviewMonth}
            RecruitersSeries={interviewSeries}
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

export default AdminDashBoard;
