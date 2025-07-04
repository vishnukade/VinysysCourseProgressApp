import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {
  TrendingUp,
  Clock,
  Calendar,
  BarChart3,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import './UpdateProgress.css';

export default function ProgressEntryPage() {
  const navigate = useNavigate();

  const [coursesData, setCoursesData] = useState({});
  const [courseOptions, setCourseOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);

  const [formData, setFormData] = useState({
    courseName: '',
    currentModule: '',
    hoursSpent: '',
    progress: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState('');

  const API_URL = 'https://o09mpf9zbk.execute-api.us-west-2.amazonaws.com/prod/updateprogress';

  useEffect(() => {
    const hardcodedCourses = {
      "AWS Basics": 5,
      "React Fundamentals": 6,
      "Machine Learning": 8,
      "Quantum AI" : 10,
      "CyberSecurity" : 15
    };

    setCoursesData(hardcodedCourses);
    setCourseOptions(Object.keys(hardcodedCourses));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShowError('');

    if (name === "courseName") {
      const moduleCount = coursesData[value] || 0;
      const moduleList = Array.from({ length: moduleCount }, (_, i) => `Module ${i + 1}`);
      setModuleOptions(moduleList);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        currentModule: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    const { courseName, currentModule, hoursSpent, progress, notes } = formData;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!courseName || !currentModule || !hoursSpent || !progress) {
      setShowError('Please fill out all required fields.');
      setTimeout(() => setShowError(''), 4000);
      return;
    }

    if (!currentUser?.userId) {
      setShowError('User not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
  username: currentUser.userId,
  courseId: courseName.toLowerCase().replace(/\s+/g, '-'), // optional
  courseName: formData.courseName,
  currentModule: formData.currentModule,
  hoursSpend: Number(formData.hoursSpent),   // ✅ correct key name
  progress: Number(formData.progress),
  date: formData.date,
  notes: formData.notes
};


      const res = await axios.post(API_URL, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log("✅ Progress submitted:", res.data);
      setShowSuccess(true);
      setShowError('');
      setFormData({
        courseName: '',
        currentModule: '',
        hoursSpent: '',
        progress: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setModuleOptions([]);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/user-dashboard');
      }, 2000);

    } catch (error) {
      console.error("❌ Submission failed:", error);
      setShowError('Submission failed. Please try again.');
      setShowSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="update-progress-page">
      <div className="progress-form-container">
        {/* Left Side: Hero Panel */}
        <div className="form-hero-panel">
          <button className="back-button" onClick={() => navigate('/user-dashboard')}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <div className="hero-content">
            <BarChart3 size={60} className="hero-icon" />
            <h1>Log Your Progress</h1>
            <p>Consistency is key. Documenting your learning reinforces knowledge and keeps you on track.</p>
          </div>
          <div className="hero-footer">Powered by V-Track</div>
        </div>

        {/* Right Side: Form */}
        <div className="form-card-panel">
          {showSuccess && (
            <div className="form-message success">
              <CheckCircle size={20} />
              <span>Progress logged! Redirecting...</span>
            </div>
          )}
          {showError && (
            <div className="form-message error">
              <span>{showError}</span>
            </div>
          )}

          <div className="form-header">
            <h2>New Progress Entry</h2>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="courseName"><BookOpen size={16} /> Course Name *</label>
              <select id="courseName" name="courseName" value={formData.courseName} onChange={handleInputChange} required>
                <option value="" disabled>Select a course</option>
                {courseOptions.map(course => <option key={course} value={course}>{course}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="currentModule"><ClipboardList size={16} /> Current Module *</label>
              <select id="currentModule" name="currentModule" value={formData.currentModule} onChange={handleInputChange} disabled={!moduleOptions.length} required>
                <option value="" disabled>Select a module</option>
                {moduleOptions.map(mod => <option key={mod} value={mod}>{mod}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="hoursSpent"><Clock size={16} /> Hours Spent *</label>
              <input id="hoursSpent" type="number" name="hoursSpent" value={formData.hoursSpent} onChange={handleInputChange} placeholder="e.g., 2.5" step="0.5" required />
            </div>

            <div className="input-group">
              <label htmlFor="progress"><TrendingUp size={16} /> Progress (%) *</label>
              <input id="progress" type="number" name="progress" value={formData.progress} onChange={handleInputChange} placeholder="e.g., 75" min="0" max="100" required />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="date"><Calendar size={16} /> Date</label>
            <input id="date" type="date" name="date" value={formData.date} onChange={handleInputChange} />
          </div>

          <div className="input-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows="4" placeholder="Any breakthroughs or blockers?" />
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Add Progress Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
