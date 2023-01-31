import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateSpot } from '../../store/spots'

export default function SpotDetails({id, spots}) {
  const dispatch = useDispatch()
  
  const fillerDistance = [389, 55, 389, 77, 1055, 66, 22, 223, 587, 1222, 78, 99, 167]  
  // const avgRating = [2, 5, 4.4, 3.1, 2.1, 1, 0.5, 1.8, 4.9, 3.9, 3.6, 1.5, 1.7, 2.5, 3.5]
  if (!spots) return null

  if (!spots.previewImage) return null

  // const handleHeartClick = () => {
  //   onClick={() => dispatch(updateSpot(spots, spots.Owner, spots.SpotImages, spots.favorites === 'true'))}
  // }

  return (
    <div className="spot-info">
          
        <img className="spot-images" src={spots.previewImage ? spots.previewImage : "https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/9bd67185-dc83-4473-a191-9486c62aec66.jpeg?im_w=720"}  alt="No Preview Image Available"  />
        
        <div className="front-spottext">
        <p  className="location">{spots.city}, {spots.state} <span><i style={{color: 'black', fontSize: '0.65rem'}} className="fa-solid fa-star"></i> {spots.avgRating === "No reviews have been posted for this location" ? spots.avgRating = 0 : Number(spots.avgRating).toFixed(2)}</span></p>
        </div>
        <p className='grey'>{fillerDistance[spots.id]} miles away</p>
        <p><span className="dollar">${spots.price}</span> night</p>
        
        {/* <button  className="heart"><i id="heart-icon" class="fa-solid fa-heart"></i></button> */}
        
        
    </div>
  )
}

