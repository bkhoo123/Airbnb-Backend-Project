import React, {useEffect} from 'react'
import { getSpotById } from '../../store/spots'
import { useDispatch } from 'react-redux'

export default function SpotByIdPlaceHolder() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSpotById(6))
  }, [dispatch])

  return (
    <div>SpotByIdPlaceHolder</div>
  )
}
