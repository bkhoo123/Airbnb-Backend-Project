import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createSpot } from "../../store/spots";
import { useHistory, Redirect } from "react-router-dom";
import { createSpotReview } from "../../store/reviews";

export default function ReviewFormModal({spotId, userId}) {
  const dispatch = useDispatch()
  const history = useHistory()

  const [review, setReview] = useState("")
  const [stars, setStars] = useState(3)
  const [errors, setErrors] = useState("")
  const { closeModal } = useModal();

  const payload = {
    userId: userId,
    spotId: spotId,
    review,
    stars
  }

  
  return (
    <div className="signup-form">
      <form className="create-spotform" onSubmit={() => dispatch(createSpotReview(payload), closeModal(), <Redirect to={`/api/spots/${spotId}`}/>)} action="">
          <label>
          Type your Review here
          <textarea
            className="signup-input"
            type="text"
            style={{width: '25vw', height: '10vh', wrap:'hard', paddingLeft: 5, paddingRight: 5}}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>
        <label>
          Review Stars
          <input
            className="signup-input"
            type="number"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            required
          />
        </label>
        <button className="insidespot-idbuttons" style={{fontFamily: 'Helvetica', fontSize: '1.25rem', marginTop: 15}} type="submit">Submit your Review</button>
        </form>
    </div>
  )
}

