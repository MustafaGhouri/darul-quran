import Chart from "react-apexcharts";
const LineCharts = () => {
    const data = {
        options: {
            chart: {
                id: "basic-line"
            },
            xaxis: {
                categories: [1991, 1992, 1993, 1994]
            }
        },
        colors: ["#95C4BE"],
        series: [
            {
                name: "series-1",
                data: [30, 40, 45, 20]
            }
        ]
    };
    return (
        <div className="app ">
            <div className="row">
                <div className="max-sm:hidden mixed-chart">
                    <Chart
                        options={data.options}
                        series={data.series}
                        type="area"

                        width="400"
                    />
                </div>
                <div className="sm:hidden mixed-chart">
                    <Chart
                        options={data.options}
                        series={data.series}
                        type="area"

                        width="300"
                    />
                </div>
            </div>
        </div>
    )
}

export default LineCharts
