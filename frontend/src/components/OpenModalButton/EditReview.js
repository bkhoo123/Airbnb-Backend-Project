import React from 'react'
import { useModal } from '../../context/Modal';

export default function EditModalButton({modalComponent, buttonText, onButtonClick, onModalClose}) {
  const {setModalContent, setOnModalClose} = useModal()

  const onClick = () => {
    if (typeof onButtonClick === 'function') onButtonClick();
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return (
    <button className="edit-reviewbutton" onClick={onClick}>{buttonText}</button>
  )
}