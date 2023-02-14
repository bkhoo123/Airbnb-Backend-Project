import React from 'react'
import { currentSpots, thunkGetFavoriteSpots } from '../../store/spots'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { deleteSpot } from '../../store/spots'
import OpenModalButton from '../OpenModalButton'
import EditFormModal from '../EditFormModal'
import { Link } from 'react-router-dom'
import CreateSpotFormModal from '../CreateSpotFormModal'

export default function CurrentSpots() {
  const history = useHistory()
  const dispatch = useDispatch()
  const current = useSelector(state => state.spots.allSpots)
  
  
  
  useEffect(() => {
    dispatch(currentSpots())
    
  }, [dispatch])

  if (!current) return null
  
  const currentArr = Object.values(current)



  return (
    <div className="currentspots">
      {!currentArr.length 
      ? <div>
          <h1>You currently don't own or are hosting any Locations</h1> 
          <h2>You should start hosting to become a billionaire</h2>
          <div>
            <OpenModalButton
            buttonText="Create Spot"
            modalComponent={<CreateSpotFormModal/>}
            />
          </div>

       </div>
      : currentArr.map((spot, index) => (
        <div className="spot-info">
        <h2>Hosted Locations # {index + 1}</h2> 
        
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


