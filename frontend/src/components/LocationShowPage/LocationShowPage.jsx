import './LocationShowPage.css';
import StarRating from '../StarRating/StarRating';
import Row from '../row/Row';
import ReviewIndexItem from '../ReviewIndexItem/ReviewIndexItem';
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal';
import ReservationMadeModal from '../ReservationMadeModal/ReservationMadeModal';
import ReservationConfirmModal from '../ReservationConfirmModal/ReservationConfirmModal';
import ReservationCancelModal from '../ReservationCancelModal/ReservationCancelModal';
import Panels from '../panels';
import Panel from '../panel/Panel';
import Map from '../map';
import Loading from '../loading/Loading';
import LessonDatesIndexItem from '../LessonDatesIndexItem'; 
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import { StarIcon } from '../icon/Icon';
import { getReservations, createReservation, fetchReservations, deleteReservation, removeReservation } from '../../store/reservation';
import { getLocation, fetchLocation } from '../../store/location';
import { getLessons, fetchLessons, getLessonsForLocation } from '../../store/lesson';
import { getLessonDate, getLessonDates, fetchLessonDates, getLessonDatesForLocation } from '../../store/lessonDates';
import { fetchReviews, getReviews, getReviewsForLocation, createReview, deleteReview, updateReview } from '../../store/review';
import { CgBrowser } from 'react-icons/cg';
import { AiFillFacebook } from 'react-icons/ai';
import { ImTwitter } from 'react-icons/im';
import { BsInstagram } from 'react-icons/bs'
import ToolTip from '../ToolTip/ToolTip';
import { restoreSession } from '../../store/session';


