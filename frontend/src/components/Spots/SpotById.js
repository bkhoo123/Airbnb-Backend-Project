import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSpotById } from '../../store/spots'
import * as sessionActions from "../../store/session"
import { deleteSpot } from '../../store/spots'
import { useHistory } from 'react-router-dom'


export default function SpotById() {
  const history = useHistory()
  const {spotId} = useParams()
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false) 
  const [errors, setErrors] = useState([])
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    dispatch(getSpotById(spotId))
    
  }, [dispatch, spotId])

  const spot = useSelector(state => state.spots[spotId])
  const user = useSelector(state => state.session.user)
  if (!spot) return spot
  if (!user) return user
  
  // console.log('user', user)
  // console.log('spot', spot)
  // console.log('userId', userId)
  // console.log('ownerId', ownerId)
  
  const userId = user.id
  const ownerId = spot.ownerId

  if (Number(userId) === Number(ownerId)) setVerified(true)
  
  // , 'On The Rocks Architectural Estate Dramatic Ocean', 'Tahoe Beach & Ski Club', 'Forest of Death Experienced Directly with the Forest', 'Perfect Home of Your Dreams Perfect for Parties'
  //! Detail Arrays
  let title = ['Invisible House Joshua Tree | Modern Masterpiece', 'Dome Sweet Dome: An OMG! Experience', 'Honey Silo Retreat', 'Paradise Ranch Inn', ' Emotional Healing', 'Fjord Mountains Great Views', 'Barn Stay in a Hedge Maze Free Range Chicken Farm', 'Gaudi Style House' ]
  
  const handleClickDelete = () => {
      dispatch(deleteSpot(spotId))
      history.push(`/deleted/success`)
  }

  return (
    <>
    <h1>{title[spotId - 1]}</h1>
    <span style={{fontSize: 20}}><i className="fa-solid fa-star"></i> {spot.avgStarRating} 
    <span> {spot.numReviews} Reviews </span>
    <span style={({textDecoration: "underline"})}>{spot.address}, {spot.city} {spot.state} {spot.country}</span></span>

    <span className="spotid-buttons">
      <Link to="/api/spots/1/edit">
      <button id={!verified ? "delete-hidden" : ""} className="insidespot-idbuttons" style={{fontFamily: 'Helvetica'}}>Edit Hosting</button> 
      </Link>
      <button id={!verified ? "delete-hidden" : ""} className="insidespot-idbuttons" onClick={() => handleClickDelete()} style={{fontFamily: 'Helvetica'}}>Delete Hosting</button>
      </span>
    <div className ='spot-idcontainer' style={{paddingTop: 5}}>
        <img className="spot-idimages" src={spot.SpotImages[0].url} alt="Server undergoing Maintenence" />
        <div className = "right-spotidcontainer">
            <img className="spotidright-image" src={spot.SpotImages[1].url}  alt="" />
            <img className="spotidright-image" src={spot.SpotImages[2].url}  alt="" />
            <img className="spotidright-image" src={spot.SpotImages[3].url}  alt="" />
            <img className="spotidright-image" src={spot.SpotImages[4].url}  alt="" />
        </div>
    </div>
    <div>
    <h2>Hosted By: {spot.name}</h2>
    <h2>Price Per Night: ${spot.price}</h2>
    </div>
     
    <div className="spot-bottomcontainer">
    <div>5 guests 1 bedroom 1 bed 1 bath</div>
    <div>{spot.description}</div>
    </div>
    <div className="spotreview-container">

    </div>
    </>
  ) 
}
