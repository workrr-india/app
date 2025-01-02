import React from 'react';
import { SignIn } from "@clerk/nextjs";
import { FaSearch } from 'react-icons/fa';

const GlassdoorPage = () => {
  return (
    <div className="min-h-screen bg-white-50 flex flex-col items-center"> {/* Adjusted background color */}
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white shadow-md">
      <h1 className="text-blue-600 text-2xl font-bold">WORKRR</h1>
        <div className="flex space-x-4">
          {/* Post Job Free Button */}
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
            Post Job Free
          </button>
          {/* Search Jobs Button */}
          <button className="bg-[#fe995c] text-white px-4 py-2 rounded-lg shadow hover:bg-[#e9894b]">
            Upload Resume
          </button>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-semibold text-green-600 mb-6">Search Jobs Online | Hire Candidates | Post a Job</h2>
        <p className="text-blue-500 mb-8 text-center">
        Create an account or sign in to access all the website's resources for free.
        </p>
          

  {/* Jobs Search */}
  <div className="w-full max-w-lg mx-auto p-4">
  <div className="relative">
    <input
      type="text"
      placeholder="Search for jobs..."
      className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
    />
    <button
      className="absolute right-0 top-0 mt-0 mr-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    > Search
    </button>
  </div>
</div>
                    
        {/* Clerk SignIn Component */}
        <div className="w-full max-w-sm">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-green-600 hover:bg-green-700',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border shadow-sm hover:bg-gray-50',
                formFieldInput: 'focus:ring-green-600',
              },
            }}
          />
        </div>

         </main>

           {/* Copyright */}
      <div className="w-full bg-black text-center py-2 text-sm text-white">
        <p>WORKRR All rights reserved &copy; 2017 - 2025</p>
      </div>
    </div>
  );
};

export default GlassdoorPage;
