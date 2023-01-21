import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from '../Images/logo.jpg'
import CreateSpot from '../Spots/CreateSpot';
import OpenModalButton from '../OpenModalButton';
import CreateSpotFormModal from '../CreateSpotFormModal';
import Tyler from '../Images/Tyler.jpg'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  
  const url = '/api/spots/'

  return (
    <div className="nav-bar">
      <span > 
        <NavLink style={{textDecoration: "none"}} exact to="/"><img style={{width: '3vw'}} src={Tyler} alt="" /><span className="logo-name">airBKhoo</span></NavLink>
        
      </span>
      {isLoaded && (
        <span className="nav-rightcontainer">
          <div>
            <OpenModalButton
            buttonText="Host Your Home"
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
