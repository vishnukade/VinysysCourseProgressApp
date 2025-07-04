// UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserDashboard.css';

const UserDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [myCourses, setMyCourses] = useState([]);
    const [overallProgress, setOverallProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDashboard = (userId) => {
        const API_URL = "https://o09mpf9zbk.execute-api.us-west-2.amazonaws.com/prod/user";

        axios.get(API_URL, {
            params: {
                userId,
                action: 'getDashboard'
            }
        })
        .then(response => {
            const items = response.data;
            if (!items || items.length === 0) {
                setMyCourses([]);
                setLoading(false);
                return;
            }

            let totalProgress = 0;
            const processedCourses = items.map(item => {
                const percentage = parseFloat(item.progress) || 0;
                totalProgress += percentage;
                let status = 'Not Started';
                if (percentage === 100) status = 'Completed';
                else if (percentage > 0) status = 'In Progress';

                return {
                    name: item.courseName || 'Untitled Course',
                    status,
                    progress: percentage,
                    description: item.notes || 'No description available.',
                    currentModule: item.currentModule || 'N/A',
                    hoursSpent: parseFloat(item.hoursSpent) || 0,
                    lastUpdated: item.updatedAt || new Date().toISOString()
                };
            });

            setMyCourses(processedCourses);
            setOverallProgress(
                processedCourses.length > 0
                    ? Math.round(totalProgress / processedCourses.length)
                    : 0
            );
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching dashboard:", error);
            setLoading(false);
        });
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        let currentUser;
        if (!storedUser) {
            currentUser = { userId: "alice", username: "Alice" }; // Default user for demo
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        } else {
            try {
                currentUser = JSON.parse(storedUser);
            } catch (err) {
                localStorage.removeItem("currentUser");
                navigate('/user-login');
                return;
            }
        }

        if (!currentUser || !currentUser.userId) {
            navigate('/user-login');
            return;
        }

        setUser(currentUser);
        fetchDashboard(currentUser.userId);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const handleUpdateProgress = () => {
        navigate('/progress-update');
    };

    const getUserInitials = (userName) => {
        if (!userName) return 'U';
        const parts = userName.split(' ');
        return parts.length > 1
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : userName.substring(0, 2).toUpperCase();
    };

    return (
        <div className="user-dashboard-container">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    
                    <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>&times;</button>
                </div>
                <nav className="sidebar-menu">
                    <ul>
                        <li><a href="#dashboard" className="active"><span>📊</span>Dashboard</a></li>
                        <li><button onClick={handleLogout} className="logout-button"><span>🚪</span>Logout</button></li>
                    </ul>
                </nav>
                
            </aside>

            <div className="dashboard-content">
                <header className="dashboard-header">
                    <button onClick={() => setIsSidebarOpen(true)} className="menu-toggle">☰</button>
                    <div className="user-info">
                        <span>Welcome back, <strong>{user?.username || 'Learner'}!</strong></span>
                        <div className="avatar" title={user?.username || 'User'}>
                            {getUserInitials(user?.username)}
                        </div>
                    </div>
                </header>

                <main className="dashboard-main-grid">
                    {loading ? (
                        <div className="loading-text">Loading your dashboard...</div>
                    ) : (
                        <>
                            <section className="dashboard-section welcome-card">
                                <h2>Your Learning Journey</h2>
                                <p>Awesome progress this week! Let's keep the momentum going.</p>
                            </section>

                            <section className="dashboard-section progress-summary-card">
                                <h3>Overall Progress</h3>
                                <div className="progress-bar-container">
                                    <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
                                </div>
                                <div className="progress-label">
                                    <span>{overallProgress}% Complete</span>
                                    <p>Keep it up!</p>
                                </div>
                            </section>

                            <section className="dashboard-section my-courses-container">
                                <div className="section-header">
                                    <h3>Your Enrolled Courses</h3>
                                    {myCourses.length > 0 && (
                                        <button onClick={handleUpdateProgress} className="update-button">Update Progress</button>
                                    )}
                                </div>
                                <div className="course-grid">
                                    {myCourses.length > 0 ? (
                                        myCourses.map((course, index) => (
                                            <div key={index} className="course-card">
                                                <div className="course-card-header">
                                                    <h4>{course.name}</h4>
                                                    <span className={`status-badge status-${course.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                        {course.status}
                                                    </span>
                                                </div>
                                                <p className="course-desc">{course.description}</p>
                                                <div className="course-details">
                                                    <p><strong>Module:</strong> {course.currentModule}</p>
                                                    <p><strong>Time:</strong> {course.hoursSpent} hrs</p>
                                                </div>
                                                <div className="progress-wrap">
                                                    <div className="progress-bar">
                                                        <div className="fill" style={{ width: `${course.progress}%` }}></div>
                                                    </div>
                                                    <span className="progress-percentage">{course.progress}%</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-courses-card">
                                            <p>You haven't enrolled in any courses yet.</p>
                                            <button className="update-button">Explore Courses</button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;