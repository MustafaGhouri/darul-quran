import React from "react";
import Chart from "react-apexcharts";

const AreaChart = ({ data = [] }) => {
  const series = [
    {
      name: "Revenue",
      data: data.map(item => Number(item.revenue)),
    },
  ];

  const options = {
    chart: {
      id: "revenue-area",
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    colors: ["#95C4BE"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.48,
        opacityTo: 0,
        stops: [0, 100],
        gradientToColors: ["#ffffff"],
      },
    },
    dataLabels: {
      enabled: false,
    },

    grid: {
      show: true,
      strokeDashArray: 0,
      borderColor: "#E6E6E6",
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: data.map(item => item.week_start),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "13px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: true,
      labels: {
        formatter: function (val) {
          if (val >= 1000) return (val / 1000).toFixed(0) + "k";
          return val;
        },
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      strokeColors: "#fff",
      hover: {
        size: 6,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "€" + val.toLocaleString();
        },
      },
    },
    legend: { show: false },
  };

  return (
    <div className="max-w-6xl min-w-xl mx-auto ">
      <div >
        <div className="w-full">
          <Chart
            options={options}
            series={series}
            type="area"
            width="100%"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default AreaChart;
