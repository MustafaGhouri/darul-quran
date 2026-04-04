import React from "react";
import ReactApexChart from "react-apexcharts";
import { getQuarter, format } from "date-fns";

const BarChart = ({ data = [] }) => {
  // If data is passed in, use it; otherwise fallback to the hardcoded array
  const formattedData = data && data.length > 0 
    ? data.map(item => ({ x: item.x, y: Number(item.y) || 0 }))
    : [
        { x: "Mon", y: 0 },
        { x: "Tue", y: 0 },
        { x: "Wed", y: 0 },
        { x: "Thu", y: 0 },
        { x: "Fri", y: 0 },
        { x: "Sat", y: 0 },
        { x: "Sun", y: 0 },
      ];

  const series = [
    {
      name: "Enrollments",
      data: formattedData
    }
  ];

  const options = {
    chart: {
    type: "bar",
    height: 380,
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ['#95C4BE'],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      }
    },
  },
  colors: ["#95C4BE"],
    tooltip: {
      x: {
        formatter: (val) => {
          const date = new Date(val);
          return isNaN(date.getTime()) 
            ? val 
            : `Q${getQuarter(date)} ${format(date, "yyyy")}`;
        },
      },
    },
  };

  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={380} />
    </div>
  );
};

export default BarChart;
