import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Stack,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, 'Phone number must be a valid 10-digit Indian number')
      .required('Phone number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://internship-recommendation-u8d3.onrender.com/api/auth/register', data);

      if (response.status === 201) {
        setRegisteredData({
          name: data.name,
          email: data.email,
          userId: response.data.userId,
        });
        setSuccessDialogOpen(true);
        toast.success('Registration successful! Please complete your profile.');
        reset(); // Clear form
      }
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'User already exists with this email or phone');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const handleProceedToProfile = () => {
    setSuccessDialogOpen(false);
    // Store temporary data for profile creation
    localStorage.setItem('tempUserId', registeredData.userId);
    localStorage.setItem('tempUserName', registeredData.name);
    localStorage.setItem('tempUserEmail', registeredData.email);

    // Navigate to profile setup
    navigate('/auth/profile-setup', { replace: true });
  };

  const handleGoToLogin = () => {
    setSuccessDialogOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <RHFTextField name="name" label="Full Name" placeholder="Enter your full name" />

          <RHFTextField name="email" label="Email Address" placeholder="Enter your email address" type="email" />

          <RHFTextField
            name="phone"
            label="Phone Number"
            placeholder="Enter your 10-digit phone number"
            type="tel"
            InputProps={{
              startAdornment: <InputAdornment position="start">+91</InputAdornment>,
            }}
          />

          <RHFTextField
            name="password"
            label="Password"
            placeholder="Create a strong password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter your password"
            type={showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            By registering, you agree to our Terms of Service and Privacy Policy. Your phone number is required for
            government verification purposes.
          </Typography>
        </Box>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 2 }}>
          Create Account
        </LoadingButton>
      </FormProvider>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main', mr: 1 }} />
            Registration Successful!
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Welcome, <strong>{registeredData?.name}</strong>!
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Your account has been created successfully. You can now login to access your dashboard and complete your
            profile to start receiving personalized internship recommendations.
          </Typography>
          <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
            🎉 Registration completed! Please login to continue.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <LoadingButton
            onClick={handleGoToLogin}
            variant="contained"
            startIcon={<Iconify icon="eva:log-in-fill" />}
            fullWidth
          >
            Go to Login
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
