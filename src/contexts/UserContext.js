import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }
      const response = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      } else {
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

   // This function must be defined
   const updateUserData = async (updatedData, saveToServer = true) => {
    if (saveToServer) {
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          method: 'PUT', // Changed from PATCH
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(updatedData)
        });
        
        if (response.ok) {
          const updatedUser = await response.json();
          setCurrentUser(prevUser => ({
            ...prevUser,
            ...updatedUser
          }));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to update user data:', error);
        return false;
      }
    } else {
      // Just update locally
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...updatedData
      }));
      return true;
    }
  };

  // Load user data on initial mount
  useEffect(() => {
    fetchUserData();
  }, []);

  console.log("UserContext initialized with updateUserData function:", typeof updateUserData);
  
  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      fetchUserData, 
      updateUserData,
      loading 
    }}>
      {console.log("UserContext Provider value includes:", Object.keys({ 
        currentUser, 
        setCurrentUser, 
        fetchUserData, 
        updateUserData,
        loading 
      }))}
      {children}
    </UserContext.Provider>
  );
};