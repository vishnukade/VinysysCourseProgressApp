// import React, { useState, useEffect } from 'react';
// import './AdminDashbord_css.css'; // Make sure this path is correct
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
                
//                 const responseData = await response.json(); 
//                 setGroupedLearnerData(responseData.users || []);

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
//             userName: user.username,
//             email: `${user.username}@example.com`, // Dummy email
//             ...course 
//         }))
//     );

//     // Filtered entries for the main table display based on search term
//     const filteredTableEntries = allIndividualCourseEntries.filter(entry =>
//         entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         entry.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         entry.currentModule.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // --- Calculate Summary Statistics ---
//     const totalLearners = groupedLearnerData.length; 

//     const avgProgress = allIndividualCourseEntries.length > 0
//         ? (allIndividualCourseEntries.reduce((sum, entry) => sum + entry.progress, 0) / allIndividualCourseEntries.length).toFixed(0)
//         : 0;

//     const activeCoursesCount = new Set(allIndividualCourseEntries.map(entry => entry.courseName)).size;

//     // --- Handle User Click for Modal Display ---
//     const handleUserClick = (userName) => {
//         const user = groupedLearnerData.find(u => u.username === userName);
//         if (user) {
//             setSelectedUserDetails({
//                 name: user.username,
//                 email: `${user.username}@example.com`, // Dummy email
//                 allCourses: user.courses 
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
//                         <FaHome className="icon" /> <span>Dashboard</span> {/* Added span for text */}
//                     </li>
//                     <li>
//                         <FaUsers className="icon" /> <span>Manage Learners</span>
//                     </li>
//                     <li>
//                         <FaBook className="icon" /> <span>Manage Courses</span>
//                     </li>
//                     <li>
//                         <FaCog className="icon" /> <span>Settings</span>
//                     </li>
//                 </ul>
//                 <div className="logout">
//                     <FaSignOutAlt className="icon" /> <span>Logout</span>
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
import { useNavigate } from 'react-router-dom';
import './AdminDashbord_css.css';
import { FaHome, FaUsers, FaBook, FaCog, FaSignOutAlt, FaSearch, FaTimesCircle } from 'react-icons/fa'; // Added FaTimesCircle for close button
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



const API_GATEWAY_URL = 'https://o09mpf9zbk.execute-api.us-west-2.amazonaws.com/prod/adminDashboard';

