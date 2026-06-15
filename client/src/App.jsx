// client/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing';
import ListingDetail from './pages/ListingDetail';
import MyTrips from './pages/MyTrips';
import PaymentSuccess from './pages/PaymentSuccess';
import MyProperties from './pages/MyProperties'; 
import Wishlist from './pages/Wishlist';
import EditListing from './pages/EditListing'; // NEW IMPORT

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/become-a-host" element={<CreateListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/edit-listing/:id" element={<EditListing />} /> {/* NEW ROUTE */}
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/payment-success" element={<PaymentSuccess />} /> 
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/wishlist" element={<Wishlist />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;