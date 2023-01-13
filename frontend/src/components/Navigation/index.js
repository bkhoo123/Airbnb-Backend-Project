// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton';
// import OpenModalButton from '../OpenModalButton';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';

// export default function Navigation({isLoaded}) {
//   const sessionUser = useSelector(state => state.session.user)
  
//   let sessionLinks;

//   if (sessionUser) {
//     sessionLinks = (
//         <span className="session-nav">
//             <ProfileButton user={sessionUser}/>
//         </span>
//     )
//   } else {
//     sessionLinks = (
//         <span className="login-signup">
//         <OpenModalButton 
//         className="log-signbuttons"
//         buttonText="Log In" 
//         modalComponent={<LoginFormModal />}
//         />
//         <OpenModalButton
//           className="log-signbuttons"
//           buttonText="Sign Up"
//           modalComponent={<SignupFormModal />}
//         />
//         </span>
//     )
//   }

//   return (
//     <div className="nav-bar">
//       <span className="home-nav">
//       <NavLink exact to="/">Home</NavLink>
//       </span>
//       {isLoaded && sessionLinks}
//     </div>
//   );
// }


import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="nav-bar">
      <span>
        <NavLink exact to="/">Home</NavLink>
      </span>
      {isLoaded && (
        <span>
          <ProfileButton user={sessionUser} />
        </span>
      )}
    </div>
  );
}

export default Navigation;
