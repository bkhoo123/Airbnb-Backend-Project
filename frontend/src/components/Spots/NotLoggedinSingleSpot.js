import React from 'react'
import { useParams, Link, Redirect } from 'react-router-dom'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetFavoriteSpots, getSpotById } from '../../store/spots'
import { deleteSpot } from '../../store/spots'
import { useHistory } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton'
import EditFormModal from '../EditFormModal'
import { getSpotReviews } from '../../store/reviews'
import ReviewFormModal from '../Reviews/ReviewFormModal'
import { deleteSpotReview } from '../../store/reviews'
import { getSpots } from '../../store/spots'
import CreateBooking from '../Bookings/CreateBooking'
import { thunkGetAllBookings } from '../../store/bookings'
import EditModalButton from '../OpenModalButton/EditReview'
import EditReview from '../Reviews/EditReview'
import { updateSpot } from '../../store/spots'
import { thunkDeleteSpotFavorite } from '../../store/favorites'
import { thunkCreateSpotFavorite } from '../../store/favorites'
import { thunkCurrentFavoriteSpots } from '../../store/favorites'


export default function NotLoggedinSingleSpot() {
    const history = useHistory()
    const {spotId} = useParams()
    const dispatch = useDispatch()
    const spot = useSelector(state => state.spots.singleSpot)
    const user = useSelector(state => state.session.user)
    const review = useSelector(state => state.reviews)

    const [average, setAverage] = useState(0)
    const reviewArr = Object.values(review)

    let count = 0 
    reviewArr.forEach((review) => {
        count += Number(review.stars)
    })

    const sortReview = reviewArr.sort((a, b) => {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt)
    })

    useEffect(() => {
        dispatch(getSpotReviews(spotId))
        dispatch(getSpotById(spotId))

        setAverage(count / reviewArr.length)

    }, [dispatch, spotId, count])

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    return (
        <>
        {/* Headers / Images / Review Count / Address / Favorites */}
        <h2>
        {spot.title} 
        </h2>
        
        <span style={{fontSize: 20}}><i style={{color: 'black', marginRight: 5}} className="fa-solid fa-star"></i> 
        {isNaN(Number(average).toFixed(1)) ? "No Reviews Yet" : Number(average).toFixed(1)} 
        <span> {spot?.numReviews} {spot.numReviews > 1 ? 'Reviews' : 'Review'} </span>
        <span style={({textDecoration: "underline"})}>{spot.address}, {spot.city} {spot.state} {spot.country}</span>
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

    
        <h2>Price Per Night: ${spot.price}</h2>
        
        <div className="spot-bottomcontainer">
        <div>5 guests · 1 bedroom · 1 bed · 1 bath</div>
        <div style={{marginTop: 10}}>{spot.description}</div>
        </div>
        
        {/* Reviews */}
          <div style={{marginTop: 15}} className="spotreview-container">
          <span> <i style={{color: 'black'}} className="fa-solid fa-star"></i> {isNaN(Number(average).toFixed(1)) ? "New" : Number(average).toFixed(1)} · {spot?.numReviews} {spot?.numReviews > 1 ? 'Reviews' : 'Review'} 

          </span>
          <div>
    
            {!sortReview.length 
            ? <div>
              <h2>Be the first to post a review!</h2>
            </div> 
            : sortReview.map(review => (
              <>
              <hr />
              <h3 style={{fontFamily: 'Helvetica', fontWeight: 'bold'}}> <i style={{marginRight: 10}} class="fa-solid fa-user"></i> {review.User?.firstName} 
              

              </h3>
              <h3 style={{color: 'gray', fontSize: '1rem'}} className="user-review">{review.review}</h3>
              <span style={{fontFamily: 'monospace'}}>Posted On: {month[review.createdAt.split("T")[0].split("-")[1] - 1]} {review.createdAt.split("T")[0].split("-")[2]}, {review.createdAt.split("T")[0].split("-")[0]}</span>
              </>
            ))}
          </div>
        </div>
        </>
      ) 
}
