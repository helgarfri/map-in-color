// src/components/Signup.js
import React, { useMemo, useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { signUp } from "../api";
import countries from "../data/countries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";

import MICMessageModal from "./MICMessageModal"; // ✅ new component

const PasswordRequirement = ({ text, isValid }) => {
  return (
    <div className={styles.passwordRequirementItem}>
      <div
        className={`${styles.requirementIcon} ${
          isValid ? styles.valid : styles.invalid
        }`}
      />
      <span>{text}</span>
    </div>
  );
};

export default function Signup() {
  const { setAuthToken } = useContext(UserContext);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [subscribePromos, setSubscribePromos] = useState(false);

  const [acceptPolicy, setAcceptPolicy] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // ✅ modal state (instead of alerts)
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgVariant, setMsgVariant] = useState("info"); // error | info | success
  const [msgTitle, setMsgTitle] = useState("Notice");
  const [msgMessage, setMsgMessage] = useState("");
  const [msgDetails, setMsgDetails] = useState(null);

  const daysList = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const yearsList = useMemo(() => Array.from({ length: 100 }, (_, i) => 2025 - i), []);
  const monthsList = useMemo(
    () => [
      { value: "1", label: "January" },
      { value: "2", label: "February" },
      { value: "3", label: "March" },
      { value: "4", label: "April" },
      { value: "5", label: "May" },
      { value: "6", label: "June" },
      { value: "7", label: "July" },
      { value: "8", label: "August" },
      { value: "9", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ],
    []
  );

  const isLongEnough = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!?.#]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";

  const openMsg = ({ variant = "info", title, message, details = null }) => {
    setMsgVariant(variant);
    setMsgTitle(title || "Notice");
    setMsgMessage(message || "");
    setMsgDetails(details);
    setMsgOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!first_name.trim()) newErrors.first_name = "First name is required.";
    if (!last_name.trim()) newErrors.last_name = "Last name is required.";

    if (!year || !month || !day) {
      newErrors.date_of_birth = "Date of birth is required.";
    } else {
      const dob = new Date(`${year}-${month}-${day}`);
      const now = new Date();
      if (dob > now) newErrors.date_of_birth = "Date of birth cannot be in the future.";
    }

    if (!gender) newErrors.gender = "Gender is required.";
    if (!location) newErrors.location = "Location is required.";

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";
    }

    if (!username.trim()) newErrors.username = "Username is required.";

    if (!password) newErrors.password = "Password is required.";
    else if (!isLongEnough || !hasUpperCase || !hasNumber || !hasSpecial)
      newErrors.password = "Password does not meet the requirements.";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (!passwordsMatch) newErrors.confirmPassword = "Passwords do not match.";

    if (!acceptPolicy) newErrors.acceptPolicy = "You need to accept the terms.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const mm = month.toString().padStart(2, "0");
    const dd = day.toString().padStart(2, "0");
    const date_of_birth = `${year}-${mm}-${dd}`;

    setIsSigningUp(true);
    setSignupSuccess(false);

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 10000)
    );

    try {
      const res = await Promise.race([
        signUp({
          first_name,
          last_name,
          date_of_birth,
          gender,
          location,
          email,
          username,
          password,
          subscribe_promos: subscribePromos,
        }),
        timeout,
      ]);

      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      setSignupSuccess(true);

      // Use ref so we always call the current router's navigate (App re-creates the router when authToken changes)
      setTimeout(() => {
        setIsSigningUp(false);
        navigateRef.current("/dashboard", { replace: true });
      }, 400);
    } catch (err) {
      console.error("Signup Error:", err);

      let title = "Sign up failed";
      let message = "Something went wrong. Please try again.";
      let details = null;

      if (err?.message === "timeout") {
        title = "Server timed out";
        message = "The server didn’t respond in time. Please try again.";
      } else if (err?.response) {
        const status = err.response.status;
        const serverMsg = err.response?.data?.msg;

        if (status === 409) {
          title = "Account already exists";
          message = serverMsg || "Try a different email/username.";
        } else if (status === 400) {
          title = "Invalid information";
          message = serverMsg || "Please review the form and try again.";
        } else if (status === 403) {
          title = "Not allowed";
          message = serverMsg || "You are not allowed to sign up right now.";
        } else {
          title = "Server error";
          message = serverMsg || "Please try again later.";
        }

        details = (
          <div>
            <div><b>Status:</b> {status}</div>
            {serverMsg ? <div><b>Server:</b> {serverMsg}</div> : null}
          </div>
        );
      } else if (err?.request) {
        title = "No response from server";
        message = "Check your connection and try again.";
      }

      openMsg({ variant: "error", title, message, details });

      setIsSigningUp(false);
      setSignupSuccess(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
      {/* MIC Loader */}
      {isSigningUp && (
        <div className={styles.micModalOverlay} role="presentation">
          <div className={styles.micModalCard} role="dialog" aria-modal="true">
            <div className={styles.micModalHeader}>
              <div>
                <div className={styles.micModalEyebrow}>
                  {signupSuccess ? "Success" : "Creating account"}
                </div>
                <h2 className={styles.micModalTitle}>
                  {signupSuccess ? "Account created!" : "Creating your profile…"}
                </h2>
                <p className={styles.micModalSubtitle}>
                  {signupSuccess
                    ? "Redirecting you to your dashboard…"
                    : "This usually takes a couple seconds."}
                </p>
              </div>
            </div>

            <div className={styles.micModalBody}>
              {signupSuccess ? (
                <div className={`${styles.iconWrap} ${styles.success}`}>
                  ✓
                </div>
              ) : (
                <>
                  <div className={styles.loaderRow}>
                    <span className={styles.loaderDot} />
                    <span className={styles.loaderText}>Please wait</span>
                  </div>

                  <div className={styles.progressTrack}>
                    <div className={styles.progressFillIndeterminate} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ One nice message modal */}
      <MICMessageModal
        isOpen={msgOpen}
        variant={msgVariant}
        title={msgTitle}
        message={msgMessage}
        details={msgDetails}
        confirmText="Got it"
        onClose={() => setMsgOpen(false)}
      />

      <button onClick={() => navigate("/")} className={styles.goBackButton}>
        <FontAwesomeIcon icon={faHome} />
      </button>

<div className={styles.leftSide}>
<div className={styles.brandContainer}>
  <img
    src="/assets/3-0/mic-logo-2-5-text.png"
    alt="Map in Color Logo"
    className={styles.logo}
  />
</div>

</div>

      <div className={styles.rightSide}>
        <div className={styles.signupBox}>
          <h2 className={styles.signupTitle}>Sign Up</h2>
          <p className={styles.signupSubtitle}>Create your account to start building maps.</p>

          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.formColumns}>
              <div className={styles.leftColumn}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="first_name">First Name</label>
                    <input
                      type="text"
                      id="first_name"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    {errors.first_name && (
                      <div className={styles.errorMessage}>{errors.first_name}</div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      type="text"
                      id="last_name"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    {errors.last_name && (
                      <div className={styles.errorMessage}>{errors.last_name}</div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className={styles.errorMessage}>{errors.email}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Date of Birth</label>
                  <div className={styles.dobContainer}>
                    <select value={day} onChange={(e) => setDay(e.target.value)}>
                      <option value="">Day</option>
                      {daysList.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    <select value={month} onChange={(e) => setMonth(e.target.value)}>
                      <option value="">Month</option>
                      {monthsList.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>

                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                      <option value="">Year</option>
                      {yearsList.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors.date_of_birth && (
                    <div className={styles.errorMessage}>{errors.date_of_birth}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>

                  {errors.gender && (
                    <div className={styles.errorMessage}>{errors.gender}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="location">Location</label>
                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>

                  {errors.location && (
                    <div className={styles.errorMessage}>{errors.location}</div>
                  )}
                </div>
              </div>

              <div className={styles.rightColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.replace(/\s/g, "").toLowerCase())
                    }
                    autoComplete="off"
                  />
                  {errors.username && (
                    <div className={styles.errorMessage}>{errors.username}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <div className={styles.errorMessage}>{errors.password}</div>
                  )}
                </div>

                <div className={styles.passwordRequirementsGrid}>
                  <PasswordRequirement text="At least 6 characters" isValid={isLongEnough} />
                  <PasswordRequirement text="At least one uppercase letter" isValid={hasUpperCase} />
                  <PasswordRequirement text="At least one number" isValid={hasNumber} />
                  <PasswordRequirement text="At least one special character" isValid={hasSpecial} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <div className={styles.errorMessage}>{errors.confirmPassword}</div>
                  )}
                </div>

                <div className={styles.passwordMatch}>
                  <div
                    className={`${styles.requirementIcon} ${
                      passwordsMatch ? styles.valid : styles.invalid
                    }`}
                  />
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            <div className={styles.checkboxContainer}>
              <div className={styles.formGroupCheckbox}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={subscribePromos}
                    onChange={(e) => setSubscribePromos(e.target.checked)}
                  />
                  <span className={styles.termsText}>
                    I want to receive promotional emails about Map in Color
                  </span>
                </label>
              </div>

              <div className={styles.formGroupCheckbox}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={acceptPolicy}
                    onChange={(e) => setAcceptPolicy(e.target.checked)}
                  />
                  <div className={styles.termsText}>
                    <span>I agree to the</span>
                    <Link
                      to="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.privacyLink}
                    >
                      Terms of Use
                    </Link>
                    <span>and</span>
                    <Link
                      to="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.privacyLink}
                    >
                      Privacy Policy
                    </Link>
                    <span className={styles.dot}>.</span>
                  </div>
                </label>

                {errors.acceptPolicy && (
                  <div className={styles.errorMessage}>{errors.acceptPolicy}</div>
                )}
              </div>
            </div>

            <button type="submit" className={styles.signupButton}>
              Sign Up
            </button>
          </form>

          <p className={styles.signupFooter}>
            Already have an account? <Link to="/login">Login here</Link>.
          </p>

        </div>
      </div>
    </div>
  );
}
