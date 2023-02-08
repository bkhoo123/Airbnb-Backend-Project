import React, { useState, useEffect, useRef, startTransition } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory, Link } from "react-router-dom";
import DemoFormModal from "../DemoFormModal";

export default function ProfileButton({user}) {
  const history = useHistory()
  const dispatch = useDispatch ()
  const [showMenu, setShowMenu] = useState(false)
  const ulRef = useRef();

  const fakeCredentials = 'Demo-lition'
  const fakePassword = 'password'

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault()
    dispatch(sessionActions.logoutUser())
    closeMenu();
    history.push('/')
  }

  const handleCurrent = () => {
    closeMenu()
    history.push('/spots/current')
  }

  const handleFavorite = () => {
    closeMenu()
    history.push('/favoritespots')
  }

  const handleBookings = () => {
    closeMenu()
    history.push('/bookings')
  }

  const handleAccount = () => {
    closeMenu()
    history.push('/account')
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden")

  return (
    <>
      <button className="drop-down" onClick={openMenu}>
        <i className="fa-solid fa-bars"/>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Username: {user.username}</li>
            <li>Name: {user.firstName} {user.lastName}</li>
            <li>Email: {user.email}</li>
            <div className="session-buttons">
              <button className="logout-button" style={{fontFamily: 'Montserrat', fontSize: '0.95rem', color: "white", borderStyle: 'none', backgroundColor: "#FF5A5F", borderRadius: 10, height: 40, width: 200, marginTop: 10, cursor: 'pointer'}} onClick={logout}>Log Out</button>
              <button className="logout-button"  onClick={() => handleCurrent()}>My Hosted Locations</button>
              <button onClick={() => handleFavorite()} className="logout-button">My Favorites</button>
              <button onClick={() => handleBookings()} className="logout-button">Bookings</button>
              <button onClick={() => handleAccount()} className="logout-button">Account</button>
            </div>
          </>
        ) : (
          <>
            <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
            <div>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </div>
            <div>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>
            <div>
            <OpenModalButton
              buttonText="Demo User"
              onButtonClick={closeMenu}
              modalComponent={<DemoFormModal/>}
            />
            </div>
            </div>
          </>
        )}
      </ul>
    </>
  );
}
