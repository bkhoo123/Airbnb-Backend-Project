import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";

export default function CreateSpotFormModal() {
  const dispatch = useDispatch()
  const history = useHistory()
  
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [errors, setErrors] = useState([])
  const [previewImage, setPreviewImage] = useState("Must be a image URL")
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    let lat = 50
    let lng = 50

    const payload = {
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
    
    return dispatch(createSpot(payload))
      .then(closeModal)
      .then(history.push(`/api/spots/:spotId`))
      .catch(
        async(res) => {
          const data = await res.json()
          if (data) return setErrors(data.errors)
        }
      )
  }
  const values = Object.values(errors)
  
  return (
    <div className="signup-form">
      <ul>
        {console.log('values', values)}
        {(values.map((error, idx) => <li key={idx}>{error}</li>))}
      </ul>

      <h3>List your Home Up and Become Rich being a Host</h3>
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
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button className="insidespot-idbuttons" style={{fontFamily: 'Helvetica', fontSize: '1.25rem', marginTop: 15}} type="submit">Submit your House Listing</button>
          </form>
    </div>
  )
}