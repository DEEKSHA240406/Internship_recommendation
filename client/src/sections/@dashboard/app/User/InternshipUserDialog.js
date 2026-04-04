import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Box,
  Switch,
  FormControlLabel,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function InternshipUserDialog({ open, onClose, internshipId, fetchInternships }) {
  const [internshipData, setInternshipData] = useState({
    title: '',
    company: '',
    location: '',
    skills_required: [],
    sectors: [],
    description: '',
    remote_ok: false,
    duration: '',
    stipend: { amount: 0, currency: 'INR' },
    eligibility: { education: [] },
    applicationDeadline: '',
    maxApplications: 50,
    websiteLink: '',
    status: 'Active',
  });

  const [tempSkill, setTempSkill] = useState('');
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [availableSectors, setAvailableSectors] = useState([]);
  const [tempEducation, setTempEducation] = useState('');
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [loadingInternship, setLoadingInternship] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSectors();
  }, []);

  useEffect(() => {
    if (internshipId) {
      fetchInternshipDetails();
    } else {
      resetForm();
    }
  }, [internshipId]);

  const fetchSectors = async () => {
    setLoadingSectors(true);
    try {
      const response = await axios.get('http://localhost:8070/api/sectors');
      setAvailableSectors(response.data.sectors || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
      toast.error('Failed to load sectors');
    } finally {
      setLoadingSectors(false);
    }
  };

  const fetchInternshipDetails = async () => {
    setLoadingInternship(true);
    try {
      const response = await axios.get(`http://localhost:8070/api/internships/internships/${internshipId}`);
      const fetchedData = response.data;

      setInternshipData({
        title: fetchedData.title || '',
        company: fetchedData.company || '',
        location: fetchedData.location || '',
        skills_required: fetchedData.skills_required || [],
        sectors: fetchedData.sectors || [],
        description: fetchedData.description || '',
        remote_ok: fetchedData.remote_ok || false,
        duration: fetchedData.duration || '',
        stipend: fetchedData.stipend || { amount: 0, currency: 'INR' },
        eligibility: fetchedData.eligibility || { education: [] },
        applicationDeadline: fetchedData.applicationDeadline
          ? new Date(fetchedData.applicationDeadline).toISOString().split('T')[0]
          : '',
        maxApplications: fetchedData.maxApplications || 50,
        websiteLink: fetchedData.websiteLink || '',
        status: fetchedData.status || 'Active',
      });

      // Set selected sectors for autocomplete
      // Handle both ObjectId format and populated format
      if (fetchedData.sectors) {
        const sectorsToSelect = fetchedData.sectors
          .map((sector) => {
            if (typeof sector === 'string') {
              // If sector is ObjectId string, find matching sector from available sectors
              return availableSectors.find((s) => s._id === sector);
            }
            if (sector._id) {
              // If sector is populated object
              return sector;
            }
            return null;
          })
          .filter(Boolean);

        setSelectedSectors(sectorsToSelect);
      }
    } catch (error) {
      console.error('Error fetching internship details:', error);
      toast.error('Failed to fetch internship details');
    } finally {
      setLoadingInternship(false);
    }
  };

  const handleUpdateInternship = async () => {
    try {
      // Convert selected sectors to ObjectIds
      const sectorIds = selectedSectors.map((sector) => sector._id);
      const dataToSubmit = {
        ...internshipData,
        sectors: sectorIds,
      };

      const response = await axios.put(
        `http://localhost:8070/api/internships/admin/internships/${internshipId}`,
        dataToSubmit,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Internship updated successfully');
      fetchInternships();
      onClose();
    } catch (error) {
      console.error('Error updating internship:', error);
      toast.error('Error updating internship');
    }
  };

  const resetForm = () => {
    setInternshipData({
      title: '',
      company: '',
      location: '',
      skills_required: [],
      sectors: [],
      description: '',
      remote_ok: false,
      duration: '',
      stipend: { amount: 0, currency: 'INR' },
      eligibility: { education: [] },
      applicationDeadline: '',
      maxApplications: 50,
      websiteLink: '',
      status: 'Active',
    });
    setSelectedSectors([]);
  };

  const addSkill = () => {
    if (tempSkill.trim() && !internshipData.skills_required.includes(tempSkill.trim())) {
      setInternshipData((prev) => ({
        ...prev,
        skills_required: [...prev.skills_required, tempSkill.trim()],
      }));
      setTempSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setInternshipData((prev) => ({
      ...prev,
      skills_required: prev.skills_required.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addEducation = () => {
    if (tempEducation.trim() && !internshipData.eligibility.education.includes(tempEducation.trim())) {
      setInternshipData((prev) => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          education: [...prev.eligibility.education, tempEducation.trim()],
        },
      }));
      setTempEducation('');
    }
  };

  const removeEducation = (educationToRemove) => {
    setInternshipData((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        education: prev.eligibility.education.filter((edu) => edu !== educationToRemove),
      },
    }));
  };

  if (loadingInternship) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Update Internship</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Job Title"
          value={internshipData.title}
          onChange={(e) => setInternshipData((prev) => ({ ...prev, title: e.target.value }))}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Company"
          value={internshipData.company}
          onChange={(e) => setInternshipData((prev) => ({ ...prev, company: e.target.value }))}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Location"
          value={internshipData.location}
          onChange={(e) => setInternshipData((prev) => ({ ...prev, location: e.target.value }))}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Description"
          value={internshipData.description}
          onChange={(e) => setInternshipData((prev) => ({ ...prev, description: e.target.value }))}
          margin="normal"
          multiline
          rows={3}
        />

        {/* Skills Section */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Skills Required
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            label="Add Skill"
            value={tempSkill}
            onChange={(e) => setTempSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            size="small"
          />
          <Button onClick={addSkill} variant="outlined">
            Add
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {internshipData.skills_required.map((skill, index) => (
            <Chip key={index} label={skill} onDelete={() => removeSkill(skill)} deleteIcon={<DeleteIcon />} />
          ))}
        </Box>

        {/* Sectors Section - Updated with Autocomplete */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Sectors
        </Typography>
        {loadingSectors ? (
          <CircularProgress size={20} />
        ) : (
          <Autocomplete
            multiple
            options={availableSectors}
            getOptionLabel={(option) => option.name}
            value={selectedSectors}
            onChange={(event, newValue) => {
              setSelectedSectors(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Select Sectors"
                placeholder="Choose sectors..."
                helperText="Select from predefined Internship Recommendation sectors"
              />
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} key={option._id} variant="outlined" />
              ))
            }
            sx={{ mb: 2 }}
          />
        )}

        <FormControlLabel
          control={
            <Switch
              checked={internshipData.remote_ok}
              onChange={(e) => setInternshipData((prev) => ({ ...prev, remote_ok: e.target.checked }))}
            />
          }
          label="Remote Work Available"
          sx={{ mt: 1, mb: 1 }}
        />

        <TextField
          fullWidth
          label="Duration"
          value={internshipData.duration}
          onChange={(e) => setInternshipData((prev) => ({ ...prev, duration: e.target.value }))}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Monthly Stipend (INR)"
          type="number"
          value={internshipData.stipend.amount}
          onChange={(e) =>
            setInternshipData((prev) => ({
              ...prev,
              stipend: { ...prev.stipend, amount: parseInt(e.target.value, 10) || 0 },
            }))
          }
          margin="normal"
        />

        <TextField
          fullWidth
          label="Application Deadline"
          type="date"
          value={internshipData.applicationDeadline}
          onChange={(e) => setInternshipData((prev) => ({ ...prev, applicationDeadline: e.target.value }))}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Maximum Applications"
          type="number"
          value={internshipData.maxApplications}
          onChange={(e) =>
            setInternshipData((prev) => ({ ...prev, maxApplications: parseInt(e.target.value, 10) || 50 }))
          }
          margin="normal"
        />

        <TextField
          fullWidth
          label="Website Link"
          value={internshipData.websiteLink || ''}
          onChange={(e) => setInternshipData((prev) => ({ ...prev, websiteLink: e.target.value }))}
          placeholder="e.g. https://company.com/careers"
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={internshipData.status}
            label="Status"
            onChange={(e) => setInternshipData((prev) => ({ ...prev, status: e.target.value }))}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Paused">Paused</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>

        {/* Eligibility Section */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Eligibility Criteria
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            label="Add Education Level"
            value={tempEducation}
            onChange={(e) => setTempEducation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addEducation()}
            size="small"
          />
          <Button onClick={addEducation} variant="outlined">
            Add
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {internshipData.eligibility.education.map((edu, index) => (
            <Chip
              key={index}
              label={edu}
              onDelete={() => removeEducation(edu)}
              deleteIcon={<DeleteIcon />}
              color="primary"
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleUpdateInternship}
          variant="contained"
          color="primary"
          disabled={selectedSectors.length === 0}
        >
          Update Internship
        </Button>
      </DialogActions>
    </Dialog>
  );
}
