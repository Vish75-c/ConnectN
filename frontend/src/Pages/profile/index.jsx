import { useAppStore } from '@/store'
import React from 'react'

const Profile = () => {
  const {userInfo}=useAppStore();
  return (
    <div>
      Profile
      <div>{userInfo.password}</div>
    </div>
  )
}

export default Profile
