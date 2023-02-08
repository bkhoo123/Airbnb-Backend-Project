import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { thunkCreateBooking } from "../../store/bookings";
import { thunkGetAllBookings } from "../../store/bookings";

export default function CreateBookingFavorite({userId, spotOwnerId, spotId}) {
  const dispatch = useDispatch()
  const history = useHistory()
  const bookings = useSelector(state => state.bookings.bookingsById)

  const [startDate, setStartDate] = useState("2023-03-01")
  const [endDate, setEndDate] = useState("2023-03-10")
  const {closeModal} = useModal()
  const [errors, setErrors] = useState([])

  
  const bookingsArray = Object.values(bookings)


  useEffect(() => {
    dispatch(thunkGetAllBookings(Number(spotId)))
    const errors = []

    if (userId === spotOwnerId) errors.push("You cannot reserve your own place")
    if (Date.parse(startDate) > Date.parse(endDate)) errors.push("End Date cannot be on or before State Date")
    for (let book of bookingsArray) {
      if (Date.parse(book.startDate) >= Date.parse(startDate) && Date.parse(book.endDate) <= Date.parse(endDate)) {
        errors.push("Start Date and End Date cannot conflict with an existing reservation")
      } 
    }

    setErrors(errors)
    
  }, [startDate, endDate, dispatch])
  


  const handleSubmit = async (e) => {
    e.preventDefault()

    const bookingInfo = {
      id: spotId,
      startDate,
      endDate
    }

    setErrors([])

    const newlyCreatedBooking = await dispatch(thunkCreateBooking(bookingInfo))
      .catch(async (res) => {
        const data = await res.json()
        if (data && data.errors) setErrors(data.errors)
      })
      
    
    closeModal()
    history.push(`/bookings`)
  }
  let errorArray = Object.values(errors)
  

  return (
    <div className="bookings-form">
      <h3>Reserve this Spot</h3>
      <ul>
        {(errorArray.map((error, idx) => <li key={idx}>{error}</li>))}
      </ul>

      <form className="create-spotform" action="" onSubmit={handleSubmit}>
        <label htmlFor="">
          Start Date:
          <input 
            type="date" 
            style={{marginTop: 10, marginBottom: 10, cursor: 'pointer'}}
            className="signup-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>

        <label htmlFor="">
          End Date: 
          <input 
          type="date" 
          className="signup-input"
          style={{marginTop: 10, cursor: 'pointer'}}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          />
        </label>
    
        <button disabled={errors.length ? true: false} className="insidespot-idbuttons" style={{marginTop: 10, marginLeft: 10}} type="submit">Reserve your Location</button>
      </form>
        {bookingsArray.map((booking, index) => (
          <div className="current-bookings">
            <h3>Current Reservations #{index + 1}</h3>
          <div>
          <li style={{color: 'teal'}}>Start Date: {booking.startDate.split(" ")[0]}</li>
          <li style={{color: 'teal'}}>End Date: {booking.endDate.split(" ")[0]}</li>
          </div>
          </div>
        ))}
    </div>
  )
}

