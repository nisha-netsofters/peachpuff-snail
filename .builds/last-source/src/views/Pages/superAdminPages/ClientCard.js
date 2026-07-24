// ** Third Party Components

import { User } from "react-feather";

// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";

const ClientCard = ({ dated }) => {
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
    colors: ["#ea5455"],
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
  const series = [{ name: "client", data: [100, 50, 20, 40, 80, 20, 10] }];
  return dated !== null ? (
    <StatsWithAreaChart
      icon={<User size={21} />}
      color="danger"
      stats={dated?.client}
      statTitle="Total Client"
      series={series}
      options={options}
      type="area"
    />
  ) : null;
};

export default ClientCard;
