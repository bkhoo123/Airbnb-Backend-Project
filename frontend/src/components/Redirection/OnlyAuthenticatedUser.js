import React from 'react'
import OpenModalButton from '../OpenModalButton'
import SignupFormModal from '../SignupFormModal'
import LoginFormModal from '../LoginFormModal'

export default function OnlyAuthenticatedUser() {
  return (
    <div>
        <h1>Only logged in Users are allowed to use or see this content. Please login on the top right. Or use the 2 links below</h1>
        <div style={{display: 'flex', justifyContent: 'center', gap: 10}}>
        <OpenModalButton
        buttonText="Sign Up"
        modalComponent={<SignupFormModal/>}
        />
        <OpenModalButton
        buttonText="Login"
        modalComponent={<LoginFormModal/>}
        />
        </div>
    </div>
  )
}
