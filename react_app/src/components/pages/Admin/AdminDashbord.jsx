// import React, { useState, useEffect } from 'react';
// import './AdminDashbord_css.css';
// import { FaHome, FaUsers, FaBook, FaCog, FaSignOutAlt, FaSearch } from 'react-icons/fa';

// // IMPORTANT: Replace with your actual API Gateway Invoke URL
// const API_GATEWAY_URL = 'https://o09mpf9zbk.execute-api.us-west-2.amazonaws.com/prod/adminDashboard';

// const Admin = () => {
//     // State to store the fetched data in the new grouped format: [{ username: "...", courses: [...] }]
//     const [groupedLearnerData, setGroupedLearnerData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showUserModal, setShowUserModal] = useState(false);
//     const [selectedUserDetails, setSelectedUserDetails] = useState(null); // Stores details for the modal

//     useEffect(() => {
//         const fetchLearnerData = async () => {
//             try {
//                 const response = await fetch(API_GATEWAY_URL);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
                
//                 // --- MODIFICATION STARTS HERE ---
//                 // In your specific case, 'data' itself is likely the parsed JSON.
//                 // So, we don't need to access 'data.body' or parse it again.
//                 const responseData = await response.json(); 
                
//                 // Now, 'responseData' directly contains:
//                 // { "message": "All user progress", "users": [...] }
                
//                 // So, you directly use responseData.users
//                 setGroupedLearnerData(responseData.users || []);
//                 // --- MODIFICATION ENDS HERE ---

//             } catch (err) {
//                 setError("Failed to fetch learner data: " + err.message);
//                 console.error("Fetch error:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLearnerData();
//     }, []);

//     // --- Derived states for dashboard display and filtering ---

//     // Flattened list of all individual course entries for the main table
//     const allIndividualCourseEntries = groupedLearnerData.flatMap(user =>
//         user.courses.map(course => ({
//             userName: user.username, // Use 'username' from the new structure
//             email: `${user.username}@example.com`, // Dummy email
//             ...course // Spread the course details
//         }))
//     );

//     // Filtered entries for the main table display based on search term
//     const filteredTableEntries = allIndividualCourseEntries.filter(entry =>
//         entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         entry.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         entry.currentModule.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // --- Calculate Summary Statistics ---
//     const totalLearners = groupedLearnerData.length; // Each object in groupedLearnerData is a unique user

//     const avgProgress = allIndividualCourseEntries.length > 0
//         ? (allIndividualCourseEntries.reduce((sum, entry) => sum + entry.progress, 0) / allIndividualCourseEntries.length).toFixed(0)
//         : 0;

//     const activeCoursesCount = new Set(allIndividualCourseEntries.map(entry => entry.courseName)).size;

//     // --- Handle User Click for Modal Display ---
//     const handleUserClick = (userName) => {
//         // Find the user details directly from the groupedLearnerData
//         const user = groupedLearnerData.find(u => u.username === userName);
//         if (user) {
//             setSelectedUserDetails({
//                 name: user.username,
//                 email: `${user.username}@example.com`, // Dummy email
//                 allCourses: user.courses // The courses array is directly available
//             });
//             setShowUserModal(true);
//         }
//     };

//     const closeModal = () => {
//         setShowUserModal(false);
//         setSelectedUserDetails(null);
//     };

//     return (
//         <div className="admin-dashboard">
//             <div className="sidebar">
//                 <div className="logo">
//                     <h3>VINSYS Tracker</h3>
//                 </div>
//                 <ul className="sidebar-menu">
//                     <li className="active">
//                         <FaHome className="icon" /> Dashboard
//                     </li>
//                     <li>
//                         <FaUsers className="icon" /> Manage Learners
//                     </li>
//                     <li>
//                         <FaBook className="icon" /> Manage Courses
//                     </li>
//                     <li>
//                         <FaCog className="icon" /> Settings
//                     </li>
//                 </ul>
//                 <div className="logout">
//                     <FaSignOutAlt className="icon" /> Logout
//                 </div>
//             </div>
//             <div className="main-content">
//                 <header className="main-header">
//                     <h1>Welcome, Admin</h1>
//                 </header>
//                 <div className="summary-cards">
//                     <div className="card">
//                         <p className="card-label">Total Learners</p>
//                         <p className="card-value">{totalLearners}</p>
//                     </div>
//                     <div className="card">
//                         <p className="card-label">Avg. Course Completion</p>
//                         <p className="card-value">{avgProgress}%</p>
//                     </div>
//                     <div className="card">
//                         <p className="card-label">Active Courses</p>
//                         <p className="card-value">{activeCoursesCount}</p>
//                     </div>
//                 </div>

