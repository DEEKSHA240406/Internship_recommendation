import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Button,
  Paper,
  Avatar,
  LinearProgress,
  Alert,
  IconButton,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Tabs,
  Tab,
  CircularProgress,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  EmailOutlined as EmailOffIcon,
  TrendingUp as TrendingUpIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MonetizationOnIcon,
  Groups as GroupsIcon,
  Assignment as AssignmentIcon,
  DateRange as DateRangeIcon,
  Language as LanguageIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  // Core states
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [availableSectors, setAvailableSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editFormData, setEditFormData] = useState({});
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [saving, setSaving] = useState(false);

  // NEW: Internship details dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  // Email notification states - simplified for email only
  const [emailNotificationStatus, setEmailNotificationStatus] = useState({
    hasEmail: false,
    email: '',
    notificationsEnabled: false,
    notificationType: 'email',
    status: 'disabled',
  });
  const [emailNotificationLoading, setEmailNotificationLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');
  const userEmail = localStorage.getItem('email');

  // Predefined options for autocomplete
  const skillOptions = [
    'JavaScript',
    'Python',
    'Java',
    'React',
    'Node.js',
    'SQL',
    'HTML',
    'CSS',
    'Angular',
    'Vue.js',
    'PHP',
    'C++',
    'C#',
    'Ruby',
    'Go',
    'Swift',
    'Kotlin',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Redis',
    'Docker',
    'Kubernetes',
    'AWS',
    'Git',
    'Linux',
    'Machine Learning',
    'Data Analysis',
    'UI/UX Design',
    'Photoshop',
    'Illustrator',
    'Figma',
    'AutoCAD',
    'SolidWorks',
    'MATLAB',
    'R Programming',
    'Tableau',
    'Power BI',
    'Excel',
    'Project Management',
    'Digital Marketing',
    'Content Writing',
    'Social Media Marketing',
    'SEO',
  ];

  const locationOptions = [
    'Remote',
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Bhopal',
    'Visakhapatnam',
    'Patna',
    'Vadodara',
    'Ghaziabad',
    'Ludhiana',
    'Surat',
    'Kochi',
    'Coimbatore',
    'Madurai',
    'Thiruvananthapuram',
    'Mysore',
  ];

  const languageOptions = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'हिंदी (Hindi)' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
    { code: 'mr-IN', name: 'मराठी (Marathi)' },
    { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)' },
  ];

  // Initialize on component mount
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchStudentData(), fetchSectors(), fetchEmailNotificationStatus()]);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        toast.error('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Helper function to get sector names for display
  const getSectorNames = (sectorInterests) => {
    if (!sectorInterests || !Array.isArray(sectorInterests)) return [];

    return sectorInterests.map((sector) => {
      if (typeof sector === 'object' && sector.name) {
        return sector.name;
      }
      const foundSector = availableSectors.find((s) => s._id === sector);
      return foundSector ? foundSector.name : 'Unknown Sector';
    });
  };

  // Fetch sectors from API
  const fetchSectors = async () => {
    setLoadingSectors(true);
    try {
      const response = await axios.get('https://internship-recommendation-u8d3.onrender.com/api/sectors');
      setAvailableSectors(response.data.sectors || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
      toast.error('Failed to load sectors');
    } finally {
      setLoadingSectors(false);
    }
  };

  // Fetch student profile data
  const fetchStudentData = async () => {
    try {
      const profileResponse = await axios.get(
        `https://internship-recommendation-u8d3.onrender.com/api/auth/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (profileResponse.data.profile) {
        setProfile(profileResponse.data.profile);
        fetchRecommendations();
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Error loading profile data');
    }
  };

  // Fetch recommendations
  const fetchRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      const response = await axios.get(
        `https://internship-recommendation-u8d3.onrender.com/api/internships/recommendations/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Email notification functions
  const fetchEmailNotificationStatus = async () => {
    try {
      const response = await axios.get(
        `https://internship-recommendation-u8d3.onrender.com/api/auth/status/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmailNotificationStatus(response.data);
    } catch (error) {
      console.error('Error fetching email notification status:', error);
      // Set default state with user email
      setEmailNotificationStatus({
        hasEmail: !!userEmail,
        email: userEmail || '',
        notificationsEnabled: false,
        notificationType: 'email',
        status: 'disabled',
      });
    }
  };

  // Toggle email notifications
  const toggleEmailNotifications = async (enabled) => {
    setEmailNotificationLoading(true);

    try {
      await axios.put(
        `https://internship-recommendation-u8d3.onrender.com/api/auth/toggle/${userId}`,
        { enabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchEmailNotificationStatus();
      toast.success(`Email notifications ${enabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error('Error toggling email notifications:', error);
      toast.error('Failed to update email notification settings');
    } finally {
      setEmailNotificationLoading(false);
    }
  };

  // NEW: Handle view internship details
  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedInternship(null);
  };

  // Profile management functions
  const handleRefreshRecommendations = () => {
    fetchRecommendations();
    toast.info('Refreshing recommendations...');
  };

  const handleEditProfile = () => {
    setEditFormData({
      education: profile.education || '',
      skills: profile.skills || [],
      sector_interests: profile.sector_interests || [],
      preferred_locations: profile.preferred_locations || [],
      language: profile.language || 'en-IN',
    });

    // Initialize selected sectors for editing
    if (profile.sector_interests) {
      const profileSectorIds = profile.sector_interests.map((sector) =>
        typeof sector === 'object' ? sector._id : sector
      );
      const sectorsToSelect = availableSectors.filter((sector) => profileSectorIds.includes(sector._id));
      setSelectedSectors(sectorsToSelect);
    }

    setEditDialogOpen(true);
  };

  const handleCompleteProfile = () => {
    navigate('/dashboard/profile-setup');
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setActiveTab(0);
    setEditFormData({});
    setSelectedSectors([]);
  };

  const handleFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectorChange = (event, newValue) => {
    setSelectedSectors(newValue);
    setEditFormData((prev) => ({
      ...prev,
      sector_interests: newValue.map((sector) => sector._id),
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const updateData = {
        id: userId,
        ...editFormData,
      };

      const response = await axios.post(
        'https://internship-recommendation-u8d3.onrender.com/api/auth/profile/create',
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.profile) {
        setProfile(response.data.profile);
        toast.success('Profile updated successfully!');
        handleCloseEditDialog();
        // Refresh recommendations after profile update
        fetchRecommendations();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Tab panel component for edit dialog
  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}</div>
  );

  // NEW: Render internship details dialog
  const renderInternshipDetailsDialog = () => {
    if (!selectedInternship) return null;

    return (
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { maxHeight: '90vh' },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                {selectedInternship.title}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {selectedInternship.company}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Chip
                  label={`${selectedInternship.matchScore}% Match`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 'bold', mr: 1 }}
                />
                <Chip label={selectedInternship.job_id} variant="outlined" size="small" />
              </Box>
            </Box>
            <IconButton onClick={handleCloseDetailsDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Job Details
                  </Typography>

                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Location
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">{selectedInternship.location}</Typography>
                      {selectedInternship.remote_ok && (
                        <Chip label="Remote Available" size="small" color="success" sx={{ ml: 1 }} />
                      )}
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Duration
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <ScheduleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">{selectedInternship.duration}</Typography>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Stipend
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <MonetizationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {selectedInternship.stipend?.amount > 0
                          ? `₹${selectedInternship.stipend.amount}/month`
                          : 'Unpaid'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Application Deadline
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <DateRangeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {new Date(selectedInternship.applicationDeadline).toLocaleDateString('en-IN')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Requirements */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <BuildIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Requirements
                  </Typography>

                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Skills Required
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedInternship.skills_required.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  {selectedInternship.sectors && selectedInternship.sectors.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Industry Sectors
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedInternship.sectors.map((sector, index) => (
                          <Chip key={index} label={sector.name} size="small" color="secondary" variant="filled" />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {selectedInternship.eligibility?.education && selectedInternship.eligibility.education.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Education Requirements
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedInternship.eligibility.education.map((edu, index) => (
                          <Chip key={index} label={edu} size="small" color="info" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Job Description
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                    {selectedInternship.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Match Details */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ bgcolor: 'success.light', borderColor: 'success.main' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.dark">
                    <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Why This Matches Your Profile ({selectedInternship.matchScore}% Match)
                  </Typography>

                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedInternship.matchDetails?.skills || 'Skills alignment with your profile'}
                        primaryTypographyProps={{ color: 'success.dark' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedInternship.matchDetails?.location || 'Location matches your preferences'}
                        primaryTypographyProps={{ color: 'success.dark' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedInternship.matchDetails?.sectors || 'Sector aligns with your interests'}
                        primaryTypographyProps={{ color: 'success.dark' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Application Information */}
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="subtitle2" gutterBottom>
                  Ready to Apply?
                </Typography>
                <Typography variant="body2">
                  This internship is part of the Internship Recommendation. To apply, you will use the below{' '}
                  <strong>"Apply Now"</strong> button.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Application Deadline:</strong>{' '}
                  {new Date(selectedInternship.applicationDeadline).toLocaleDateString('en-IN')}
                </Typography>
                {selectedInternship.maxApplications && (
                  <Typography variant="body2">
                    <strong>Maximum Applications:</strong> {selectedInternship.maxApplications} positions available
                  </Typography>
                )}
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDetailsDialog} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={() => {
              // Here you would typically redirect to application page or external link
              window.open(selectedInternship.websiteLink, '_blank');
            }}
          >
            Apply Now
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Render edit dialog with all tabs
  const renderEditDialog = () => (
    <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Profile</Typography>
          <IconButton onClick={handleCloseEditDialog} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Education" />
          <Tab label="Skills" />
          <Tab label="Sectors" />
          <Tab label="Locations" />
          <Tab label="Language" />
          <Tab label="Email Alerts" />
        </Tabs>

        {/* Education Tab */}
        <TabPanel value={activeTab} index={0}>
          <TextField
            fullWidth
            label="Education Background"
            value={editFormData.education || ''}
            onChange={(e) => handleFormChange('education', e.target.value)}
            placeholder="e.g., B.Sc. Computer Science, B.Tech Information Technology"
            multiline
            rows={3}
            helperText="Describe your educational background, degree, and field of study"
            sx={{ mt: 2 }}
          />
        </TabPanel>

        {/* Skills Tab */}
        <TabPanel value={activeTab} index={1}>
          <Autocomplete
            multiple
            options={skillOptions}
            freeSolo
            value={editFormData.skills || []}
            onChange={(event, newValue) => handleFormChange('skills', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} color="primary" />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Technical & Professional Skills"
                placeholder="Type skill name and press Enter"
                helperText="Add your technical and professional skills. You can type custom skills."
              />
            )}
          />
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Current skills: {editFormData.skills?.length || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tip: Include both technical skills (programming languages, software) and soft skills (communication,
              leadership)
            </Typography>
          </Box>
        </TabPanel>

        {/* Sector Interests Tab */}
        <TabPanel value={activeTab} index={2}>
          {loadingSectors ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>Loading sectors...</Typography>
            </Box>
          ) : (
            <Autocomplete
              multiple
              options={availableSectors}
              getOptionLabel={(option) => option.name}
              value={selectedSectors}
              onChange={handleSectorChange}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    variant="filled"
                    color="secondary"
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option._id}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Industry Sector Interests"
                  placeholder="Select sectors you're interested in..."
                  helperText="Choose sectors from the official Internship Recommendation that align with your career goals"
                />
              )}
            />
          )}
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Selected sectors: {selectedSectors.length || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Selecting multiple sectors increases your chances of finding relevant internships
            </Typography>
          </Box>
        </TabPanel>

        {/* Locations Tab */}
        <TabPanel value={activeTab} index={3}>
          <Autocomplete
            multiple
            options={locationOptions}
            freeSolo
            value={editFormData.preferred_locations || []}
            onChange={(event, newValue) => handleFormChange('preferred_locations', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="filled" color="info" label={option} {...getTagProps({ index })} key={index} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Preferred Work Locations"
                placeholder="Type city name and press Enter"
                helperText="Where would you like to work? Include 'Remote' if you're open to remote work opportunities"
              />
            )}
          />
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Current locations: {editFormData.preferred_locations?.length || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Adding multiple locations and 'Remote' option increases your internship opportunities
            </Typography>
          </Box>
        </TabPanel>

        {/* Language Tab */}
        <TabPanel value={activeTab} index={4}>
          <FormControl fullWidth>
            <InputLabel>Preferred Language</InputLabel>
            <Select
              value={editFormData.language || 'en-IN'}
              onChange={(e) => handleFormChange('language', e.target.value)}
              label="Preferred Language"
            >
              {languageOptions.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              This language will be used for email notifications and system communications. All official communications
              will be available in your selected language.
            </Typography>
          </Box>
        </TabPanel>

        {/* Email Notifications Tab */}
        <TabPanel value={activeTab} index={5}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Email Notification Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Stay updated with personalized internship opportunities delivered directly to your email inbox. Perfect
              for busy schedules and ensures you never miss matching opportunities.
            </Typography>

            <Box
              sx={{
                border: '1px solid',
                borderColor: emailNotificationStatus.status === 'enabled' ? 'success.main' : 'grey.300',
                borderRadius: 2,
                p: 3,
                bgcolor: emailNotificationStatus.status === 'enabled' ? 'success.light' : 'grey.50',
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  {emailNotificationStatus.status === 'enabled' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <EmailOffIcon color="disabled" />
                  )}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Email Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {emailNotificationStatus.status === 'enabled' ? 'Enabled' : 'Disabled'}
                    </Typography>
                    {emailNotificationStatus.email && (
                      <Typography variant="caption" color="text.secondary">
                        Delivery address: {emailNotificationStatus.email}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotificationStatus.notificationsEnabled}
                      onChange={(e) => toggleEmailNotifications(e.target.checked)}
                      disabled={emailNotificationLoading}
                      color="primary"
                    />
                  }
                  label={emailNotificationStatus.notificationsEnabled ? 'ON' : 'OFF'}
                />
              </Box>

              {emailNotificationStatus.status === 'enabled' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Perfect! You'll receive email notifications for internships with 50%+ compatibility match. All
                    emails are sent in your preferred language.
                  </Typography>
                </Alert>
              )}

              {emailNotificationStatus.status === 'disabled' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Enable email notifications to receive personalized internship recommendations! We only send
                    high-quality matches to keep your inbox clean and relevant.
                  </Typography>
                </Alert>
              )}
            </Box>

            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                What emails will you receive?
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" color="text.secondary">
                  New internship matches (50%+ compatibility with your profile)
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Weekly digest of trending opportunities in your sectors
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Application deadline reminders for internships you've shown interest in
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Important updates about the Internship Recommendation
                </Typography>
              </Box>
            </Box>

            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom color="success.main">
                Email Delivery Promise
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We respect your inbox! Maximum 2-3 emails per week for active opportunities. All emails are
                personalized, relevant, and you can unsubscribe anytime. No spam, no irrelevant content - only valuable
                internship opportunities.
              </Typography>
            </Box>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCloseEditDialog} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveProfile}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {saving ? 'Saving Changes...' : 'Save Profile'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Box textAlign="center">
            <LinearProgress sx={{ width: 300, mb: 2 }} />
            <Typography variant="h6" color="primary">
              Loading your dashboard...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preparing your personalized recommendations
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  // Profile incomplete state
  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Internship Recommendation
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Complete Your Profile to Get Started
              </Typography>
              <Typography variant="body1" paragraph>
                To receive personalized internship recommendations, please complete your profile with your education,
                skills, and career interests.
              </Typography>
              <Button variant="contained" onClick={handleCompleteProfile} startIcon={<PersonIcon />} size="large">
                Complete Profile Now
              </Button>
            </Alert>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // Main dashboard with complete profile data
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, {profile.name}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Internship Recommendation - Your personalized dashboard
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          {emailNotificationStatus.status === 'disabled' && (
            <Button
              variant="outlined"
              color="warning"
              size="small"
              startIcon={<EmailIcon />}
              onClick={() => toggleEmailNotifications(true)}
              disabled={emailNotificationLoading}
            >
              {emailNotificationLoading ? 'Enabling...' : 'Enable Email Alerts'}
            </Button>
          )}
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Email notification alert for disabled notifications */}
        {emailNotificationStatus.status === 'disabled' && (
          <Grid item xs={12}>
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => toggleEmailNotifications(true)}
                  disabled={emailNotificationLoading}
                >
                  {emailNotificationLoading ? 'Enabling...' : 'Enable Now'}
                </Button>
              }
            >
              <Typography variant="subtitle2">Don't miss perfect internship matches!</Typography>
              <Typography variant="body2">
                Enable email notifications to get personalized internship recommendations delivered directly to{' '}
                {userEmail}
              </Typography>
            </Alert>
          </Grid>
        )}

        {/* Profile Overview Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{profile.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userEmail}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    Internship Recommendation Candidate
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box mb={2}>
                <Box display="flex" alignItems="center" mb={1}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Education</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {profile.education || 'Not specified'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Language Preference</Typography>
                </Box>
                <Chip
                  label={languageOptions.find((l) => l.code === profile.language)?.name || 'English'}
                  size="small"
                  color="primary"
                />
              </Box>

              <Box mb={2}>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Email Notifications</Typography>
                </Box>
                <Chip
                  label={emailNotificationStatus.status === 'enabled' ? 'Active' : 'Disabled'}
                  size="small"
                  color={emailNotificationStatus.status === 'enabled' ? 'success' : 'default'}
                  variant={emailNotificationStatus.status === 'enabled' ? 'filled' : 'outlined'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Skills Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <BuildIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Skills</Typography>
                </Box>
                <Chip label={profile.skills?.length || 0} size="small" color="primary" />
              </Box>

              <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                {profile.skills && profile.skills.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {profile.skills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" variant="outlined" color="primary" />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No skills added yet. Add skills to get better recommendations.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sector Interests Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <BusinessIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Sector Interests</Typography>
                </Box>
                <Chip label={profile.sector_interests?.length || 0} size="small" color="secondary" />
              </Box>

              <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                {getSectorNames(profile.sector_interests).length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {getSectorNames(profile.sector_interests).map((sectorName, index) => (
                      <Chip key={index} label={sectorName} size="small" variant="filled" color="secondary" />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No sector interests added yet. Select sectors to find relevant internships.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferred Locations Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <LocationIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Preferred Locations</Typography>
                </Box>
                <Chip label={profile.preferred_locations?.length || 0} size="small" color="info" />
              </Box>

              <Box>
                {profile.preferred_locations && profile.preferred_locations.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {profile.preferred_locations.map((location, index) => (
                      <Chip key={index} label={location} size="small" variant="filled" color="info" />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No location preferences set. Add locations to find nearby opportunities.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Profile Summary</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h4" color="primary.contrastText">
                      {recommendations.length}
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText">
                      Active Matches
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h4" color="success.contrastText">
                      {profile.skills?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="success.contrastText">
                      Skills Listed
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light' }}>
                    <Typography variant="h4" color="secondary.contrastText">
                      {getSectorNames(profile.sector_interests).length}
                    </Typography>
                    <Typography variant="body2" color="secondary.contrastText">
                      Sectors
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                    <Typography variant="h4" color="info.contrastText">
                      {profile.preferred_locations?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="info.contrastText">
                      Locations
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations Section */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center">
                  <WorkIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Personalized Internship Recommendations</Typography>
                </Box>
                <IconButton
                  onClick={handleRefreshRecommendations}
                  disabled={recommendationsLoading}
                  color="primary"
                  title="Refresh recommendations"
                >
                  <RefreshIcon />
                </IconButton>
              </Box>

              {/* Recommendations Content */}
              {(() => {
                if (recommendationsLoading) {
                  return (
                    <Box textAlign="center" py={4}>
                      <LinearProgress sx={{ mb: 2 }} />
                      <Typography>Finding the best internship matches for you...</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Analyzing your skills, interests, and preferences
                      </Typography>
                    </Box>
                  );
                }

                if (recommendations.length > 0) {
                  return (
                    <>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Found {recommendations.length} internship{recommendations.length > 1 ? 's' : ''} matching your
                        profile. Sorted by compatibility score.
                      </Typography>
                      <Grid container spacing={2}>
                        {recommendations.map((internship, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Card
                              variant="outlined"
                              sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid',
                                borderColor: 'primary.light',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  boxShadow: 3,
                                  transform: 'translateY(-2px)',
                                  transition: 'all 0.2s ease-in-out',
                                },
                                position: 'relative',
                              }}
                            >
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                                    {internship.title}
                                  </Typography>
                                  <Chip
                                    label={`${internship.matchScore || 85}% Match`}
                                    color="primary"
                                    size="small"
                                    sx={{ fontWeight: 'bold' }}
                                  />
                                </Box>

                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                  {internship.company}
                                </Typography>

                                <Box display="flex" alignItems="center" mb={2}>
                                  <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {internship.location}
                                    {internship.remote_ok && (
                                      <Chip label="Remote OK" size="small" color="success" sx={{ ml: 1 }} />
                                    )}
                                  </Typography>
                                </Box>

                                {/* Display sector information */}
                                {internship.sectors && internship.sectors.length > 0 && (
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                      Sectors:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                      {internship.sectors.map((sector, idx) => (
                                        <Chip
                                          key={idx}
                                          label={sector.name}
                                          size="small"
                                          color="secondary"
                                          variant="outlined"
                                        />
                                      ))}
                                    </Box>
                                  </Box>
                                )}

                                {/* Match details */}
                                <Box
                                  mt={2}
                                  sx={{
                                    bgcolor: 'success.light',
                                    p: 2,
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'success.main',
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="success.dark"
                                    display="block"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    Why this matches you:
                                  </Typography>
                                  <Typography variant="caption" color="success.dark" display="block">
                                    ✓ {internship.matchDetails?.skills || 'Skills alignment'}
                                  </Typography>
                                  <Typography variant="caption" color="success.dark" display="block">
                                    ✓ {internship.matchDetails?.location || 'Location preference'}
                                  </Typography>
                                  <Typography variant="caption" color="success.dark" display="block">
                                    ✓ {internship.matchDetails?.sectors || 'Sector interest'}
                                  </Typography>
                                </Box>

                                {/* Stipend and duration */}
                                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                  {internship.stipend?.amount > 0 ? (
                                    <Chip
                                      label={`₹${internship.stipend.amount}/month`}
                                      size="small"
                                      color="success"
                                      variant="filled"
                                    />
                                  ) : (
                                    <Chip label="Unpaid" size="small" color="default" variant="outlined" />
                                  )}

                                  {internship.duration && (
                                    <Chip label={internship.duration} size="small" color="info" variant="outlined" />
                                  )}
                                </Box>

                                {internship.applicationDeadline && (
                                  <Box mt={1}>
                                    <Typography variant="caption" color="warning.main">
                                      Apply by: {new Date(internship.applicationDeadline).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                )}
                              </CardContent>

                              {/* NEW: Card Actions with View Details button */}
                              <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleViewDetails(internship)}
                                  fullWidth
                                  sx={{ mr: 1 }}
                                >
                                  View Details
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<SendIcon />}
                                  onClick={() => {
                                    // Direct application redirect
                                    window.open(internship.websiteLink, '_blank');
                                  }}
                                  fullWidth
                                >
                                  Apply Now
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  );
                }

                return (
                  <Alert severity="info" sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" gutterBottom>
                      No matching internships found at the moment.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Don't worry! New internships are added regularly.
                      {emailNotificationStatus.status === 'enabled'
                        ? " We'll email you when perfect matches become available!"
                        : ' Enable email notifications to get alerted when new opportunities match your profile.'}
                    </Typography>
                    {emailNotificationStatus.status === 'disabled' && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EmailIcon />}
                        onClick={() => toggleEmailNotifications(true)}
                        disabled={emailNotificationLoading}
                      >
                        Enable Email Alerts
                      </Button>
                    )}
                  </Alert>
                );
              })()}
            </CardContent>
          </Card>
        </Grid>

        {/* Email notification success status */}
        {emailNotificationStatus.status === 'enabled' && (
          <Grid item xs={12}>
            <Alert severity="success" variant="outlined">
              <Typography variant="subtitle2" gutterBottom>
                Email Notifications Active
              </Typography>
              <Typography variant="body2">
                You're all set! We'll send personalized internship recommendations to {emailNotificationStatus.email}
                in {languageOptions.find((l) => l.code === profile.language)?.name || 'English'}. Check your inbox
                regularly for new opportunities.
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Edit Profile Dialog */}
      {renderEditDialog()}

      {/* NEW: Internship Details Dialog */}
      {renderInternshipDetailsDialog()}
    </Container>
  );
};

export default StudentDashboard;
