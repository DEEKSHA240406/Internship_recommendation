import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Chip,
  Box,
  Switch,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function InternshipAddUserDialog({ open, onClose, fetchInternships }) {
  const [internshipData, setInternshipData] = useState({
    title: '',
    company: '',
    location: '',
    skills_required: [],
    sectors: [], // This will now store sector ObjectIds
    description: '',
    remote_ok: false,
    duration: '',
    stipend: { amount: 0, currency: 'INR' },
    eligibility: { education: [] },
    applicationDeadline: '',
    websiteLink: '',
    maxApplications: 50,
  });

  const [tempSkill, setTempSkill] = useState('');
  const [selectedSectors, setSelectedSectors] = useState([]); // For Autocomplete
  const [availableSectors, setAvailableSectors] = useState([]); // From API
  const [tempEducation, setTempEducation] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingSectors, setLoadingSectors] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch sectors on component mount
  useEffect(() => {
    fetchSectors();
  }, []);

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

  const handleAddInternship = async () => {
    try {
      // Convert selected sectors to ObjectIds
      const sectorIds = selectedSectors.map((sector) => sector._id);
      const dataToSubmit = {
        ...internshipData,
        sectors: sectorIds,
      };

      const response = await axios.post('http://localhost:8070/api/internships/admin/internships', dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        fetchInternships();
        onClose();
        resetForm();
        toast.success('Internship added successfully');
      }
    } catch (error) {
      console.error('Error adding internship:', error);
      toast.error('Error adding internship');
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file before uploading.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'http://localhost:8070/api/internships/admin/internships/bulk-upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success(`${response.data.count} internships uploaded successfully`);
        fetchInternships();
        setSelectedFile(null);
        onClose();
      }
    } catch (error) {
      console.error('Error bulk uploading internships:', error);
      toast.error('Error bulk uploading internships');
    } finally {
      setIsUploading(false);
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
      websiteLink: '',
      maxApplications: 50,
    });
    setTempSkill('');
    setSelectedSectors([]);
    setTempEducation('');
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const isBulkMode = !!selectedFile;

  const getButtonContent = () => {
    if (isUploading) {
      return <CircularProgress size={24} />;
    }
    if (isBulkMode) {
      return 'Upload';
    }
    return 'Add Internship';
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isBulkMode ? 'Bulk Upload Internships' : 'Add New Internship'}</DialogTitle>
      <DialogContent>
        {!isBulkMode ? (
          <>
            <TextField
              fullWidth
              label="Job Title"
              value={internshipData.title}
              onChange={(e) => setInternshipData((prev) => ({ ...prev, title: e.target.value }))}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Company"
              value={internshipData.company}
              onChange={(e) => setInternshipData((prev) => ({ ...prev, company: e.target.value }))}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Location"
              value={internshipData.location}
              onChange={(e) => setInternshipData((prev) => ({ ...prev, location: e.target.value }))}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={internshipData.description}
              onChange={(e) => setInternshipData((prev) => ({ ...prev, description: e.target.value }))}
              margin="normal"
              multiline
              rows={3}
              required
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
              sx={{ mt: 2 }}
            />

            <TextField
              fullWidth
              label="Duration"
              value={internshipData.duration}
              onChange={(e) => setInternshipData((prev) => ({ ...prev, duration: e.target.value }))}
              margin="normal"
              placeholder="e.g. 3 months, 6 months"
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
              required
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
              margin="normal"
              placeholder="e.g. https://company.com/careers"
            />

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
                placeholder="e.g. B.Tech, B.Sc, MBA"
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
          </>
        ) : null}

        {/* Bulk Upload Section */}
        <Box sx={{ mt: 3, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Or Bulk Upload Internships
          </Typography>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} style={{ marginBottom: '16px' }} />
          {selectedFile && (
            <Typography variant="body2" color="primary">
              Selected: {selectedFile.name}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={isBulkMode ? handleBulkUpload : handleAddInternship}
          color="primary"
          variant="contained"
          disabled={isUploading || (selectedSectors.length === 0 && !isBulkMode)}
        >
          {getButtonContent()}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
