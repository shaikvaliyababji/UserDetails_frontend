import React, { useState, useEffect } from 'react';
import { Layers, Sun, Moon, CheckCheck, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import ProfileForm from './components/ProfileForm';
import ProfileCard from './components/ProfileCard';
import ProfileList from './components/ProfileList';

const API_URL = 'http://localhost:8080/api';

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  avatar: '',
  jobTitle: '',
  experienceLevel: '',
  primarySkills: '',
  bio: '',
  workMode: 'Remote',
  expectedSalary: '',
  availableFrom: ''
};

export default function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [profiles, setProfiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Fetch profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  // Theme Toggle Effect
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkTheme]);

  // Toast notifier helper
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
    addToast('Theme toggled successfully!', 'info');
  };

  // REST API Actions
  const fetchProfiles = async () => {
    setIsLoadingList(true);
    try {
      const response = await fetch(`${API_URL}/details`);
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      const data = await response.json();
      // Show newest first
      setProfiles(data.reverse());
    } catch (error) {
      console.error('Fetch error:', error);
      addToast('Could not load profiles. Ensure backend is running.', 'error');
    } finally {
      // Small delay for smooth loader animation
      setTimeout(() => setIsLoadingList(false), 500);
    }
  };

  const handleSubmitProfile = async () => {
    setIsSubmitting(true);
    
    // Build payload
    const payload = {
      ...formData,
      expectedSalary: formData.expectedSalary ? formData.expectedSalary : null,
      availableFrom: formData.availableFrom ? formData.availableFrom : null
    };

    try {
      const response = await fetch(`${API_URL}/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        addToast('Profile saved successfully!', 'success');
        setShowSuccessModal(true);
        fetchProfiles(); // Reload list
      } else {
        const errText = await response.text();
        addToast(`Validation failed: ${errText}`, 'error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      addToast('Connection to backend failed. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Reset Form
    setFormData(initialFormState);
    setCurrentStep(1);
    
    // Scroll to the profiles grid list
    setTimeout(() => {
      const el = document.querySelector('.submissions-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header class="main-header">
        <div className="logo">
          <Layers className="logo-icon" />
          <span className="logo-text">DevProfile<span className="highlight">Connect</span></span>
        </div>
        <div className="theme-toggle-container">
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
            {isDarkTheme ? <Sun className="sun-icon" style={{ display: 'block', color: '#f59e0b' }} /> : <Moon className="moon-icon" style={{ display: 'block' }} />}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="workspace">
        {/* Left wizard form */}
        <section className="wizard-section">
          <ProfileForm 
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onSubmit={handleSubmitProfile}
            isSubmitting={isSubmitting}
          />
        </section>

        {/* Right card preview */}
        <section className="preview-section">
          <div className="sticky-container">
            <h3 className="section-title">Live Card Preview</h3>
            <ProfileCard formData={formData} />
          </div>
        </section>
      </main>

      {/* Submissions Section */}
      <ProfileList 
        profiles={profiles}
        onRefresh={fetchProfiles}
        isLoading={isLoadingList}
      />

      {/* Success Modal Overlay */}
      <div className={`modal-overlay ${showSuccessModal ? 'active' : ''}`}>
        <div className="modal-card">
          <div className="success-checkmark">
            <CheckCheck className="success-icon" />
          </div>
          <h2>Profile Created!</h2>
          <p>Your details have been successfully written to the MySQL database.</p>
          <button className="btn btn-primary" onClick={handleCloseModal}>
            View Registered Profiles
          </button>
        </div>
      </div>

      {/* Toast Notification Stack */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: 'pointer' }}
          >
            {toast.type === 'success' && <CheckCircle size={18} />}
            {toast.type === 'error' && <AlertTriangle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
