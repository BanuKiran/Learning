import { useState } from 'react';
import Backdrop from './Backdrop';

type Props = {
  text: string;
};

function Todo(props: Props) {
  const [showModal, setShowModal] = useState<boolean>();

  function showModalHandler() {
    setShowModal(true);
  }

  function closeModalHandler() {
    setShowModal(false);
  }
  return (
    <div className="card">
      <h2>{props.text}</h2>
      <div className="actions">
        <button className="btn" onClick={showModalHandler}>
          Delete
        </button>
        {showModal && <Backdrop onClick={closeModalHandler} />}
      </div>
    </div>
  );
}

export default Todo;
