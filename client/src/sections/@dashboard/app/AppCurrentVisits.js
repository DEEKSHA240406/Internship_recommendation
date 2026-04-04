import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import html2canvas from 'html2canvas';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;  // Increased height
const LEGEND_HEIGHT = 100; // More space for labels

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(12),  // Moved chart lower
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT }px) !important`,  // Moved legend below chart
  },
}));

// ----------------------------------------------------------------------

AppCurrentVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
  chartData: PropTypes.array.isRequired,
};

export default function AppCurrentVisits({ title, subheader, chartColors, chartData, ...other }) {
  
  const theme = useTheme();
  const chartLabels = chartData.map((i) => i.label);
  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { 
      floating: false, 
      horizontalAlign: 'center', 
      position: 'bottom' // Moves labels to the bottom
    },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => `${fNumber(value)}`, 
        title: { formatter: (seriesName) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });

  // Function to capture and download chart
  const handleDownloadChart = () => {
    const chartElement = document.getElementById('current-visits-chart');
    if (!chartElement) return;

    html2canvas(chartElement, { scale: 2 }).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'chart.png';
      link.click();
    });
  };

  return (
    <Card {...other}>
      <CardHeader 
        title={title} 
        subheader={subheader} 
        action={
          <IconButton onClick={handleDownloadChart}>
            <DownloadIcon />
          </IconButton>
        } 
      />

      <ChartWrapperStyle dir="ltr" id="current-visits-chart">
        <ReactApexChart type="pie" series={chartSeries} options={chartOptions} height={400} />
      </ChartWrapperStyle>
    </Card>
  );
}
