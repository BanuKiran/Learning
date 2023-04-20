import React from 'react';

const Message = (props: {
  user: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
  message: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
}) => (
  <div style={{ background: '#eee', borderRadius: '5px', padding: '0 10px' }}>
    <p>
      <strong>{props.user}</strong> says:
    </p>
    <p>{props.message}</p>
  </div>
);

export default Message;
