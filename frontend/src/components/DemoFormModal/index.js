import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch} from 'react-redux';
import { useModal } from "../../context/Modal";


export default function DemoFormModal() {
    const dispatch = useDispatch()

    const [errors, setErrors] = useState([])
    const {closeModal} = useModal()

    const credential = 'demo@user.io'
    const password = 'password'


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

      <button className="insidespot-idbuttons" type="submit">Log In</button>
    </form>
    )
}
