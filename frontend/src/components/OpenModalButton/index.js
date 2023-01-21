import React from 'react'
import { useModal } from '../../context/Modal';

export default function OpenModalButton({modalComponent, buttonText, onButtonClick, onModalClose}) {
  const {setModalContent, setOnModalClose} = useModal()

  const onClick = () => {
    if (typeof onButtonClick === 'function') onButtonClick();
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return (
    <button className="insidespot-idbuttons"  onClick={onClick}>{buttonText}</button>
  )
}

// font-family: georgia;
//     color: #8f8f8f;
//     font-size: 1rem;