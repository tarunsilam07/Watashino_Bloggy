"use client"
import Navbar from '@/components/NavBar';
import React from 'react';

const UnderConstruction: React.FC = () => {
  return (
    <>
    <Navbar/>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        color: '#212529',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        🚧 Page Under Construction 🚧
      </h1>
      <p style={{ fontSize: '1.25rem' }}>
        We're working on this page. Please check back later!
      </p>
    </div>
    </>
  );
};

export default UnderConstruction;
