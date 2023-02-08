import React from 'react'
import { thunkGetFavoriteSpots } from '../../store/spots'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { deleteSpot } from '../../store/spots'
import OpenModalButton from '../OpenModalButton'
import EditFormModal from '../EditFormModal'
import { Link } from 'react-router-dom'
import { thunkCurrentFavoriteSpots } from '../../store/favorites'
import { thunkDeleteSpotFavorite } from '../../store/favorites'
import CreateBookingFavorite from '../Bookings/CreateBookingFavorite'


export default function FavoriteSpot() {
  const history = useHistory()
  const dispatch = useDispatch()
  const favoriteSpots = useSelector(state => state.spots.allSpots)
  const favorite = useSelector(state => state.favorites)
  const currentArr = Object.values(favoriteSpots)
  

  const favoriteArray = []
  
  useEffect(() => {
    dispatch(thunkGetFavoriteSpots())
    dispatch(thunkCurrentFavoriteSpots())
    
    
  }, [dispatch])

  Object.values(favorite).forEach(favorite => {
    favoriteArray.push(favorite.id)
  })
  
  const filter = currentArr.filter(favorite => {
    return favoriteArray.includes(favorite.favoriteId) 
  })

  if (!favoriteSpots) return null

  
  
  let title = ['Invisible House Joshua Tree | Modern Masterpiece', 'Dome Sweet Dome: An OMG! Experience', 'Honey Silo Retreat', 'Paradise Ranch Inn', ' Emotional Healing', 'Fjord Mountains Great Views', 'Barn Stay in a Hedge Maze Free Range Chicken Farm', 'Gaudi Style House', 'On The Rocks Architectural Estate Dramatic Ocean', 'Tahoe Beach & Ski Club', 'Forest of Death Experienced Directly with the Forest', 'Perfect Home of Your Dreams Perfect for Parties' ]

  
  return (
    <div className="currentspots">
      {!filter.length 
      ? <div>
          <h1>You currently Don't have any Favorited Locations</h1> 
          <h2>You should add some favorites to this Dash board</h2>
        </div>
      : filter.map((spot, index) => (
        <div className="spot-info">

        <h3>{title[spot.id - 1]} <button onClick={async (e) => await dispatch(thunkDeleteSpotFavorite(spot.favoriteId))} style={{background: 'None', borderStyle: 'none'}}><i style={{marginLeft: 5, fontSize: 20}} id="hearty" class="fa-solid fa-heart"></i></button> </h3>
        
        <Link key={spot.id} to={`/spots/${spot.id}`}>  
        <img className="currentspot-images" src={spot.previewImage ? spot.previewImage : "https://a0.muscache.com/im/pictures/miso/Hosting-770519476322190230/original/fba61625-7eb9-4c25-8c64-953749548e6a.jpeg?im_w=1200"} alt="No Preview Image Available"  />
        </Link>
        <span className="currentbuttons">
        <div>
        <p className="location">{spot.address}</p>
        <p className="location">{spot.city}, {spot.state}</p>
        <p>{spot.country}</p>
        </div>
        <OpenModalButton
        buttonText="Bookings / Reserve Spot"
        modalComponent={<CreateBookingFavorite userId={spot.favoriteUserId} spotOwnerId={spot.ownerId} spotId={spot.id}  />}
        />
        
        </span> 
        </div>
      ))}  
    </div>
  )
}

