import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { updateSpot } from "../../store/spots";
import { getSpots } from "../../store/spots";

export default function EditFormModal({spot, spotId}) {
  const dispatch = useDispatch()
  const history = useHistory()
  
  
  const [address, setAddress] = useState(spot.address)
  const [title, setTitle] = useState(spot.title)
  const [city, setCity] = useState(spot.city)
  const [state, setState] = useState(spot.state)
  const [country, setCountry] = useState(spot.country)
  const [name, setName] = useState(spot.name)
  const [description, setDescription] = useState(spot.description)
  const [price, setPrice] = useState(spot.price)
  // const [previewImage, setPreviewImage] = useState("Must be a image URL")
  const [errors, setErrors] = useState([])
  const { closeModal } = useModal();

  const Owner = spot.Owner
  const SpotImages = spot.SpotImages

  useEffect(() => {
    const errors = [
      "Street Address is required",
      "Name of Location is required",
      "City is required",
      "State is required",
      "Country is required",
      "Name is required and must be less than 50 characters",
      "Description is required",
      "Price must be an integer and is also required and cannot be below 0"
    ]

    if (address.length > 0) errors.splice(errors.indexOf("Street Address is required"), 1)
    if (title.length > 0) errors.splice(errors.indexOf("Name of Location is required"), 1)
    if (city.length > 0) errors.splice(errors.indexOf("City is required"), 1)
    if (state.length > 0) errors.splice(errors.indexOf("State is required"), 1)
    if (country.length > 0) errors.splice(errors.indexOf("Country is required"), 1)
    if (name.length < 50 && name.length > 0) errors.splice(errors.indexOf("Name is required and must be less than 50 characters"), 1)
    if (description.length > 0) errors.splice(errors.indexOf("Description is required"), 1)
    if (price > 0) errors.splice(errors.indexOf("Price must be an integer and is also required and cannot be below 0"), 1)

    setErrors(errors)
  }, [address, city, state, country, name, description, price, title])
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    let lat = 0
    let lng = 0

    
    const payload = {
        ...spot,
        address,
        title,
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
      .then(history.push(`/spots/${spot.id}`))

  }
  
  
  return (
    <div className="signup-form">
      <h3>Edit Your Spot</h3>
      <ul>
        {(errors.map((error, idx) => <li key={idx}>{error}</li>))}
      </ul>
        
        <form className="create-spotform" onSubmit={handleSubmit} action="">
          <label>
          Address:
          <input
            className="signup-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label className="label">
          Name of Location
          <input
            className="signup-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          Hosted By:
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
        {/* <label>
          PreviewImage
          <input
            className="signup-input"
            type="text"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            required
          />
        </label> */}
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
        <button disabled={errors.length ? true : false} className="insidespot-idbuttons" style={{marginTop: 10, width: '15vw'}} type="submit">Submit Your Location Edits</button>
          </form>
    </div>
  )
}

