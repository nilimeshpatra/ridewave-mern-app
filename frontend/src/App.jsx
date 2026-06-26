import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookRide from "./pages/BookRide";
import MyRides from "./pages/MyRides";
import DriverDashboard from "./pages/DriverDashboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" replace />;
};
function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/book" element={<PrivateRoute><BookRide /></PrivateRoute>} />
        <Route path="/my-rides" element={<PrivateRoute><MyRides /></PrivateRoute>} />
        <Route path="/driver" element={<PrivateRoute><DriverDashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;
