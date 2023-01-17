import React from 'react'
import { useParams, Link, Redirect } from 'react-router-dom'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSpotById } from '../../store/spots'
import * as sessionActions from "../../store/session"
import { deleteSpot } from '../../store/spots'
import { useHistory } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton'
import EditFormModal from '../EditFormModal'
import { getSpotReviews } from '../../store/reviews'
import ReviewFormModal from '../Reviews/ReviewFormModal'
import { deleteSpotReview } from '../../store/reviews'

const SpotById = () => {
  const history = useHistory()
  const {spotId} = useParams()
  const dispatch = useDispatch()
  const spot = useSelector(state => state.spots[spotId])
  const user = useSelector(state => state.session.user)
  const review = useSelector(state => state.reviews)

  useEffect(() => {
    dispatch(getSpotReviews(spotId))
    dispatch(getSpotById(spotId))
    
    
  }, [dispatch, spotId])
  
  const reviewArr = Object.values(review)

  
  console.log(reviewArr)
  
  if (!spot) return null
  if (!user) return null
  if (!spot.SpotImages) return null
  if (!review) return null
  

  //! Detail Arrays
  let title = ['Invisible House Joshua Tree | Modern Masterpiece', 'Dome Sweet Dome: An OMG! Experience', 'Honey Silo Retreat', 'Paradise Ranch Inn', ' Emotional Healing', 'Fjord Mountains Great Views', 'Barn Stay in a Hedge Maze Free Range Chicken Farm', 'Gaudi Style House', 'On The Rocks Architectural Estate Dramatic Ocean', 'Tahoe Beach & Ski Club', 'Forest of Death Experienced Directly with the Forest', 'Perfect Home of Your Dreams Perfect for Parties' ]
  
  const handleClickDelete = () => {
      dispatch(deleteSpot(spotId))
      history.push(`/deleted/success`)
  }

  
  return (
    <>
    <h1>{title[spotId - 1]}</h1>
    <span style={{fontSize: 20}}><i style={{color: 'gold'}} className="fa-solid fa-star"></i> {spot.avgStarRating} 
    <span> {spot.numReviews} Reviews </span>
    <span style={({textDecoration: "underline"})}>{spot.address}, {spot.city} {spot.state} {spot.country}</span></span>

    <span className="spotid-buttons">
      <div id={user.id === spot.ownerId ? "" : "delete-hidden"}>
        <OpenModalButton
        buttonText="Edit Location"
        modalComponent={<EditFormModal spot={spot}/>}
        />
      </div>
      <button id={user.id === spot.ownerId ? "" : "delete-hidden"} className="insidespot-idbuttons" onClick={() => handleClickDelete()} style={{fontFamily: 'Helvetica'}}>Delete Location</button>
      </span>
    <div className ='spot-idcontainer' style={{paddingTop: 5}}>
      {spot.SpotImages[0].url ? ( 
        <>
        <img className="spot-idimages" src={spot.SpotImages[0].url} alt="Server undergoing Maintenence" />
        <div className = "right-spotidcontainer">
            <img className="spotidright-image" src={spot.SpotImages[1].url}  alt="" />
            <img className="spotidright-image" src={spot.SpotImages[2].url}  alt="" />
            <img className="spotidright-image" src={spot.SpotImages[3].url}  alt="" />
            <img className="spotidright-image" src={spot.SpotImages[4].url}  alt="" />
        </div>
        </>
       ) : (  
        <>
            <img className="spot-idimages" src="https://a0.muscache.com/im/pictures/8db6ed20-fc30-4f7e-ae90-3f860874158b.jpg?im_w=1200" alt="Server undergoing Maintenence" />
            <div className = "right-spotidcontainer">
            <img className="spotidright-image" src="https://a0.muscache.com/im/pictures/11de73ab-f346-4313-82af-4f92617c6751.jpg?im_w=720"  alt="" />
            <img className="spotidright-image" src="https://a0.muscache.com/im/pictures/e331a478-330e-4256-975d-d2ae722d82e4.jpg?im_w=720"  alt="" />
            <img className="spotidright-image" src="https://a0.muscache.com/im/pictures/441bf0ac-a272-4aad-9cef-326b94d7aa1a.jpg?im_w=720"  alt="" />
            <img className="spotidright-image" src="https://a0.muscache.com/im/pictures/6c970eef-7678-4c18-8611-46b1c49c5fa9.jpg?im_w=720" alt="" />
        </div>
        </>
       )}
        
    </div>
    <div>
    <h2>Hosted By: {spot.name}</h2>
    <h2>Price Per Night: ${spot.price}</h2>
    </div>
     
    <div className="spot-bottomcontainer">
    <div>5 guests 1 bedroom 1 bed 1 bath</div>
    <div>{spot.description}</div>
    </div>
    <div className="spotreview-container">
      <h1 style={{textDecoration: 'underline'}}>Reviews<span style={{paddingLeft: 10}}>
        <OpenModalButton
        buttonText="Post Review"
        modalComponent={<ReviewFormModal spotId={spotId} userId={user.id}/>}
        />
      </span>
      </h1>
      
      <div>
        {reviewArr[0]?.Reviews?.map(review => (
          <>
          <h3> {review.User?.firstName} {review.User?.lastName} {review.stars} Star Review <i style={{color: 'gold'}} className="fa-solid fa-star"></i> <button id={review.User.id === user.id ? "" : "delete-hidden"} onClick={() => dispatch(deleteSpotReview(review.id), <Redirect to={`/api/spots/${spotId}`}/>)} className="insidespot-idbuttons">Delete Review</button></h3>
          <h3 style={{fontFamily: 'sans-serif', fontSize: '1.5rem', fontWeight: 'normal'}}>{review.review}</h3>
          <span style={{fontFamily: 'monospace'}}>Posted On: {review.createdAt}</span>
          </>
        ))}
      </div>
    </div>
    </>
  ) 
}
// const reviewArray = reviewArr[0].Reviews
export default SpotById