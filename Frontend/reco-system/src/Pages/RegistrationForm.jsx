import React, { useState } from "react";
import "./RegistrationForm.css";
import Header from "../Components/Header";
import FooterComponent from "../Components/FooterComponent";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    birthday: { day: "", month: "", year: "" },
    gender: "",
    address: "",
  });

  const handleBirthdayChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      birthday: { ...formData.birthday, [name]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
  
    // Validate all fields before sending the data
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      formData.emailError ||
      !formData.phoneNumber ||
      formData.phoneNumberError ||
      !formData.password ||
      formData.password !== formData.confirmPassword ||
      !formData.birthday ||
      !formData.gender ||
      !formData.address
    ) {
      alert('Please fill out all fields correctly.');
      return;
    }
  
    // Prepare the data for the API call
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      password: formData.password,
      birthday: formData.birthday,
      gender: formData.gender,
      address: formData.address,
    };
  
    try {
      // Make the API call
      const response = await fetch('http://127.0.0.1:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Registration successful!'); // You can display this success message better in your UI
        console.log('Response:', data); // Debug the response if needed
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Registration failed.'}`);
      }
    } catch (error) {
      console.error('Error during API call:', error);
      alert('An error occurred while registering. Please try again.');
    }
  };  

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthday") {
      // Ensure a valid date is selected
      const isValidDate = Boolean(Date.parse(value)); // Checks if the value is a valid date
      setFormData({
        ...formData,
        birthday: value,
        birthdayError: !isValidDate, // Highlight field if the date is invalid
      });
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setFormData({
        ...formData,
        email: value,
        emailError: !emailRegex.test(value),
      });
    } else if (name === "phoneNumber") {
      const phoneRegex = /^\d{10}$/;
      setFormData({
        ...formData,
        phoneNumber: value,
        phoneNumberError: !phoneRegex.test(value),
      });
    } else if (name === "password" || name === "confirmPassword") {
      const isMatch =
        name === "confirmPassword" ? value === formData.password : true;

      setFormData({
        ...formData,
        [name]: value,
        confirmPasswordError:
          name === "confirmPassword" ? !isMatch : formData.confirmPasswordError,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGenderChange = (selectedGender) => {
    setFormData({ ...formData, gender: selectedGender });
  };

  return (
    <div>
      <Header />
      <div className="registration-form-container">
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={formData.emailError ? "input-error" : ""}
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit Phone Number"
                className={formData.phoneNumberError ? "input-error" : ""}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter Password"
                className={formData.confirmPasswordError ? "input-error" : ""}
                required // Makes the field mandatory
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Birthday</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className={formData.birthdayError ? "input-error" : ""}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <div className="gender-toggle">
                <button
                  type="button"
                  className={formData.gender === "male" ? "active" : ""}
                  onClick={() => handleGenderChange("male")}
                >
                  Male
                </button>
                <button
                  type="button"
                  className={formData.gender === "female" ? "active" : ""}
                  onClick={() => handleGenderChange("female")}
                >
                  Female
                </button>
                <button
                  type="button"
                  className={formData.gender === "other" ? "active" : ""}
                  onClick={() => handleGenderChange("other")}
                >
                  Other
                </button>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                required
              ></textarea>
            </div>
          </div>

          <div className="form-submit">
            <button type="submit" className="submit-button">
              Register
            </button>
          </div>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
};

export default RegistrationForm;
