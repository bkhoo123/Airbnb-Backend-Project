import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import * as actionSpots from '../../store/spots'
import {useHistory} from 'react-router-dom'

export default function CreateSpot() {
  const dispatch = useDispatch()
  const history = useHistory()

  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [name, setName] = useState("")
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [errors, setErrors] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
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

    // address: address,
    //     city: city,
    //     state: state,
    //     country: country,
    //     lat: lat,
    //     lng: lng,
    //     name: name,
    //     description: description,
    //     price: price

    let createdSpot
    
    try {
      createdSpot = await dispatch(actionSpots.createSpot(payload))
    } catch (error) {
      if (error) setErrors(error.errors)
      return (errors)
    }
    
    history.push(`/spots`)
  }
 
  return (
    <div>
        Create Spot Place Holder
        <form className="create-spotform" onSubmit={handleSubmit} action="">
        <ul>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
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
          lng
          <input
            className="signup-input"
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
          />
        </label>
        <label>
          lat
          <input
            className="signup-input"
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
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
          Price
          <input
            className="signup-input"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Your House</button>
          </form>
    </div>
  )
}


// address, city, state, country, lat, lng, name, description, price