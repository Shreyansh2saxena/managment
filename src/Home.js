import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">

        <div className="text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
           We will make it happen !
          </p>
        </div>
      </div>

      {/* Simple Content Section */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Discover Something Amazing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Feature One</h3>
              <p className="text-gray-600">Experience the best of what we have to offer with our innovative solutions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Feature Two</h3>
              <p className="text-gray-600">Get access to tools and resources that will help you achieve your goals.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Feature Three</h3>
              <p className="text-gray-600">Join a community of like-minded individuals working towards success.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;