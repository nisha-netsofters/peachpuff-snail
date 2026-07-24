// ** Third Party Components
// import classnames from 'classnames'
import {
  TrendingUp,
  User,
  Box,
  DollarSign,
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
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Row,
  Col,
  Input,
} from "reactstrap";

const Statistics = ({ setYear, setMonth, candidate, year, month }) => {
  const lastYears = ["All"];
  const max = new Date().getFullYear();
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
  const data = [
    {
      title: candidate?.candidate,
      subtitle: "Candidate",
      color: "light-primary",
      icon: <User size={24} />,
    },
    {
      title: candidate?.OnBoarding,
      subtitle: "On Boarding",
      color: "light-info",
      icon: <BookOpen size={24} />,
    },
    {
      title: candidate?.scheduled,
      subtitle: "Interview Scheduled",
      color: "light-warning",
      icon: <UserCheck size={24} />,
    },
    {
      title: candidate?.hired,
      subtitle: "Hired",
      color: "light-success",
      icon: <CheckCircle size={24} />,
    },
    {
      title: candidate?.rejected,
      subtitle: "Rejected",
      color: "light-danger",
      icon: <XCircle size={24} />,
    },
    {
      title: candidate?.completed,
      subtitle: "Completed",
      color: "light-success",
      icon: <CheckSquare size={24} />,
    },
  ];

  const renderData = () => {
    return data.map((item, index) => {
      return (
        <Col
          key={index}
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
          }}
          className="mb-5"
        >
          <div className="d-flex align-items-center">
            <Avatar color={item.color} icon={item.icon} className="me-2" />
            <div className="my-auto">
              <h4 className="fw-bolder mb-0">{item.title}</h4>
              <CardText className="font-small-3 mb-0">{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      );
    });
  };

  return (
    <Card className="card-statistics" style={{ height: "500px" }}>
      <CardHeader>
        <CardTitle tag="h4">Statistics</CardTitle>
        {/* <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText> */}
        <div className="d-flex align-items-center mt-md-0 mt-1">
          <div className="d-flex align-items-center w-100">
            <label htmlFor="rows-per-page">Select Year</label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={year ? year : "Year Filter"}
              style={{ width: "6rem", cursor: "pointer" }}
              onChange={(e) => {
                setYear(e.target.value);
              }}
            >
              {lastYears?.map((item) => {
                return <option value={item == "All" ? 0 : item}>{item}</option>;
              })}
            </Input>
            <label htmlFor="rows-per-page" style={{ marginLeft: "10px" }}>
              Select Month
            </label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={month ? month : "Month Filter"}
              style={{ width: "8rem", cursor: "pointer" }}
              onChange={(e) => {
                setMonth(e.target.value);
              }}
            >
              {months?.map((item, i) => {
                return <option value={i}>{item}</option>;
              })}
            </Input>
          </div>
        </div>
      </CardHeader>
      <CardBody className="statistics-body">
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  );
};

export default Statistics;
