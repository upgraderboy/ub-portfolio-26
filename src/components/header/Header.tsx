"use client";

import React, { useState, useEffect } from "react";
import UB from "../../assets/upgraderboy_dark.svg";
import AB from "../../assets/logo1.svg";
import { usePortfolioData } from "../db/PortfolioContext";
import { auth, isFirebaseConfigured } from "../db/firebase";
import "./header.css";
// import Register from "../auth/Register.jsx";
import Mode from "../mode/Mode";

// import "../../../public/share.js";
interface HeaderProps {
  currentRoute: string;
  navigate: (to: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentRoute, navigate })=>{
  const [dark, setMode] = useState(false);
  const [Toggle, showMenu] = useState(false);
  const [activeNav, setActiveNav] = useState("#home");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMode(localStorage.getItem("mode") === "light");
    }
  }, []);

  const { 
    user, 
    authLoading, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    logOut,
    refreshUser
  } = usePortfolioData();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoadingState, setAuthLoadingState] = useState(false);

  // User Profile Form States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileLocation, setProfileLocation] = useState("");
  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const getFriendlyAuthErrorMessage = (err: any): string => {
    if (!err) return "An unexpected error occurred.";
    const code = err.code || "";
    
    switch (code) {
      case "auth/operation-not-allowed":
        return "Sign-in methods are disabled. Please go to Firebase Console > Authentication > Sign-in method and enable 'Email/Password' and 'Google'.";
      case "auth/email-already-in-use":
        return "This email address is already in use by another account.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "The password is too weak. It must be at least 6 characters long.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password. Please try again.";
      case "auth/popup-closed-by-user":
        return "The Google login popup was closed before completion.";
      case "auth/cancelled-popup-request":
        return "Google login popup request was cancelled.";
      default:
        return err.message || "Authentication failed. Please try again.";
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoadingState(true);
    try {
      await signInWithEmail(email, password);
      setShowAuthModal(false);
      resetForm();
    } catch (err: any) {
      setAuthError(getFriendlyAuthErrorMessage(err));
    } finally {
      setAuthLoadingState(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoadingState(true);
    try {
      await signUpWithEmail(email, password, name);
      setShowAuthModal(false);
      resetForm();
    } catch (err: any) {
      setAuthError(getFriendlyAuthErrorMessage(err));
    } finally {
      setAuthLoadingState(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setAuthLoadingState(true);
    try {
      await signInWithGoogle();
      setShowAuthModal(false);
      resetForm();
    } catch (err: any) {
      setAuthError(getFriendlyAuthErrorMessage(err));
    } finally {
      setAuthLoadingState(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setAuthError("");
  };

  // Listen for open-auth-modal events to trigger login modal
  useEffect(() => {
    const handleOpenAuth = () => {
      setShowAuthModal(true);
      setAuthTab("signin");
    };
    window.addEventListener("open-auth-modal", handleOpenAuth);
    return () => window.removeEventListener("open-auth-modal", handleOpenAuth);
  }, []);

  // Fetch extra profile details when the profile modal is opened
  useEffect(() => {
    if (!showProfileModal || !user) return;
    
    setProfileName(user.displayName || "");
    setProfilePhotoURL(user.photoURL || "");
    setProfilePhone("");
    setProfileBio("");
    setProfileLocation("");

    const fetchDetails = async () => {
      setProfileLoading(true);
      try {
        const response = await fetch(`/api/users/${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          if (data.name) setProfileName(data.name);
          if (data.phone_number) setProfilePhone(data.phone_number);
          if (data.bio) setProfileBio(data.bio);
          if (data.location) setProfileLocation(data.location);
          if (data.photo_url) setProfilePhotoURL(data.photo_url);
        }
      } catch (e) {
        console.error("Failed to load user profile:", e);
      }
      setProfileLoading(false);
    };

    fetchDetails();
  }, [showProfileModal, user]);

  // Save the updated profile details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileSaving(true);
    setProfileSuccess(false);

    try {
      if (isFirebaseConfigured && auth) {
        const { updateProfile } = await import("firebase/auth");
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: profileName,
            photoURL: profilePhotoURL || null
          });
        }

        await fetch(`/api/users/${user.uid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName: profileName,
            email: user.email,
            phoneNumber: profilePhone,
            photoURL: profilePhotoURL,
            bio: profileBio,
            location: profileLocation
          })
        });

        await refreshUser();
      } else {
        const updatedUser = {
          ...user,
          displayName: profileName,
          photoURL: profilePhotoURL || null
        };
        localStorage.setItem("portfolio_mock_user", JSON.stringify(updatedUser));
        localStorage.setItem(`profile_details_${user.uid}`, JSON.stringify({
          displayName: profileName,
          phoneNumber: profilePhone,
          photoURL: profilePhotoURL,
          bio: profileBio,
          location: profileLocation
        }));
        window.location.reload();
      }
      setProfileSuccess(true);
      setTimeout(() => {
        setProfileSuccess(false);
        setShowProfileModal(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile details. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (currentRoute !== "/") {
      e.preventDefault();
      navigate("/" + hash);
    } else {
      setActiveNav(hash);
    }
  };

  const handleSubrouteClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };
  
  // const [toggleState, setToggleState] = useState(false);

  // // const toggleTab = (index) => {
  // //   setToggleState(index);
  // // };
  // window.addEventListener("scroll", function(){

  //   const header = this.document.querySelector(".header");
  //   if(this.scrollY >= 80) header.classList.add("scroll-header");
    
  //   else header.classList.remove("scroll-header");})
  return (
    <>
      <header className="header">
        <nav className="nav container">
          <a
            className="nav__logo"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            href="/"
            rel="noopener noreferrer"
          >
            <img
              src={!dark ? "/assets/upgraderboy_dark.svg" : "/assets/logo1.svg"}
              style={{ height: "200px" }}
              alt="Upgrader Boy"
            />
            
          </a>
          <div className={Toggle ? "nav__menu show-menu" : "nav__menu"}>
            <ul className="nav__list">
              {currentRoute === "/" ? (
                <>
                  <li className="nav__item">
                    <a
                      href="#home"
                      onClick={(e) => handleNavClick(e, "#home")}
                      className={activeNav === "#home" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-estate nav__icon active-link"></i>Home
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="#about"
                      onClick={(e) => handleNavClick(e, "#about")}
                      className={activeNav === "#about" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-user nav__icon"></i>About Me
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="#terminal"
                      onClick={(e) => handleNavClick(e, "#terminal")}
                      className={activeNav === "#terminal" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-terminal nav__icon"></i>Console
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="#skills"
                      onClick={(e) => handleNavClick(e, "#skills")}
                      className={activeNav === "#skills" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-file-alt nav__icon"></i>Skills
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="#services"
                      onClick={(e) => handleNavClick(e, "#services")}
                      className={activeNav === "#services" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-briefcase-alt nav__icon"></i>Services
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="#portfolio"
                      onClick={(e) => handleNavClick(e, "#portfolio")}
                      className={activeNav === "#portfolio" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-scenery nav__icon"></i>Portfolio
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="#blogs"
                      onClick={(e) => handleNavClick(e, "#blogs")}
                      className={activeNav === "#blogs" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-book-reader nav__icon"></i>Blogs
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="#contact"
                      onClick={(e) => handleNavClick(e, "#contact")}
                      className={activeNav === "#contact" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-message nav__icon"></i>Contact
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav__item">
                    <a
                      href="/"
                      onClick={(e) => handleSubrouteClick(e, "/")}
                      className="nav__link"
                    >
                      <i className="uil uil-estate nav__icon"></i>Home
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="/memories"
                      onClick={(e) => handleSubrouteClick(e, "/memories")}
                      className={currentRoute === "/memories" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-history nav__icon"></i>Memories
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="/projects"
                      onClick={(e) => handleSubrouteClick(e, "/projects")}
                      className={currentRoute === "/projects" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-briefcase nav__icon"></i>Projects
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="/resources"
                      onClick={(e) => handleSubrouteClick(e, "/resources")}
                      className={currentRoute === "/resources" ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-book-open nav__icon"></i>Resources
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="/blogs"
                      onClick={(e) => handleSubrouteClick(e, "/blogs")}
                      className={(currentRoute === "/blogs" || currentRoute.startsWith("/blog/")) ? "nav__link active-link" : "nav__link"}
                    >
                      <i className="uil uil-book-reader nav__icon"></i>Blogs
                    </a>
                  </li>
                  <li className="nav__item">
                    <a
                      href="/#contact"
                      onClick={(e) => handleSubrouteClick(e, "/#contact")}
                      className="nav__link"
                    >
                      <i className="uil uil-message nav__icon"></i>Contact
                    </a>
                  </li>
                </>
              )}
            </ul>
            <i
              className="uil uil-times nav__close"
              onClick={() => showMenu(!Toggle)}
            ></i>
          </div>
          <div className="nav__toggle" onClick={() => showMenu(!Toggle)}>
            <i className="uil uil-apps"></i>
          </div>
          <div style={{ display: "flex", alignItems: "center", columnGap: "1rem" }}>
            <div className="mode" onClick={()=>setMode(!dark)}><Mode /></div>
            
            {/* User Profile / Login Button */}
            {authLoading ? (
              <div className="portfolio-loader-circle" style={{ width: "20px", height: "20px", borderWidth: "2px" }} />
            ) : user ? (
              <div style={{ position: "relative" }}>
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    columnGap: "0.5rem",
                    padding: 0
                  }}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--green-color)" }} />
                  ) : (
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--first-color)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700 }}>
                      {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                {showUserDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 0.5rem)",
                      backgroundColor: "var(--container-color)",
                      border: "1px solid rgba(100, 116, 139, 0.15)",
                      borderRadius: "0.75rem",
                      padding: "0.75rem",
                      minWidth: "160px",
                      zIndex: 1000,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: "var(--text-color-light)", marginBottom: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Hi, {user.displayName || user.email?.split("@")[0] || "User"}
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowUserDropdown(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "0.5rem",
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        background: "transparent",
                        color: "var(--title-color)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        transition: "background 0.2s",
                        marginBottom: "0.25rem"
                      }}
                      className="nav__user-menu-item"
                    >
                      <i className="uil uil-user-circle" style={{ fontSize: "1.1rem", color: "var(--green-color)" }}></i> My Profile
                    </button>
                    <button
                      onClick={() => {
                        logOut();
                        setShowUserDropdown(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "0.5rem",
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        background: "rgba(239, 68, 68, 0.08)",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        transition: "background 0.2s"
                      }}
                    >
                      <i className="uil uil-signout"></i> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  columnGap: "0.35rem",
                  background: "var(--first-color)",
                  color: "#fff",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "2rem",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  transition: "background 0.2s"
                }}
              >
                <i className="uil uil-signin" style={{ fontSize: "1rem" }}></i> Login
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "1rem"
          }}
          onClick={() => {
            setShowAuthModal(false);
            resetForm();
          }}
        >
          <div 
            style={{
              backgroundColor: "var(--container-color)",
              border: "1px solid rgba(100, 116, 139, 0.15)",
              borderRadius: "1.25rem",
              padding: "2rem",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowAuthModal(false);
                resetForm();
              }}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                color: "var(--text-color-light)",
                cursor: "pointer",
                padding: "0.25rem",
                lineHeight: 1
              }}
            >
              <i className="uil uil-times"></i>
            </button>

            {/* Title / Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(100, 116, 139, 0.15)", marginBottom: "1.5rem" }}>
              <button 
                onClick={() => { setAuthTab("signin"); setAuthError(""); }}
                style={{
                  flex: 1,
                  padding: "0.75rem 0.5rem",
                  background: "transparent",
                  border: "none",
                  borderBottom: authTab === "signin" ? "2px solid var(--green-color)" : "2px solid transparent",
                  color: authTab === "signin" ? "var(--title-color)" : "var(--text-color-light)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthTab("signup"); setAuthError(""); }}
                style={{
                  flex: 1,
                  padding: "0.75rem 0.5rem",
                  background: "transparent",
                  border: "none",
                  borderBottom: authTab === "signup" ? "2px solid var(--green-color)" : "2px solid transparent",
                  color: authTab === "signup" ? "var(--title-color)" : "var(--text-color-light)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div 
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.8rem",
                  marginBottom: "1rem",
                  lineHeight: "1.4"
                }}
              >
                {authError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={authTab === "signin" ? handleSignIn : handleSignUp} style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
              {authTab === "signup" && (
                <div style={{ display: "flex", flexDirection: "column", rowGap: "0.35rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--title-color)" }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      padding: "0.6rem 0.85rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(100, 116, 139, 0.2)",
                      backgroundColor: "var(--container-color)",
                      color: "var(--title-color)",
                      outline: "none",
                      fontSize: "0.85rem"
                    }}
                  />
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", rowGap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--title-color)" }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(100, 116, 139, 0.2)",
                    backgroundColor: "var(--container-color)",
                    color: "var(--title-color)",
                    outline: "none",
                    fontSize: "0.85rem"
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", rowGap: "0.35rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--title-color)" }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(100, 116, 139, 0.2)",
                    backgroundColor: "var(--container-color)",
                    color: "var(--title-color)",
                    outline: "none",
                    fontSize: "0.85rem"
                  }}
                />
              </div>

              <button 
                type="submit" 
                disabled={authLoadingState}
                style={{
                  backgroundColor: "var(--first-color)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  marginTop: "0.5rem",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  columnGap: "0.5rem"
                }}
              >
                {authLoadingState ? (
                  <div className="portfolio-loader-circle" style={{ width: "16px", height: "16px", borderWidth: "2px", borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#fff" }} />
                ) : null}
                {authTab === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", columnGap: "0.5rem" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(100, 116, 139, 0.15)" }}></div>
              <span style={{ fontSize: "0.7rem", color: "var(--text-color-light)", fontWeight: 500, textTransform: "uppercase" }}>Or Continue With</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(100, 116, 139, 0.15)" }}></div>
            </div>

            {/* Google Login Button */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={authLoadingState}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                columnGap: "0.5rem",
                backgroundColor: "transparent",
                border: "1px solid rgba(100, 116, 139, 0.2)",
                borderRadius: "0.5rem",
                padding: "0.6rem",
                cursor: "pointer",
                color: "var(--title-color)",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(100, 116, 139, 0.05)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: "0.25rem" }}>
                <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.8 2-1.8 2.6v2.2h2.9c1.7-1.6 2.7-4 2.7-6.4z"/>
                <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.8-3.1.8-2.4 0-4.4-1.6-5.1-3.8H.9v2.3C2.4 15.9 5.5 18 9 18z"/>
                <path fill="#FBBC05" d="M3.9 10.6c-.2-.5-.3-1.1-.3-1.6s.1-1.1.3-1.6V5.1H.9C.3 6.3 0 7.6 0 9s.3 2.7.9 3.9l3-2.3z"/>
                <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6C13.5 1 11.4 0 9 0 5.5 0 2.4 2.1.9 5.1l3 2.3c.7-2.2 2.7-3.8 5.1-3.8z"/>
              </svg>
              Google Account
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal Overlay */}
      {showProfileModal && user && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "1rem"
          }}
          onClick={() => setShowProfileModal(false)}
        >
          <div 
            style={{
              backgroundColor: "var(--container-color)",
              border: "1px solid rgba(100, 116, 139, 0.15)",
              borderRadius: "1.25rem",
              padding: "2rem",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowProfileModal(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                color: "var(--text-color-light)",
                cursor: "pointer",
                padding: "0.25rem",
                lineHeight: 1
              }}
            >
              <i className="uil uil-times"></i>
            </button>

            <h3 style={{ fontSize: "1.25rem", color: "var(--title-color)", marginBottom: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="uil uil-user-circle" style={{ color: "var(--green-color)" }}></i> Edit Profile
            </h3>

            {profileLoading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem 0" }}>
                <div className="portfolio-loader-circle" style={{ borderTopColor: "var(--green-color)" }}></div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-color-light)", marginTop: "1rem" }}>Retrieving profile...</span>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
                {profileSuccess && (
                  <div style={{ backgroundColor: "rgba(1, 195, 105, 0.08)", border: "1px solid rgba(1, 195, 105, 0.2)", color: "var(--green-color)", padding: "0.75rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, textAlign: "center" }}>
                    Profile saved successfully!
                  </div>
                )}

                {/* Email (Read Only) */}
                <div style={{ display: "flex", flexDirection: "column", rowGap: "0.35rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--title-color)" }}>Email (Read-only)</label>
                  <input 
                    type="text" 
                    value={user.email || ""} 
                    disabled 
                    style={{
                      padding: "0.6rem 0.85rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(100, 116, 139, 0.15)",
                      backgroundColor: "rgba(100, 116, 139, 0.08)",
                      color: "var(--text-color-light)",
                      fontSize: "0.85rem",
                      cursor: "not-allowed"
                    }}
                  />
                </div>

                {/* Name */}
                <div style={{ display: "flex", flexDirection: "column", rowGap: "0.35rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--title-color)" }}>Display Name</label>
                  <input 
                    type="text" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)} 
                    required 
                    placeholder="John Doe"
                    style={{
                      padding: "0.6rem 0.85rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(100, 116, 139, 0.2)",
                      backgroundColor: "var(--container-color)",
                      color: "var(--title-color)",
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Phone Number */}
                <div style={{ display: "flex", flexDirection: "column", rowGap: "0.35rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--title-color)" }}>Phone Number</label>
                  <input 
                    type="tel" 
                    value={profilePhone} 
                    onChange={(e) => setProfilePhone(e.target.value)} 
                    placeholder="+1 234 567 8900"
                    style={{
                      padding: "0.6rem 0.85rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(100, 116, 139, 0.2)",
                      backgroundColor: "var(--container-color)",
                      color: "var(--title-color)",
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Avatar Image URL */}
                <div style={{ display: "flex", flexDirection: "column", rowGap: "0.35rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--title-color)" }}>Avatar Photo URL</label>
                  <input 
                    type="url" 
                    value={profilePhotoURL} 
                    onChange={(e) => setProfilePhotoURL(e.target.value)} 
                    placeholder="https://example.com/avatar.jpg"
                    style={{
                      padding: "0.6rem 0.85rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(100, 116, 139, 0.2)",
                      backgroundColor: "var(--container-color)",
                      color: "var(--title-color)",
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Location */}
                <div style={{ display: "flex", flexDirection: "column", rowGap: "0.35rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--title-color)" }}>Location</label>
                  <input 
                    type="text" 
                    value={profileLocation} 
                    onChange={(e) => setProfileLocation(e.target.value)} 
                    placeholder="New York, USA"
                    style={{
                      padding: "0.6rem 0.85rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(100, 116, 139, 0.2)",
                      backgroundColor: "var(--container-color)",
                      color: "var(--title-color)",
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Bio */}
                <div style={{ display: "flex", flexDirection: "column", rowGap: "0.35rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--title-color)" }}>Bio Description</label>
                  <textarea 
                    value={profileBio} 
                    onChange={(e) => setProfileBio(e.target.value)} 
                    placeholder="A short bio about yourself..."
                    rows={3}
                    style={{
                      padding: "0.6rem 0.85rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(100, 116, 139, 0.2)",
                      backgroundColor: "var(--container-color)",
                      color: "var(--title-color)",
                      fontSize: "0.85rem",
                      outline: "none",
                      resize: "none",
                      fontFamily: "inherit"
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={profileSaving}
                  style={{
                    backgroundColor: "var(--green-color)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    marginTop: "0.5rem",
                    transition: "background 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    columnGap: "0.5rem"
                  }}
                >
                  {profileSaving ? (
                    <div className="portfolio-loader-circle" style={{ width: "16px", height: "16px", borderWidth: "2px", borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#fff" }} />
                  ) : null}
                  Save Profile Details
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
