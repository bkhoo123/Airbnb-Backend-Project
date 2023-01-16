import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from '../Images/logo.jpg'
import CreateSpot from '../Spots/CreateSpot';
import OpenModalButton from '../OpenModalButton';
import CreateSpotFormModal from '../CreateSpotFormModal';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const url = '/api/spots/'

  return (
    <div className="nav-bar">
      <span>
        <NavLink exact to="/"><i className="fa-brands fa-airbnb"/></NavLink>
        <span className="logo-name">airBKhoo</span>
      </span>
      {isLoaded && (
        <span className="nav-rightcontainer">
          <div>
            <OpenModalButton
            buttonText="AirBKhoo Host Your Home"
            modalComponent={<CreateSpotFormModal/>}
            />
          </div>
          <ProfileButton user={sessionUser} />
        </span>
      )}
    </div>
  );
}

export default Navigation;
