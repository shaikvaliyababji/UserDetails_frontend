import React from 'react';
import { MapPin, CreditCard, Clock, User } from 'lucide-react';

export default function ProfileCard({ formData }) {
  const {
    firstName,
    lastName,
    avatar,
    jobTitle,
    experienceLevel,
    primarySkills,
    bio,
    workMode,
    expectedSalary,
    availableFrom
  } = formData;

  const fullName = (firstName || lastName) ? `${firstName} ${lastName}` : 'Your Name';
  const roleName = jobTitle || 'Professional Role';
  const seniority = experienceLevel || 'Seniority';
  const bioSummary = bio || 'Your short biography and goals will appear here as you type them in the wizard.';
  
  // Format Salary
  const formattedSalary = expectedSalary 
    ? `$${Number(expectedSalary.replace(/[^\d]/g, '')).toLocaleString('en-US')} / Year` 
    : '$0 / Year';

  // Format Date
  let formattedDate = 'Immediate';
  if (availableFrom) {
    const dateObj = new Date(availableFrom);
    formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Parse Skills
  const skillsList = primarySkills
    ? primarySkills.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : [];

  return (
    <div className="developer-card" id="devCard">
      <div className="card-bg-glow"></div>
      
      <div className="card-header">
        <div className="card-avatar-wrapper">
          {avatar ? (
            <img src={avatar} alt="Avatar" />
          ) : (
            <User className="card-avatar-icon" />
          )}
        </div>
        
        <div className="card-title-area">
          <h4>{fullName}</h4>
          <p>{roleName}</p>
        </div>
        
        <span className="badge">{seniority}</span>
      </div>
      
      <div className="card-body">
        <p className="card-bio">{bioSummary}</p>
        
        <div className="card-skills">
          {skillsList.length > 0 ? (
            skillsList.map((skill, index) => (
              <span key={index} className="skill-pill">{skill}</span>
            ))
          ) : (
            <span className="skill-pill-placeholder">No skills added yet</span>
          )}
        </div>
      </div>
      
      <div className="card-footer">
        <div className="footer-meta">
          <MapPin />
          <span>{workMode}</span>
        </div>
        <div className="footer-meta">
          <CreditCard />
          <span>{formattedSalary}</span>
        </div>
        <div className="footer-meta">
          <Clock />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
