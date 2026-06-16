// client/src/components/Navbar.jsx

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserCircle, LogOut, Loader2, Menu, X } from 'lucide-react';
import logo from '../Images/Airbnb_Logo.png'; 

export default function Navbar() {
  const { user, logout, loading } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleLogoClick = () => {
    window.dispatchEvent(new Event('resetHomeSearch'));
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center z-50"
          >
            <img 
              src={logo} 
              alt="Airbnb Logo" 
              className="h-8 object-contain" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="flex items-center justify-center px-4">
                <Loader2 className="h-5 w-5 text-gray-300 animate-spin" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-2 lg:gap-4">
                <Link to="/wishlist" className="text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition">Wishlists</Link>
                <Link to="/my-trips" className="text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition">Trips</Link>
                <Link to="/my-properties" className="text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition">Properties</Link>
                <Link to="/become-a-host" className="text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition">Become a Host</Link>

                <Link to="/profile" className="flex items-center gap-2 hover:shadow-md px-3 py-2 rounded-full transition border border-gray-200 bg-white ml-2">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <UserCircle className="h-8 w-8 text-gray-500" />
                  )}
                  <span className="text-sm font-bold text-gray-700">{user.firstName}</span>
                </Link>

                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500 hover:text-brand transition px-2 ml-1" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-brand">Login</Link>
                <Link to="/register" className="text-sm font-bold text-white bg-brand px-4 py-2 rounded-full hover:bg-rose-600 transition">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-6 flex flex-col gap-2">
            {loading ? (
              <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 text-brand animate-spin" /></div>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 mb-2">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <UserCircle className="h-10 w-10 text-gray-500" />
                  )}
                  <div>
                    <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link to="/profile" onClick={closeMenu} className="p-3 font-medium text-gray-700 hover:bg-gray-50 rounded-lg">My Profile</Link>
                <Link to="/wishlist" onClick={closeMenu} className="p-3 font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Wishlists</Link>
                <Link to="/my-trips" onClick={closeMenu} className="p-3 font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Trips</Link>
                <Link to="/my-properties" onClick={closeMenu} className="p-3 font-medium text-gray-700 hover:bg-gray-50 rounded-lg">My Properties</Link>
                <Link to="/become-a-host" onClick={closeMenu} className="p-3 font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Become a Host</Link>
                <button onClick={handleLogout} className="p-3 font-bold text-brand hover:bg-rose-50 rounded-lg text-left mt-2 flex items-center gap-2">
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 p-4">
                <Link to="/login" onClick={closeMenu} className="w-full text-center py-3 font-bold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50">Log In</Link>
                <Link to="/register" onClick={closeMenu} className="w-full text-center py-3 font-bold text-white bg-brand rounded-xl hover:bg-rose-600">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}