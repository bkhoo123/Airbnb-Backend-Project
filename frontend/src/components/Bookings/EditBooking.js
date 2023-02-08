import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { thunkEditBooking } from "../../store/bookings";
import { thunkGetAllBookings } from "../../store/bookings";


export default function EditBooking({id, spotId}) {
  const dispatch = useDispatch()
  const history = useHistory()
  const bookingById = useSelector(state => state.bookings.bookingsById)
  
  const bookingsArray = Object.values(bookingById)
  const find = bookingsArray.find(book => {
    return book.id === id
  })



  const [startDate, setStartDate] = useState(find?.startDate)
  const [endDate, setEndDate] = useState(find?.endDate)
  const {closeModal} = useModal()
  const [errors, setErrors] = useState([])
  

  useEffect(() => {
    const errors = []
    dispatch(thunkGetAllBookings(spotId))
    if (Date.parse(startDate) > Date.parse(endDate)) errors.push("End Date cannot be on or before State Date")
    for (let book of bookingsArray) {
      if (Date.parse(book.startDate) >= Date.parse(startDate) && Date.parse(book.endDate) <= Date.parse(endDate)) {
        errors.push("Start Date and End Date cannot conflict with an existing reservation")
      } 
    }
    if (new Date())

    setErrors(errors)
  }, [startDate, endDate, dispatch])


  const handleSubmit = async (e) => {
    e.preventDefault()

    const bookingInfo = {
      id: id,
      startDate,
      endDate
    }

    setErrors([])

    const editedBooking = await dispatch(thunkEditBooking(bookingInfo))
      .catch(async(res) => {
        const data = await res.json()
        if (data && data.errors) setErrors(data.errors)
        if (data && data.errors) errors.push(data.errors)
      })
    closeModal()
    history.push(`/bookings`)  
  }

  let errorArray = Object.values(errors)

  return (
    <div className="bookings-form">
      <ul>
      {(errorArray.map((error, idx) => <li key={idx}>{error}</li>))}
      </ul>

      <form className="create-spotform" onSubmit={handleSubmit} action="">
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
