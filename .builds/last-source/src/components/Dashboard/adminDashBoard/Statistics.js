// ** Third Party Components
import {
  User,
  BookOpen,
  UserCheck,
  CheckCircle,
  XCircle,
  CheckSquare,
} from "react-feather";
// ** Custom Components
import Avatar from "@components/avatar";
// ** Reactstrap Imports
import {
  Card,
  CardTitle,
  CardText,
  Row,
  Col,
  Input,
} from "reactstrap";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Statistics = ({ setYear, setMonth, candidate, year, month, loading }) => {
  const history = useHistory();
  const slug = localStorage.getItem("slug") || "uniqueworld";
  const lastYears = ["All"];
  const max = new Date().getFullYear();
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const min = 2023;
  for (let i = max; i >= min; i--) {
    lastYears.push(i);
  }
  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const buildRedirectUrl = (item) => {
    const params = new URLSearchParams();
    if (year && Number(year) !== 0) params.set("year", String(year));
    if (month && Number(month) !== 0) params.set("month", String(month));
    if (item.quickFilter) params.set("quickFilter", item.quickFilter);
    if (item.interviewStatus)
      params.set("interviewStatus", item.interviewStatus);
    const qs = params.toString();
    return `/${slug}${item.path}${qs ? `?${qs}` : ""}`;
  };

  const data = [
    {
      title: candidate?.candidate,
      subtitle: "Candidate",
      color: "light-primary",
      icon: <User size={24} />,
      path: "/candidate",
    },
    {
      title: candidate?.OnBoarding,
      subtitle: "On Boarding",
      color: "light-info",
      icon: <BookOpen size={24} />,
      path: "/onboarding",
    },
    {
      title: candidate?.scheduled,
      subtitle: "Interview Scheduled",
      color: "light-warning",
      icon: <UserCheck size={24} />,
      path: "/candidate",
      quickFilter: "interviewScheduled",
    },
    {
      title: candidate?.hired,
      subtitle: "Hired",
      color: "light-success",
      icon: <CheckCircle size={24} />,
      path: "/candidate",
      quickFilter: "selected",
    },
    {
      title: candidate?.rejected,
      subtitle: "Rejected",
      color: "light-danger",
      icon: <XCircle size={24} />,
      path: "/candidate",
      quickFilter: "rejected",
    },
    {
      title: candidate?.completed,
      subtitle: "Completed",
      color: "light-success",
      icon: <CheckSquare size={24} />,
      path: "/candidate",
      interviewStatus: "completed",
    },
  ];

  const renderData = () => {
    return data.map((item) => {
      return (
        <Col
          key={item.subtitle}
          lg={6}
          xs={6}
          xl={6}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            cursor: "pointer",
          }}
          className="mb-5"
          role="button"
          tabIndex={0}
          title={`View ${item.subtitle}`}
          onClick={() => history.push(buildRedirectUrl(item))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              history.push(buildRedirectUrl(item));
            }
          }}
        >
          <Avatar color={item.color} icon={item.icon} className="me-2" />
          <div className="my-auto">
            <h4
              className="fw-bolder mb-0"
              style={{ color: themecolor || undefined }}
            >
              {item.title}
            </h4>
            <CardText className="font-small-3 mb-0">{item.subtitle}</CardText>
          </div>
        </Col>
      );
    });
  };

  const [focus, setIsfocus] = useState(null);
  return (
    <Card
      className="card-statistics"
      style={{ height: "500px", padding: "1.5rem 1.5rem" }}
    >
      <div style={{ margin: "10px 0px" }}>
        <CardTitle tag="h4">Statistics</CardTitle>
      </div>
      <Row className="d-flex align-items-center mb-3">
        <Col lg={6} xs={6} xl={6}>
          <label
            htmlFor="year-input"
            style={{ marginLeft: "10px", marginBottom: "10px" }}
          >
            Year
          </label>
          <Input
            type="select"
            id="year-input"
            disabled={loading}
            value={year ? year : "Year Filter"}
            onFocus={() => setIsfocus("year")}
            onBlur={() => setIsfocus(null)}
            style={{
              cursor: "pointer",
              borderColor: focus === "year" && themecolor,
            }}
            onChange={(e) => {
              setYear(e.target.value);
            }}
          >
            {lastYears?.map((item) => {
              return (
                <option key={String(item)} value={item == "All" ? 0 : item}>
                  {item}
                </option>
              );
            })}
          </Input>
        </Col>
        <Col lg={6} xs={6} xl={6}>
          <label
            htmlFor="month-input"
            style={{ marginLeft: "10px", marginBottom: "10px" }}
          >
            Month
          </label>
          <Input
            className="mx-50"
            type="select"
            disabled={loading}
            id="month-input"
            value={month ? month : "Month Filter"}
            onFocus={() => setIsfocus("month")}
            onBlur={() => setIsfocus(null)}
            style={{
              cursor: "pointer",
              borderColor: focus === "month" && themecolor,
            }}
            onChange={(e) => {
              setMonth(e.target.value);
            }}
          >
            {months?.map((item, i) => {
              return (
                <option key={item} value={i}>
                  {item}
                </option>
              );
            })}
          </Input>
        </Col>
      </Row>
      {loading == true ? (
        <ComponentSpinner isClientCandidate={true} theamcolour={themecolor} />
      ) : (
        <Row className="d-flex align-items-center">{renderData()}</Row>
      )}
    </Card>
  );
};

export default Statistics;
