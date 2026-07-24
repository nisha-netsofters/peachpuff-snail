// ** React Imports
import { useContext, useEffect, useState } from "react";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";

// ** Demo Components
// import CompanyTable from "./CompanyTable";
// import Earnings from "./Earnings";
// import CardMedal from "./CardMedal";
import CardMeetup from "./CardMeetup";
// import StatsCard from "./StatsCard";
import GoalOverview from "./GoalOverview";
import AgencyCard from "./AgencyCard";
import CandidateCard from "./CandidateCard";
import ClientCard from "./ClientCard";
import CompanyTable from "./CompanyTable";
// import RevenueReport from "./RevenueReport";
// import OrdersBarChart from "./OrdersBarChart";
// import CardTransactions from "./CardTransactions";
// import ProfitLineChart from "./ProfitLineChart";
// import CardBrowserStates from "./CardBrowserState";

// ** Styles
import "@styles/react/libs/charts/apex-charts.scss";
import "@styles/base/pages/dashboard-ecommerce.scss";
import { useDispatch, useSelector } from "react-redux";
import agencyActions from "../../../redux/agency/actions";

const DashBoard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors);

  // ** vars
  //   const trackBgColor = "#e9ecef";
  const { agency } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [dated, setData] = useState(null);
  useEffect(() => {
    dispatch({
      type: agencyActions.GET_AGENCY_DASHBOARD,
    });
  }, []);
  useEffect(() => {
    setData(agency?.agencyDashboard);
  }, [agency?.agencyDashboard]);
  return (
    <div id="dashboard-ecommerce">
      <Row className="match-height">
        <Col xl="3" md="6" xs="12">
          <CardMeetup />
        </Col>
        <Col xl="3" md="6" xs="12">
          <AgencyCard dated={dated} />
        </Col>
        <Col xl="3" md="6" xs="12">
          <CandidateCard dated={dated} />
        </Col>
        <Col xl="3" md="6" xs="12">
          <ClientCard dated={dated} />
        </Col>
        {/* <Col xl="8" md="6" xs="12">
          <StatsCard cols={{ xl: "3", sm: "6" }} />
        </Col> */}
      </Row>
      <Row className="match-height">
        <Col lg="3" md="6" xs="12">
          <GoalOverview success={colors.success.main} />
        </Col>
        <Col lg="9" md="6" xs="12">
          <CompanyTable />
        </Col>
      </Row>
    </div>
  );
};

export default DashBoard;
