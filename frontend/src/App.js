import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, NavLink } from "react-router-dom";
import * as sessionActions from "./store/session";
import * as spotsActions from "./store/spots"
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import CreateSpot from "./components/Spots/CreateSpot";
import './App.css'
import SpotById from "./components/Spots/SpotById";
import SpotDetails from "./components/Spots/SpotDetails";
import Redirection from "./components/Redirection";
import CurrentSpots from "./components/Spots/CurrentSpots";
import { currentSpots } from "./store/spots";

function App() {
  const {spotId} = useParams()
  
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(currentSpots())
  }, [dispatch]);

  const current = useSelector(state => state.spots)
  const currentArr = Object.values(current)

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <hr />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <Spots/>
          </Route>
          <Route exact path="/api/spots/current">
            <CurrentSpots key={spotId}/>
          </Route>
          <Route exact path="/api/spots/:spotId">
          <SpotById key={currentArr.id}/>
          </Route>
          <Route path="/deleted/success">
            <Redirection/>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;