// Neon Dreams Theme Showcase - JavaScript
import { Component, useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Demo component showcasing various JavaScript features
 * @param {Object} props - Component properties
 * @returns {JSX.Element} React component
 */
const UserDashboard = ({ userId = 123, theme = 'dark' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Async function with template literals
  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      const userData = response.data;
      
      if (userData && userData.length > 0) {
        setUsers(userData);
        console.log(`Loaded ${userData.length} users`);
      }
    } catch (err) {
      setError(`Failed to fetch user data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Effect hook with cleanup
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchUserData(userId);
      }
    };

    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Object destructuring and spread operator
  const processUserData = (rawData) => {
    return rawData.map(({ id, name, email, ...rest }) => ({
      id,
      displayName: name.toUpperCase(),
      contact: email.toLowerCase(),
      metadata: { ...rest, processed: true },
      status: rest.active ? 'online' : 'offline'
    }));
  };

  // Arrow function with conditional rendering
  const renderUser = (user) => (
    <div key={user.id} className={`user-card ${user.status}`}>
      <h3>{user.displayName}</h3>
      <p>{user.contact}</p>
      {user.metadata.verified && <span>✓ Verified</span>}
    </div>
  );

  // Regular expressions and array methods
  const filterUsers = (searchTerm) => {
    const regex = new RegExp(searchTerm, 'gi');
    return users.filter(user => 
      regex.test(user.displayName) || regex.test(user.contact)
    );
  };

  // Class definition with static method
  class UserManager {
    static MAX_USERS = 100;
    
    constructor(initialUsers = []) {
      this.users = initialUsers;
      this.lastUpdated = new Date();
    }

    addUser(user) {
      if (this.users.length >= UserManager.MAX_USERS) {
        throw new Error('Maximum user limit reached');
      }
      this.users.push({ ...user, id: Date.now() });
    }

    getUserById(id) {
      return this.users.find(user => user.id === id) || null;
    }
  }

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>
      <div className="users-grid">
        {processUserData(users).map(renderUser)}
      </div>
    </div>
  );
};

export default UserDashboard; 