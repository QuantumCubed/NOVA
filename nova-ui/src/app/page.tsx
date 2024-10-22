// src/app/page.tsx
import React from 'react';
import Header from './components/Header';

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="p-4 mt-16 ml-48"> {/* Use ml-48 (12rem) if sidebar pushes content aside */}
        {/* Your main content goes here */}
        {/* Add more content as needed */}
      </main>
    </div>
  );
};

export default HomePage;
