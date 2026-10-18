// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { FaUser, FaCamera, FaPhone } from "react-icons/fa";
// import { RiLockPasswordFill } from "react-icons/ri";
// import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
// import { CldUploadWidget } from "next-cloudinary";
// import Swal from "sweetalert2";
// import "./RegisterForm.css";

// const RegisterForm = () => {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleImageUploadSuccess = (results) => {
//     if (results.info?.secure_url && results.event === "success") {
//       setImage(results.info.secure_url);
//       setImagePreview(results.info.secure_url);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Validate all fields
//     if (!name || !phone || !email || !password || !confirmPassword || !image) {
//       setError("All fields are required.");
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Check if user exists
//       const resUserExists = await fetch("/api/userExists", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       if (!resUserExists.ok) {
//         throw new Error("Failed to check user existence");
//       }

//       const { user } = await resUserExists.json();
//       if (user) {
//         setError("User already exists.");
//         setLoading(false);
//         return;
//       }

//       // Register user
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           phone,
//           email,
//           password,
//           image,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Registration failed");
//       }

//       // Success
//       const form = e.target;
//       form.reset();
//       Swal.fire({
//         icon: "success",
//         title: "Registration Successful",
//         text: "You have been successfully registered!",
//         confirmButtonText: "OK",
//       }).then(() => {
//         router.push("/auth/login");
//       });
//     } catch (error) {
//       console.error("Registration error:", error);
//       setError(error.message || "Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen mt-16 grid md:grid-cols-2 bg-gradient-to-br from-black to-amber-900 relative overflow-hidden">
//       <BackgroundAnimation />
//       <div className="hidden md:flex flex-col justify-center p-12 relative z-10">
//         <h1 className="text-5xl font-bold text-amber-500 mb-4 animate-pulse">
//           Luxury<span className="text-white">Stay</span>
//         </h1>
//         <p className="text-white text-lg">Create your account for bookings and management.</p>
//       </div>

//       <div className="flex items-center justify-center p-6 relative z-10">
//         <div className="w-full max-w-md bg-black bg-opacity-60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-amber-500">
//           <h2 className="text-3xl font-bold text-center text-amber-500 mb-8">Create Account</h2>

//           <div className="flex justify-center mb-6">
//             <div className="relative">
//               {imagePreview ? (
//                 <img
//                   src={imagePreview}
//                   alt="Profile preview"
//                   className="w-24 h-24 rounded-full object-cover border-4 border-amber-500"
//                 />
//               ) : (
//                 <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center border-4 border-amber-500">
//                   <FaUser className="w-12 h-12 text-amber-500" />
//                 </div>
//               )}
//               <CldUploadWidget
//                 uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
//                 onSuccess={handleImageUploadSuccess}
//                 options={{ cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, multiple: false }}
//               >
//                 {({ open }) => (
//                   <button
//                     type="button"
//                     onClick={open}
//                     className="absolute bottom-0 right-0 bg-amber-600 rounded-full p-2 hover:bg-amber-700"
//                   >
//                     <FaCamera className="text-black" />
//                   </button>
//                 )}
//               </CldUploadWidget>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="relative">
//               <input 
//                 onChange={(e) => setName(e.target.value)} 
//                 type="text" 
//                 placeholder="Full Name" 
//                 required
//                 className="form-field" 
//               />
//               <FaUser className="input-icon" />
//             </div>

//             <div className="relative">
//               <input 
//                 onChange={(e) => setPhone(e.target.value)} 
//                 type="tel" 
//                 placeholder="Phone Number" 
//                 required
//                 className="form-field" 
//               />
//               <FaPhone className="input-icon" />
//             </div>

//             <div className="relative">
//               <input 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 type="email" 
//                 placeholder="Email Address" 
//                 required
//                 className="form-field" 
//               />
//               <MdEmail className="input-icon" />
//             </div>

//             <div className="relative">
//               <input 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 type={showPassword ? "text" : "password"} 
//                 placeholder="Password" 
//                 required
//                 className="form-field" 
//               />
//               <button 
//                 type="button" 
//                 onClick={() => setShowPassword(!showPassword)} 
//                 className="icon-btn"
//               >
//                 {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
//               </button>
//             </div>

//             <div className="relative">
//               <input 
//                 onChange={(e) => setConfirmPassword(e.target.value)} 
//                 type={showConfirmPassword ? "text" : "password"} 
//                 placeholder="Confirm Password" 
//                 required
//                 className="form-field" 
//               />
//               <button 
//                 type="button" 
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
//                 className="icon-btn"
//               >
//                 {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
//               </button>
//             </div>

//             <button 
//               type="submit" 
//               disabled={loading}
//               className="w-full py-3 text-black bg-amber-500 rounded-lg hover:bg-amber-600 font-semibold"
//             >
//               {loading ? "Creating Account..." : "Create Account"}
//             </button>
//           </form>

//           {error && (
//             <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//               {error}
//             </div>
//           )}

