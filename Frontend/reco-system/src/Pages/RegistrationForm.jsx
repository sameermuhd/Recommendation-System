import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrationForm.css";
import Header from "../Components/Header";
import FooterComponent from "../Components/FooterComponent";
import { getSession, clearSession } from "../utils/SessionUtils";
import { useAlert } from "../Components/CustomAlert";
import { storeSession } from "../utils/SessionUtils";

const RegistrationForm = ({ isViewMode = false }) => {
  const { showAlert } = useAlert();
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const navigate = useNavigate();
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

  // Fetch user data when in view mode
  useEffect(() => {
    if (isViewMode && !isEditMode) {
      const user = getSession();
      if (user) {
        setFormData({
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phoneNumber: user.phone_number,
          password: "dummyPassword890",
          confirmPassword: "dummyPassword890",
          birthday: new Date(user.birthday).toISOString().slice(0, 10),
          gender: user.gender,
          address: user.address,
        });
      }
    }
  }, [isViewMode, isEditMode]);

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
      showAlert(
        "Please fill out all fields correctly.",
        "OK!",
        () => {},
        "warning",
        true
      );
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
      const response = await fetch("http://127.0.0.1:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        showAlert(
          "Registration successful, please login.",
          "OK!",
          () => {
            navigate("/login");
          },
          "success",
          true
        );
      } else {
        const errorData = await response.json();
        showAlert(
          `Error: ${errorData.message || "Registration failed."}`,
          "Try again!",
          () => {},
          "error",
          true
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
      showAlert(
        "An error occurred while registering. Please try again.",
        "Try again!",
        () => {},
        "error",
        true
      );
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

  const handleEdit = () => {
    setOriginalData(formData); // Save current data as original
    setIsEditMode(true); // Enable edit mode
  };

  const handleUpdate = () => {
    // Define the mapping of frontend keys to backend keys
    const keyMapping = {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      phoneNumber: "phone_number",
      password: "password",
      birthday: "birthday",
      gender: "gender",
      address: "address",
    };

    // Filter and prepare the edited fields
    const editedFields = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== originalData[key]) {
        let value = formData[key];

        // Convert specific fields to numbers if necessary
        if (key === "phoneNumber") {
          value = parseInt(value, 10); // Ensure it's a number
        }

        // Map the frontend key to the backend key
        const backendKey = keyMapping[key] || key; // Default to original key if not mapped
        acc[backendKey] = value;
      }
      return acc;
    }, {});

    // Now you can send only the `editedFields` in the API request
    console.log("Edited fields:", editedFields);

    // Example API request
    fetch(`http://localhost:3000/user/edit/${getSession().id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedFields),
    })
      .then((response) => {
        if (response.ok) {
          showAlert(
            "Edit successful! Please log in again to continue.",
            "OK!",
            () => {
              clearSession(); // Clear the session
              navigate("/login"); // Redirect to the login page
            },
            "success",
            true
          );
        } else {
          showAlert(
            "Failed to update user information.",
            "Try again!",
            () => {},
            "error",
            true
          );
        }
      })
      .catch((error) => {
        console.error("Error updating user information:", error);
        showAlert(
          "An error occurred. Please try again.",
          "Try again!",
          () => {},
          "error",
          true
        );
      });
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
                readOnly={isViewMode && !isEditMode}
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
                readOnly={isViewMode && !isEditMode}
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
                readOnly={isViewMode && !isEditMode}
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
                readOnly={isViewMode && !isEditMode}
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
                readOnly={isViewMode && !isEditMode}
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
                readOnly={isViewMode && !isEditMode}
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
                readOnly={isViewMode && !isEditMode}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <div className="gender-toggle">
                <button
                  type="button"
                  className={formData.gender === "male" ? "active" : ""}
                  onClick={() => handleGenderChange("male")}
                  disabled={isViewMode && !isEditMode}
                >
                  Male
                </button>
                <button
                  type="button"
                  className={formData.gender === "female" ? "active" : ""}
                  onClick={() => handleGenderChange("female")}
                  disabled={isViewMode && !isEditMode}
                >
                  Female
                </button>
                <button
                  type="button"
                  className={formData.gender === "other" ? "active" : ""}
                  onClick={() => handleGenderChange("other")}
                  disabled={isViewMode && !isEditMode}
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
                readOnly={isViewMode && !isEditMode}
              ></textarea>
            </div>
          </div>

          <div className="form-submit">
            {!isViewMode && !isEditMode ? (
              // Register Mode
              <button type="submit" className="submit-button">
                Register
              </button>
            ) : isEditMode ? (
              // Edit Mode
              <div className="edit-mode-buttons">
                <button
                  type="button"
                  className="update-button"
                  onClick={handleUpdate}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              // View Mode
              <div className="view-mode-buttons">
                <button
                  type="button"
                  className="edit-button"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="logout-button"
                  onClick={() => {
                    clearSession();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </button>
                <button
                  type="button"
                  className="delete-account-button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete your account?"
                      )
                    ) {
                      fetch(
                        `http://localhost:3000/user/delete/${getSession().id}`,
                        {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      )
                        .then((response) => {
                          if (response.ok) {
                            showAlert(
                              "Account deleted successfully.",
                              "OK!",
                              () => navigate("/"),
                              "success",
                              true
                            );
                            clearSession();
                          } else {
                            showAlert(
                              "Failed to delete account.",
                              "Try again!",
                              () => {},
                              "error",
                              true
                            );
                          }
                        })
                        .catch((error) => console.error("Error:", error));
                    }
                  }}
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
};

export default RegistrationForm;
