// ** Third Party Components

import { Anchor, Users } from "react-feather";

// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";

const AgencyCard = ({ dated }) => {
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
    colors: ["#323D76"],
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
  const series = [{ name: "agency", data: [25, 35, 20, 45, 60, 41] }];
  return dated !== null ? (
    <StatsWithAreaChart
      icon={<Anchor size={21} />}
      color="primary"
      stats={dated?.agency}
      statTitle="Total Agency"
      series={series}
      options={options}
      type="area"
    />
  ) : null;
};

export default AgencyCard;
