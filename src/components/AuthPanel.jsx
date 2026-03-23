import React, { useState } from "react";

const initialFormState = {
  name: "",
  email: "",
  password: "",
};

export default function AuthPanel({
  authError,
  currentUser,
  isAuthenticated,
  login,
  logout,
  signup,
  clearAuthError,
}) {
  const [mode, setMode] = useState("login");
  const [formState, setFormState] = useState(initialFormState);

  const updateField = (key, value) => {
    setFormState((current) => ({ ...current, [key]: value }));
    if (authError) {
      clearAuthError();
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setFormState(initialFormState);
    clearAuthError();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const succeeded =
      mode === "login"
        ? login({ email: formState.email, password: formState.password })
        : signup(formState);

    if (succeeded) {
      setFormState(initialFormState);
    }
  };

  if (isAuthenticated) {
    return (
      <section className="auth-panel">
        <div className="auth-copy">
          <p className="eyebrow">Account</p>
          <h2>{currentUser.name}</h2>
          <p className="hero-copy">
            Signed in as {currentUser.email}. You can now download product images.
          </p>
        </div>
        <div className="auth-actions">
          <button type="button" className="auth-button secondary" onClick={logout}>
            Log out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-panel">
      <div className="auth-copy">
        <p className="eyebrow">Download Access</p>
        <h2>Create an account or log in.</h2>
        <p className="hero-copy">
          Recruiters can filter products freely, but image downloads are available
          only after signing in.
        </p>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Create account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className="field">
              <span>Name</span>
              <input
                type="text"
                value={formState.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Your name"
              />
            </label>
          ) : null}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={formState.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="name@example.com"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={formState.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Enter password"
            />
          </label>

          {authError ? <p className="auth-error">{authError}</p> : null}

          <button type="submit" className="auth-button">
            {mode === "login" ? "Login to download" : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}
