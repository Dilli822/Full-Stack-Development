import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@material-ui/core";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send POST request to Django server to initiate password reset
    fetch("/api/password_reset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage(
            "An email with instructions for resetting your password has been sent to your email address."
          );
          setErrorMessage("");
          setEmail("");
        } else {
          setErrorMessage("Invalid email address.");
          setSuccessMessage("");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("An error occurred. Please try again later.");
        setSuccessMessage("");
      });
  };

  return (
    <Container maxWidth="sm" >
      <br></br>
    <form onSubmit={handleSubmit}>
      <Typography>Reset Password</Typography>
      <Typography>Enter your email to reset the password</Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" variant="contained" color="primary">
        Reset Password
      </Button>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </form>
    </Container>
  );
};

export default ResetPassword;
