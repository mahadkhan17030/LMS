import React, { useState } from 'react';
import { signup } from '../../config/firebaseauthconfih';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert,
  CssBaseline,
  CircularProgress
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getDatabase, ref, set } from 'firebase/database';

const theme = createTheme();

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [model, setModel] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    phoneNumber: '', 
    nicNumber: '' 
  });
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ 
    email: false, 
    password: false, 
    name: false, 
    phoneNumber: false, 
    nicNumber: false 
  });
  const [isLoading, setIsLoading] = useState(false);

  const signupUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!model.email || !model.password || !model.name || !model.phoneNumber || !model.nicNumber) {
      setError("Please fill in all required fields.");
      return;
    }
    if (model.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const user = await signup(model.email, model.password);
      if (user) {
        // Store additional user data in Realtime Database
        const db = getDatabase();
        await set(ref(db, 'users/' + user.uid), {
          name: model.name,
          phoneNumber: model.phoneNumber,
          nicNumber: model.nicNumber,
          email: model.email
        });

        alert('User created successfully');
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field: keyof typeof model) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModel({ ...model, [name]: value });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper 
          elevation={6}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
          }}
        >
          <PersonAddIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          <Box component="form" onSubmit={signupUser} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={model.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              error={touched.name && !model.name}
              helperText={touched.name && !model.name ? "Name is required" : ""}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="tel"
              value={model.phoneNumber}
              onChange={handleChange}
              onBlur={() => handleBlur('phoneNumber')}
              error={touched.phoneNumber && !model.phoneNumber}
              helperText={touched.phoneNumber && !model.phoneNumber ? "Phone number is required" : ""}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="nicNumber"
              label="NIC Number"
              name="nicNumber"
              value={model.nicNumber}
              onChange={handleChange}
              onBlur={() => handleBlur('nicNumber')}
              error={touched.nicNumber && !model.nicNumber}
              helperText={touched.nicNumber && !model.nicNumber ? "NIC number is required" : ""}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={model.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              error={touched.email && !model.email}
              helperText={touched.email && !model.email ? "Email is required" : ""}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={model.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              error={touched.password && !model.password}
              helperText={touched.password && !model.password ? "Password is required" : ""}
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
              aria-label="Sign Up"
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/login')}
              disabled={isLoading}
              aria-label="Go To Login"
            >
              Go To Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;