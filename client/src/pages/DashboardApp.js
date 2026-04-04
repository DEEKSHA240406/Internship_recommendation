import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Box,
  Button,
} from '@mui/material';
// components
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
  AppDonutChart,
} from '../sections/@dashboard/app';
import StudentDashboard from './StudentDashboard';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [userAnalytics, setUserAnalytics] = useState({});
  const [internshipAnalytics, setInternshipAnalytics] = useState({});
  const [notificationStats, setNotificationStats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('topSkills');
  const [loading, setLoading] = useState(true);

  // Get user role from localStorage
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('email');

  const categoryOptions = [
    { key: 'locationStats', label: 'Location Distribution' },
    { key: 'sectorStats', label: 'Sector Distribution' },
    { key: 'skillsDemand', label: 'Skills in Demand' },
    { key: 'topCompanies', label: 'Top Companies' },
    { key: 'topSectorInterests', label: 'Popular Sector Interests' },
    { key: 'languageStats', label: 'Language Distribution' },
  ];

  // Fetch statistics from the backend
  useEffect(() => {
    if (userRole === 'admin') {
      fetchAdminStats();
    } else {
      setLoading(false);
    }
  }, [userRole]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const [dashboardRes, userRes, internshipRes, notificationRes] = await Promise.all([
        axios.get('https://internship-recommendation-u8d3.onrender.com/api/stats/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://internship-recommendation-u8d3.onrender.com/api/stats/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://internship-recommendation-u8d3.onrender.com/api/stats/internships', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios
          .get('https://internship-recommendation-u8d3.onrender.com/api/stats/notifications', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch((err) => {
            console.warn('Notification stats not available:', err);
            return { data: {} };
          }),
      ]);

      setStats(dashboardRes.data || {});
      setUserAnalytics(userRes.data || {});
      setInternshipAnalytics(internshipRes.data || {});
      setNotificationStats(notificationRes.data || {});
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log('Stats:', stats);
  console.log('User Analytics:', userAnalytics);
  console.log('Internship Analytics:', internshipAnalytics);

  // Get chart data based on selected category - UPDATED to handle sector names
  const getChartData = () => {
    let data = [];

    switch (selectedCategory) {
      case 'locationStats': {
        data = internshipAnalytics.locationStats || [];
        return {
          labels: data.map((item) => item._id || 'Unknown'),
          values: data.map((item) => item.count || 0),
        };
      }
      case 'sectorStats': {
        data = internshipAnalytics.sectorStats || [];
        return {
          labels: data.map((item) => item.name || item._id || 'Unknown Sector'),
          values: data.map((item) => item.count || 0),
        };
      }
      case 'skillsDemand': {
        data = internshipAnalytics.skillsDemand || [];
        return {
          labels: data.map((item) => item._id || 'Unknown'),
          values: data.map((item) => item.count || 0),
        };
      }
      case 'topCompanies': {
        data = internshipAnalytics.topCompanies || [];
        return {
          labels: data.map((item) => item._id || 'Unknown'),
          values: data.map((item) => item.count || 0),
        };
      }
      case 'topSectorInterests': {
        data = userAnalytics.topSectorInterests || [];
        return {
          labels: data.map((item) => item.name || item._id || 'Unknown Sector'),
          values: data.map((item) => item.count || 0),
        };
      }
      case 'languageStats': {
        data = userAnalytics.languageStats || [];
        const languageNames = {
          'en-IN': 'English',
          'hi-IN': 'Hindi',
          'ta-IN': 'Tamil',
          'mr-IN': 'Marathi',
          'gu-IN': 'Gujarati',
          'te-IN': 'Telugu',
          'kn-IN': 'Kannada',
          'ml-IN': 'Malayalam',
          'bn-IN': 'Bengali',
          'pa-IN': 'Punjabi',
        };
        return {
          labels: data.map((item) => languageNames[item._id] || item._id || 'Unknown'),
          values: data.map((item) => item.count || 0),
        };
      }
      default: {
        return {
          labels: [],
          values: [],
        };
      }
    }
  };

  const chartData = getChartData();

  // User Dashboard Content
  if (userRole === 'user') {
    return <StudentDashboard />;
  }

  // Admin Dashboard Content
  if (loading) {
    return (
      <Page title="Dashboard">
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Loading Dashboard...
          </Typography>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Admin Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Internship Recommendation - Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Overview Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Users"
              total={stats.overview?.totalUsers || 0}
              color="primary"
              icon="eva:people-fill"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Internships"
              total={stats.overview?.totalInternships || 0}
              color="info"
              icon="eva:briefcase-fill"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Profile Completion"
              total={`${stats.overview?.profileCompletionRate || 0}%`}
              color="success"
              icon="eva:checkmark-circle-2-fill"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Email Notifications"
              total={`${stats.overview?.emailNotificationRate || 0}%`}
              color="warning"
              icon="eva:email-fill"
            />
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="New Users (Week)"
              total={stats.recent?.newUsersThisWeek || 0}
              color="error"
              icon="eva:person-add-fill"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="New Internships (Week)"
              total={stats.recent?.newInternshipsThisWeek || 0}
              color="secondary"
              icon="eva:plus-circle-fill"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Remote Opportunities"
              total={stats.internships?.remote || 0}
              color="success"
              icon="eva:home-fill"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Sectors"
              total={stats.overview?.totalSectors || 0}
              color="warning"
              icon="eva:grid-fill"
            />
          </Grid>

          {/* Internship Status Distribution */}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Internship Status"
              subheader="Current distribution of internship statuses"
              chartData={[
                { label: 'Active', value: stats.internships?.active || 0 },
                { label: 'Paused', value: stats.internships?.paused || 0 },
                { label: 'Closed', value: stats.internships?.closed || 0 },
              ]}
              chartColors={[theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main]}
            />
          </Grid>

          {/* Email Notification Status */}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Email Notifications"
              subheader="User email notification preferences"
              chartData={[
                {
                  label: 'Enabled',
                  value: (userAnalytics.emailNotificationStats || []).find((stat) => stat._id === true)?.count || 0,
                },
                {
                  label: 'Disabled',
                  value: (userAnalytics.emailNotificationStats || []).find((stat) => stat._id === false)?.count || 0,
                },
              ]}
              chartColors={[theme.palette.success.main, theme.palette.grey[400]]}
            />
          </Grid>

          {/* Top Skills */}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Top Skills"
              subheader="Most popular skills among users"
              chartData={(userAnalytics.topSkills || []).slice(0, 6).map((skill) => ({
                label: skill._id,
                value: skill.count,
              }))}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.red[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
                theme.palette.chart.green[0],
                theme.palette.chart.blue[0],
              ]}
            />
          </Grid>

          {/* Category Selection */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analytics Category
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Select Analytics Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Select Analytics Category"
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.key} value={option.key}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Statistics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">New Users This Month: {stats.recent?.newUsersThisMonth || 0}</Typography>
                  <Typography variant="body2">
                    New Internships This Month: {stats.recent?.newInternshipsThisMonth || 0}
                  </Typography>
                  <Typography variant="body2">Email Coverage: {notificationStats.emailCoverage || 0}%</Typography>
                  <Typography variant="body2">Active Internships: {stats.internships?.active || 0}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Analytics Chart */}
          <Grid item xs={12} md={12} lg={8}>
            <AppWebsiteVisits
              title="Analytics Overview"
              subheader={`Distribution of ${
                categoryOptions.find((c) => c.key === selectedCategory)?.label || 'Analytics'
              }`}
              chartLabels={chartData.labels}
              chartData={[
                {
                  name: categoryOptions.find((c) => c.key === selectedCategory)?.label || 'Category',
                  type: 'bar',
                  fill: 'solid',
                  data: chartData.values,
                },
              ]}
            />
          </Grid>

          {/* Distribution Pie Chart */}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Distribution Analysis"
              subheader={`${categoryOptions.find((c) => c.key === selectedCategory)?.label || 'Analytics'} Breakdown`}
              chartData={chartData.labels.slice(0, 8).map((label, index) => ({
                label: label.length > 15 ? `${label.substring(0, 15)}...` : label,
                value: chartData.values[index] || 0,
              }))}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.red[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
                theme.palette.chart.green[0],
                theme.palette.chart.blue[0],
              ]}
            />
          </Grid>

          {/* Horizontal Bar Chart */}
          <Grid item xs={12} md={6}>
            <AppConversionRates
              title="Detailed Breakdown"
              subheader={`${
                categoryOptions.find((c) => c.key === selectedCategory)?.label || 'Analytics'
              } Detailed View`}
              chartData={chartData.labels.slice(0, 10).map((label, index) => ({
                label: label.length > 20 ? `${label.substring(0, 20)}...` : label,
                value: chartData.values[index] || 0,
              }))}
            />
          </Grid>

          {/* Donut Chart */}
          <Grid item xs={12} md={6}>
            <AppDonutChart
              title="Category Distribution"
              subheader={`${categoryOptions.find((c) => c.key === selectedCategory)?.label || 'Analytics'} Overview`}
              chartData={chartData.labels.slice(0, 6).map((label, index) => ({
                label: label.length > 12 ? `${label.substring(0, 12)}...` : label,
                value: chartData.values[index] || 0,
              }))}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.success.main,
                theme.palette.error.main,
                theme.palette.warning.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
