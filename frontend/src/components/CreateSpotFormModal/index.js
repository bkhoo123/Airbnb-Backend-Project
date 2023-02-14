import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import { createPreviewImage } from "../../store/spots";

export default function CreateSpotFormModal() {
  const dispatch = useDispatch()
  const history = useHistory()
  
  const [address, setAddress] = useState("")
  const [title, setTitle] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [errors, setErrors] = useState([])
  const [previewImage, setPreviewImage] = useState("")
  const { closeModal } = useModal();


  useEffect(() => {
    const errors = [
      "Street Address is required",
      "Name of Location is required",
      "City is required and character length must be at least 4 characters and less than 100",
      "State is required",
      "Country is required",
      "Name is required and must be less than 50 characters",
      "Description is required",
      "Must be a valid Preview Image URL",
      "Price must be an integer and is also required"
    ]

    if (address.length > 0) errors.splice(errors.indexOf("Street Address is required"), 1)
    if (title.length > 0) errors.splice(errors.indexOf("Name of Location is required"), 1)
    if (city.length >= 4 && city.length <= 100) errors.splice(errors.indexOf("City is required and character length must be at least 4 characters and less than 100"), 1)
    if (state.length > 0) errors.splice(errors.indexOf("State is required"), 1)
    if (country.length > 0) errors.splice(errors.indexOf("Country is required"), 1)
    if (name.length < 50 && name.length > 0) errors.splice(errors.indexOf("Name is required and must be less than 50 characters"), 1)
    if (description.length > 0) errors.splice(errors.indexOf("Description is required"), 1)
    if (previewImage.length > 30) errors.splice(errors.indexOf("Must be a valid Preview Image URL"), 1)
    if (price > 0) errors.splice(errors.indexOf("Price must be an integer and is also required"), 1)
    

    setErrors(errors)

  }, [address, title, city, state, country, name, description, price, previewImage])


  const handleSubmit = async (e) => {
    e.preventDefault()
    let lat = 0
    let lng = 0

    const payload = {
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

    const url = previewImage;
    
    const newlyCreatedSpot = await dispatch(createSpot(payload))
      .catch(async (res) => {
        const data = await res.json()
        if (data && data.errors) errors.push(data.errors)
      })
    
    const previewImages = await dispatch(createPreviewImage(Number(newlyCreatedSpot.id), url, true))
      .catch(async (res) => {
        const data = await res.json()
        if (data && data.errors) errors.push(data.errors)
      })
    
    closeModal()
    history.push(`/spots/${newlyCreatedSpot.id}`)
  }
  
  
  return (
    <div className="signup-form">
      <h3 style={{textAlign: 'center'}}>Create a New Spot!</h3>
     
        <form className="create-spotform" onSubmit={handleSubmit} action="">
        <h3>Where's Your Place located?</h3>
        <ul>
        {(errors.map((error, idx) => <li key={idx}>{error}</li>))}
      </ul>
          <label className="label">
          Address
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
        <label className="label">
          City
          <input
            className="signup-input"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label className="label">
          State
          <input
            className="signup-input"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label className="label">
          Country
          <input
            className="signup-input"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label className="label">
          Hosted By:
          <input
            className="signup-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="label">
          Describe Your Place to your Guests
          <input
            className="signup-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label className="label">
          Liven up your spot with photos
          <input
            className="signup-input"
            type="url"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            required
          />
        </label>
        <label className="label">
          Set a Base Price for your Spot
          <input
            className="signup-input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button disabled={errors.length ? true : false} className="insidespot-idbuttons" style={{fontFamily: 'Helvetica', fontSize: '1rem', marginTop: 15, width: 180, marginBottom: 15}} type="submit">Create Spot</button>
          </form>
    </div>
  )
}