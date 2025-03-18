import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div>
      <footer>
        <section className="bg-gray-900 text-white py-10">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h3 className="text-2xl font-bold">Travel</h3>
              <p className="mt-3 text-gray-400">
                Simplifies your journey with intuitive booking tools, personalized itineraries, and real-time updates. Trust us for a reliable and stress-free travel experience, tailored to your needs.
              </p>
              <h5 className="mt-4 font-semibold">Get in touch</h5>
              <a href="mailto:example@mail.com" className="text-blue-400 block mt-2">@gmail.com</a>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold">About Us</h4>
              <ul className="mt-3 space-y-2">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Our Team</a></li>
                <li><a href="#" className="hover:underline">Careers <span className="text-green-400">We're hiring!</span></a></li>
                <li><a href="#" className="hover:underline">Mission and Values</a></li>
                <li><a href="#" className="hover:underline">Partnerships</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold">Help</h4>
              <ul className="mt-3 space-y-2">
                <li><Link to="/feed" className="hover:underline">FAQ</Link></li>
                <li><a href="#" className="hover:underline">Booking Guide</a></li>
                <li><a href="#" className="hover:underline">Cancellation Policy</a></li>
                <li><a href="#" className="hover:underline">Site Map</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold">Resources</h4>
              <ul className="mt-3 space-y-2">
                <li><a href="#" className="hover:underline">Newsletter</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Gallery</a></li>
                <li><a href="#" className="hover:underline">Offers</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center text-gray-400 border-t border-gray-700 pt-6">
            <div>&copy; 2024 - Travel, Inc. All rights reserved.</div>
            <div className="mt-3 space-x-4">
              <a href="#" className="hover:underline">Terms & Conditions</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </section>
      </footer>
    </div>
  );
}

export default Footer;
