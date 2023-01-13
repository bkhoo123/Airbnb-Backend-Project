import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';

export default function Navigation({isLoaded}) {
  
  const sessionUser = useSelector(state => state.session.user)
  const dispatch = useDispatch()


  let sessionLinks;

  if (sessionUser) {
    sessionLinks = (
        <span className="session-nav">
            <ProfileButton user={sessionUser}/>
        </span>
    )
  } else {
    sessionLinks = (
        <span className="login-signup">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
        </span>
    )
  }

  return (
    <div className="nav-bar">
      <span className="home-nav">
      <NavLink exact to="/">Home</NavLink>
      </span>
      {isLoaded && sessionLinks}
    </div>
  );
}
