import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Chip,
  Box,
  Grid,
  Divider,
  Paper,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  DateRange as DateIcon,
  Group as GroupIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import axios from 'axios';

export default function InternshipUserViewDialog({ open, onClose, internship, internshipId }) {
  const [internshipData, setInternshipData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (internshipId && !internship) {
      // Fetch internship data if not provided
      fetchInternshipDetails();
    } else if (internship) {
      setInternshipData(internship);
    }
  }, [internshipId, internship]);

  const fetchInternshipDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://internship-recommendation-u8d3.onrender.com/api/internships/internships/${internshipId}`
      );
      console.log(response.data);

      // Process the internship data to handle sectors
      const processedData = await processInternshipData(response.data);
      setInternshipData(processedData);
    } catch (error) {
      console.error('Error fetching internship details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to process internship data and populate sectors if needed
  const processInternshipData = async (data) => {
    if (data.sectors && data.sectors.length > 0) {
      // Check if sectors are already populated (have 'name' property)
      const firstSector = data.sectors[0];
      if (typeof firstSector === 'string' || (firstSector && !firstSector.name)) {
        // Sectors are not populated, fetch sector details
        try {
          const sectorPromises = data.sectors.map(async (sectorId) => {
            if (typeof sectorId === 'string') {
              const sectorResponse = await axios.get(
                `https://internship-recommendation-u8d3.onrender.com/api/sectors/${sectorId}`
              );
              return sectorResponse.data.sector;
            }
            return sectorId;
          });
          data.sectors = await Promise.all(sectorPromises);
        } catch (error) {
          console.warn('Error fetching sector details:', error);
          // Keep original sectors if fetching fails
        }
      }
    }
    return data;
  };

  const getColor = (internship) => {
    if (internship === 'Active') return 'success';
    if (internship === 'Paused') return 'warning';
    return 'error';
  };

  // Helper function to get sector name from sector object or string
  const getSectorName = (sector) => {
    if (typeof sector === 'string') return sector;
    if (sector && sector.name) return sector.name;
    return 'Unknown Sector';
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading internship details...
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!internshipData) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogContent>
          <Typography>No internship data available.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WorkIcon color="primary" />
          <Typography variant="h5" component="span">
            {internshipData.title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Basic Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <BusinessIcon color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Company
                        </Typography>
                        <Typography variant="body1">{internshipData.company}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <LocationIcon color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Location
                        </Typography>
                        <Typography variant="body1">
                          {internshipData.location}
                          {internshipData.remote_ok && (
                            <Chip label="Remote OK" size="small" color="success" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <ScheduleIcon color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Duration
                        </Typography>
                        <Typography variant="body1">{internshipData.duration || 'Not specified'}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <MoneyIcon color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Stipend
                        </Typography>
                        <Typography variant="body1">
                          {internshipData.stipend?.amount
                            ? `₹${internshipData.stipend.amount.toLocaleString()}/month`
                            : 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <DateIcon color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Application Deadline
                        </Typography>
                        <Typography variant="body1">
                          {new Date(internshipData.applicationDeadline).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <GroupIcon color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Max Applications
                        </Typography>
                        <Typography variant="body1">{internshipData.maxApplications || 'Not specified'}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      {internshipData.status === 'Active' ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Status
                        </Typography>
                        <Chip label={internshipData.status} color={getColor(internshipData.status)} size="small" />
                      </Box>
                    </Box>
                  </Grid>

                  {internshipData.websiteLink && (
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <BusinessIcon color="action" />
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Website Link
                          </Typography>
                          <Typography variant="body1">
                            <a href={internshipData.websiteLink} target="_blank" rel="noopener noreferrer">
                              {internshipData.websiteLink}
                            </a>
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Description */}
          <Grid item xs={12}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Job Description
                </Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                  {internshipData.description || 'No description provided'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Skills Required */}
          <Grid item xs={12} md={6}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Skills Required
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {internshipData.skills_required?.length > 0 ? (
                    internshipData.skills_required.map((skill, index) => (
                      <Chip key={index} label={skill} variant="outlined" color="primary" />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No specific skills mentioned
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sectors - Updated to handle populated sectors */}
          <Grid item xs={12} md={6}>
            <Card elevation={1}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CategoryIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    Sectors
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {internshipData.sectors?.length > 0 ? (
                    internshipData.sectors.map((sector, index) => (
                      <Chip
                        key={typeof sector === 'string' ? sector : sector._id || index}
                        label={getSectorName(sector)}
                        variant="filled"
                        color="secondary"
                        size="medium"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No sectors specified
                    </Typography>
                  )}
                </Box>

                {/* Show sector count if multiple */}
                {internshipData.sectors?.length > 0 && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    {internshipData.sectors.length} sector{internshipData.sectors.length > 1 ? 's' : ''} listed
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Eligibility Criteria */}
          <Grid item xs={12}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Eligibility Criteria
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Education Level
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      {internshipData.eligibility?.education?.length > 0 ? (
                        internshipData.eligibility.education.map((edu, index) => (
                          <Chip key={index} label={edu} size="small" color="primary" variant="outlined" />
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Any education level
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Info */}
          <Grid item xs={12}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Additional Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Job ID
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {internshipData.job_id || 'Not assigned'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Posted Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {internshipData.posted_date || internshipData.createdAt
                        ? new Date(internshipData.posted_date || internshipData.createdAt).toLocaleDateString()
                        : 'Not available'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Current Applications
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {internshipData.currentApplications || 0} / {internshipData.maxApplications || 'Unlimited'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Remote Work
                    </Typography>
                    <Chip
                      label={internshipData.remote_ok ? 'Remote work available' : 'On-site only'}
                      color={internshipData.remote_ok ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
