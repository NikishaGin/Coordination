import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CheckCircle } from 'lucide-react';

const SnackbarContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #3a3a6a;
  color: #ffffff;
  padding: 12px 14px;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  font-size: 16px;
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  transition: opacity 0.3s, visibility 0.3s;
`;

const Snackbar = ({ message, visible, onClose }) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    return (
        <SnackbarContainer visible={visible}>
            <CheckCircle size={20} />
            {message}
        </SnackbarContainer>
    );
};

export default Snackbar;