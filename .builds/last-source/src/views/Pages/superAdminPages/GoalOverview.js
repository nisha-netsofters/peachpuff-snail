// ** React Imports
// import { useEffect, useState } from 'react'

// ** Third Party Components
// import axios from 'axios'
import Chart from "react-apexcharts";
import { HelpCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Row,
  Col,
} from "reactstrap";
import agencyActions from "../../../redux/agency/actions";
import { useEffect, useState } from "react";

const GoalOverview = (props) => {
  const dispatch = useDispatch();
  const { agency } = useSelector((state) => state);

  // ** State
  const [data, setData] = useState(null);
  const [persentage, setPersentage] = useState(0);
  let active = Number(0);
  let inactive = Number(0);
  let total = Number(0);
  console.log("agency", agency);
  console.log("persentage", persentage);

  useEffect(() => {
    dispatch({
      type: agencyActions.GET_AGENCY_COUNT,
    });
  }, []);

  useEffect(() => {
    if (agency?.agencyCount) {
      setData(agency?.agencyCount);
      active = agency?.agencyCount?.active;
      inactive = agency?.agencyCount?.inactive;
      total = Number(active) + Number(inactive);
      setPersentage(Math.floor((active / total) * 100));
    }
  }, [agency?.agencyCount]);

  const options = {
    chart: {
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        blur: 3,
        left: 1,
        top: 1,
        opacity: 0.1,
      },
    },
    colors: ["#51e5a8"],
    plotOptions: {
      radialBar: {
        offsetY: 10,
        startAngle: -150,
        endAngle: 150,
        hollow: {
          size: `70%`,
        },
        track: {
          background: "#ebe9f1",
          strokeWidth: "50%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            color: "#5e5873",
            fontFamily: "Montserrat",
            fontSize: "2.86rem",
            fontWeight: "600",
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: [props.success],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    grid: {
      padding: {
        bottom: 30,
      },
    },
  };

  const series = [persentage];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Agency's overview</CardTitle>
          <HelpCircle size={18} className="text-muted cursor-pointer" />
        </CardHeader>
        <CardBody className="p-0">
          <Chart
            options={options}
            series={series}
            type="radialBar"
            height={245}
          />
        </CardBody>
        <Row className="border-top text-center mx-0">
          <Col xs="6" className="border-end py-1">
            <CardText className="text-muted mb-0">Active</CardText>
            <h3 className="fw-bolder mb-0">{data?.active}</h3>
          </Col>
          <Col xs="6" className="py-1">
            <CardText className="text-muted mb-0">Inactive</CardText>
            <h3 className="fw-bolder mb-0">{data?.inactive}</h3>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default GoalOverview;
