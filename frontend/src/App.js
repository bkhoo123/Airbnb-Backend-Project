import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, NavLink, Redirect } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import './App.css'
import SpotById from "./components/Spots/SpotById";
import CurrentSpots from "./components/Spots/CurrentSpots";
import { currentSpots } from "./store/spots";
import OnlyAuthenticatedUser from "./components/Redirection/OnlyAuthenticatedUser";
import FavoriteSpot from "./components/Spots/FavoriteSpot";
import Bookings from "./components/Bookings";
import Profile from "./components/Profile/profile";
import NotLoggedinSingleSpot from "./components/Spots/NotLoggedinSingleSpot";


function App() {
  const {spotId} = useParams()
  
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    
  }, [dispatch]);

  const spots = useSelector(state => state.spots)
  const reviews = useSelector(state => state.reviews)
  const user = useSelector(state => state.session)
  
  if (!user) return null
  if (!spots) return null
  if (!reviews) return null

  let currentSession = Object.values(user)[0]

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <hr />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <Spots/>
          </Route>
          <Route exact path="/spots/current">
            <CurrentSpots/>
          </Route>
          <Route path="/spots/:spotId">
          {currentSession === null ? <NotLoggedinSingleSpot/> : <SpotById key={spots.id}/>}
          </Route>
          <Route path="/authenticate">
            <OnlyAuthenticatedUser/>
          </Route>
          <Route path="/favoritespots">
            <FavoriteSpot/>
          </Route>
          <Route path="/bookings">
            <Bookings/>
          </Route>
          <Route path="/account">
            <Profile/>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;