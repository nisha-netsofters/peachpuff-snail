// ** Third Party Components
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import { Calendar } from "react-feather";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardSubtitle,
  Input,
} from "reactstrap";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { useState } from "react";
// import { useState } from 'react'

const RecruiterWorkChart = ({
  direction,
  title,
  year,
  month,
  setYear,
  setMonth,
  category,
  RecruitersSeries,
  loading,
}) => {
  const { width } = useBreakpoint();
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
  const themecolor = localStorage.getItem("themecolor");
  const columnColors = {
    series1: themecolor,
    series2: `${themecolor}80`,
    series3: `${themecolor}30`,
    // bg: 'none'
  };

  // ** Chart Options
  const options = {
    chart: {
      height: 400,
      type: "bar",
      stacked: true,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnColors: "none !important",
        columnWidth: "30%",
        colors: {
          // backgroundBarColors: [columnColors.bg, columnColors.bg, columnColors.bg, columnColors.bg, columnColors.bg],
          // backgroundBarRadius: 20
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "start",
    },
    colors: [columnColors.series1, columnColors.series2, columnColors.series3],
    stroke: {
      show: true,
      colors: ["transparent"],
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: category,
    },
    fill: {
      opacity: 1,
    },
    yaxis: {
      opposite: direction === "rtl",
    },
  };

  // ** Chart Series
  // const series = [
  //     {
  //         name: 'Scheduled',
  //         data: [10, 20, 30, 40]
  //     },
  //     {
  //         name: 'Hired',
  //         data: [15, 25, 35, 45]
  //     },
  //     {
  //         name: 'Rejected',
  //         data: [17, 27, 37, 47]
  //     }
  // ]
  const [focus, setIsfocus] = useState(null);
  return (
    <Card>
      <CardHeader className="d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start">
        <div>
          <CardTitle className="mb-75" tag="h4">
            {title}
          </CardTitle>
          {/* <CardSubtitle className='text-muted'>Commercial networks</CardSubtitle> */}
        </div>
        <div className="d-flex align-items-center mt-md-0 mt-1">
          <div
            className="align-items-center w-100"
            style={width > 767 ? { display: "flex" } : { display: "none" }}
          >
            <label htmlFor="rows-per-page">Select Year</label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={year ? year : "Year Filter"}
              onFocus={() => setIsfocus("year")}
              onBlur={() => setIsfocus(null)}
              style={{
                width: "6rem",
                cursor: "pointer",
                borderColor: focus === "year" && themecolor,
              }}
              onChange={(e) => {
                setYear(e.target.value);
              }}
            >
              {lastYears?.map((item) => {
                return <option value={item == "All" ? 0 : item}>{item}</option>;
              })}
            </Input>
            <label htmlFor="rows-per-page" style={{ marginLeft: "40px" }}>
              Select Month
            </label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={month ? month : "Month Filter"}
              onFocus={() => setIsfocus("month")}
              onBlur={() => setIsfocus(null)}
              style={{
                width: "6rem",
                cursor: "pointer",
                borderColor: focus === "month" && themecolor,
              }}
              onChange={(e) => {
                setMonth(e.target.value);
              }}
            >
              {months?.map((item, i) => {
                return <option value={i}>{item}</option>;
              })}
            </Input>
          </div>
          <div
            className="w-100 flex-column gap-1"
            style={width > 767 ? { display: "none" } : { display: "flex" }}
          >
            <div className="d-flex align-items-center">
              <label htmlFor="rows-per-page">Select Year</label>
              <Input
                className="mx-50"
                type="select"
                id="rows-per-page"
                value={year ? year : "Year Filter"}
                onFocus={() => setIsfocus("year")}
                onBlur={() => setIsfocus(null)}
                style={{
                  width: "6rem",
                  cursor: "pointer",
                  borderColor: focus === "year" && themecolor,
                }}
                onChange={(e) => {
                  setYear(e.target.value);
                }}
              >
                {lastYears?.map((item) => {
                  return <option value={item}>{item}</option>;
                })}
              </Input>
            </div>
            <div className="d-flex align-items-center">
              <label htmlFor="rows-per-page">Select Month</label>
              <Input
                className="mx-50"
                type="select"
                id="rows-per-page"
                value={month ? month : "Month Filter"}
                onFocus={() => setIsfocus("month")}
                onBlur={() => setIsfocus(null)}
                style={{
                  width: "6rem",
                  cursor: "pointer",
                  borderColor: focus === "month" && themecolor,
                }}
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
        </div>
      </CardHeader>
      <CardBody style={{ height: loading == true && "400px" }}>
        {loading == true ? (
          <ComponentSpinner theamcolour={themecolor} />
        ) : (
          <Chart
            options={options}
            series={RecruitersSeries}
            type="bar"
            height={400}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default RecruiterWorkChart;
