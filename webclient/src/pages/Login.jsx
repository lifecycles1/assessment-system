import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import LoadingButton from "../components/common/LoadingButton";
import { useAuth } from "../hooks/useAuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, token } = useAuth();

  useEffect(() => {
    if (token) navigate("dashboard");
  }, [navigate, token]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // deployed version - http://localhost:8080/ replaced with /api/ (see dispatch.yaml)
      const response = await axios.post("http://localhost:8080/signin", { email, password });
      const { data } = response;
      if (data.token) {
        login(data.token);
      } else {
        setError("Authentication failed. Email or password is incorrect.");
      }
    } catch (error) {
      setError("An error occurred while logging in.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-center">Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <input required type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <LoadingButton type="submit" loading={loading} className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300" text="Login" />
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
        <p className="text-center">OR</p>
        <div className="text-center">
          <Link to="/signup" className="text-blue-500 hover:underline">
            Signup Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
