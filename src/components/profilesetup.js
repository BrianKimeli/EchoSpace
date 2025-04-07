import React, { useState, useContext } from 'react';
import './profilesetup.css';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, UserCircle, X, ChevronRight, Check, Upload } from 'lucide-react';
import { UserContext } from '../contexts/UserContext'; // Make sure path is correct

const ProfileSetup = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    profilePicture: null,
    bio: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const totalSteps = 5;

  const { currentUser, updateUserData, fetchUserData } = useContext(UserContext);
    console.log("ProfileSetup: Context functions available:", {
      hasCurrentUser: !!currentUser,
      hasUpdateUserData: typeof updateUserData === 'function',
      hasFetchUserData: typeof fetchUserData === 'function'
    });
  // Check if context is properly loaded
  console.log("Context loaded:", !!updateUserData);

  const handleCompleteProfile = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('location', formData.location);
    if (formData.profilePicture instanceof File) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    } else if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture); // If it's already a URL
    }
    
    try {
      console.log("Starting profile update...");
      
      // Debug: Check what's available in context
      if (typeof updateUserData !== 'function') {
        console.error("updateUserData is not a function:", updateUserData);
        alert("Error: Unable to update profile due to missing context function");
        return;
      }
      
      // Handle file upload separately if needed
      let finalData = { ...formData };
      
      // If profile picture is a File object, we need to upload it first
      if (formData.profilePicture instanceof File) {
        const formDataForFile = new FormData();
        formDataForFile.append('profilePicture', formData.profilePicture);
        
        try {
          const uploadResponse = await fetch('http://localhost:5000/api/users/upload-profile-picture', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formDataForFile
          });
          
          if (uploadResponse.ok) {
            const { profilePictureUrl } = await uploadResponse.json();
            finalData.profilePicture = profilePictureUrl;
          } else {
            console.error('Failed to upload profile picture');
            // Use default if upload fails
            finalData.profilePicture = '/avatar.png';
          }
        } catch (uploadError) {
          console.error('Profile picture upload failed:', uploadError);
          finalData.profilePicture = '/avatar.png';
        }
      } else if (formData.profilePicture === 'default') {
        finalData.profilePicture = '/avatar.png';
      }
      
      // Update user data through context
      console.log("Updating user data with:", finalData);
      const updated = await updateUserData(finalData);
      
      if (updated) {
        console.log("Profile updated successfully");
        if (onComplete) onComplete(finalData);
        navigate('/home');
      } else {
        console.error("Profile update returned false");
        alert("There was a problem updating your profile. Please try again.");
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      alert("Failed to update profile: " + error.message);
    }
  };
  
  const handleNext = () => {
    if (currentStep === 2) {
      // Validate username
      if (!formData.username.trim()) {
        setErrors({ username: 'Username is required' });
        return;
      }
      // API call for username uniqueness can go here if needed.
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step reached: complete profile setup
      handleCompleteProfile();
    }
  };

  const handleSkip = () => {
    if (currentStep === 3) {
      // Skip profile picture - use default value
      setFormData({ ...formData, profilePicture: 'default' });
    } else if (currentStep === 5) {
      // Skip location (set to empty string)
      setFormData({ ...formData, location: '' });
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step reached: complete profile setup
      handleCompleteProfile();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="setup-step welcome-step">
            <div className="step-icon-container">
              <UserCircle size={80} className="step-icon" />
            </div>
            <h2>Let's finish setting up your profile</h2>
            <p>Just a few more steps to complete your profile. This will help others connect with you!</p>
            <div className="button-container">
              <button className="primary-button" onClick={handleNext}>
                Get Started <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="setup-step username-step">
            <h2>Choose a unique username</h2>
            <p>Your username is how others will find you on the platform.</p>
            <div className="input-container">
              <div className="input-wrapper">
                <span className="input-prefix">@</span>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  placeholder="username"
                  className={errors.username ? 'error' : ''}
                />
              </div>
              {errors.username && <p className="error-message">{errors.username}</p>}
              {formData.username && !errors.username && (
                <p className="username-available">
                  <Check size={16} className="check-icon" /> Username is available
                </p>
              )}
            </div>
            <div className="username-tips">
              <h4>Tips for a good username:</h4>
              <ul>
                <li>Use letters, numbers, and underscores</li>
                <li>Make it memorable</li>
                <li>Keep it professional if you'll use this for work</li>
              </ul>
            </div>
            <div className="button-container">
              <button className="primary-button" onClick={handleNext}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="setup-step profile-picture-step">
            <h2>Add a profile picture</h2>
            <p>Add a photo to help others recognize you.</p>
            
            <div className="profile-picture-upload">
              <div className="profile-picture-preview">
                {previewImage ? (
                  <img src={previewImage} alt="Profile Preview" />
                ) : (
                  <Camera size={40} className="camera-icon" />
                )}
              </div>
              
              <label className="upload-button" htmlFor="profile-picture-input">
                <Upload size={16} /> Choose Photo
              </label>
              <input 
                id="profile-picture-input" 
                type="file" 
                accept="image/*" 
                onChange={handleProfilePictureUpload} 
                hidden 
              />
            </div>
            
            <div className="button-container dual-buttons">
              <button className="secondary-button skip-button" onClick={handleSkip}>
                Skip for now
              </button>
              <button 
                className="primary-button" 
                onClick={handleNext}
                disabled={!previewImage && !formData.profilePicture}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="setup-step bio-step">
            <h2>Tell us about yourself</h2>
            <p>Share a brief bio to help others get to know you.</p>
            
            <div className="input-container">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short bio..."
                rows={5}
                maxLength={160}
              />
              <div className="character-count">
                {formData.bio.length}/160 characters
              </div>
            </div>
            
            <div className="bio-tips">
              <h4>Tips for a great bio:</h4>
              <ul>
                <li>Keep it brief and to the point</li>
                <li>Share your interests or expertise</li>
                <li>Show your personality</li>
              </ul>
            </div>
            
            <div className="button-container">
              <button className="primary-button" onClick={handleNext}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="setup-step location-step">
            <h2>Where are you located?</h2>
            <p>Share your location to connect with people nearby.</p>
            
            <div className="input-container">
              <div className="location-input-wrapper">
                <MapPin size={20} className="location-icon" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>
            </div>
            
            <div className="location-privacy-note">
              <p>Your location will be visible on your profile. You can change this later in your privacy settings.</p>
            </div>
            
            <div className="button-container dual-buttons">
              <button className="secondary-button skip-button" onClick={handleSkip}>
                Skip for now
              </button>
              <button 
                className="primary-button" 
                onClick={handleNext}
                disabled={!formData.location && formData.location !== ''}
              >
                Finish <Check size={16} />
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-overlay">
        <div className="profile-setup-modal">
          <div className="setup-progress">
            <div className="progress-steps">
              {[...Array(totalSteps)].map((_, index) => (
                <div 
                  key={index}
                  className={`progress-step ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}`}
                />
              ))}
            </div>
            <span className="progress-text">Step {currentStep} of {totalSteps}</span>
          </div>
          
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;