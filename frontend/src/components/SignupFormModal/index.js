import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import { useHistory } from "react-router-dom";

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
  
  

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === confirmPassword) {
      setErrors([])
      return dispatch(sessionActions.signupUser({email, username, firstName, lastName, password})).then(closeModal)
        .catch(async (res) => {
          const data = await res.json()
          if (data && data.errors) return setErrors(data.errors)
        })
    }
    return setErrors(['Confirm Password field must be the same as the Password field'])
  }
  const values = Object.values(errors)

  return (
    <>
    <form className="signup-formreal" onSubmit={handleSubmit}>
    <ul>
        {console.log('values', values)}
        {(values.map((error, idx) => <li key={idx}>{error}</li>))}
      </ul>
    <h3>Login or sign up</h3>
    <h2>Welcome to airBKhoo</h2>
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
      <button className="submit-button" style={{fontFamily: 'Montserrat', fontSize: '1rem', marginTop: 15, color: "white", borderStyle: 'none', backgroundColor: "#FF5A5F", borderRadius: 10, height: 40, width: '15vw'}} type="submit">Sign Up</button>
    </form>
    </>
  );
}