//                 <div className="learner-progress-section">
//                     <h2>Learner Progress</h2>
//                     <div className="search-bar">
//                         <FaSearch className="search-icon" />
//                         <input
//                             type="text"
//                             placeholder="Search by name, course, or module..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                     {loading && <p>Loading learner data...</p>}
//                     {error && <p className="error-message">{error}</p>}
//                     {!loading && !error && filteredTableEntries.length === 0 && (
//                         <p>No learner data found or matches your search.</p>
//                     )}
//                     {!loading && !error && filteredTableEntries.length > 0 && (
//                         <div className="learner-table-container">
//                             <table className="learner-table">
//                                 <thead>
//                                     <tr>
//                                         <th>Name</th>
//                                         <th>Email</th>
//                                         <th>Course</th>
//                                         <th>Current Module</th>
//                                         <th>Progress</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredTableEntries.map((learnerCourseEntry, index) => (
//                                         <tr
//                                             key={`${learnerCourseEntry.userName}-${learnerCourseEntry.courseIdentifier}-${index}`}
//                                             onClick={() => handleUserClick(learnerCourseEntry.userName)}
//                                             className="learner-row-clickable"
//                                         >
//                                             <td>{learnerCourseEntry.userName}</td>
//                                             <td>{learnerCourseEntry.email}</td>
//                                             <td>{learnerCourseEntry.courseName}</td>
//                                             <td>{learnerCourseEntry.currentModule}</td>
//                                             <td className="progress-cell">
//                                                 <div className="progress-bar-wrapper">
//                                                     <div className="progress-bar" style={{ width: `${learnerCourseEntry.progress}%` }}></div>
//                                                 </div>
//                                                 <span>{learnerCourseEntry.progress}</span>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* User Details Modal */}
//             {showUserModal && selectedUserDetails && (
//                 <div className="modal-overlay" onClick={closeModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <h3>Courses for {selectedUserDetails.name}</h3>
//                         <p>Email: {selectedUserDetails.email}</p>
//                         <div className="user-courses-list">
//                             <h4>In Progress Courses ({selectedUserDetails.allCourses.filter(c => c.progress < 100).length})</h4>
//                             {selectedUserDetails.allCourses.filter(c => c.progress < 100).length > 0 ? (
//                                 <ul>
//                                     {selectedUserDetails.allCourses
//                                         .filter(c => c.progress < 100)
//                                         .map((course, idx) => (
//                                             <li key={idx}>
//                                                 <strong>{course.courseName}</strong> (Module: {course.currentModule}, Progress: {course.progress}%)
//                                                 <p>Hours Spent: {course.hoursSpent} hours</p>
//                                                 <p>Notes: {course.notes || 'No notes provided.'}</p>
//                                                 <p className="last-updated">Last updated: {new Date(course.updatedAt).toLocaleString()}</p>
//                                             </li>
//                                         ))}
//                                 </ul>
//                             ) : (
//                                 <p>No courses currently in progress for this user.</p>
//                             )}

//                             <h4>Completed Courses ({selectedUserDetails.allCourses.filter(c => c.progress === 100).length})</h4>
//                             {selectedUserDetails.allCourses.filter(c => c.progress === 100).length > 0 ? (
//                                 <ul>
//                                     {selectedUserDetails.allCourses
//                                         .filter(c => c.progress === 100)
//                                         .map((course, idx) => (
//                                             <li key={idx}>
//                                                 <strong>{course.courseName}</strong> (Completed on: {course.date || 'N/A'})
//                                                 <p>Hours Spent: {course.hoursSpent} hours</p>
//                                                 <p>Notes: {course.notes || 'No notes provided.'}</p>
//                                             </li>
//                                         ))}
//                                 </ul>
//                             ) : (
//                                 <p>No completed courses for this user.</p>
//                             )}
//                         </div>
//                         <button onClick={closeModal} className="close-modal-btn">Close</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Admin;

import React, { useState, useEffect } from 'react';
import './AdminDashbord_css.css'; // Make sure this path is correct
import { FaHome, FaUsers, FaBook, FaCog, FaSignOutAlt, FaSearch } from 'react-icons/fa';

// IMPORTANT: Replace with your actual API Gateway Invoke URL
const API_GATEWAY_URL = 'https://o09mpf9zbk.execute-api.us-west-2.amazonaws.com/prod/adminDashboard';

