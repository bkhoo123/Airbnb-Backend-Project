import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { updateSpot } from "../../store/spots";
import { getSpots } from "../../store/spots";

export default function EditFormModal({spot, spotId}) {
  const dispatch = useDispatch()
  const history = useHistory()
  
  
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [previewImage, setPreviewImage] = useState("Must be a image URL")
  const [errors, setErrors] = useState([])
  const { closeModal } = useModal();

  
  const Owner = spot.Owner
  
  const SpotImages = spot.SpotImages
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    let lat = 50
    let lng = 50

    
    const payload = {
        ...spot,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    }
    
    const updatedSpot = await dispatch(updateSpot(payload, Owner, SpotImages))
      .then(closeModal)
      .then(history.push(`/api/spots/${spot.id}`))
      // .catch(
      //   async(res) => {
      //     const data = await res.json()
      //     if (data && data.errors)  return setErrors(data.errors)
      //   }
      // )
  }
  
  
  return (
    <div className="signup-form">
      <h3>Edit Your Location</h3>
      <ul>
        {(errors.map((error, idx) => <li key={idx}>{error}</li>))}
      </ul>
        
        <form className="create-spotform" onSubmit={handleSubmit} action="">
          <label>
          Address
          <input
            className="signup-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          City
          <input
            className="signup-input"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State
          <input
            className="signup-input"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label>
          Country
          <input
            className="signup-input"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          Name
          <input
            className="signup-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <input
            className="signup-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          PreviewImage
          <input
            className="signup-input"
            type="text"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            required
          />
        </label>
        <label>
          Price
          <input
            className="signup-input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button className="insidespot-idbuttons" style={{fontFamily: 'Helvetica', fontSize: '1.25rem', marginTop: 15}} type="submit">Submit Your Location Edits</button>
          </form>
    </div>
  )
}



// address: address,
//         city: city,
//         state: state,
//         country: country,
//         lat: lat,
//         lng: lng,
//         name: name,
//         description: description,
//         price: price