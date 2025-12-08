import { useState } from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = () => {
  const [state] = useState({
    series: [44, 55, 13, 43],
    options: {
      chart: {
        type: "pie",
      },
      colors: ["#06574C", "#95C4BE", "#EBD4C9", "#F1C2AC"],
      labels: ["Upcoming", "Cancelled", "Missed", "In Progress"],
      legend: { show: false },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(1)}%`,
        style: {
          fontSize: "12px",
          fontWeight: "600",
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: { width: 300 },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  });

  const { series } = state;
  const labels = state.options.labels;
  const colors = state.options.colors;
  const total = series.reduce((s, v) => s + v, 0);

  return (
    <div className="">
      <h2 className="text-2xl font-semibold ">Class Status Overview</h2>
      <div className="flex gap-8 items-center flex-col-reverse md:flex-row">
        <div className="w-full md:w-1/2">
          <ul className="space-y-4">
            {labels.map((label, i) => {
              const value = series[i];
              const pct = total ? ((value / total) * 100).toFixed(1) : "0.0";
              return (
                <li
                  key={label}
                  className="flex items-center justify-between bg-transparent"
                >
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden
                      className="w-4 h-4 rounded-full inline-block"
                      style={{ backgroundColor: colors[i] }}
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {value} <span className="text-gray-400">({pct}%)</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT chart */}
        <div className="w-full md:w-1/2 flex justify-center">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="pie"
            width={280}
          />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
