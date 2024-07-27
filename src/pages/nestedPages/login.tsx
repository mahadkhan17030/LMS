import { useState } from 'react';
import { login } from '../../config/firebaseauthconfih';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert,
  CssBaseline
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const Login = () => {
  const navigate = useNavigate();
  const [model, setModel] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const loginUser = async (e:any) => {
    e.preventDefault();
    try {
      await login(model.email, model.password);
      alert('User Logged in Successfully');
      navigate('/dashboard', { replace: true });
    } catch (error:any) {
      setError(error.message);
    }
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
          <LockOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          <Box component="form" onSubmit={loginUser} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={model.email}
              onChange={(e) => setModel({ ...model, email: e.target.value })}
              error={!model.email}
              helperText={!model.email ? "Email is required" : ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={model.password}
              onChange={(e) => setModel({ ...model, password: e.target.value })}
              error={!model.password}
              helperText={!model.password ? "Password is required" : ""}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/signup')}
            >
              Go To Signup
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;