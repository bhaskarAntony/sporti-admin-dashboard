// DialogContext.js
import React, { createContext, useState, useContext } from 'react';
import SuccessPopup from './SuccessPopup';

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        title: '',
        desc: '',
        status:false
    });

    const openDialog = (title, desc, status) => {
        setDialogState({ isOpen: true, title, desc, status });
    };

    const closeDialog = () => {
        setDialogState({ isOpen: false, title: '', desc: '', status:false });
    };

    return (
        <DialogContext.Provider value={{ dialogState, openDialog, closeDialog }}>
            {children}
            {dialogState.isOpen && (
                <SuccessPopup
                    show={dialogState.isOpen}
                    close={closeDialog}
                    title={dialogState.title}
                    desc={dialogState.desc}
                    error={dialogState.status}
                />
            )}
        </DialogContext.Provider>
    );
};

export const useDialog = () => useContext(DialogContext);
