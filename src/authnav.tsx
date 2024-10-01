import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BarChart2 } from 'lucide-react';

const AuthenticatedNavigationBar: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <BarChart2 className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">DemandCast</span>
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}  // Use logoutParams here
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthenticatedNavigationBar;