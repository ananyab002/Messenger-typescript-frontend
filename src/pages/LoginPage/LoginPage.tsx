import { useForm } from "react-hook-form";
import "./loginPage.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoginDataType } from "../../types/type";

import { useEffect, useState } from "react";
import { useLogin } from "../../hooks/useLogin";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginCurrentUser, loginError } = useLogin();
  const [error, setError] = useState('');
  const location = useLocation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginDataType>();

  useEffect(() => {
    if (location.state?.authError) {
      setError(location.state.authError);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const onSubmit = async (data: LoginDataType) => {
    const response = await loginCurrentUser(data);
    if (response?.success)
      navigate("/Messenger-typescript-frontend/messenger");
  }

  return (
    <div className="login">
      {" "}
      <h3>Login</h3>
      <div className="login-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="items">
            <input {...register("email", {
              required: "Email is required",
              pattern: { value: /^[A-Za-z0-9._]+@gmail\.com$/, message: "Email is invalid" }
            })} placeholder="Enter your email" />
            {errors.email && <div>{errors.email.message}</div>}

            <input {...register("password", {
              required: "password required",
              minLength: { value: 4, message: "Minimum 4 characters" }
            })} placeholder="Enter your password" />
            {errors.password && <div>{errors.password.message}</div>}

            <button>{isSubmitting ? "Please Wait......" : "Login"}</button>
            {loginError && <div style={{ color: "red" }}>{loginError}</div>}
            {error && (
              <div style={{ color: "red" }}>
                {error}
              </div>
            )}
            <p>
              Do not have an account ? Please regiter{" "}
              <Link to="/Messenger-typescript-frontend/register">here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