const Admin = () => {
    const [groupedLearnerData, setGroupedLearnerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const navigate = useNavigate();

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

    const allIndividualCourseEntries = groupedLearnerData.flatMap(user =>
        user.courses.map(course => ({
            userName: user.username,
            email: `${user.username}@example.com`, // Dummy email
            ...course
        }))
    );

    const filteredTableEntries = allIndividualCourseEntries.filter(entry =>
        entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.currentModule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalLearners = groupedLearnerData.length;

    const avgProgress = allIndividualCourseEntries.length > 0
        ? (allIndividualCourseEntries.reduce((sum, entry) => sum + entry.progress, 0) / allIndividualCourseEntries.length).toFixed(0)
        : 0;

    const activeCoursesCount = new Set(allIndividualCourseEntries.map(entry => entry.courseName)).size;

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

    const handleLogout = () => {
  localStorage.removeItem('currentUser');
  navigate('/');
};



    const closeModal = () => {
        setShowUserModal(false);
        setSelectedUserDetails(null);
    };


    const downloadPDF = () => {
  const sortedEntries = [...filteredTableEntries].sort((a, b) =>
    a.userName.localeCompare(b.userName)
  );

  const pdf = new jsPDF('p', 'pt');
  const margin = 40;
  const startY = 60;
  let currentY = startY;

  pdf.setFontSize(18);
  pdf.text('Admin Dashboard - Learner Progress Report', margin, currentY);
  currentY += 30;

  pdf.setFontSize(12);
  sortedEntries.forEach((entry, index) => {
    if (currentY > 750) {
      pdf.addPage();
      currentY = startY;
    }

    pdf.setFont(undefined, 'bold');
    pdf.text(`Name: `, margin, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(entry.userName, margin + 45, currentY);
    currentY += 18;

    pdf.setFont(undefined, 'bold');
    pdf.text(`Email: `, margin, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(entry.email, margin + 45, currentY);
    currentY += 18;

    pdf.setFont(undefined, 'bold');
    pdf.text(`Course: `, margin, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(entry.courseName, margin + 50, currentY);
    currentY += 18;

    pdf.setFont(undefined, 'bold');
    pdf.text(`Current Module: `, margin, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(entry.currentModule, margin + 90, currentY);
    currentY += 18;

    pdf.setFont(undefined, 'bold');
    pdf.text(`Progress: `, margin, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(`${entry.progress}%`, margin + 55, currentY);
    currentY += 30;
  });

  pdf.save('AdminDashboard_Report.pdf');
};




    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <div className="logo">
                    <h3>VINSYS Tracker</h3>
                </div>
                <ul className="sidebar-menu">
                    <li className="active">
                        <FaHome className="icon" /> <span>Dashboard</span>
                    </li>
                    
                </ul>
                <div className="logout">
                    <button onClick={handleLogout} className="icon"> <span>Logout</span> </button>
                </div>
            </div>
            <div className="main-content">
                <header className="main-header">
                    <h1>Welcome, Admin</h1>
                    <button onClick={downloadPDF} className="download-btn">
                            Download PDF Report
                    </button>
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
                    <h2>Learner Progress Overview</h2>
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by learner, course, or module..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {loading && <p className="loading-message">Loading learner data...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && filteredTableEntries.length === 0 && (
                        <p className="no-data-message">No learner data found or matches your search criteria.</p>
                    )}
                    {!loading && !error && filteredTableEntries.length > 0 && (
                        <div className="learner-table-container custom-scrollbar">
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
                                                <span>{learnerCourseEntry.progress}%</span>
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
                        <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
                            <FaTimesCircle />
                        </button>
                        <h3>Courses for {selectedUserDetails.name}</h3>
                        <p className="user-email-display">Email: {selectedUserDetails.email}</p>
                        <div className="user-courses-list">
                            <h4>In Progress Courses ({selectedUserDetails.allCourses.filter(c => c.progress < 100).length})</h4>
                            {selectedUserDetails.allCourses.filter(c => c.progress < 100).length > 0 ? (
                                <ul>
                                    {selectedUserDetails.allCourses
                                        .filter(c => c.progress < 100)
                                        .map((course, idx) => (
                                            <li key={idx} className="course-item in-progress">
                                                <strong>{course.courseName}</strong>
                                                <p>Module: {course.currentModule}</p>
                                                <p>Progress: <span className="progress-value">{course.progress}%</span></p>
                                                <p>Hours Spent: {course.hoursSpent} hours</p>
                                                <p>Notes: {course.notes || 'No notes provided.'}</p>
                                                <p className="last-updated">Last updated: {new Date(course.updatedAt).toLocaleString()}</p>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p className="no-courses-message">No courses currently in progress for this user.</p>
                            )}

                            <h4>Completed Courses ({selectedUserDetails.allCourses.filter(c => c.progress === 100).length})</h4>
                            {selectedUserDetails.allCourses.filter(c => c.progress === 100).length > 0 ? (
                                <ul>
                                    {selectedUserDetails.allCourses
                                        .filter(c => c.progress === 100)
                                        .map((course, idx) => (
                                            <li key={idx} className="course-item completed">
                                                <strong>{course.courseName}</strong>
                                                <p>Completed on: {course.date ? new Date(course.date).toLocaleDateString() : 'N/A'}</p>
                                                <p>Hours Spent: {course.hoursSpent} hours</p>
                                                <p>Notes: {course.notes || 'No notes provided.'}</p>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p className="no-courses-message">No completed courses for this user.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>

        
    );
};

export default Admin;