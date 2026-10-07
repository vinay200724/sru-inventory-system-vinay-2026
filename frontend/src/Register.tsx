import { useState } from "react";

type RegisterProps = {
  onRegister: () => void;
  onBackToLogin: () => void;
};

function Register({
  onRegister,
  onBackToLogin
}: RegisterProps) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {

  if (!name || !email || !password) {
  setMessage("Please fill all fields");
  return;
}

if (!email.includes("@")) {
  setMessage("Please enter a valid email");
  return;
}

if (password.length < 5) {
  setMessage("Password must be at least 5 characters");
  return;
}

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password
          })
        }
      );

      const data = await response.json();

      if (data.message === "Registration successful") {

        setMessage("Registration successful!");

        setTimeout(() => {
          onRegister();
        }, 1000);

      } else {

        setMessage(data.message);

      }

    } catch (error) {

      console.log(error);
      setMessage("Unable to connect to server");

    }
  };


  return (
    <div className="login-page">

      <div className="login-box">

        <h1>Smart Inventory</h1>

        <h2>Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>
          Register
        </button>

        {message && (
          <p>{message}</p>
        )}

        <p>
          Already have an account?
        </p>

        <button onClick={onBackToLogin}>
          Back to Login
        </button>

      </div>

    </div>
  );
}

export default Register;