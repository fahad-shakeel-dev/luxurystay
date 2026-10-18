"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import "./animations.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);
  const signingIn = useRef(false);
  const loading = pending !== null;

  const router = useRouter();
  const { status } = useSession();

  const destination = () => {
    const callback = new URLSearchParams(window.location.search).get("callbackUrl");
    try {
      const url = new URL(callback || "/userDashboard", window.location.origin);
      if (url.origin === window.location.origin && !url.pathname.startsWith("//") && !url.pathname.startsWith("/auth/") && !url.pathname.startsWith("/api/auth")) {
        return url.pathname + url.search + url.hash;
      }
    } catch {}
    return "/userDashboard";
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    if (code) {
      const messages = {
        Callback: "Google sign-in could not be completed. Please try again or sign in with your email and password.",
        OAuthCallback: "Google sign-in could not be completed. Please try again or sign in with your email and password.",
        OAuthSignin: "Unable to connect to Google. Please try again.",
        OAuthAccountNotLinked: "This email already uses another sign-in method. Please use your original sign-in method.",
        CredentialsSignin: "The email or password is incorrect. Please try again.",
        AccessDenied: "Sign-in was not approved. Please try again.",
        Configuration: "Sign-in is temporarily unavailable. Please try again later.",
      };
      setError(messages[code] || "Sign-in could not be completed. Please try again.");
    }
    // Browsers can restore the pre-Google page from their back/forward cache.
    const restore = () => { signingIn.current = false; setPending(null); };
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);

  useEffect(() => {
    if (status === "authenticated") router.replace(destination());
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signingIn.current) return;
    signingIn.current = true;
    setPending("credentials");
    setError("");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res?.ok || res.error) {
        setError("Invalid credentials");
        signingIn.current = false;
        setPending(null);
        return;
      }

      setPending("redirecting");
      router.replace(destination());
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
      signingIn.current = false;
      setPending(null);
    }
  };

  const handleGoogleLogin = async () => {
    if (signingIn.current) return;
    signingIn.current = true;
    setPending("google");
    setError("");
    try {
      const result = await signIn("google", { callbackUrl: destination() });
      if (result?.error) throw new Error("Google sign-in failed");
    } catch {
      setError("Unable to connect to Google. Please try again.");
      signingIn.current = false;
      setPending(null);
    }
  };

  if (status !== "unauthenticated") {
    return (
      <div className="login-session-wait" role="status" aria-live="polite">
        <span className="login-spinner" aria-hidden="true" />
        <p>{status === "authenticated" ? "Signed in! Opening your dashboard..." : "Checking your session..."}</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-black px-4 py-6 text-amber-500">
      <BackgroundAnimation />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-900 bg-opacity-80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-md relative z-10 border border-amber-500"
      >
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Sign in" aria-busy={loading}>
          <h1 className="text-4xl font-extrabold text-center text-amber-500 animate-gradient-text">
            User Login
          </h1>

          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            whileHover={{ scale: 1.05, backgroundColor: "#f59e0b" }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 border border-amber-500 text-amber-500 px-4 py-3 rounded-lg transition duration-300 disabled:opacity-60 disabled:cursor-wait"
          >
            {pending === "google" ? <span className="login-spinner" aria-hidden="true" /> : <FaGoogle className="text-red-500" />}
            {pending === "google" ? "Connecting to Google..." : "Sign in with Google"}
          </motion.button>

          <div className="relative group">
            <input
              type="email"
              id="login-email"
              autoComplete="username"
              disabled={loading}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-field peer"
              placeholder="Email Address"
            />
            <MdEmail className="input-icon" />
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div className="form-field-underline"></div>
          </div>

          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              id="login-password"
              autoComplete="current-password"
              disabled={loading}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-field peer"
              placeholder="Password"
            />
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <button
              type="button"
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="icon-btn"
            >
              {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
            <div className="form-field-underline"></div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-amber-500 text-gray-900 py-3 rounded-lg font-semibold shadow-lg transition duration-300 disabled:opacity-50"
          >
            {pending === "credentials" || pending === "redirecting" ? (
              <span className="flex items-center justify-center">
                <span className="login-spinner mr-3" aria-hidden="true" />
                {pending === "redirecting" ? "Opening your account..." : "Signing in..."}
              </span>
            ) : (
              "Login"
            )}
          </motion.button>

          <div className="login-feedback" role="status" aria-live="polite" aria-atomic="true">
            {loading && (
              <div className="login-progress">
                <div className="login-progress-track" aria-hidden="true"><span /></div>
                <p>{pending === "google" ? "Please wait while we connect you to Google." : pending === "redirecting" ? "You're signed in. Taking you to your account..." : "Checking your details. Please wait..."}</p>
              </div>
            )}
          </div>
          {error && <div className="login-error" role="alert">{error}</div>}

          <p className="text-center text-gray-300">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-bold text-amber-500 hover:text-amber-400 transition-colors duration-200">
              Register
            </Link>
          </p>
          <Link
            href="/"
            className="mx-auto flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-700 text-sm font-semibold text-gray-200 transition-colors hover:border-amber-500 hover:text-amber-400"
          >
            Go to website
          </Link>
        </form>
      </motion.div>

    </div>
  );
}

const BackgroundAnimation = () => {
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(245, 158, 11, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        const connections = [];
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            connections.push({ j, distance });
          }
        }
        connections.sort((a, b) => a.distance - b.distance);
        for (let k = 0; k < Math.min(3, connections.length); k++) {
          const j = connections[k].j;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(245, 158, 11, ${1 - connections[k].distance / 150})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      frame = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <canvas id="particle-canvas" className="w-full h-full"></canvas>
    </div>
  );
};
