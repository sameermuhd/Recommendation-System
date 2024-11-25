import React, { useState, createContext, useContext } from 'react';
import { Snackbar, Alert, Button, Backdrop, CircularProgress } from '@mui/material';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

const CustomAlertProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [actionText, setActionText] = useState('');
  const [actionCallback, setActionCallback] = useState(null);
  const [severity, setSeverity] = useState('info'); // info, success, warning, error
  const [showOverlay, setShowOverlay] = useState(false); // Overlay state

  const showAlert = (msg, buttonText = null, callback = null, type = 'info', overlay = true) => {
    setMessage(msg);
    setActionText(buttonText);
    setActionCallback(() => callback);
    setSeverity(type);
    setShowOverlay(overlay); // Enable or disable overlay
    setIsOpen(true);
  };

  const handleAction = () => {
    if (actionCallback) actionCallback();
    setIsOpen(false);
    setShowOverlay(false); // Hide overlay
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowOverlay(false); // Hide overlay
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Backdrop for overlay */}
      {showOverlay && (
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          open={showOverlay}
          onClick={(e) => e.stopPropagation()} // Prevent backdrop clicks from closing the alert
        >
          <div
            onClick={(e) => e.stopPropagation()} // Block clicks inside the backdrop from propagating
          >
            {/* Optional loader or empty div to retain overlay behavior */}
            <CircularProgress color="inherit" size={50} style={{ visibility: 'hidden' }} />
          </div>
        </Backdrop>
      )}

      {/* Floating Snackbar Alert */}
      <Snackbar
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          action={
            actionText && (
              <Button color="inherit" size="small" onClick={handleAction}>
                {actionText}
              </Button>
            )
          }
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export default CustomAlertProvider;
