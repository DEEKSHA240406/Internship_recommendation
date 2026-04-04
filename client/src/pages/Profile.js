import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Avatar, Grid, Alert, Box } from '@mui/material';
import axios from 'axios';
import Iconify from '../components/Iconify'; // Assuming you have an Iconify component for icons
import Page from '../components/Page';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const id = localStorage.getItem('id');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://internship-recommendation-u8d3.onrender.com/api/auth/profile/${id}`);
        setUser(response.data);
        setFormData({
          email: response.data.email,
          role: response.data.role,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const requestOtp = async () => {
    try {
      await axios.post('https://internship-recommendation-u8d3.onrender.com/api/auth/request-otp', { email }); // Send OTP to user's email
      setMessage('OTP sent to your email.');
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Error sending OTP. Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://internship-recommendation-u8d3.onrender.com/api/auth/change-password', {
        email: user.email,
        currentPassword,
        newPassword,
        otp,
      });
      setMessage('Password changed successfully!');
      // Reset fields after successful change
      setCurrentPassword('');
      setNewPassword('');
      setOtp('');
      setOtpSent(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Error changing password. Please check your OTP or current password.');
    }
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Page title="Profile">
      <Container>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>

        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <Grid container spacing={3} maxWidth={700}>
            <Grid item xs={12} md={7} padding={2}>
              <Avatar alt={user.name} src="/path/to/avatar.png" sx={{ width: 100, height: 100 }} />
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6">User Information</Typography>

              <TextField
                label="Email"
                name="email"
                value={isEditing ? formData.email : user.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
              />

              <TextField
                label="Role"
                name="role"
                value={isEditing ? formData.role : user.role}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
              />

              {/* Password Change Section */}
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Change Password
              </Typography>

              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                margin="normal"
              />

              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="normal"
              />

              {otpSent && (
                <TextField label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} fullWidth margin="normal" />
              )}

              {!otpSent ? (
                <Button variant="contained" onClick={requestOtp} startIcon={<Iconify icon="eva:paper-plane-fill" />}>
                  Request OTP
                </Button>
              ) : (
                <Button variant="contained" onClick={handleChangePassword} startIcon={<Iconify icon="eva:key-fill" />}>
                  Change Password
                </Button>
              )}

              {message && (
                <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mt: 2 }}>
                  {message}
                </Alert>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
};

export default ProfilePage;
