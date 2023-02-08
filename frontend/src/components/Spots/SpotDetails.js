import React from 'react'
import { useDispatch } from 'react-redux'
import { thunkCreateSpotFavorite } from '../../store/favorites'
import { useState, useEffect } from 'react'
import { thunkDeleteSpotFavorite } from '../../store/favorites'

export default function SpotDetails({userId, spots, favorites}) {
  const dispatch = useDispatch()

  const [favoriteClick, setFavoriteClick] = useState("heart-icon")
  const [toggleFavorite, setToggleFavorite] = useState("grayheart")

  const fillerDistance = [389, 55, 389, 77, 1055, 66, 22, 223, 587, 1222, 78, 99, 167]  

  
  const superFavorites = Object.values(favorites)

  
  

  useEffect(() => {
    const favoritesArray = []
    Object.values(favorites).forEach(favorite => {
        favoritesArray.push(favorite.spotId)
    })
    
    const find = favoritesArray.find(favorite => {
      return Number(favorite) === spots.id
    })
    if (find) setFavoriteClick("heart-icon-clicked")
    if (!find) setFavoriteClick("heart-icon")
    // favoritesArray.forEach(favorite => {
    //   if (spots.id === Number(favorite)) setFavoriteClick("heart-icon-clicked")
    //   if (spots.id !== Number(favorite)) setFavoriteClick("heart-icon")
    // })


  }, [favoriteClick, favorites, dispatch])


  const handleClickFavorite = async (e) => {
    e.preventDefault()
    
    const payload = {
      id: Number(spots.id),
      userId: userId,
    }
    const find = superFavorites.find(favorite => {
      return Number(favorite.spotId) === Number(spots.id)
    })
    


    if (favoriteClick === "heart-icon") {
      const newFavorite = await dispatch(thunkCreateSpotFavorite(payload))
      setFavoriteClick("heart-icon-clicked")
    } else if (find) {
      const deleteFavorite = await dispatch(thunkDeleteSpotFavorite(find.id))
      setFavoriteClick("heart-icon")
    }
  }

  

  if (!spots) return null
  if (!spots.previewImage) return null

  return (
    <div className="spot-info">
          
        <img className="spot-images"  src={spots.previewImage ? spots.previewImage : "https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/9bd67185-dc83-4473-a191-9486c62aec66.jpeg?im_w=720"}  alt="No Preview Image Available"  />
        
        <div className="front-spottext">
        <p  className="location">{spots.city}, {spots.state} <span><i style={{color: 'black', fontSize: '0.65rem'}} className="fa-solid fa-star"></i> {spots.avgRating === "No reviews have been posted for this location" ? spots.avgRating = 0 : Number(spots.avgRating).toFixed(2)}</span></p>
        </div>
        <p className='grey'>{fillerDistance[spots.id]} miles away</p>
        <p><span className="dollar">${spots.price}</span> night</p>
        
        <button onClick={handleClickFavorite} className="heart"><i id={favoriteClick} class="fa-solid fa-heart" ></i></button>
        
        
    </div>
  )
}

