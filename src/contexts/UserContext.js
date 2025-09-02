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
      
      // Mock user data for demo
      const mockUserData = {
        _id: 'demo_user_123',
        username: 'demo_user',
        email: 'demo@echospace.com',
        profilePicture: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Welcome to EchoSpace!',
        location: 'Demo City',
        dateCreated: new Date().toISOString(),
        followers: 0,
        following: 0
      };
      
      setCurrentUser(mockUserData);
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

   const updateUserData = async (updatedData, saveToServer = true) => {
    try {
      // For demo purposes, just update locally
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...updatedData
      }));
      return true;
    } catch (error) {
      console.error('Failed to update user data:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      fetchUserData, 
      updateUserData,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
};