import React from 'react'

export default function SpotDetails({id, spots}) {
  
  const fillerDistance = [389, 55, 389, 77, 1055, 66, 22, 223, 587, 1222, 78, 99]  
  const avgRating = [2, 5, 4.4, 3.1, 2.1, 1, 0.5, 1.8, 4.9, 3.9, 3.6, 1.5, 1.7, 2.5, 3.5]
  if (!spots) return null

  
  return (
    <div className="spot-info">
        <img className="spot-images" src={spots.previewImage ? spots.previewImage : "https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/9bd67185-dc83-4473-a191-9486c62aec66.jpeg?im_w=720"} alt="No Preview Image Available" />
        <p className="location">{spots.city}, {spots.state} <span><i style={{color: 'gold'}} className="fa-solid fa-star"></i> {avgRating[spots.id]}</span></p>
        <p className='grey'>{fillerDistance[spots.id]} miles away</p>
        <p><span className="dollar">${spots.price}</span> night</p>
    </div>
    
  )
}
