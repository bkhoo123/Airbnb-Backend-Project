import React from 'react'
import { currentSpots } from '../../store/spots'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { deleteSpot } from '../../store/spots'
import OpenModalButton from '../OpenModalButton'
import EditFormModal from '../EditFormModal'
import { Link } from 'react-router-dom'

export default function CurrentSpots() {
  const history = useHistory()
  const dispatch = useDispatch()
  const current = useSelector(state => state.spots)
  
  
  useEffect(() => {
    dispatch(currentSpots())
  }, [dispatch])

  if (!current) return null
  
  const currentArr = Object.values(current)

  const handleDelete = async () => {
    await dispatch(deleteSpot(Number))
  }
  

  let title = ['Invisible House Joshua Tree | Modern Masterpiece', 'Dome Sweet Dome: An OMG! Experience', 'Honey Silo Retreat', 'Paradise Ranch Inn', ' Emotional Healing', 'Fjord Mountains Great Views', 'Barn Stay in a Hedge Maze Free Range Chicken Farm', 'Gaudi Style House', 'On The Rocks Architectural Estate Dramatic Ocean', 'Tahoe Beach & Ski Club', 'Forest of Death Experienced Directly with the Forest', 'Perfect Home of Your Dreams Perfect for Parties' ]

  return (
    <div className="currentspots">
      {currentArr.map((spot, index) => (
        <div className="spot-info">
        <h2>{title[spot.id - 1]}</h2>
        
        
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
        buttonText="Edit Location"
        modalComponent={<EditFormModal  spot={spot}/>}
        />
        <button onClick={() => dispatch(deleteSpot(Number(spot.id)))}  className="insidespot-idbuttons">Delete Location</button>
        </span> 
        </div>
      ))}  
    </div>
  )
}


