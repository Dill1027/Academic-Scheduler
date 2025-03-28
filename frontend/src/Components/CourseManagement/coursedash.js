import { useState } from "react";
import Header from "../Navbar/Header";
import Footer from "../Navbar/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import './coursed.css';
import AddDoc from "../CourseManagement/AddDoc"; // Import your AddDoc component
import { Link } from "react-router-dom";

function Coursed() {
  const [showAddDocModal, setShowAddDocModal] = useState(false);

  return (
    <div className="main_function">
      <div>
        <div>
          <Header />
          
          <div style={{ marginTop: "20px", padding: '125px' }}>
            <div className="p1">
              <Link to="/StudentCourse" style={{ textDecoration: 'none', color: 'white' }}>
                <h3 className="title">Module Allocation for Students</h3>
              </Link>
            </div>

            {/* Course Requirements Section - Now triggers modal */}
            <div className="p1 mt-5" onClick={() => setShowAddDocModal(true)} style={{ cursor: 'pointer' }}>
              <h3 className="title">Uploading Course Requirements</h3>
            </div>

            {/* Modal for AddDoc */}
            {showAddDocModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <button 
                    className="close-button" 
                    onClick={() => setShowAddDocModal(false)}
                  >
                    ×
                  </button>
                  <AddDoc onClose={() => setShowAddDocModal(false)} />
                </div>
              </div>
            )}

            <div className="p1 container mt-5">
              <h3 className="title">Available Courses</h3>
              
              <div className="row mt-4">
                {/* 1st Year */}
                <div className="col-md-3 mb-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <h4 className="card-title">1st Year</h4>
                      <p className="card-text">View courses for 1st-year students</p>
                      <Link to="/first" className="btn btn-primary">Go to 1st Year</Link>
                    </div>
                  </div>
                </div>

                {/* 2nd Year */}
                <div className="col-md-3 mb-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <h4 className="card-title">2nd Year</h4>
                      <p className="card-text">View courses for 2nd-year students</p>
                      <Link to="/second" className="btn btn-primary">
                        Go to 2nd Year
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 3rd Year */}
                <div className="col-md-3 mb-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <h4 className="card-title">3rd Year</h4>
                      <p className="card-text">View courses for 3rd-year students</p>
                      <Link to="/Third" className="btn btn-primary">
                        Go to 3rd Year
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 4th Year */}
                <div className="col-md-3 mb-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <h4 className="card-title">4th Year</h4>
                      <p className="card-text">View courses for 4th-year students</p>
                      <Link to="/Fourth" className="btn btn-primary">
                        Go to 4th Year
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
}

export default Coursed;