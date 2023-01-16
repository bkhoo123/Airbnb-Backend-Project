import React from 'react'

export default function SpotDetails({id, spots}) {
  
  const fillerDistance = [389, 55, 389, 77, 1055, 66, 22, 223, 587]  
  if (!spots) return null
  
  return (
    <div className="spot-info">
        <img className="spot-images" src={spots.previewImage} alt="No Preview Image Available" />
        <p className="location">{spots.city}, {spots.state}</p>
        <p className='grey'>{fillerDistance[spots.id]} miles away</p>
        <p><span className="dollar">${spots.price}</span> night</p>
    </div>
    
  )
}
