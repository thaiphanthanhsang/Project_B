import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased">
      {children}
    </div>
  );
};

export default Layout;
