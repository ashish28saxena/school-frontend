import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://school-management-backend-ochre.vercel.app/api/auth";

const emptyForm = {
  name: "",
  email: "",
  mobileNumber: "",
  identifier: "",
  password: "",
  roleId: "",
};

export default function Login({ onSuccess }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type: "error" | "ok", text }
  const [loading, setLoading] = useState(false); // submit button
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false); // roles fetch

  const isLogin = mode === "login";

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setMessage(null);
  };

  const validate = () => {
    const er = {};
    const emailOk = /^\S+@\S+\.\S+$/;
    const mobileOk = /^[0-9]{10}$/;

    if (!form.roleId) er.roleId = "Select your role";

    if (isLogin) {
      const id = form.identifier.trim();
      if (!id) er.identifier = "Enter your email or mobile number";
      else if (!emailOk.test(id) && !mobileOk.test(id))
        er.identifier = "Enter a valid email or 10-digit mobile number";
    } else {
      if (!form.name.trim()) er.name = "Enter your full name";
      const email = form.email.trim();
      const mobile = form.mobileNumber.trim();
      if (!email && !mobile) {
        er.email = "Add an email or a mobile number";
      } else {
        if (email && !emailOk.test(email)) er.email = "Enter a valid email address";
        if (mobile && !mobileOk.test(mobile)) er.mobileNumber = "Enter a 10-digit mobile number";
      }
    }
    if (form.password.length < 6) er.password = "Password must be at least 6 characters";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const request = async (url, options = {}) => {
    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.message || "Something went wrong. Please try again.");
    }
    return result;
  };

  const handleSubmit = async () => {
    setMessage(null);
    if (!validate()) return;

    let body;
    if (isLogin) {
      const id = form.identifier.trim();
      body = {
        loginId: id.includes("@") ? id.toLowerCase() : id,
        password: form.password,
        roleId: form.roleId,
      };
    } else {
      body = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        mobileNumber: form.mobileNumber.trim() || null,
        password: form.password,
        roleId: form.roleId,
      };
    }

    setLoading(true);
    try {
      const data = await request(isLogin ? "/login" : "/register", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (isLogin) {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        onSuccess?.(data);
        navigate("/", { replace: true }); // login ke baad home page
      } else {
        setForm({ ...emptyForm, identifier: body.email || body.mobileNumber || "" });
        setMode("login");
        setMessage({ type: "ok", text: "Account created. Sign in to continue." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const result = await request("/roles");
      setRoles(result.data || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const onEnter = (e) => e.key === "Enter" && handleSubmit();

  return (
    <div className="auth">
      <style>{css}</style>

      <aside className="auth-side">
        <h1>One sign-in for everyone at school.</h1>
        <ul>
          {roles.map((r) => (
            <li key={r._id}>
              <strong>{r.name}</strong>
              <span>{r.name} portal access</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="auth-main">
        <div className="auth-card" onKeyDown={onEnter}>
          <div className="tabs" role="tablist">
            <button
              role="tab"
              aria-selected={isLogin}
              className={isLogin ? "on" : ""}
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={!isLogin}
              className={!isLogin ? "on" : ""}
              onClick={() => switchMode("signup")}
            >
              Create account
            </button>
          </div>

          {message && (
            <p className={`msg ${message.type}`} role="alert">
              {message.text}
            </p>
          )}

          {/* Role selector: login aur signup dono me, sirf ek baar */}
          <fieldset className={`roles ${errors.roleId ? "bad" : ""}`}>
            <legend>{isLogin ? "Sign in as" : "I am a"}</legend>

            {rolesLoading && <span className="hint">Loading roles…</span>}

            {roles.map((r) => (
              <label key={r._id} className={form.roleId === r._id ? "on" : ""}>
                <input
                  type="radio"
                  name="roleId"
                  value={r._id}
                  checked={form.roleId === r._id}
                  onChange={set("roleId")}
                />
                {r.name}
              </label>
            ))}

            {errors.roleId && <span className="err roles-err">{errors.roleId}</span>}
          </fieldset>

          {!isLogin && (
            <>
              <Field label="Full name" error={errors.name}>
                <input value={form.name} onChange={set("name")} autoComplete="name" />
              </Field>
              <Field label="Email" error={errors.email} hint="Optional if you add a mobile number">
                <input type="email" value={form.email} onChange={set("email")} autoComplete="email" />
              </Field>
              <Field label="Mobile number" error={errors.mobileNumber} hint="Optional if you add an email">
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.mobileNumber}
                  onChange={set("mobileNumber")}
                  autoComplete="tel"
                />
              </Field>
            </>
          )}

          {isLogin && (
            <Field label="Email or mobile number" error={errors.identifier}>
              <input value={form.identifier} onChange={set("identifier")} autoComplete="username" />
            </Field>
          )}

          <Field label="Password" error={errors.password}>
            <div className="pw">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </Field>

          <button className="submit" onClick={handleSubmit} disabled={loading}>
            {loading
              ? isLogin
                ? "Signing in…"
                : "Creating account…"
              : isLogin
              ? "Sign in"
              : "Create account"}
          </button>

          <p className="switch">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => switchMode(isLogin ? "signup" : "login")}>
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({ label, error, hint, children }) {
  return (
    <label className={`field ${error ? "bad" : ""}`}>
      <span className="lbl">{label}</span>
      {children}
      {error ? <span className="err">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </label>
  );
}

const css = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;700&display=swap");
.auth{--board:#17382d;--chalk:#f3e9c6;--paper:#f6f7f3;--ink:#1b2420;--mute:#5f6b65;--line:#d5dad4;--bad:#b3261e;--ok:#1f6b45;
  min-height:100vh;display:grid;grid-template-columns:minmax(300px,5fr) 6fr;font-family:"Bricolage Grotesque",system-ui,sans-serif;color:var(--ink);background:var(--paper)}
.auth *{box-sizing:border-box}
.auth-side{background:var(--board);color:var(--chalk);padding:56px 48px;display:flex;flex-direction:column;justify-content:center;gap:36px}
.auth-side h1{font-size:clamp(28px,3.4vw,44px);line-height:1.1;font-weight:700;margin:0;max-width:14ch}
.auth-side ul{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.auth-side li{display:grid;gap:2px;padding-left:14px;border-left:2px solid rgba(243,233,198,.45)}
.auth-side li span{opacity:.75;font-size:14px}
.auth-main{display:grid;place-items:center;padding:32px 20px}
.auth-card{width:100%;max-width:420px;display:grid;gap:16px}
.tabs{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--line)}
.tabs button{font:inherit;font-weight:500;padding:12px 0;background:none;border:0;border-bottom:3px solid transparent;margin-bottom:-1px;color:var(--mute);cursor:pointer}
.tabs button.on{color:var(--ink);border-bottom-color:var(--board)}
.roles{border:0;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:8px}
.roles legend{font-size:14px;font-weight:500;margin-bottom:8px;padding:0}
.roles label{position:relative;text-align:center;padding:9px 4px;font-size:14px;border:1px solid var(--line);border-radius:6px;cursor:pointer;background:#fff;text-transform:capitalize}
.roles label.on{background:var(--board);color:var(--chalk);border-color:var(--board)}
.roles.bad label{border-color:var(--bad)}
.roles input{position:absolute;opacity:0;pointer-events:none}
.roles label:has(input:focus-visible){outline:3px solid #7aa896;outline-offset:2px}
.roles .hint,.roles-err{grid-column:1/-1}
.field{display:grid;gap:6px}
.lbl{font-size:14px;font-weight:500}
.field input{font:inherit;width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:6px;background:#fff;color:var(--ink)}
.field input:focus-visible,.pw button:focus-visible,.submit:focus-visible,.switch button:focus-visible,.tabs button:focus-visible{outline:3px solid #7aa896;outline-offset:2px}
.field.bad input{border-color:var(--bad)}
.err{color:var(--bad);font-size:13px}
.hint{color:var(--mute);font-size:13px}
.pw{position:relative}
.pw input{padding-right:64px}
.pw button{position:absolute;right:6px;top:50%;transform:translateY(-50%);font:inherit;font-size:13px;color:var(--board);background:none;border:0;padding:6px 8px;cursor:pointer;font-weight:500}
.submit{font:inherit;font-weight:700;padding:13px;border:0;border-radius:6px;background:var(--board);color:var(--chalk);cursor:pointer;margin-top:4px}
.submit:hover:not(:disabled){background:#10281f}
.submit:disabled{opacity:.6;cursor:progress}
.switch{margin:0;text-align:center;color:var(--mute);font-size:14px}
.switch button{font:inherit;background:none;border:0;color:var(--board);font-weight:700;cursor:pointer;padding:0;text-decoration:underline}
.msg{margin:0;padding:10px 12px;border-radius:6px;font-size:14px}
.msg.error{background:#fbe9e7;color:var(--bad)}
.msg.ok{background:#e4f2ea;color:var(--ok)}
@media (max-width:760px){
  .auth{grid-template-columns:1fr}
  .auth-side{padding:28px 24px;gap:0}
  .auth-side ul{display:none}
  .auth-side h1{font-size:24px;max-width:none}
}
`;