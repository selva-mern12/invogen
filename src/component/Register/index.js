import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { RiEyeCloseFill, RiEyeFill  } from "react-icons/ri";
import "./index.css";

function Register() {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    companyName: "",
    companyAddress: "",
    mobileNumber: "",
  });
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if(
        formData.username.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.name.trim() !== "" &&
        formData.companyName.trim() !== "" &&
        formData.companyAddress.trim() !== "" &&
        formData.mobileNumber.trim() !== ""
      ) {
        const userDetails = {
            name: formData.name,
            username: formData.username,
            password: formData.password, 
            companyName: formData.companyName, 
            companyAddress: formData.companyAddress, 
            mobileNumber: formData.mobileNumber
        }
        const registerUrl = "https://invo-gen-server.onrender.com/invoice/register"
        const registerOptions = {
            method: "POST", 
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({userDetails})
        }
        
        const registerResponse = await fetch(registerUrl, registerOptions);
        const registerData = await registerResponse.json()
        if (registerResponse.ok){
            setErrorMsg(registerData.message)
            setIsFlipped(true);
            setFormData({
              username: "",
              password: "",
              name: "",
              companyName: "",
              companyAddress: "",
              mobileNumber: "",
            });
            setErrorMsg("")
        } else{
            setErrorMsg(registerData.error)
        }
    }

  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const userDetails = {
        username: loginData.username,
        password: loginData.password
    }
    const loginUrl = "https://invo-gen-server.onrender.com/invoice/login"
    const loginOptions = {
        method: "POST", 
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({userDetails})
    }
    
    const loginResponse = await fetch(loginUrl, loginOptions);
    const loginDatas = await loginResponse.json()
    if (loginResponse.ok){
        setErrorMsg(loginDatas.message)
        Cookies.set('jwt_token', loginDatas.jwt_token, {expires: 10})
        Cookies.set('username', loginDatas.username, {expires: 10})
        Cookies.set('user_id', loginDatas.user_id, {expires: 10})
        navigate('/')
        setLoginData({
            username: "",
            password: "",
       })
       setErrorMsg("")
    } else{
        setErrorMsg(loginDatas.error)
    }
  };

  return (
    <div className="register-bg-container">
      <div className={`register-form-container ${isFlipped ? "register-flipped" : ""}`}>
        {/* Register Form */}
        <div className="register-form">
          <h2 className="register-heading">Register</h2>
          <form onSubmit={handleRegister} className="register-form-fields">
            <input
              className="register-input"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
            <div className="register-input">
                <input
                className="password"
                type={showPassword ? "text" : "Password"}
                placeholder="password"
                value={formData.password}
                onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                }
                required
                /> 
                <button onClick={() => setShowPassword(prevState => !prevState)} className="passwordicon"> 
                {showPassword ? <RiEyeFill /> :  <RiEyeCloseFill />}
                </button>
            </div>
            <input
              className="register-input"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              className="register-input"
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              required
            />
            <input
              className="register-input"
              type="text"
              placeholder="Company Address"
              value={formData.companyAddress}
              onChange={(e) =>
                setFormData({ ...formData, companyAddress: e.target.value })
              }
              required
            />
            <input
              className="register-input"
              type="text"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={(e) =>
                setFormData({ ...formData, mobileNumber: e.target.value })
              }
              required
            />
            <button type="submit" className="register-button">
              Register
            </button>
            {errorMsg !== "" && <p>{errorMsg}</p>}
          </form>
          <p className="register-login-text">
            Already registered?{" "}
            <span className="register-login-link" onClick={() => setIsFlipped(true)}>
              Login here
            </span>
          </p>
        </div>

        {/* Login Form */}
        <div className="login-form">
          <h2 className="login-heading">Login</h2>
          <form onSubmit={handleLogin} className="login-form-fields">
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              required
            />
            <div className="register-input">
                <input
                className="password"
                type={showPassword ? "text" : "Password"}
                placeholder="password"
                value={loginData.password}
                onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                }
                required
                /> 
                <button onClick={() => setShowPassword(prevState => !prevState)} className="passwordicon"> 
                {showPassword ? <RiEyeFill /> :  <RiEyeCloseFill />}
                </button>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {errorMsg !== "" && <p>{errorMsg}</p>}
          </form>
          <p className="login-register-text">
            Don't have an account?{" "}
            <span className="login-register-link" onClick={() => setIsFlipped(false)}>
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;