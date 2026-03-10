import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ data = [], isLoading = false }) => {
  const seriesData = data.map(item => Number(item.revenue) || 0);
  const categoriesData = data.map(item => item.week_label);

  const [chartState, setChartState] = React.useState({
    series: [{
      name: 'Revenue',
      data: seriesData.length > 0 ? seriesData : [0, 0, 0, 0],
    }],
    options: {
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#06574C'] // Line color
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.48,
          opacityTo: 0,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: 'rgba(149, 196, 190, 0.48)',
              opacity: 1
            },
            {
              offset: 100,
              color: 'rgba(255, 255, 255, 0)',
              opacity: 1
            }
          ]
        }
      },
      colors: ['#06574C'],
      xaxis: {
        type: 'categories',
        categories: categoriesData.length > 0 ? categoriesData : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px'
          }
        }
      },
      grid: {
        borderColor: '#F3F4F6',
        strokeDashArray: 4,
        padding: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 20
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
        style: {
          fontSize: '12px',
          fontFamily: 'inherit'
        }
      },
    },
  });

  // Add useEffect to update the chart if data changes
  React.useEffect(() => {
    if (data && data.length > 0) {
      setChartState(prevState => ({
        ...prevState,
        series: [{
          name: 'Revenue',
          data: data.map(item => Number(item.revenue) || 0)
        }],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: data.map(item => item.week_label)
          }
        }
      }));
    }
  }, [data]);

  return (
    <div id="chart">
      <ReactApexChart 
        options={chartState.options} 
        series={chartState.series} 
        type="area" 
        height={380} 
      />
    </div>
  );
};

export default ApexChart;