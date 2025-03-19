import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../Home/SideBar";
import Header from "../Navbar/Header";
import Footer from "../Navbar/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import './coursed.css';
import { Link } from 'react-router-dom';

function Coursed() {


  return (
    <div>
      <div className="main_function ">
        <div>
          <Header />
          
       <div style={{ marginTop: "20px" , padding:'125px' }}>
        
            <div className="p1">
                <Link to="/StudentCourse" style={{ textDecoration: 'none' , color:'white'}}>
                   <h3 class="title">Module Allocation for Students</h3>
                </Link>
            </div>

      {/* Course Requirements Section */}
            <div className="p1 mt-5">
                <Link to="/AddDoc" style={{ textDecoration: 'none' }}>
                   <h3 class="title">Uploading Course Requirements</h3>
                </Link>
            </div>


             <div className=" p1 container mt-5">
                <h3 class="title">Available Courses</h3>

                 
                <div className=" row mt-4">
       
                     <div className="col-md-3 mb-4">
                        <div className="card">
                            <div className="card-body text-center">
                               <h4 className="card-title">1st Year</h4>
                               <p className="card-text">View courses for 1st-year students</p>
                               <Link to="/1st-year" className="btn btn-primary">Go to 1st Year</Link>
                            </div>
                        </div>
                    </div>

                    {/* 2nd Year */}
                    <div className="col-md-3 mb-4">
                    <div className="card">
                        <div className="card-body text-center">
                        <h4 className="card-title">2nd Year</h4>
                        <p className="card-text">View courses for 2nd-year students</p>
                        <Link to="/2nd-year" className="btn btn-primary">
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
                        <Link to="/3rd-year" className="btn btn-primary">
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
                        <Link to="/4th-year" className="btn btn-primary">
                            Go to 4th Year
                        </Link>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

           </div>

           <Footer/>
        </div>

      </div>
    </div>
  );
}

export default Coursed;
