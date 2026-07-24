// ** Third Party Components
import Chart from "react-apexcharts";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";

// ** Store
import { useSelector } from "react-redux";

import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";

const CandidateJobChart = ({ aggregatedStats, loading }) => {
  // Use system theme color from redux (agency detail)
  const themeColorFromStore = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );

  const themecolor = themeColorFromStore || "#7367f0";

  // Prepare data for the chart
  // Single series with multiple categories so that there is visible space between columns
  const chartData = [
    {
      name: "Job Statistics",
      data: [
        aggregatedStats.jobsApplied || 0,
        aggregatedStats.interviewsScheduled || 0,
        aggregatedStats.interviewsAttended || 0,
        aggregatedStats.onboardedJobs || 0,
        aggregatedStats.hired || 0,
        aggregatedStats.rejected || 0
      ]
    }
  ];

  const categories = [
        "Jobs Applied",
        "Interviews Scheduled",
        "Interviews Attended",
        "Onboarded Jobs",
        "Hired",
        "Rejected"
  ];

  const barColors = [
    themecolor, // Jobs Applied
    `${themecolor}cc`, // Interviews Scheduled
    `${themecolor}99`, // Interviews Attended
    `${themecolor}66`, // Onboarded Jobs
    `${themecolor}55`, // Hired 
    `${themecolor}33`, // Rejected
  ];

  // ** Chart Options
  const options = {
    chart: {
      height: 400,
      type: "bar",
      stacked: false,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        // Bars are narrower than the category width so there is space between columns
        columnWidth: "45%",
        distributed: true,
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val > 0 ? val : '';
      },
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "center",
      fontSize: '14px',
      // Use custom legend labels that match each category / bar
      customLegendItems: categories,
      markers: {
        fillColors: barColors
      }
    },
    colors: barColors,
    // Keep bar colors the same on hover/click (no darkening effect)
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0
        }
      },
      hover: {
        filter: {
          type: "none",
          value: 0
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0
        }
      }
    },
      stroke: {
      show: true,
      // colors: ["transparent"],
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '0.850rem',
          fontWeight: 600,
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return Math.floor(val);
        }
      }
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: false,
      followCursor: true,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        if (dataPointIndex === undefined || dataPointIndex < 0) {
          return '';
        }
        const category = w.globals.categoryLabels[dataPointIndex] || '';
        const value = series[seriesIndex] && series[seriesIndex][dataPointIndex] !== undefined 
          ? series[seriesIndex][dataPointIndex] 
          : 0;
        const color = w.globals.colors[dataPointIndex] || '#7367f0';
        
        return (
          '<div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">' +
          category +
          '</div>' +
          '<div class="apexcharts-tooltip-series-group" style="order: 1; display: flex;">' +
          '<span class="apexcharts-tooltip-marker" style="background-color: ' +
          color +
          ';"></span>' +
          '<div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">' +
          '<div class="apexcharts-tooltip-y-group">' +
          '<span class="apexcharts-tooltip-text-label">Value: </span>' +
          '<span class="apexcharts-tooltip-text-value">' +
          value +
          ' jobs' +
          '</span>' +
          '</div>' +
          '</div>' +
          '</div>'
        );
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="mb-75" tag="h4">
            Job Application Overview
          </CardTitle>
          <small className="text-muted">Your job search progress and outcomes</small>
        </div>
      </CardHeader>
      <CardBody style={{ height: loading == true && "400px" }}>
        {loading == true ? (
          <ComponentSpinner theamcolour={themecolor} />
        ) : (
          <Chart
            options={options}
            series={chartData}
            type="bar"
            height={400}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default CandidateJobChart;
