import { useState } from "react";
import { API_BASE_URL } from "./config";

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

type LoginRole = "admin" | "viewer";

function Login({ onLogin, onRegister }: LoginProps) {
  const [loginRole, setLoginRole] = useState<LoginRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (
        response.ok &&
        data.message === "Login successful" &&
        data.access_token
      ) {
        if (data.role !== loginRole) {
          setMessage(
            `This account is not authorized for ${
              loginRole === "admin" ? "Administrator" : "Student"
            } login.`
          );
          return;
        }

        onLogin({
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          role: data.role,
          access_token: data.access_token,
        });
      } else {
        setMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server. Please check whether the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = loginRole === "admin";

  return (
    <div className="auth-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap');
        .auth-page, .auth-page * { box-sizing: border-box; }
        .auth-page {
          min-height: 100vh; display: flex; flex-direction: column;
          color: #17243b; font-family: 'DM Sans', sans-serif;
          background: radial-gradient(circle at 12% 15%, rgba(36,190,177,.18), transparent 28%),
                      radial-gradient(circle at 88% 85%, rgba(49,103,180,.18), transparent 30%),
                      linear-gradient(135deg,#f4f8fc 0%,#eaf1f8 100%);
        }
        .auth-header {
          display:flex; align-items:center; gap:16px; padding:18px clamp(20px,6vw,88px);
          color:#fff; background:linear-gradient(110deg,#10294d,#174d70 65%,#087f83);
          box-shadow:0 8px 28px rgba(16,41,77,.18);
        }
        .auth-logo {
          width:64px;height:64px;object-fit:contain;background:#fff;border-radius:15px;padding:5px;
          box-shadow:0 4px 14px rgba(0,0,0,.12);
        }
        .auth-brand {font:800 21px 'Manrope',sans-serif;letter-spacing:.7px}
        .auth-brand-sub {font-size:11px;letter-spacing:1.8px;opacity:.82;margin-top:4px}
        .auth-main {width:min(900px,100%);margin:auto;padding:48px 22px 38px}
        .auth-heading{text-align:center;margin-bottom:30px}
        .auth-eyebrow{color:#078c89;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase}
        .auth-heading h1{font:800 clamp(27px,4vw,36px) 'Manrope',sans-serif;color:#15365c;margin:10px 0}
        .auth-heading p{color:#687991;margin:0;line-height:1.7}
        .auth-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
        .auth-card{
          background:rgba(255,255,255,.94);border:1px solid #dce7f1;border-radius:22px;
          padding:30px;box-shadow:0 16px 45px rgba(25,58,94,.09);
        }
        .auth-choice{transition:transform .2s,box-shadow .2s;border-top:4px solid #0c9991}
        .auth-choice:hover{transform:translateY(-5px);box-shadow:0 22px 48px rgba(25,58,94,.15)}
        .auth-icon{width:58px;height:58px;display:grid;place-items:center;border-radius:17px;
          background:#e4f5f3;font-size:29px;margin-bottom:17px}
        .auth-card h2{font:800 22px 'Manrope',sans-serif;color:#183c65;margin:0 0 10px}
        .auth-description{color:#6b7b91;line-height:1.7;min-height:52px;margin:0 0 22px}
        .auth-button{
          width:100%;border:0;border-radius:11px;padding:14px 18px;color:#fff;
          background:linear-gradient(100deg,#173b70,#087f83);font:700 15px 'DM Sans',sans-serif;
          cursor:pointer;box-shadow:0 7px 17px rgba(17,74,112,.18);transition:filter .2s,transform .2s
        }
        .auth-button:hover{filter:brightness(1.08);transform:translateY(-1px)}
        .auth-button:disabled{opacity:.65;cursor:not-allowed;transform:none}
        .auth-secondary{background:#fff;color:#17436d;border:1px solid #c8d8e7;box-shadow:none}
        .auth-secondary:hover{background:#f2f8fb}
        .auth-form-card{max-width:460px;margin:0 auto}
        .auth-form-card h2{margin-bottom:6px}
        .auth-form-note{color:#718198;font-size:14px;margin:0 0 22px}
        .auth-field{display:block;color:#34465f;font-size:13px;font-weight:700;margin:0 0 16px}
        .auth-input{display:block;width:100%;margin-top:8px;padding:14px 15px;border:1px solid #d2deea;
          border-radius:10px;background:#fbfdff;color:#17243b;font:15px 'DM Sans',sans-serif;outline:none}
        .auth-input:focus{border-color:#0a9991;box-shadow:0 0 0 3px rgba(10,153,145,.12)}
        .auth-alert{background:#fff0ef;color:#ad3028;border:1px solid #ffd3cf;border-radius:9px;
          padding:11px 13px;font-size:13px;line-height:1.5;margin:0}
        .auth-switch{text-align:center;color:#708097;font-size:13px;margin:20px 0 9px}
        .auth-footer{text-align:center;color:#7b8ba0;font-size:12px;padding:0 20px 24px}
        .auth-footer span{color:#078c89;font-weight:700}
        @media(max-width:620px){
          .auth-choice-grid{grid-template-columns:1fr}
          .auth-header{padding:15px 20px}.auth-logo{width:54px;height:54px}
          .auth-brand{font-size:18px}.auth-brand-sub{font-size:9px;letter-spacing:1.2px}
          .auth-main{padding-top:34px}.auth-card{padding:24px}
        }
      `}</style>

      <header className="auth-header">
        <img className="auth-logo" src="/images/srulogo.png" alt="SR University Logo" />
        <div>
          <div className="auth-brand">SR UNIVERSITY</div>
          <div className="auth-brand-sub">SMART INVENTORY MANAGEMENT SYSTEM</div>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-heading">
          <div className="auth-eyebrow">Campus inventory portal</div>
          <h1>
            {loginRole
              ? `${isAdmin ? "Administrator" : "Student"} Login`
              : "Welcome to SR University"}
          </h1>
          <p>
            {loginRole
              ? "Sign in with your authorized college account to continue."
              : "Choose your access type to securely continue."}
          </p>
        </div>

        {!loginRole ? (
          <div className="auth-choice-grid">
            <section className="auth-card auth-choice">
              <div className="auth-icon">🛡️</div>
              <h2>Administrator</h2>
              <p className="auth-description">
                Manage campus inventory, rooms, assets and records.
              </p>
              <button className="auth-button" onClick={() => { setLoginRole("admin"); setMessage(""); }}>
                Administrator Login
              </button>
            </section>

            <section className="auth-card auth-choice">
              <div className="auth-icon">🎓</div>
              <h2>Student</h2>
              <p className="auth-description">
                View inventory information, search assets and check reports.
              </p>
              <button className="auth-button" onClick={() => { setLoginRole("viewer"); setMessage(""); }}>
                Student Login
              </button>
            </section>
          </div>
        ) : (
          <section className="auth-card auth-form-card">
            <h2>{isAdmin ? "Administrator Access" : "Student Access"}</h2>
            <p className="auth-form-note">Enter your registered account details below.</p>
            <form onSubmit={(event) => { event.preventDefault(); void handleLogin(); }}>
              <label className="auth-field">
                Email address
                <input className="auth-input" type="email" autoComplete="username"
                  placeholder="name@example.com" value={email}
                  onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label className="auth-field">
                Password
                <input className="auth-input" type="password" autoComplete="current-password"
                  placeholder="Enter your password" value={password}
                  onChange={(event) => setPassword(event.target.value)} />
              </label>

              {message && <p className="auth-alert" role="alert">{message}</p>}

              <button className="auth-button" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in securely"}
              </button>
            </form>

            <p className="auth-switch">New student? Create your account below.</p>
            <button className="auth-button auth-secondary" onClick={onRegister}>Create Student Account</button>
            <button className="auth-button auth-secondary" style={{ marginTop: 10 }}
              onClick={() => { setLoginRole(null); setEmail(""); setPassword(""); setMessage(""); }}>
              Back to Login Choices
            </button>
          </section>
        )}
      </main>

      <footer className="auth-footer">
        <span>SR UNIVERSITY</span> · Authorized college users only
      </footer>
    </div>
  );
}

export default Login;
