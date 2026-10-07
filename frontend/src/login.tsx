import { useState } from "react";

type LoggedInUser = {
  user_id: number;
  name: string;
  email: string;
  role: "admin" | "viewer";
  access_token: string;
};

type LoginProps = {
  onLogin: (user: LoggedInUser) => void;
  onRegister: () => void;
};

function Login({ onLogin, onRegister }: LoginProps) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.message === "Login successful" &&
        data.access_token
      ) {

        onLogin({
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          role: data.role === "admin"
            ? "admin"
            : "viewer",
          access_token: data.access_token
        });

      } else {

        setMessage(
          data.message || "Invalid email or password"
        );

      }

    } catch (error) {

      console.log(error);

      setMessage(
        "Unable to connect to server"
      );

    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>Smart Inventory</h1>

        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

        {message && (
          <p>{message}</p>
        )}

        <p>
          Don't have an account?
        </p>

        <button onClick={onRegister}>
          Register
        </button>

      </div>

    </div>
  );
}

export default Login;