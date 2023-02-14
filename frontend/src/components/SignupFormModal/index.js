import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import { useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";

export default function SignupFormModal() {
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState([])
  const { closeModal } = useModal();
  
  useEffect(() => {
    const errors = [
      "Email must have at least 4 characters and be no more than 30 characters",
      "Email must be a valid email",
      "Username is required and must be at least 4 characters",
      "First Name is required",
      "Last Name is required",
      "Password and Confirmed password does not match",
      "Password is required",
      "Confirm Password is required"
    ]

    if (email.length >= 4) errors.splice(errors.indexOf("Email must have at least 4 characters and be no more than 30 characters"), 1)

    if (email.includes('@') || email.includes('.com')) errors.splice(errors.indexOf("Email must be a valid email"), 1)

    if (username.length >= 4) errors.splice(errors.indexOf("Username is required and must be at least 4 characters"), 1)

    if (firstName.length > 0) errors.splice(errors.indexOf("First Name is required"), 1) 

    if (lastName.length > 0) errors.splice(errors.indexOf("Last Name is required"), 1)

    if (password === confirmPassword) errors.splice(errors.indexOf("Password and Confirmed password does not match"), 1)

    if (password.length > 0) errors.splice(errors.indexOf("Password is required"), 1)

    if (confirmPassword.length > 0) errors.splice(errors.indexOf("Confirm Password is required"), 1)

    setErrors(errors)


  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === confirmPassword) {
      setErrors([])
      return dispatch(sessionActions.signupUser({email, username, firstName, lastName, password})).then(closeModal)
    }
    return setErrors(['Confirm Password field must be the same as the Password field'])
  }

  return (
    <>
    <form className="signup-formreal" onSubmit={handleSubmit}>
    <ul>
        {(errors.map((error, idx) => <li key={idx}>{error}</li>))}
      </ul>
    <h3>Sign Up</h3>
      <label>
        Email
        <input
          className="signup-input"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Username
        <input
          className="signup-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        First Name
        <input
          className="signup-input"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </label>
      <label>
        Last Name
        <input
          className="signup-input"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          className="signup-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        Confirm Password
        <input
          className="signup-input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>
      <button disabled={errors.length ? true : false} className="submit-button" style={{fontFamily: 'Montserrat', fontSize: '1rem', marginTop: 15, color: "white", borderStyle: 'none', backgroundColor: "#FF5A5F", borderRadius: 5, height: '40px', width: '150px'}} type="submit">Sign Up</button>
      <div style={{height: 40}}>
        <OpenModalButton
        buttonText="Log In"
        modalComponent={<LoginFormModal/>}
        />
      </div>
    </form>
    </>
  );
}