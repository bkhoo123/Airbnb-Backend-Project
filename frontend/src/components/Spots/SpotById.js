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
import { getSpots } from '../../store/spots'
import FavoriteFormModal from '../FavoriteFormModal'

const SpotById = () => {
  const history = useHistory()
  const {spotId} = useParams()
  const dispatch = useDispatch()
  const spot = useSelector(state => state.spots[spotId])
  const user = useSelector(state => state.session.user)
  const review = useSelector(state => state.reviews)
  const [average, setAverage] = useState(0)
  const reviewArr = Object.values(review)

  let count = 0 
  reviewArr.forEach((review) => {
    count += Number(review.stars)
  })

  useEffect(() => {
    dispatch(getSpotReviews(spotId))
    dispatch(getSpotById(spotId))
    setAverage(count / reviewArr.length)
  }, [dispatch, spotId, count])
  
  const stars = <i style={{color: 'gold'}} className="fa-solid fa-star"></i>
  
  if (!spot) return null
  if (!user) return null
  if (!spot.SpotImages) return null
  if (!review) return null
  if (!reviewArr) return null 
  
  //! Detail Arrays
  let title = ['Invisible House Joshua Tree | Modern Masterpiece', 'Dome Sweet Dome: An OMG! Experience', 'Honey Silo Retreat', 'Paradise Ranch Inn', ' Emotional Healing', 'Fjord Mountains Great Views', 'Barn Stay in a Hedge Maze Free Range Chicken Farm', 'Gaudi Style House', 'On The Rocks Architectural Estate Dramatic Ocean', 'Tahoe Beach & Ski Club', 'Forest of Death Experienced Directly with the Forest', 'Perfect Home of Your Dreams Perfect for Parties' ]
  
  const handleClickDelete = async (e) => {
      e.preventDefault()
      const deletedSpot = await dispatch(deleteSpot((spotId)))
      .catch(async (res) => {
        const data = await res.json()
      })
      history.push(`/`)
  }

  
  
  return (
    <>
    <h1>
      {title[spotId - 1]} 
     {/* <span style={{marginLeft: 10}}> 
     
      <OpenModalButton
      buttonText={<i id="spotid-favorite" class="fa-solid fa-heart"></i>}
      modalComponent={<FavoriteFormModal spotId={spotId} spot={spot}/>}
      />
      </span> */}
    </h1>
    
    <span style={{fontSize: 20}}><i style={{color: 'black'}} className="fa-solid fa-star"></i> {isNaN(Number(average).toFixed(2)) ? 0 : Number(average).toFixed(2)} 
    <span> {spot?.numReviews} Reviews </span>
    
    <span style={({textDecoration: "underline"})}>{spot.address}, {spot.city} {spot.state} {spot.country}</span></span>

    <span className="spotid-buttons">
      <div id={user.id === spot.ownerId ? "" : "delete-hidden"}>
        <OpenModalButton
        buttonText="Edit Location"
        
        modalComponent={<EditFormModal spotId={spotId} spot={spot}/>}
        />
      </div>
      <button id={user.id === spot.ownerId ? "" : "delete-hidden"} className="deletespot-button" onClick={handleClickDelete} >Delete Location</button>
      </span>
      
      {spot.SpotImages?.length !== 0 ? (
        <div className ='spot-idcontainer' style={{paddingTop: 5}}>       
        <img className="spot-idimages" src={spot.SpotImages[0].url} alt="Server undergoing Maintenence" />
        <div className = "right-spotidcontainer">
            <img className="spotidright-image" src={spot.SpotImages[1]?.url ? spot.SpotImages[1].url : "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"}  alt="No Image at the moment" />
            <img className="spotidright-image" src={spot.SpotImages[2]?.url ? spot.SpotImages[2].url : "https://images.unsplash.com/photo-1554797589-7241bb691973?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80"}  alt="No Image at the moment" />
            <img className="spotidright-image" src={spot.SpotImages[3]?.url ? spot.SpotImages[3].url : "https://images.unsplash.com/photo-1544885935-98dd03b09034?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"}  alt="No Image at the moment" />
            <img className="spotidright-image" src={spot.SpotImages[4]?.url ? spot.SpotImages[4].url : "https://images.unsplash.com/photo-1622285422722-b1b3eb36c728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"}  alt="No Image at the moment" />
        </div>    
      </div>
      ) : (
        <div className ='spot-idcontainer' style={{paddingTop: 5}}>       
        <img className="spot-idimages" src={spot.SpotImages[0]?.url} alt="Server undergoing Maintenence" />
        <div className = "right-spotidcontainer">
            <img className="spotidright-image" src="https://a0.muscache.com/im/pictures/cc01a848-de55-48b3-87f1-8950bc5a822c.jpg?im_w=720" alt="" />
            <img className="spotidright-image" src="https://a0.muscache.com/im/pictures/66c19a34-2e46-4f32-b78a-b399d6ad48cd.jpg?im_w=720"  alt="" />
            <img className="spotidright-image" src="https://a0.muscache.com/im/pictures/5ae05267-bf5f-4999-9084-7ce64ef1f836.jpg?im_w=1200" alt="" />
            <img className="spotidright-image" src="https://a0.muscache.com/im/pictures/04ccf07c-7cbf-4b02-aaba-93452796fba1.jpg?im_w=720"  alt="" />
        </div>    
      </div>
      )}
    
    <div>
    <h2>Hosted By: {spot.name}</h2>
    <h2>Price Per Night: ${spot.price}</h2>
    </div>
    <div className="spot-bottomcontainer">
    <div>5 guests 1 bedroom 1 bed 1 bath</div>
    <div style={{marginTop: 10}}>{spot.description}</div>
    </div>
    
      <hr />
      <div style={{marginTop: 15}} className="spotreview-container">
      
      <span> <i style={{color: 'black'}} className="fa-solid fa-star"></i> {isNaN(Number(average).toFixed(2)) ? 0 : Number(average).toFixed(2)} · {spot?.numReviews} Reviews <span style={{paddingLeft: 10}}>
        <OpenModalButton
        onButtonClick={() => {spot.numReviews += 1}}
        buttonText="Post Review"
        modalComponent={<ReviewFormModal reviewArr={reviewArr} spotId={spotId} userId={user.id}/>}
        />
      </span>
      </span>
      <div>
        {reviewArr.map(review => (
          <>
          <hr />
          <h3 style={{fontFamily: 'Helvetica', fontWeight: 'bold'}}> <i style={{marginRight: 10}} class="fa-solid fa-user"></i> {review.User?.firstName} {review.User?.lastName} 
          {review.User.id === user.id && (<button className="review-delete" 
          onClick={() => dispatch(deleteSpotReview(review.id)).then(history.push(`/spots/${Number(spotId)}`)).then(spot.numReviews -=1)}><i style={{fontSize: 18, color: "#FF5A5F" }} class="fa-solid fa-trash-can"></i></button>)}
          </h3>
          <h3 className="user-review">{review.review}</h3>
          <span style={{fontFamily: 'monospace'}}>Posted On: {review.createdAt.split("T")[0]}</span>
          <hr />
          </>
        ))}
      </div>
    </div>
    </>
  ) 
}
// const reviewArray = reviewArr[0].Reviews
export default SpotById