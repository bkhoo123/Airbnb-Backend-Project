import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SpotDetails from './SpotDetails';
import {NavLink, Route, Link} from 'react-router-dom'
import SpotById from './SpotById';

import {useState, useEffect} from 'react'
import * as spotsActions from '../../store/spots';


export default function Spots() {
  const dispatch = useDispatch()
  const spots = useSelector(state => state.spots)
  

  useEffect(() => {
    dispatch(spotsActions.getSpots())
  }, [dispatch])

  const spotsArr = Object.values(spots)
  if (!spots) return null
  

  return (
    <>
      <div className="spots-container" key={spots.id}>
      {spotsArr.map((spot) => (
        <Link key={spot.id} className="spot-detailslink" to={`/spots/${spot.id}`}>
        <SpotDetails  spots={spot}/>
        </Link>
      ))}
      </div>
    </>
  )
}
