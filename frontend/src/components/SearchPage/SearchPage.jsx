import './SearchPage.css';
import React, { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import Panels from '../panels';
import Panel from '../panel/Panel';
import Columns from '../columns/Columns';
import Column from '../column/Column';
import Row from '../row/Row';
import { getLessonDates, fetchLessonDates } from '../../store/lessonDates';
import { getLessons, fetchLessons } from '../../store/lesson';
import { getLocations, fetchLocations } from '../../store/location';
import LocationIndexItem from '../LocationIndexItem/LocationIndexItem';
import Loading from '../loading/Loading';
import Map from '../map';
import LessonDatesIndexItem from '../LessonDatesIndexItem';
import ReservationConfirmModal from '../ReservationConfirmModal/ReservationConfirmModal';
import { FaLessThanEqual } from 'react-icons/fa';

export const SearchPage = ({children, id='', className="SearchPage"}) => {
  const lessonDates = useSelector(getLessonDates);
  const lessons = useSelector(getLessons);
  const locations = useSelector(getLocations);
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [indexType, setIndexType] = useState('lessons');
  const [ modalStatus, setModalStatus ] = useState(false);
  const [ modalLessonDate, setModalLessonDate ] = useState();
  const [ modalLesson, setModalLesson ] = useState();
  const [ modalLocation, setModalLocation ] = useState();

  useEffect(() => {
    dispatch(fetchLessonDates())
    dispatch(fetchLessons())
    dispatch(fetchLocations())
    setIndexType('lessons')
  }, [])

  useEffect(() => {
    if (locations && lessons && lessonDates && locations.length && lessons.length && lessonDates.length) {
      setLoaded(true)
      console.log(lessonDates)
    }
  },[dispatch, locations, lessons, lessonDates])

  const getLocation = (locationId) => {
    for (const location of locations) {
      if (location.id === locationId) {
        return location;
      }
    }
  }

  const getLesson = (lessonId) => {
    for (const lesson of lessons) {
      if (lesson.id === lessonId) {
        return lesson;
      }
    }
  }

  const handleResClick = (lessonDate, lesson, location) => {
    setModalStatus(true)
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


  if (!loaded) {
    return (
      <Loading />
    )
  } else {
    return (
      <Panels id={id} className={className}>
        { modalStatus && <ReservationConfirmModal lessonDate={modalLessonDate} lesson={modalLesson} location={modalLocation} handleModalClose={handleModalClose} /> }
        <Panel className='lessonDatesIdxleftPanel'>
          <Row className="IndexToggleBar">
            <div onClick={() => setIndexType('lessons')} className={indexType === 'lessons' ? "searchTypeSelected" : "searchTypeunSelected"} >
              Lessons
            </div>
            <div onClick={() => setIndexType('locations')} className={indexType === 'locations' ? "searchTypeSelected" : "searchTypeunSelected"} >
              Locations
            </div>
          </Row>
    
          <ul className='lessonDatesIdxUL'>
            {indexType === 'lessons' ? lessonDates?.map((lessonDate, idx) => <LessonDatesIndexItem handleResClick={handleResClick} lessonDate={lessonDate} lesson={getLesson(lessonDate.lessonId)} location={getLocation(getLesson(lessonDate.lessonId).locationId)} key={idx} />) :
            locations?.map((location, idx) => <LocationIndexItem location={location} lessonIds={location.lessonIds} key={idx} />)}
          </ul>
        </Panel>
        <Panel className='lessonDatesIdxrightPanel'>
          <Map />
        </Panel>
      </Panels> 
    )
  }
}

export default SearchPage;