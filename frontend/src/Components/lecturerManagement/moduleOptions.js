import React from 'react';

const moduleOptionsData = {
  "Software Engineering": {
    "1st Year": ["Programming Fundamentals", "Mathematics", "Computer Systems", "Web Development"],
    "2nd Year": ["Data Structures", "Algorithms", "Software Design", "Database Systems"],
    "3rd Year": ["Software Engineering", "Mobile Development", "Cloud Computing", "AI Fundamentals"],
    "4th Year": ["Advanced Software Engineering", "DevOps", "Software Architecture", "Project Management"]
  },
  "Information Technology": {
    "1st Year": ["IT Fundamentals", "Mathematics", "Computer Networks", "Web Technologies"],
    "2nd Year": ["System Administration", "Database Management", "Data Communications", "IT Project Management"],
    "3rd Year": ["Enterprise Systems", "Cloud Technologies", "IT Security", "Business Intelligence"],
    "4th Year": ["Advanced IT Systems", "IT Governance", "Emerging Technologies", "Capstone Project"]
  },
  "Data Science": {
    "1st Year": ["Programming for DS", "Statistics", "Discrete Mathematics", "Data Visualization"],
    "2nd Year": ["Data Structures", "Machine Learning", "Database Systems", "Linear Algebra"],
    "3rd Year": ["Advanced ML", "Big Data", "Data Mining", "Statistical Modeling"],
    "4th Year": ["Deep Learning", "Natural Language Processing", "AI Ethics", "Capstone Project"]
  },
  "Cyber Security": {
    "1st Year": ["Cyber Fundamentals", "Networking", "Operating Systems", "Programming"],
    "2nd Year": ["Cryptography", "Network Security", "Ethical Hacking", "Digital Forensics"],
    "3rd Year": ["Advanced Security", "Cloud Security", "Incident Response", "Security Governance"],
    "4th Year": ["Penetration Testing", "Security Architecture", "Cyber Law", "Capstone Project"]
  },
  "Interactive Media": {
    "1st Year": ["Design Principles", "Digital Imaging", "Web Development", "Media Theory"],
    "2nd Year": ["UI/UX Design", "Animation", "Game Design", "Interactive Storytelling"],
    "3rd Year": ["Advanced Web Tech", "AR/VR Development", "Motion Graphics", "Media Production"],
    "4th Year": ["Emerging Media", "Portfolio Development", "Media Business", "Capstone Project"]
  }
};

const ModuleOptions = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Module Options</h2>
      {Object.entries(moduleOptionsData).map(([specialization, years]) => (
        <div key={specialization} className="mb-4">
          <h3 className="text-primary">{specialization}</h3>
          {Object.entries(years).map(([year, modules]) => (
            <div key={year} className="ms-4 mb-3">
              <h4 className="text-secondary">{year}</h4>
              <ul className="list-group">
                {modules.map((module) => (
                  <li key={module} className="list-group-item">{module}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Named export for the data
export const moduleOptions = moduleOptionsData;

// Default export for the component
export default ModuleOptions;