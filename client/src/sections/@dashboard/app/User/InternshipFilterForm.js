import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

InternshipFilterForm.propTypes = {
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  onResetFilters: PropTypes.func,
};

export default function InternshipFilterForm({ filters, onFilterChange, onResetFilters }) {
  const [availableSectors, setAvailableSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [loadingSectors, setLoadingSectors] = useState(false);

  useEffect(() => {
    fetchSectors();
  }, []);

  useEffect(() => {
    // Update selected sector when filters change
    if (filters.sectors && availableSectors.length > 0) {
      const sector = availableSectors.find((s) => s.name.toLowerCase().includes(filters.sectors.toLowerCase()));
      setSelectedSector(sector || null);
    } else {
      setSelectedSector(null);
    }
  }, [filters.sectors, availableSectors]);

  const fetchSectors = async () => {
    setLoadingSectors(true);
    try {
      const response = await axios.get('http://localhost:8070/api/sectors');
      setAvailableSectors(response.data.sectors || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    } finally {
      setLoadingSectors(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    onFilterChange(field, event.target.value);
  };

  const handleSectorChange = (event, newValue) => {
    setSelectedSector(newValue);
    onFilterChange('sectors', newValue ? newValue.name : '');
  };

  const handleResetFilters = () => {
    setSelectedSector(null);
    onResetFilters();
  };

  return (
    <RootStyle>
      <Typography variant="h6" gutterBottom>
        Filter Internships
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {/* Title filter */}
        <SearchStyle
          value={filters.title || ''}
          onChange={handleInputChange('title')}
          placeholder="Search by Job Title"
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />

        {/* Company filter */}
        <TextField
          fullWidth
          label="Company"
          value={filters.company || ''}
          onChange={handleInputChange('company')}
          placeholder="e.g. Google, Microsoft"
        />

        {/* Location filter */}
        <TextField
          fullWidth
          label="Location"
          value={filters.location || ''}
          onChange={handleInputChange('location')}
          placeholder="e.g. Bangalore, Mumbai, Remote"
        />

        {/* Skills filter */}
        <TextField
          fullWidth
          label="Skills"
          value={filters.skills || ''}
          onChange={handleInputChange('skills')}
          placeholder="e.g. python, javascript, react"
          helperText="Search by required skills"
        />

        {/* Sectors filter - Updated with Autocomplete */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Filter by Sector
          </Typography>
          {loadingSectors ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">Loading sectors...</Typography>
            </Box>
          ) : (
            <Autocomplete
              options={availableSectors}
              getOptionLabel={(option) => option.name}
              value={selectedSector}
              onChange={handleSectorChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select a sector..."
                  helperText="Choose from Internship Recommendation sectors"
                />
              )}
              fullWidth
            />
          )}
        </Box>

        {/* Status filter */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={filters.status || ''} onChange={handleInputChange('status')} label="Status">
            <MenuItem value="">
              <em>All Statuses</em>
            </MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Paused">Paused</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>

        {/* Remote Work filter */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Remote Work</InputLabel>
          <Select value={filters.remote_ok || ''} onChange={handleInputChange('remote_ok')} label="Remote Work">
            <MenuItem value="">
              <em>All Types</em>
            </MenuItem>
            <MenuItem value="true">Remote Available</MenuItem>
            <MenuItem value="false">On-site Only</MenuItem>
          </Select>
        </FormControl>

        {/* Duration filter */}
        <TextField
          fullWidth
          label="Duration"
          value={filters.duration || ''}
          onChange={handleInputChange('duration')}
          placeholder="e.g. 3 months, 6 months"
          helperText="Search by internship duration"
        />

        {/* Stipend filter */}
        <TextField
          fullWidth
          label="Minimum Stipend (INR)"
          type="number"
          value={filters.minStipend || ''}
          onChange={handleInputChange('minStipend')}
          placeholder="e.g. 10000"
          helperText="Filter by minimum monthly stipend"
        />

        {/* Job ID filter */}
        <TextField
          fullWidth
          label="Job ID"
          value={filters.job_id || ''}
          onChange={handleInputChange('job_id')}
          placeholder="e.g. J1001"
          helperText="Search by specific job ID"
        />

        {/* Reset button */}
        <Button
          variant="outlined"
          onClick={handleResetFilters}
          sx={{ mt: 2 }}
          startIcon={<Iconify icon="eva:refresh-fill" />}
        >
          Reset Filters
        </Button>
      </Box>
    </RootStyle>
  );
}
