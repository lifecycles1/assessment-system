import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (isAuthenticated) {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (currentTime > decoded.exp) {
        localStorage.removeItem("token");
        setError("Session has expired. Please login again.");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate, token]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/signup", { email, password, role });
      const { data } = response;
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError("User registration failed. Email may already exist.");
      }
    } catch (error) {
      setError("An error occurred while creating an account.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-center">Signup</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <input required type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">
              Select Your Role:
            </label>
            <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} required className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
              Signup
            </button>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
        <p className="text-center">OR</p>
        <div className="text-center">
          <Link to="/" className="text-blue-500 hover:underline">
            Login Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
