
import { useState } from "react";
import { API_BASE_URL } from "./config";

type RegisterProps = {
  onRegister: () => void;
  onBackToLogin: () => void;
};

function Register({ onRegister, onBackToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 5) {
      setMessage("Password must be at least 5 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === "Registration successful") {
        setMessage("Registration successful! Taking you to login...");
        window.setTimeout(() => onRegister(), 1000);
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server. Check whether the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap');

        .register-page, .register-page * {
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 28px 18px;
          color: #17243b;
          font-family: 'DM Sans', sans-serif;
          background:
            radial-gradient(circle at 12% 15%, rgba(36,190,177,.18), transparent 28%),
            radial-gradient(circle at 88% 85%, rgba(49,103,180,.18), transparent 30%),
            linear-gradient(135deg, #f4f8fc, #eaf1f8);
        }

        .register-brand {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 25px;
          text-align: left;
        }

        .register-logo {
          width: 58px;
          height: 58px;
          object-fit: contain;
          background: white;
          border-radius: 14px;
          padding: 5px;
          box-shadow: 0 5px 18px rgba(16,41,77,.12);
        }

        .register-brand-title {
          font: 800 19px 'Manrope', sans-serif;
          color: #15365c;
          letter-spacing: .5px;
        }

        .register-brand-sub {
          font-size: 10px;
          letter-spacing: 1.2px;
          color: #718198;
          margin-top: 4px;
        }

        .register-card {
          width: min(100%, 470px);
          padding: 34px;
          background: rgba(255,255,255,.96);
          border: 1px solid #dce7f1;
          border-radius: 22px;
          box-shadow: 0 18px 55px rgba(25,58,94,.12);
        }

        .register-kicker {
          text-align: center;
          color: #078c89;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .register-card h1 {
          text-align: center;
          font: 800 29px 'Manrope', sans-serif;
          color: #15365c;
          margin: 9px 0;
        }

        .register-intro {
          text-align: center;
          color: #718198;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 26px;
        }

        .register-field {
          display: block;
          color: #34465f;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .register-input {
          display: block;
          width: 100%;
          margin-top: 8px;
          padding: 14px 15px;
          border: 1px solid #d2deea;
          border-radius: 10px;
          background: #fbfdff;
          color: #17243b;
          font: 15px 'DM Sans', sans-serif;
          outline: none;
        }

        .register-input:focus {
          border-color: #0a9991;
          box-shadow: 0 0 0 3px rgba(10,153,145,.12);
        }

        .register-button {
          width: 100%;
          border: 0;
          border-radius: 11px;
          padding: 14px 18px;
          color: white;
          background: linear-gradient(100deg, #173b70, #087f83);
          font: 700 15px 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 7px 17px rgba(17,74,112,.18);
          transition: filter .2s;
        }

        .register-button:hover {
          filter: brightness(1.08);
        }

        .register-button:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .register-back {
          margin-top: 11px;
          background: white;
          color: #17436d;
          border: 1px solid #c8d8e7;
          box-shadow: none;
        }

        .register-alert {
          margin: 0 0 15px;
          padding: 11px 13px;
          border-radius: 9px;
          background: #eef8f6;
          color: #08766f;
          border: 1px solid #ccebe5;
          font-size: 13px;
          line-height: 1.5;
        }

        .register-footer {
          text-align: center;
          color: #8190a4;
          font-size: 12px;
          margin-top: 20px;
        }

        @media (max-width: 520px) {
          .register-card {
            padding: 25px 21px;
          }

          .register-brand-title {
            font-size: 17px;
          }
        }
      `}</style>

      <div className="register-brand">
        <img
          className="register-logo"
          src="/images/srulogo.png"
          alt="SR University Logo"
        />
        <div>
          <div className="register-brand-title">SR UNIVERSITY</div>
          <div className="register-brand-sub">
            SMART INVENTORY MANAGEMENT SYSTEM
          </div>
        </div>
      </div>

      <main className="register-card">
        <div className="register-kicker">Student portal</div>
        <h1>Create Account</h1>
        <p className="register-intro">
          Register with your details to access the SR University inventory portal.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleRegister();
          }}
        >
          <label className="register-field">
            Full Name
            <input
              className="register-input"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="register-field">
            Email Address
            <input
              className="register-input"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="register-field">
            Password
            <input
              className="register-input"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {message && (
            <p className="register-alert" role="status">
              {message}
            </p>
          )}

          <button
            className="register-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Student Account"}
          </button>
        </form>

        <button
          className="register-button register-back"
          onClick={onBackToLogin}
        >
          Back to Login
        </button>

        <div className="register-footer">
          SR UNIVERSITY · Authorized college users only
        </div>
      </main>
    </div>
  );
}

export default Register;
