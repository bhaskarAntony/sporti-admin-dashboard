// src/Security.js
import { useEffect, useState } from 'react';

const Security = () => {
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    if (window.top !== window.self) {
      setIsIframe(true);
    }
  }, []);

  if (isIframe) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        textAlign: 'center',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <h1>Restricted</h1>
        <p>This content is not available in an iframe.</p>
      </div>
    );
  }

  return null; // If not in an iframe, render nothing
};

export default Security;