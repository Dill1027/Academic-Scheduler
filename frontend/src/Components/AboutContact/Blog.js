import React from 'react';
import { motion } from 'framer-motion';
import { FaUniversity, FaGraduationCap, FaBook, FaGlobe } from 'react-icons/fa';
import Navbar from '../Navbar';

const Blog = () => {
  const sections = [
    {
      title: "Excellence in Education",
      icon: <FaUniversity size={40} />,
      content: "We strive for academic excellence through innovative teaching methods and industry-relevant curriculum."
    },
    {
      title: "Expert Faculty",
      icon: <FaGraduationCap size={40} />,
      content: "Our teaching staff includes industry experts and experienced academics."
    },
    {
      title: "Global Recognition",
      icon: <FaGlobe size={40} />,
      content: "We maintain partnerships with leading universities worldwide."
    }
  ];

  return (
    <div style={{ backgroundColor: "#f8f9fa" }}>
      <Navbar />
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1>About Our Institution</h1>
        {sections.map((section, index) => (
          <div key={index}>
            <h2>{section.title}</h2>
            <div>{section.icon}</div>
            <p>{section.content}</p>
          </div>
        ))}
      </motion.section>
    </div>
  );
};

export default Blog;
