import React from 'react'

function Footer() {
  return (
    <footer className="bg-dark text-white text-center text-lg-start mt-5">
    <div className="container p-4">
      {/* Section: Social media */}
      <div className="mb-4">
        <a
          href="#"
          className="btn btn-outline-light btn-floating m-1"
          role="button"
          style={{ borderRadius: "50%" }}
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a
          href="#"
          className="btn btn-outline-light btn-floating m-1"
          role="button"
          style={{ borderRadius: "50%" }}
        >
          <i className="fab fa-twitter"></i>
        </a>
        <a
          href="#"
          className="btn btn-outline-light btn-floating m-1"
          role="button"
          style={{ borderRadius: "50%" }}
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="#"
          className="btn btn-outline-light btn-floating m-1"
          role="button"
          style={{ borderRadius: "50%" }}
        >
          <i className="fab fa-linkedin-in"></i>
        </a>
      </div>
      {/* Section: Social media */}

      {/* Section: Links */}
      <div className="row">
        <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
          <h5 className="text-uppercase">About Us</h5>
          <p>
            We provide the best solutions for web and mobile development. Our
            mission is to help developers build amazing projects efficiently.
          </p>
        </div>

        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
          <h5 className="text-uppercase">Links</h5>
          <ul className="list-unstyled mb-0">
            <li>
              <a href="#" className="text-white text-decoration-none">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-decoration-none">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-decoration-none">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="text-white text-decoration-none">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
          <h5 className="text-uppercase">Contact</h5>
          <ul className="list-unstyled mb-0">
            <li>
              <i className="fas fa-envelope me-2"></i> info@yourwebsite.com
            </li>
            <li>
              <i className="fas fa-phone me-2"></i> +1 (555) 123-4567
            </li>
            <li>
              <i className="fas fa-map-marker-alt me-2"></i> New York, USA
            </li>
          </ul>
        </div>
      </div>
      {/* Section: Links */}
    </div>

    {/* Copyright */}
    <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
      © 2025 YourWebsite. All rights reserved.
    </div>
  </footer> 
  )
}

export default Footer
