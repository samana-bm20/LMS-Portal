// src/pages/Login.js
import React, { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";
import { Config } from "../Config";

import {
  Container, Box, TextField, Button, Typography, CssBaseline, Avatar, IconButton, InputAdornment,
  Snackbar, Alert,
} from "@mui/material";
import { LockRounded, LoginRounded, VisibilityRounded, VisibilityOffRounded, } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //#region Login
  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setErrorOpen(true);
    } else {
      try {
        const response = await axios.post(`${Config.apiUrl}/login`, { username, password });
        const { token, user } = response.data;
        login(token, user);
        navigate('/lms/dashboard');
      } catch (error) {
        console.error('Error during login', error);
      }
    }
  };


  //#region Success/Error
  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorOpen(false);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ minHeight: "100vh", display: "flex" }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          alt="ML Infomap"
          // src={logo}
          sx={{ m: 1, bgcolor: "primary.main" }}
        >
          <LockRounded />
        </Avatar>
        <Typography component="h1" variant="h5">
          Lead Management System
        </Typography>

        <Box
          component="form"
          noValidate
          sx={{
            mt: 1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? (
                      <VisibilityOffRounded />
                    ) : (
                      <VisibilityRounded />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            onClick={handleLogin}
            sx={{ mt: 3, mb: 2 }}
            endIcon={<LoginRounded />}
          >
            Log In
          </Button>
        </Box>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={successOpen}
        autoHideDuration={3000}
        onClose={handleSuccessClose}
      >
        <Alert
          onClose={handleSuccessClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Login Successful
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorOpen}
        autoHideDuration={3000}
        onClose={handleErrorClose}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Enter valid credentials
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
