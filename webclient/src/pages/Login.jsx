import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoadingButton from "../components/common/LoadingButton";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";
import usePersist from "../hooks/usePersist";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const [persist, setPersist] = usePersist();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleToggle = () => setPersist((prev) => !prev);

  useEffect(() => {
    setError("");
  }, [email, password]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token }));
      setError(token);
      // navigate("dashboard");
    } catch (err) {
      console.log(err);
      if (!err.status) {
        setError("No Server Response");
      } else if (err.status === 401) {
        setError(`Unauthorized: ${err.data?.message}`);
      } else {
        setError(`${err.status} : ${err.data?.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <main className="max-w-md w-full p-6 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-center">Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <input required type="email" ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="off" className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <LoadingButton type="submit" loading={loading} className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300" text="Login" />
          </div>
          {/* {error && ( */}
          <div className="text-red-500 text-center" aria-live="assertive">
            tests {error}
          </div>
          {/* )} */}
        </form>
        <label htmlFor="persist" className="flex items-center justify-center cursor-pointer text-blue-500 hover:underline">
          <input type="checkbox" checked={persist} onChange={handleToggle} className="w-5 h-5 mr-1 text-blue-500 border rounded focus:ring" id="persist" />
          Trust This Device
        </label>
        <div className="text-center">
          <Link to="/signup" className="text-blue-500 hover:underline">
            Signup Page
          </Link>
        </div>
      </main>
    </section>
  );
};

export default Login;
