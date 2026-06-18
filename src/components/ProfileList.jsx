import React from 'react';
import { RefreshCw, Users, User, MapPin } from 'lucide-react';

export default function ProfileList({ profiles, onRefresh, isLoading }) {
  
  // Format Salary
  const formatSalary = (salary) => {
    if (!salary) return '0';
    const cleanNum = salary.replace(/[^\d]/g, '');
    return cleanNum ? Number(cleanNum).toLocaleString('en-US') : '0';
  };

  return (
    <section className="submissions-section">
      <div className="submissions-header">
        <h2>Registered Developer Profiles</h2>
        <button 
          id="refreshBtn" 
          className={`btn btn-secondary btn-icon-only ${isLoading ? 'loading-spin' : ''}`} 
          onClick={onRefresh}
          title="Refresh List"
          disabled={isLoading}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="profiles-grid" id="profilesGrid">
        {profiles.length === 0 ? (
          <div className="no-profiles-message" id="noProfilesMsg">
            <Users className="large-icon" />
            <p>No profiles loaded. Connect your Spring Boot backend to fetch data!</p>
          </div>
        ) : (
          profiles.map((profile) => {
            const skillsList = profile.primarySkills
              ? profile.primarySkills.split(',').slice(0, 3).map(s => s.trim())
              : [];

            return (
              <div key={profile.id} className="mini-dev-card">
                <div className="mini-card-header">
                  <div className="mini-avatar">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={`${profile.firstName}'s avatar`} />
                    ) : (
                      <User className="card-avatar-icon" style={{ width: '20px', height: '20px' }} />
                    )}
                  </div>
                  
                  <div className="mini-title-area">
                    <h5>{profile.firstName} {profile.lastName}</h5>
                    <p>{profile.jobTitle || 'Developer'}</p>
                  </div>
                  
                  {profile.experienceLevel && (
                    <span className="mini-badge">{profile.experienceLevel}</span>
                  )}
                </div>

                <p className="mini-card-body">{profile.bio || 'No details provided.'}</p>
                
                <div className="card-skills">
                  {skillsList.length > 0 ? (
                    skillsList.map((skill, idx) => (
                      <span key={idx} className="skill-pill">{skill}</span>
                    ))
                  ) : (
                    <span className="skill-pill-placeholder">No skills listed</span>
                  )}
                </div>

                <div className="mini-card-footer">
                  <span>
                    <MapPin style={{ width: '12px', height: '12px', verticalAlign: 'middle', marginRight: '3px' }} />
                    {profile.workMode || 'Remote'}
                  </span>
                  <span>${formatSalary(profile.expectedSalary)} / Year</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
