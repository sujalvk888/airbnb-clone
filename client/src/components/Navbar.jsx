// client/src/components/Navbar.jsx

import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserCircle, LogOut, Loader2 } from 'lucide-react';
import logo from '../Images/Airbnb_Logo.png'; 

export default function Navbar() {
  const { user, logout, loading } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    window.dispatchEvent(new Event('resetHomeSearch'));
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center"
          >
            <img 
              src={logo} 
              alt="Airbnb Logo" 
              className="h-8 object-contain" 
            />
          </Link>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="flex items-center justify-center px-4">
                <Loader2 className="h-5 w-5 text-gray-300 animate-spin" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                
                {/* NEW WISHLIST LINK HERE */}
                <Link
                  to="/wishlist"
                  className="text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition hidden sm:block"
                >
                  Wishlists
                </Link>

                <Link
                  to="/my-trips"
                  className="text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition hidden sm:block"
                >
                  Trips
                </Link>

                <Link
                  to="/my-properties"
                  className="text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition hidden sm:block"
                >
                  Properties
                </Link>

                <Link
                  to="/become-a-host"
                  className="text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition hidden sm:block"
                >
                  Become a Host
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:shadow-md px-3 py-2 rounded-full transition border border-gray-200 bg-white"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-8 w-8 text-gray-500" />
                  )}
                  <span className="text-sm font-bold text-gray-700 hidden sm:block">
                    {user.firstName}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-500 hover:text-brand transition px-2"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-bold text-gray-700 hover:text-brand"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold text-white bg-brand px-4 py-2 rounded-full hover:bg-rose-600 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}