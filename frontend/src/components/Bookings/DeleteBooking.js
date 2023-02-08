import React from 'react'
import { useModal } from '../../context/Modal'
import { useDispatch } from 'react-redux'
import {useState, useEffect} from 'react'
import { thunkDeleteBooking } from '../../store/bookings'
import { useHistory } from 'react-router-dom'

export default function DeleteBooking({id}) {
  const history = useHistory()
  const {closeModal} = useModal()
  const dispatch = useDispatch()

  

  const handleDeleteBooking = async (e) => {
    const deletedBooking = await dispatch(thunkDeleteBooking(id))
    history.push(`/bookings`)
    closeModal()
  }

  // No deleting of current or past bookings

  return (
    <div className="delete-bookingcontent">
      <h1>Are you sure you want to cancel your Reservation?</h1>
      <div style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
        <button onClick={(handleDeleteBooking)} className="delete-bookingbuttons">Yes</button>
        <button onClick={() => closeModal()} className="delete-bookingbuttons">No</button>
      </div>
    </div>
  )
}
