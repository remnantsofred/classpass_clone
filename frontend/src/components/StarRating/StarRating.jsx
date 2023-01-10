import './StarRating.css';
import React, { useState } from 'react';
import { StarIcon } from '../icon/Icon';
import { AiFillStar } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';

export const StarRating = ()=> {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <div className='starRating'>
      {[ ...Array(5)].map((star, i) => {
        const ratingValue = i + 1;

        return (
          <label className='starRatingLabel' key={`starRating${i}`}>
            <input 
              type="radio" 
              name="rating" 
              value={ratingValue} 
              onClick={()=> setRating(ratingValue)} 
              />
              <AiFillStar 
                className='star' 
                color={ratingValue <= (hover || rating) ? "#05f" : "#e7e7e7" } 
                size={15} 
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              />
          </label>
        );
        })}
        
        {/* <p>The rating is {rating}</p> */}
    </div>
  )
}

export default StarRating;