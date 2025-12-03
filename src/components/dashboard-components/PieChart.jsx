import { useState } from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = () => {
  const [state, setState] = useState({
    series: [44, 55, 13, 43],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      colors: ["#06574C", "#95C4BE", "#EBD4C9", "#F1C2AC"],
      labels: ["Team A", "Team B", "Team C", "Team D"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  return (
    <div>
      <div id="chart">
        <div className=" ">
          <h1 className="text-xl font-bold">Revenue Analytics</h1>
        </div>
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
          width={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default PieChart;
//   const domContainer = document.querySelector('#app');
//   ReactDOM.render(<ApexChart />, domContainer);
