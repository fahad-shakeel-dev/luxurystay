import "./login/animations.css";

export default function AuthLoading() {
  return (
    <div className="login-session-wait" role="status" aria-live="polite">
      <span className="login-spinner" aria-hidden="true" />
      <p>Loading sign-in. Please wait...</p>
    </div>
  );
}