//           <p className="mt-6 text-sm text-white text-center">
//             Already have an account?{" "}
//             <Link href="/auth/login" className="text-amber-500 underline">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

//   );
// };

// export default RegisterForm;














"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaCamera, FaPhone } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import LocalImageUpload from "@/components/LocalImageUpload";
import Swal from "sweetalert2";
import "./RegisterForm.css";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageUploadSuccess = (urls) => {
    setImage(urls[0]);
    setImagePreview(urls[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !phone || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!resUserExists.ok) {
        throw new Error("Failed to check user existence");
      }

      const { user } = await resUserExists.json();
      if (user) {
        setError("User already exists.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          image,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const form = e.target;
      form.reset();
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You have been successfully registered!",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/auth/login");
      });
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-black px-4 py-3">
      <BackgroundAnimation />
      <div className="relative z-10 w-full max-w-lg">
        <div className="w-full rounded-2xl border border-amber-500/70 bg-gray-900/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-lg sm:p-6">
          <p className="mb-1 text-center text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">LuxuryStay</p>
          <h1 className="mb-4 text-center text-3xl font-extrabold text-amber-500">
            Create your account
          </h1>

          <div className="mb-4 flex justify-center">
            <div className="relative group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-amber-500 shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-amber-100 flex items-center justify-center border-4 border-amber-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaUser className="w-14 h-14 text-amber-600" />
                </div>
              )}
              <LocalImageUpload onUpload={handleImageUploadSuccess} multiple={false}>
                {({ open, isUploading }) => (
                  <button
                    type="button"
                    onClick={open}
                    disabled={isUploading}
                    aria-label="Upload profile photo"
                    className="absolute bottom-0 right-0 rounded-full bg-amber-500 p-2 hover:bg-amber-600"
                  >
                    <FaCamera className="h-4 w-4 text-gray-900" />
                  </button>
                )}
              </LocalImageUpload>
            </div>
            <p className="mt-2 text-xs text-gray-300">Profile photo is optional</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="relative group">
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Full Name"
                required
                className="form-field"
              />
              <FaUser className="input-icon" />
              <div className="form-field-underline"></div>
            </div>

            <div className="relative group">
              <input
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Phone Number"
                required
                className="form-field"
              />
              <FaPhone className="input-icon" />
              <div className="form-field-underline"></div>
            </div>

            <div className="relative group">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                required
                className="form-field"
              />
              <MdEmail className="input-icon" />
              <div className="form-field-underline"></div>
            </div>

            <div className="relative group">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="form-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="icon-btn"
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
              <div className="form-field-underline"></div>
            </div>

            <div className="relative group">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                className="form-field"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="icon-btn"
              >
                {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
              <div className="form-field-underline"></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full rounded-lg bg-amber-500 py-2 text-gray-900 hover:bg-amber-600 font-semibold shadow-lg transition-colors sm:col-span-2"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-gray-900"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-3 rounded-lg border border-red-500 bg-red-900/50 p-3 text-red-200 shadow-md">
              {error}
            </div>
          )}

          <p className="mt-4 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-amber-500 hover:text-amber-400 underline transition-colors duration-200">
              Login
            </Link>
          </p>
          <Link
            href="/"
            className="mx-auto mt-3 flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-700 text-sm font-semibold text-gray-200 transition-colors hover:border-amber-500 hover:text-amber-400"
          >
            Go to website
          </Link>
        </div>
      </div>
    </div>
  );
};

const BackgroundAnimation = () => {
  useEffect(() => {
    const canvas = document.getElementById("hexagon-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hexagons = [];
    const hexagonCount = 30;

    class Hexagon {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 10 + 5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.opacity = Math.random() * 0.5 + 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = this.size * Math.cos(angle);
          const y = this.size * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(245, 158, 11, ${this.opacity})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(245, 158, 11, ${this.opacity})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(245, 158, 11, ${this.opacity * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }
    }

    for (let i = 0; i < hexagonCount; i++) {
      hexagons.push(new Hexagon());
    }

    function connectHexagons() {
      for (let i = 0; i < hexagons.length; i++) {
        const connections = [];
        for (let j = i + 1; j < hexagons.length; j++) {
          const dx = hexagons[i].x - hexagons[j].x;
          const dy = hexagons[i].y - hexagons[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            connections.push({ j, distance });
          }
        }
        connections.sort((a, b) => a.distance - b.distance);
        for (let k = 0; k < Math.min(3, connections.length); k++) {
          const j = connections[k].j;
          ctx.beginPath();
          ctx.moveTo(hexagons[i].x, hexagons[i].y);
          ctx.lineTo(hexagons[j].x, hexagons[j].y);
          ctx.strokeStyle = `rgba(245, 158, 11, ${1 - connections[k].distance / 150})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hexagons.forEach((hexagon) => {
        hexagon.update();
        hexagon.draw();
      });
      connectHexagons();
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <canvas id="hexagon-canvas" className="w-full h-full"></canvas>
    </div>
  );
};

export default RegisterForm;