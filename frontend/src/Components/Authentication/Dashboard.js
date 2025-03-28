import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    }
  }, []);

  return (
    <div>
      {role === 'Admin' && <h2>Admin Dashboard</h2>}
      {role === 'Lecturer' && <h2>Lecturer Dashboard</h2>}
      {role === 'Current Student' && <h2>Student Dashboard</h2>}
      {role === 'New Student' && <h2>New Student Registration</h2>}
    </div>
  );
};

export default Dashboard;
