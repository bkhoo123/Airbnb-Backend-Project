import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch} from 'react-redux';
import { useModal } from "../../context/Modal";
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';


export default function LoginFormModal() {
    const dispatch = useDispatch()
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const {closeModal} = useModal()


    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
      return dispatch(sessionActions.login({ credential, password }))
        .then(closeModal)
        .catch(
          async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
          }
        );
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <h1>Log In</h1>
      <label className="login-label">
        Username or Email:
        <input
          className="login-input"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      </label>
      <label className="login-label">
        Password:
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button style={{fontFamily: 'Helvetica', fontSize: '1rem', marginTop: 15, color: "white", borderStyle: 'none', backgroundColor: "#FF5A5F", borderRadius: 10, height: 35, width: 150, fontWeight: 'bold', cursor: 'pointer'}} type="submit">Log In</button>
      <div>
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal/>}
        />
      </div>
    </form>
    )
}
