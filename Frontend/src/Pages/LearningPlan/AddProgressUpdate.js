import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import './ProgressUpdate.css';

const updateTemplates = {
  TUTORIAL_COMPLETED: {
    title: "Tutorial Completed",
    fields: ['content', 'resourcesUsed', 'completionPercentage']
  },
  SKILL_LEARNED: {
    title: "New Skills Learned",
    fields: ['content', 'skillsLearned', 'completionPercentage']
  },
  MILESTONE_REACHED: {
    title: "Milestone Reached",
    fields: ['content', 'completionPercentage']
  }
};

function AddProgressUpdate() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [learningPlan, setLearningPlan] = useState(null);
  const [formData, setFormData] = useState({
    learningPlanId: planId,
    userId: localStorage.getItem('userID'),
    content: '',
    updateType: 'TUTORIAL_COMPLETED',
    totalSteps: 5,
    completedSteps: 0,
    skillsLearned: [],
    resourcesUsed: '',
    milestones: [false, false, false, false, false]
  });

  useEffect(() => {
    // Fetch learning plan details
    const fetchPlan = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/learningPlan/${planId}`);
        setLearningPlan(response.data);
      } catch (error) {
        console.error('Error fetching learning plan:', error);
      }
    };
    fetchPlan();
  }, [planId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/progress-updates', {
        learningPlanId: planId,
        userId: localStorage.getItem('userID'),
        content: formData.content,
        updateType: formData.updateType,
        totalSteps: formData.totalSteps,
        completedSteps: formData.completedSteps,
        skillsLearned: formData.skillsLearned,
        resourcesUsed: formData.resourcesUsed,
        date: new Date().toISOString()
      });

      if (response.data) {
        alert('Progress update added successfully!');
        navigate(`/allLearningPlan`);
      }
    } catch (error) {
      console.error('Error adding progress update:', error);
      alert('Failed to add progress update. Please check your connection and try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'skillsLearned' ? value.split(',') : value
    }));
  };

  const handleMilestoneChange = (index) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = !newMilestones[index];
    const completedCount = newMilestones.filter(milestone => milestone).length;
    
    setFormData(prev => ({
      ...prev,
      milestones: newMilestones,
      completedSteps: completedCount
    }));
  };

  if (!learningPlan) return <div>Loading...</div>;

  return (
    <div className="progress-update-page">
      <NavBar />
      <div className="progress-update-container">
        <h1>Update Progress for {learningPlan.title}</h1>
        <form onSubmit={handleSubmit} className="progress-update-form">
          <div className="form-group">
            <label>Update Type</label>
            <select 
              name="updateType" 
              value={formData.updateType}
              onChange={handleChange}
            >
              {Object.entries(updateTemplates).map(([key, template]) => (
                <option key={key} value={key}>{template.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Describe your progress..."
            />
          </div>

          {formData.updateType === 'SKILL_LEARNED' && (
            <div className="form-group">
              <label>Skills Learned (comma-separated)</label>
              <input
                type="text"
                name="skillsLearned"
                value={formData.skillsLearned.join(',')}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>
          )}

          {formData.updateType === 'TUTORIAL_COMPLETED' && (
            <div className="form-group">
              <label>Resources Used</label>
              <input
                type="text"
                name="resourcesUsed"
                value={formData.resourcesUsed}
                onChange={handleChange}
                placeholder="e.g., Udemy Course, YouTube Tutorial"
              />
            </div>
          )}

          <div className="form-group">
            <label>Milestones</label>
            <div className="milestones-container">
              {[1, 2, 3, 4, 5].map((milestone, index) => (
                <div key={milestone} className="milestone-item">
                  <input
                    type="checkbox"
                    id={`milestone-${milestone}`}
                    checked={formData.milestones[index]}
                    onChange={() => handleMilestoneChange(index)}
                  />
                  <label htmlFor={`milestone-${milestone}`}>Level {milestone}</label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">Add Progress Update</button>
        </form>
      </div>
    </div>
  );
}

export default AddProgressUpdate;