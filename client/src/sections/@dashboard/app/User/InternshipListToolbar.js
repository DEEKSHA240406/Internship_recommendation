import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Card,
  Box,
  TextField,
  Button,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Iconify from '../../../../components/Iconify';
import InternshipFilterForm from './InternshipFilterForm';

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  padding: theme.spacing(1, 2),
  gap: theme.spacing(2),
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

const DropdownCard = styled(Card)(({ theme, isMobile }) => ({
  position: 'absolute',
  top: '100%',
  left: isMobile ? 0 : '575px',
  zIndex: 10,
  padding: theme.spacing(2),
  width: isMobile ? '100vw' : '90vw',
  maxWidth: isMobile ? '450px' : '350px',
  maxHeight: '400px',
  overflowY: 'auto',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  minHeight: '50px',
}));

const NotificationPopup = styled(Card)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 20,
  padding: theme.spacing(3),
  width: '90vw',
  maxWidth: 400,
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
    width: '95vw',
  },
}));

InternshipListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  onResetFilters: PropTypes.func,
  selectedIds: PropTypes.array,
};

export default function InternshipListToolbar({
  numSelected,
  filterName,
  onFilterName,
  filters,
  onFilterChange,
  onResetFilters,
  selectedIds,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationData, setNotificationData] = useState({
    minMatchScore: 50,
    customMessage: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const token = localStorage.getItem('token');

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    onFilterChange(updatedFilters);
  };

  const handleTriggerNotifications = async () => {
    if (selectedIds.length === 0) {
      toast.warning('Please select internships to send notifications for');
      return;
    }

    setIsLoading(true);
    try {
      const promises = selectedIds.map((internshipId) =>
        axios.post(
          `https://internship-recommendation-u8d3.onrender.com/api/internships/admin/internships/${internshipId}/notify`,
          { minMatchScore: notificationData.minMatchScore },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );

      const results = await Promise.allSettled(promises);

      const successful = results.filter((result) => result.status === 'fulfilled').length;
      const failed = results.filter((result) => result.status === 'rejected').length;

      if (successful > 0) {
        toast.success(`Notifications triggered for ${successful} internships successfully`);
      }
      if (failed > 0) {
        toast.warning(`Failed to trigger notifications for ${failed} internships`);
      }

      setShowNotificationPopup(false);
      setNotificationData({ minMatchScore: 50, customMessage: '' });
    } catch (error) {
      console.error('Error triggering notifications:', error);
      toast.error('Error triggering notifications');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RootStyle sx={{ ...(numSelected > 0 && { color: 'primary.main', bgcolor: 'primary.lighter' }) }}>
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="Search internships..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />

          <Tooltip title="Filter list">
            <IconButton onClick={() => setShowFilter((prev) => !prev)}>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>

          {showFilter && (
            <DropdownCard isMobile={isMobile}>
              <InternshipFilterForm
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={onResetFilters}
              />
            </DropdownCard>
          )}
        </>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Send Notifications">
          <IconButton onClick={() => setShowNotificationPopup(true)}>
            <Iconify icon="eva:bell-fill" />
          </IconButton>
        </Tooltip>
      ) : null}

      {showNotificationPopup && (
        <NotificationPopup>
          <Typography variant="h6" gutterBottom>
            Send Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Send targeted notifications to users who match the selected internships.
          </Typography>

          <TextField
            fullWidth
            type="number"
            label="Minimum Match Score (%)"
            value={notificationData.minMatchScore}
            onChange={(e) =>
              setNotificationData((prev) => ({
                ...prev,
                minMatchScore: Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)),
              }))
            }
            inputProps={{ min: 0, max: 100 }}
            sx={{ mb: 2 }}
            helperText="Only notify users with match score above this threshold"
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Button variant="outlined" onClick={() => setShowNotificationPopup(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTriggerNotifications}
              disabled={isLoading}
              startIcon={isLoading ? null : <Iconify icon="eva:bell-fill" />}
            >
              {isLoading ? 'Sending...' : `Notify Users`}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This will send push notifications to users with matching profiles.
          </Typography>
        </NotificationPopup>
      )}
    </RootStyle>
  );
}
