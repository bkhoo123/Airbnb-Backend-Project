import React from 'react'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {useHistory} from 'react-router-dom'
import { thunkCurrentUserBookings } from '../../store/bookings'
import { Link } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton'
import EditBooking from './EditBooking'
import DeleteBooking from './DeleteBooking'



export default function Bookings() {
  const history = useHistory()
  const dispatch = useDispatch()
  const currentBookings = useSelector(state => state.bookings.userBookings)

  useEffect(() => {
    dispatch(thunkCurrentUserBookings())
  }, [dispatch])

  
  const currentBookingsArray = Object.values(currentBookings)
  

  return (
    <div >
      <h1>Current Bookings</h1>
      <div className="bookings">
      {currentBookingsArray.map((booking, index) => (
        <div className="booking-container">
          <Link key={booking.spotId} to={`/spots/${booking.spotId}`}>
          <img className = "currentbooking-images" src={booking?.Spot?.previewImage} alt="No Image Preview available" />
          </Link>
          <span className="booking-info">
          <span>{booking.Spot?.city}, {booking.Spot?.state}</span>
          <span className="booking-data"> Hosted By: {booking.Spot?.name}</span>
          <span className="booking-data">Start Date: {booking.startDate.split(" ")[0]}</span>
          <span className="booking-data">End Date: {booking.endDate.split(" ")[0]}</span>
          </span>
          <div className="booking-modalcontainer">
          <div>
            <OpenModalButton
            buttonText="Edit Reservation"
            modalComponent={<EditBooking spotId={booking.spotId} id={booking.id}/>}
            />
          </div>
          <div>
            <OpenModalButton
            buttonText="Cancel Reservation"
            modalComponent={<DeleteBooking id={booking.id}/>}

            />
          </div>
          </div>
        </div>
        
      ))}
      </div>
    </div>
  )
}
