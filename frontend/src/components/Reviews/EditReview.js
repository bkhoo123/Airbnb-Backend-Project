import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { thunkEditSpotReview } from "../../store/reviews";

export default function EditReview({reviewArr, reviewNote, reviewId, spotId, userId, reviewStars}) {
    const dispatch = useDispatch()
    const history = useHistory()

    
    const [review, setReview] = useState(reviewNote)
    const [stars, setStars] = useState(reviewStars)
    const [errors, setErrors] = useState([])
    const {closeModal} = useModal()

    useEffect(() => {
        const errors = [
        "Minimum 10 Characters required for Review", 
        "Review stars must be an integer between 1 and 5"
    ]
    
        if (review.length >= 10) errors.splice(errors.indexOf("Minimum 10 Characters required for Review"),1)
        if (stars >= 1 && stars <= 5) errors.splice(errors.indexOf("Review stars must be an integer between 1 and 5"), 1)
        
    
        setErrors(errors)
    
      }, [review, stars])

      const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            id: reviewId,
            userId,
            spotId,
            review,
            stars
        }

        const editReview = await dispatch(thunkEditSpotReview(payload))

        closeModal()
        history.push(`/spots/${spotId}`)
      }
    
    return (
    <div className="signup-form">
      <ul>
      {(errors.map((error, idx) => <li key={idx}>{error}</li>))}
      </ul>
      <form className="create-spotform" onSubmit={handleSubmit}  action="">
          <label>
          Edit Your Review Here
          <textarea
            className="signup-input"
            type="text"
            style={{width: 600, height: 250, wrap:'hard', paddingLeft: 5, paddingRight: 5}}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>
        <label>
          Star Rating
          <input
            className="signup-input"
            type="number"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            required
          />
        </label>
        <button disabled={errors.length ? true : false}  className="insidespot-idbuttons" style={{fontFamily: 'Helvetica', fontSize: '1rem', marginTop: 15}} type="submit">Submit your Review</button>
        </form>
    </div>
    )
}
