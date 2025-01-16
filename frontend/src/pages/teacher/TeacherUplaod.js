import React from 'react'
import { useSelector } from 'react-redux'
function TeacherUplaod() {
  const { currentUser, response, error } = useSelector((state) => state.user);
  console.log(currentUser)
  return (
    <div>

  
    </div>
  )
}

export default TeacherUplaod
