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
  
  
  useEffect(() => {
    dispatch(currentSpots())
  }, [dispatch])

  const current = useSelector(state => state.spots)
  if (!current) return null
  const currentArr = Object.values(current)
  console.log(currentArr)

  return (
    <div>
      {currentArr.map((spot, index) => (
        <div className="spot-info">
        <h1>{`Location #${index+1}`}</h1>
        <div className="currentbuttons">
        <img className="spot-images" src={spot.previewImage} alt="No Preview Image Available" />
        <div>
        <OpenModalButton
        buttonText="Edit Location"
        modalComponent={<EditFormModal/>}
        />
        </div>
        <button onClick={() => dispatch(deleteSpot(spot.id), history.push('/'))} className="insidespot-idbuttons" style={{fontFamily: 'Helvetica', fontSize: '1.25rem'}}>Delete Location</button>
        </div>
        <p className="location">{spot.address}</p>
        <p className="location">{spot.city}, {spot.state}</p>
        </div>
      ))}  
    </div>
  )
}


