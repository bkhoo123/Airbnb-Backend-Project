import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { updateSpot } from "../../store/spots";
import { getSpots } from "../../store/spots";

export default function FavoriteFormModal({spot, spotId}) {
  const dispatch = useDispatch()
  const history = useHistory()
  
  
  const [address, setAddress] = useState(spot.address)
  const [city, setCity] = useState(spot.city)
  const [state, setState] = useState(spot.state)
  const [country, setCountry] = useState(spot.country)
  const [name, setName] = useState(spot.name)
  const [description, setDescription] = useState(spot.description)
  const [price, setPrice] = useState(spot.price)
  const [previewImage, setPreviewImage] = useState("Must be a image URL")
  const [favorites, setFavorites] = useState(false)
  const [errors, setErrors] = useState([])
  const { closeModal } = useModal();

  
  const Owner = spot.Owner
  
  const SpotImages = spot.SpotImages
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    const lat = 50
    const lng = 50
    const address = spot.address
    const city = spot.city
    const state = spot.state
    const country = spot.country
    const name = spot.name
    const description = spot.description
    const price = spot.price
    const previewImage = spot.previewImage
    if (favorites === false) setFavorites(true)
    else (setFavorites(false))

    
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
        price,
        favorites
    }
    
    const favoritedSpot = await dispatch(updateSpot(payload, Owner, SpotImages))
      .then(closeModal)
      .then(history.push(`/spots/${spot.id}`))

  }
  
  
  return (
    <div className="signup-form">
      <h3>Edit Your Location</h3>
      <ul>
        {(errors.map((error, idx) => <li key={idx}>{error}</li>))}
      </ul>
        <form className="create-spotform" onSubmit={handleSubmit} action="">        
        <button className="insidespot-idbuttons" style={{marginTop: 10, width: '15vw'}} type="submit">Confirm Favorite Location</button>
          </form>
    </div>
  )
}

