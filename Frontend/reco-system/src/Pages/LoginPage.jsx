import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";
import Header from "../Components/Header";
import FooterComponent from "../Components/FooterComponent";
import { storeSession } from "../utils/SessionUtils";
import { useAlert } from "../Components/CustomAlert";

const Login = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    emailOrPhoneError: false,
    passwordError: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset errors as user types
    setErrors({
      ...errors,
      [`${name}Error`]: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      login_input: formData.emailOrPhone,
      password: formData.password,
    };
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showAlert(
            data.message,
            'OK!',
            () => {
              navigate('/');
            },
            'success',
            true
          );
          storeSession(data.user); // Store session
          console.log('Session stored:', data.user);
        } else {
          showAlert(
            data.message || 'Login failed.',
            'Try again!',
            () => {},
            'error',
            true
          );
        }
      } else {
        const errorData = await response.json();
        showAlert(
          `Error: ${errorData.message || 'Login failed.'}`,
          'Try again!',
          () => {},
          'error',
          true
        );
      }
    } catch (error) {
      console.error('Error during API call:', error);
      showAlert(
        'An error occurred while logging in. Please try again.',
        'Try again!',
        () => {},
        'error',
        true
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Login</h2>

          {/* Email or Phone Input */}
          <div className="form-group">
            <label>Email or Phone</label>
            <input
              type="text"
              name="emailOrPhone"
              placeholder="Enter email or phone number"
              value={formData.emailOrPhone}
              onChange={handleChange}
              className={errors.emailOrPhoneError ? "input-error" : ""}
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={errors.passwordError ? "input-error" : ""}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
};

export default Login;