const Admin = () => {
    // State to store the fetched data in the new grouped format: [{ username: "...", courses: [...] }]
    const [groupedLearnerData, setGroupedLearnerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null); // Stores details for the modal

    useEffect(() => {
        const fetchLearnerData = async () => {
            try {
                const response = await fetch(API_GATEWAY_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const responseData = await response.json(); 
                setGroupedLearnerData(responseData.users || []);

            } catch (err) {
                setError("Failed to fetch learner data: " + err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLearnerData();
    }, []);

    // --- Derived states for dashboard display and filtering ---

    // Flattened list of all individual course entries for the main table
    const allIndividualCourseEntries = groupedLearnerData.flatMap(user =>
        user.courses.map(course => ({
            userName: user.username,
            email: `${user.username}@example.com`, // Dummy email
            ...course 
        }))
    );

    // Filtered entries for the main table display based on search term
    const filteredTableEntries = allIndividualCourseEntries.filter(entry =>
        entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.currentModule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Calculate Summary Statistics ---
    const totalLearners = groupedLearnerData.length; 

    const avgProgress = allIndividualCourseEntries.length > 0
        ? (allIndividualCourseEntries.reduce((sum, entry) => sum + entry.progress, 0) / allIndividualCourseEntries.length).toFixed(0)
        : 0;

    const activeCoursesCount = new Set(allIndividualCourseEntries.map(entry => entry.courseName)).size;

    // --- Handle User Click for Modal Display ---
    const handleUserClick = (userName) => {
        const user = groupedLearnerData.find(u => u.username === userName);
        if (user) {
            setSelectedUserDetails({
                name: user.username,
                email: `${user.username}@example.com`, // Dummy email
                allCourses: user.courses 
            });
            setShowUserModal(true);
        }
    };

    const closeModal = () => {
        setShowUserModal(false);
        setSelectedUserDetails(null);
    };

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <div className="logo">
                    <h3>VINSYS Tracker</h3>
                </div>
                <ul className="sidebar-menu">
                    <li className="active">
                        <FaHome className="icon" /> <span>Dashboard</span> {/* Added span for text */}
                    </li>
                    <li>
                        <FaUsers className="icon" /> <span>Manage Learners</span>
                    </li>
                    <li>
                        <FaBook className="icon" /> <span>Manage Courses</span>
                    </li>
                    <li>
                        <FaCog className="icon" /> <span>Settings</span>
                    </li>
                </ul>
                <div className="logout">
                    <FaSignOutAlt className="icon" /> <span>Logout</span>
                </div>
            </div>
            <div className="main-content">
                <header className="main-header">
                    <h1>Welcome, Admin</h1>
                </header>
                <div className="summary-cards">
                    <div className="card">
                        <p className="card-label">Total Learners</p>
                        <p className="card-value">{totalLearners}</p>
                    </div>
                    <div className="card">
                        <p className="card-label">Avg. Course Completion</p>
                        <p className="card-value">{avgProgress}%</p>
                    </div>
                    <div className="card">
                        <p className="card-label">Active Courses</p>
                        <p className="card-value">{activeCoursesCount}</p>
                    </div>
                </div>

                <div className="learner-progress-section">
                    <h2>Learner Progress</h2>
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, course, or module..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {loading && <p>Loading learner data...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && filteredTableEntries.length === 0 && (
                        <p>No learner data found or matches your search.</p>
                    )}
                    {!loading && !error && filteredTableEntries.length > 0 && (
                        <div className="learner-table-container">
                            <table className="learner-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Course</th>
                                        <th>Current Module</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTableEntries.map((learnerCourseEntry, index) => (
                                        <tr
                                            key={`${learnerCourseEntry.userName}-${learnerCourseEntry.courseIdentifier}-${index}`}
                                            onClick={() => handleUserClick(learnerCourseEntry.userName)}
                                            className="learner-row-clickable"
                                        >
                                            <td>{learnerCourseEntry.userName}</td>
                                            <td>{learnerCourseEntry.email}</td>
                                            <td>{learnerCourseEntry.courseName}</td>
                                            <td>{learnerCourseEntry.currentModule}</td>
                                            <td className="progress-cell">
                                                <div className="progress-bar-wrapper">
                                                    <div className="progress-bar" style={{ width: `${learnerCourseEntry.progress}%` }}></div>
                                                </div>
                                                <span>{learnerCourseEntry.progress}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* User Details Modal */}
            {showUserModal && selectedUserDetails && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Courses for {selectedUserDetails.name}</h3>
                        <p>Email: {selectedUserDetails.email}</p>
                        <div className="user-courses-list">
                            <h4>In Progress Courses ({selectedUserDetails.allCourses.filter(c => c.progress < 100).length})</h4>
                            {selectedUserDetails.allCourses.filter(c => c.progress < 100).length > 0 ? (
                                <ul>
                                    {selectedUserDetails.allCourses
                                        .filter(c => c.progress < 100)
                                        .map((course, idx) => (
                                            <li key={idx}>
                                                <strong>{course.courseName}</strong> (Module: {course.currentModule}, Progress: {course.progress}%)
                                                <p>Hours Spent: {course.hoursSpent} hours</p>
                                                <p>Notes: {course.notes || 'No notes provided.'}</p>
                                                <p className="last-updated">Last updated: {new Date(course.updatedAt).toLocaleString()}</p>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p>No courses currently in progress for this user.</p>
                            )}

                            <h4>Completed Courses ({selectedUserDetails.allCourses.filter(c => c.progress === 100).length})</h4>
                            {selectedUserDetails.allCourses.filter(c => c.progress === 100).length > 0 ? (
                                <ul>
                                    {selectedUserDetails.allCourses
                                        .filter(c => c.progress === 100)
                                        .map((course, idx) => (
                                            <li key={idx}>
                                                <strong>{course.courseName}</strong> (Completed on: {course.date || 'N/A'})
                                                <p>Hours Spent: {course.hoursSpent} hours</p>
                                                <p>Notes: {course.notes || 'No notes provided.'}</p>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p>No completed courses for this user.</p>
                            )}
                        </div>
                        <button onClick={closeModal} className="close-modal-btn">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;