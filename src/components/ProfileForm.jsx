import React, { useState } from 'react';
import { User, UploadCloud, Mail, Phone, Briefcase, TrendingUp, Code, Home, Shuffle, Building2, DollarSign, Calendar, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

export default function ProfileForm({
  formData,
  setFormData,
  currentStep,
  setCurrentStep,
  onSubmit,
  isSubmitting
}) {
  const [errors, setErrors] = useState({});
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState(false);

  // Form Field change handlers
  const handleTextChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, workMode: e.target.value }));
  };

  // Avatar conversion
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Avatar size cannot exceed 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, avatar: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Form Step Validation
  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      }
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }

      const phonePattern = /^[\d\s()+-]{7,20}$/;
      if (!phonePattern.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consentChecked) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    onSubmit();
  };

  // Formatting helper
  const formatNumber = (numStr) => {
    const cleanNum = numStr.replace(/[^\d]/g, '');
    return cleanNum ? Number(cleanNum).toLocaleString('en-US') : '';
  };

  return (
    <div className="wizard-card">
      {/* Progress Tracker */}
      <div className="progress-bar-container">
        <div className="steps-indicators">
          {[
            { step: 1, label: 'Personal' },
            { step: 2, label: 'Professional' },
            { step: 3, label: 'Preferences' },
            { step: 4, label: 'Review' }
          ].map((item, idx) => (
            <React.Fragment key={item.step}>
              <div 
                className={`step-indicator ${currentStep === item.step ? 'active' : ''} ${currentStep > item.step ? 'completed' : ''}`}
                onClick={() => {
                  // Allow jumping to steps only if they have been validated
                  if (item.step < currentStep || validateStep(currentStep)) {
                    setCurrentStep(item.step);
                  }
                }}
              >
                <span className="step-num">{item.step}</span>
                <span className="step-label">{item.label}</span>
              </div>
              {idx < 3 && <div className="step-line"></div>}
            </React.Fragment>
          ))}
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} novalidate>
        
        {/* STEP 1: Personal Details */}
        {currentStep === 1 && (
          <div className="form-step">
            <div className="step-header">
              <h2>Tell us about yourself</h2>
              <p>Provide your basic contact information and upload a professional avatar.</p>
            </div>

            <div className="form-grid">
              <div className="avatar-upload-container">
                <div className="avatar-preview-wrapper" id="avatarPreviewContainer">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar Preview" id="formAvatarPreview" />
                  ) : (
                    <User className="avatar-placeholder-icon" />
                  )}
                </div>
                <div className="avatar-upload-info">
                  <label htmlFor="avatarInput" className="btn btn-secondary upload-btn">
                    <UploadCloud size={16} /> Upload Photo
                  </label>
                  <input 
                    type="file" 
                    id="avatarInput" 
                    accept="image/*" 
                    className="file-input-hidden" 
                    onChange={handleAvatarChange}
                  />
                  <span className="upload-tip">JPG, PNG up to 2MB</span>
                </div>
              </div>

              <div className={`input-group ${errors.firstName ? 'has-error' : ''}`}>
                <label htmlFor="firstName">First Name <span className="required">*</span></label>
                <div class="input-wrapper">
                  <User className="input-icon" />
                  <input 
                    type="text" 
                    id="firstName" 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={handleTextChange}
                    required 
                  />
                </div>
                {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
              </div>

              <div className={`input-group ${errors.lastName ? 'has-error' : ''}`}>
                <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input 
                    type="text" 
                    id="lastName" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={handleTextChange}
                    required 
                  />
                </div>
                {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
              </div>

              <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="john.doe@example.com" 
                    value={formData.email}
                    onChange={handleTextChange}
                    required 
                  />
                </div>
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>

              <div className={`input-group ${errors.phone ? 'has-error' : ''}`}>
                <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input 
                    type="tel" 
                    id="phone" 
                    placeholder="+1 (555) 000-0000" 
                    value={formData.phone}
                    onChange={handleTextChange}
                    required 
                  />
                </div>
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Professional Details */}
        {currentStep === 2 && (
          <div className="form-step">
            <div className="step-header">
              <h2>Professional Profile</h2>
              <p>Showcase your expertise, work experience, and core programming skills.</p>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="jobTitle">Job Title</label>
                <div className="input-wrapper">
                  <Briefcase className="input-icon" />
                  <input 
                    type="text" 
                    id="jobTitle" 
                    placeholder="e.g. Senior Fullstack Engineer"
                    value={formData.jobTitle}
                    onChange={handleTextChange}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="experienceLevel">Experience Level</label>
                <div className="input-wrapper">
                  <TrendingUp className="input-icon" />
                  <select 
                    id="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleTextChange}
                  >
                    <option value="">Select level</option>
                    <option value="Junior">Junior (0-2 years)</option>
                    <option value="Mid-level">Mid-level (2-5 years)</option>
                    <option value="Senior">Senior (5-8 years)</option>
                    <option value="Lead/Principal">Lead / Principal (8+ years)</option>
                  </select>
                </div>
              </div>

              <div className="input-group full-width">
                <label htmlFor="primarySkills">Primary Skills (Comma separated)</label>
                <div className="input-wrapper">
                  <Code className="input-icon" />
                  <input 
                    type="text" 
                    id="primarySkills" 
                    placeholder="e.g. Java, Spring Boot, React, MySQL"
                    value={formData.primarySkills}
                    onChange={handleTextChange}
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <div className="label-with-count">
                  <label htmlFor="bio">Professional Summary / Bio</label>
                  <span className="char-counter"><span>{formData.bio.length}</span>/200</span>
                </div>
                <textarea 
                  id="bio" 
                  rows="4" 
                  maxLength={200} 
                  placeholder="Briefly describe your career goals and what you build..."
                  value={formData.bio}
                  onChange={handleTextChange}
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Career Preferences */}
        {currentStep === 3 && (
          <div className="form-step">
            <div className="step-header">
              <h2>Career Preferences</h2>
              <p>Set your job expectations, preferred working style, and availability.</p>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Work Mode</label>
                <div className="work-mode-options">
                  {[
                    { value: 'Remote', icon: <Home size={18} /> },
                    { value: 'Hybrid', icon: <Shuffle size={18} /> },
                    { value: 'Onsite', icon: <Building2 size={18} /> }
                  ].map((mode) => (
                    <label key={mode.value} className="radio-card">
                      <input 
                        type="radio" 
                        name="workMode" 
                        value={mode.value} 
                        checked={formData.workMode === mode.value}
                        onChange={handleRadioChange}
                      />
                      <div className="radio-card-content">
                        {mode.icon}
                        <span>{mode.value}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="expectedSalary">Expected Annual Salary (USD)</label>
                <div className="input-wrapper">
                  <DollarSign className="input-icon" />
                  <input 
                    type="text" 
                    id="expectedSalary" 
                    placeholder="e.g. 120,000"
                    value={formData.expectedSalary}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, '');
                      setFormData((prev) => ({ ...prev, expectedSalary: val }));
                    }}
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <label htmlFor="availableFrom">Earliest Start Date</label>
                <div className="input-wrapper">
                  <Calendar className="input-icon" />
                  <input 
                    type="date" 
                    id="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleTextChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review and Submit */}
        {currentStep === 4 && (
          <div className="form-step">
            <div className="step-header">
              <h2>Review Your Information</h2>
              <p>Double-check all your onboarding details before saving to the database.</p>
            </div>

            <div className="review-container">
              <div className="review-item">
                <span className="review-label">Name</span>
                <span className="review-value">{`${formData.firstName} ${formData.lastName}`}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Email</span>
                <span className="review-value">{formData.email}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Phone</span>
                <span className="review-value">{formData.phone}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Role</span>
                <span className="review-value">{formData.jobTitle || 'Not specified'}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Experience</span>
                <span className="review-value">{formData.experienceLevel || 'Not specified'}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Skills</span>
                <span className="review-value">{formData.primarySkills || 'None added'}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Work Preference</span>
                <span className="review-value">{formData.workMode}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Expected Salary</span>
                <span className="review-value">
                  {formData.expectedSalary ? `$${formatNumber(formData.expectedSalary)} / Year` : 'Not specified'}
                </span>
              </div>
              <div className="review-item">
                <span className="review-label">Start Date</span>
                <span className="review-value">{formData.availableFrom || 'Immediate'}</span>
              </div>
            </div>

            <div className="legal-consent">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  id="consentCheckbox"
                  checked={consentChecked}
                  onChange={(e) => {
                    setConsentChecked(e.target.checked);
                    if (e.target.checked) setConsentError(false);
                  }}
                />
                <span className="checkmark"></span>
                <span className="consent-text">I confirm that all details are accurate and I consent to saving this profile.</span>
              </label>
              {consentError && <span className="error-msg">Consent is required to submit.</span>}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="form-navigation">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft size={16} /> Back
          </button>

          {currentStep < 4 ? (
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleNext}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="spin-icon" size={16} /> Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={16} /> Save Profile
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
