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
// import { useState } from 'react'

const InterviewsChart = ({ direction, title, category, RecruitersSeries }) => {
  const lastYears = [];
  const max = new Date().getFullYear();
  const min = max - 5;
  for (let i = max; i >= min; i--) {
    lastYears.push(i);
  }
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

  return (
    <Card>
      <CardHeader className="d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start">
        <div>
          <CardTitle className="mb-75" tag="h4">
            {title}
          </CardTitle>
          {/* <CardSubtitle className='text-muted'>Commercial networks</CardSubtitle> */}
        </div>
        {/* <div className='d-flex align-items-center mt-md-0 mt-1'>
                    <div className="d-flex align-items-center w-100">
                        <label htmlFor="rows-per-page">Select Year</label>
                        <Input
                            className="mx-50"
                            type="select"
                            id="rows-per-page"
                            value={interviewYear ? interviewYear : "Year Filter"}
                            style={{ width: '6rem', cursor: "pointer" }}
                            onChange={(e) => {
                                setInterviewYear(e.target.value)
                            }}
                        >
                            {
                                lastYears?.map(item => {
                                    return <option value={item} >{item}</option>
                                })
                            }
                        </Input>

                    </div>
                </div> */}
      </CardHeader>
      <CardBody>
        <Chart
          options={options}
          series={RecruitersSeries}
          type="bar"
          height={400}
        />
      </CardBody>
    </Card>
  );
};

export default InterviewsChart;
