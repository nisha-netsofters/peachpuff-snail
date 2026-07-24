// ** Third Party Components

import { Users } from "react-feather";

// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";

const CandidateCard = ({ dated }) => {
  // ** State

  const options = {
    chart: {
      id: "revenue",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      show: false,
    },
    colors: ["#ff9f43"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 80, 100],
      },
    },

    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      x: { show: false },
    },
  };
  const series = [{ name: "candidate", data: [0, 100, 20, 80, 45, 10, 87] }];
  return dated !== null ? (
    <StatsWithAreaChart
      icon={<Users size={21} />}
      color="warning"
      stats={dated?.candidate}
      statTitle="Total Candidate"
      series={series}
      options={options}
      type="area"
    />
  ) : null;
};

export default CandidateCard;
