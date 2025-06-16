import { SignInButton } from "@clerk/clerk-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 font-sans antialiased flex flex-col">
      {/* Header Section */}
      <header className="bg-neutral-800 shadow-md p-4 md:p-6 flex justify-between items-center rounded-b-lg">
        <div className="flex items-center">
          {/* Adjusted text color for dark theme */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
            PlivoStatus
          </h1>
        </div>
        <SignInButton mode="modal" >
          <button className="bg-white text-neutral-900 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
            Login
          </button>
        </SignInButton>
      </header>

      {/* Main Content Section */}
      {/* Changed content background and text colors for dark theme */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="bg-neutral-800 p-6 md:p-10 rounded-lg shadow-xl text-center max-w-2xl w-full">
          {/* Adjusted text color for dark theme */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-50 mb-4">
            Real-time Service Status Updates
          </h2>
          {/* Adjusted text color for dark theme */}
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
            Stay informed about the operational status of all your essential
            services. We provide up-to-the-minute information to ensure
            transparency and minimize disruptions.
          </p>
          {/* Adjusted text color for dark theme */}
          <p className="text-md md:text-lg text-gray-400">
            Check back soon for detailed service health dashboards and incident
            reports.
          </p>
        </div>
      </main>

      {/* Footer Section (already compatible with dark theme) */}
      <footer className="bg-gray-900 text-white p-4 text-center text-sm rounded-t-lg">
        <p>
          &copy; {new Date().getFullYear()} PlivoStatus. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