export const LocationShowPage = () => {
  const { locationId } = useParams();
  const location = useSelector(getLocation(locationId));
  const reviews = useSelector(getReviewsForLocation(locationId));
  const lessonDates = useSelector(getLessonDatesForLocation(locationId))
  const lessons = useSelector(getLessonsForLocation(locationId));
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const [ modalStatus, setModalStatus ] = useState(false);
  const [ modalLocation, setModalLocation ] = useState();
  const [ modalLessonDate, setModalLessonDate ] = useState();
  const [ modalLesson, setModalLesson ] = useState();
  const [ modalReview, setModalReview ] = useState();
  const [toolTipIsShown, setToolTipIsShown] = useState(false);



  useEffect(()=>{
    Promise.all([
      dispatch(fetchLocation(locationId)),
      dispatch(fetchLessons()),
      dispatch(fetchLessonDates(locationId)),  
      dispatch(fetchReviews(locationId)),  
      dispatch(restoreSession())
    ]).then(() =>  setLoaded(true))
  },[locationId])

  useEffect(()=>{
    let sortedReviews = sortReviews(reviews)
  }, [reviews])

  const sortReviews = (reviews)=>{
    let sortedReviews = reviews.sort((review1, review2) => {
      if (review1.updated_at < review2.updated_at) {
        return 1
      } else if (review1.updated_at > review2.updated_at) {
        return -1
      } else {
        return 0
      }
    })
    return sortedReviews;
  }



  const handleResClick = (lessonDate, lesson, location) => {
    setModalStatus(1)
    setModalLessonDate(lessonDate)
    setModalLesson(lesson)
    setModalLocation(location)
  }

  const handleModalClose = () => {
    setModalStatus(false)
    setModalLessonDate(null)
    setModalLesson(null)
    setModalLocation(null)
  }

  const handleResSubmit = (lessonDate) => {
    const data = {
      student_id: currentUser.id,
      lesson_date_id: lessonDate.id
    }
    dispatch(createReservation(data))
    setModalStatus(2)
  }

  const handleCancel = (lessonDate, lesson, location) => {
    setModalStatus(3)
    setModalLessonDate(lessonDate)
    setModalLesson(lesson)
    setModalLocation(location)
  }

  const handleCancelModalConfirm = (lessonDate) => {
    dispatch(deleteReservation(lessonDate.currentUserReservationId, lessonDate.id))
    setModalStatus(false)
  }

  // from modal: 
  // const reviewData = {
  //   lesson_id: lessonID,
  //   reviewer_id: currentUser.id,
  //   rating: rating,
  //   body: reviewBody,
  //   location_id: location.id
  // }
  const handleReviewSubmit = (reviewData) =>{
    if (reviewData.body){
      dispatch(createReview(reviewData))
      setModalStatus(false)
    } else {
      alert('Please enter a review')
    }
  }

  const handleReviewEditSubmit = (reviewData) =>{
    dispatch(updateReview(reviewData))
    setModalStatus(false)
  }

  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReview(reviewId))
  }

  const handleEditReviewClick = (review) => {
    setModalStatus(5)
    setModalLocation(location)
    setModalReview(review)
  }

  const reviewButtonType = () => {
    if (currentUser && !currentUser.locationsVisited.includes(parseInt(locationId))) {
      return (
        <button 
          className='review-button-no-lessons-taken'
          onMouseEnter={()=>setToolTipIsShown(true)}
          onMouseLeave={()=>setToolTipIsShown(false)}          
          >
            Leave Review
        </button>
      ) 
    } else if (currentUser && currentUser.locationsVisited.includes(parseInt(locationId))){
      return (
        <button 
          onClick={() => setModalStatus(4)} 
          className='lessonDateIdxItmReserve'>Leave Review
        </button>
      ) 
    } else if (!currentUser) {
      return (
        // <button 
        //   className='lessonDateIdxItmReserve inactive'>Sign up to Leave Review
        // </button>
        <div className='sign-up-review-text'>
          {/* Sign up and take a lesson to leave a review! */}
        </div>
      ) 
    }
  }

  if(!loaded){
    return (
      <Loading />
    )
  } else {
    return(
      <>
        { modalStatus === 1 && <ReservationConfirmModal lessonDate={modalLessonDate} lesson={modalLesson} location={modalLocation} handleModalClose={handleModalClose} handleResSubmit={handleResSubmit} source="location"/> }
        { modalStatus === 2 && <ReservationMadeModal lessonDate={modalLessonDate} lesson={modalLesson} location={modalLocation} handleModalClose={handleModalClose} source="location"/> }
        { modalStatus === 3 && <ReservationCancelModal lessonDate={modalLessonDate} lesson={modalLesson} location={modalLocation} handleModalClose={handleModalClose} handleCancelModalConfirm={handleCancelModalConfirm} source="location"/> }
        { modalStatus === 4 && <ReviewFormModal currentUser={currentUser} location={location} handleModalClose={handleModalClose} handleReviewSubmit={handleReviewSubmit} source="location" lessons={lessons} /> }
        { modalStatus === 5 && <ReviewFormModal currentUser={currentUser} location={location} review={modalReview} handleModalClose={handleModalClose} handleReviewEditSubmit={handleReviewEditSubmit} source="location" lessons={lessons} className="ReviewEditModal"/> }
      <Panels className="LocShowPage">

          <Panel className='LocShowPanelL'>
            <Row className='LocShowPanelLRow'>
              <img src={location.imageURL} alt={location.locationName} className='LocShowImg' />
            </Row>
            <Row className='locNameRow'>
              <h1 className='locName'>{location.locationName}</h1>
              <Row className='LocShowratingRow'>
                <h4 className="locationIdxItmRating">{location.averageRating.toFixed(1)}</h4> <StarRating assignedRating={location.averageRating.toFixed(0)}/>
                <div className='locShowRevCt'>({location.reviewCount})</div>
              </Row>
            </Row>
            <Row className='LocShowPanelLRow' id='noTopBorder'>
              This location offers {location.lessonTypes.join("and ")} lessons.
            </Row>
            <Row className='LocShowPanelLRow'>
              <div>{location.description}</div>
            </Row>
            
            <Row className='LocShowPanelLRow LocSchedule'>
              <h3 className="locShowSubtitle">Schedule</h3>
              <ul className='locShowIdxULLessonDates'>
                {lessonDates?.map((lessonDate, idx) => 
                  <LessonDatesIndexItem 
                    key={idx} 
                    lessonDate={lessonDate} 
                    location={location} 
                    handleResClick={handleResClick} 
                    handleCancel={handleCancel} 
                    source="locationShow" />)}
              </ul>
            </Row>
            <Row className='LocShowPanelLRow LocReviews'>
              <h3 className="locShowSubtitle" id="locShowReviewSubtitle">{location.locationName} Reviews 
              {toolTipIsShown && <ToolTip text='You must take a lesson at this location to leave a review'/>  }
              {reviewButtonType()}
              </h3>
              
              <ul className='locShowIdxULLessonDates'>
                {reviews?.reverse().map((review, idx) => 
                  <ReviewIndexItem 
                    key={idx} 
                    review={review} 
                    currentUser={currentUser} 
                    setModalStatus={setModalStatus} 
                    handleDeleteReview={handleDeleteReview} 
                    handleEditReviewClick={handleEditReviewClick}/>)}
              </ul>
            </Row>
          </Panel>
          <Panel className='LocShowPanelR'>
            <ul className='LocShowMap'>
              <Map />
            </ul>
            {/* website */}
            <Row className='LocShowPanelRRow LocShowFirstRowR'>
              <div className="LocShowRInfoIconDiv">
                < CgBrowser className='LocShowRInfoIcon'/>
              </div>
              {location.locationName.toLowerCase()}.com
            </Row>
            {/* IG */}
            <Row className='LocShowPanelRRow'>
              <div className="LocShowRInfoIconDiv">
                < BsInstagram className='LocShowRInfoIcon'/>
              </div>
              @{location.locationName.toLowerCase()}
            </Row>
            {/* facebook */}
            <Row className='LocShowPanelRRow'>
              <div className="LocShowRInfoIconDiv">
                < AiFillFacebook className='LocShowRInfoIcon'/>
              </div>
              {location.locationName.toLowerCase()}-{location.world.toLowerCase()}
            </Row>
            {/* twitter */}
            <Row className='LocShowPanelRRow'> 
              <div className="LocShowRInfoIconDiv">
                < ImTwitter className='LocShowRInfoIcon'/> 
              </div>
              @{location.locationName.toLowerCase()}
            </Row>
          </Panel>



      </Panels>
      </>
    )
  }
}

export default LocationShowPage;