import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowRight } from "react-icons/fa"; // Import right arrow icon
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
  

    <div>
    <Navbar/>
 
      {/* Banner Section */}
      <section className="position-relative">
        <img
          src="/img/home.jpg"
          alt="Students"
          className="w-100 vh-100 object-fit-cover"
          style={{ objectFit: "cover" }}
        />
     

<div className="position-absolute top-50 start-50 translate-middle text-white text-center">
  <motion.h2
    className="fw-bold display-5"
    initial={{ opacity: 0, scale: 0.5 }} // Starts small and invisible
    animate={{ opacity: 1, scale: 1 }} // Gradually grows and fades in
    transition={{ duration: 2, ease: "easeOut" }} // Smooth transition
    style={{ color: "#00088B" }} 
  >
    The Future Awaits You!
  </motion.h2>
  <p className="fs-5">Plan your academic journey efficiently.</p>
</div>


        {/* Right Arrow Button */}
        <div className="position-absolute top-50 end-0 translate-middle-y me-4">
          <button
            className="btn btn-light rounded-circle p-3 shadow"
            onClick={() => navigate("/userbase")}
            style={{ fontSize: "1.5rem" }}
          >
            <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container text-center py-5">
        <div className="row">
          {[
            { name: "Helpdesk", icon: "/icons/helpdesk.png", path: "/helpdesk" },
            { name: "Student Service", icon: "/icons/student-service.png", path: "/student-service" },
            { name: "Library", icon: "/icons/library.png", path: "/library" },
            { name: "Video Library", icon: "/icons/video-library.png", path: "/video-library" },
            { name: "Research Archive", icon: "/icons/research-archive.png", path: "/research-archive" },
          ].map((feature, index) => (
            <div key={index} className="col-md-2 col-sm-4 mb-4">
              <div className="cursor-pointer" onClick={() => navigate(feature.path)}>
                <img
                  src={feature.icon}
                  alt={feature.name}
                  className="img-fluid w-100 mb-2"
                />
                <p className="fw-bold">{feature.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-light text-center py-5">
        <h2 className="fw-bold text-primary">The Future Awaits You!</h2>
        <p className="text-muted mt-3 container">
          We are a leading non-state higher education institute approved by the
          University Grants Commission (UGC). We are members of the Association
          of Commonwealth Universities (ACU), as well as the International
          Association of Universities (IAU).
        </p>
      </section>

      {/* Faculties Section */}
      <section className="container text-center py-5">
        <h2 className="fw-bold text-primary mb-4">Our Faculties</h2>
        <div className="row">
          {["Faculty of Computing", "Faculty of Business", "Faculty of Engineering", "Faculty of Humanities & Sciences"].map((faculty, index) => (
            <div key={index} className="col-md-3 col-sm-6">
              <p className="fs-5 fw-medium">{faculty}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer/>
    </div>
    
  );
};

export default Home;
