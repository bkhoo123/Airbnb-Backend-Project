import React from 'react'
import { currentSpots } from '../../store/spots'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { deleteSpot } from '../../store/spots'
import OpenModalButton from '../OpenModalButton'
import EditFormModal from '../EditFormModal'

export default function CurrentSpots() {
  const history = useHistory()
  const dispatch = useDispatch()
  const current = useSelector(state => state.spots)
  
  
  useEffect(() => {
    dispatch(currentSpots())
  }, [dispatch])
  if (!current) return null
  
  const currentArr = Object.values(current)
  

  return (
    <div>
      {currentArr.map((spot, index) => (
        <div className="spot-info">
        <h1>{`Location #${index+1}`}</h1>
        <div className="currentbuttons">
        <img className="spot-images" src={spot.previewImage ? spot.previewImage : "https://a0.muscache.com/im/pictures/miso/Hosting-770519476322190230/original/fba61625-7eb9-4c25-8c64-953749548e6a.jpeg?im_w=1200"} alt="No Preview Image Available" />
        <div>
        <OpenModalButton
        buttonText="Edit Location"
        modalComponent={<EditFormModal  spot={spot}/>}
        />
        </div>
        <button onClick={() => dispatch(deleteSpot(spot.id))}  className="insidespot-idbuttons" style={{fontFamily: 'Helvetica', fontSize: '1.25rem'}}>Delete Location</button>
        
        </div>
        <p className="location">{spot.address}</p>
        <p className="location">{spot.city}, {spot.state}</p>
        </div>
      ))}  
    </div>
  )
}


