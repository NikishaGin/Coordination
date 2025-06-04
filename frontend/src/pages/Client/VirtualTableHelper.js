import React, { useRef, useEffect, useState } from 'react';

// Helper hook to calculate dynamic row heights if needed
export const useRowHeight = (defaultHeight = 44) => {
    const [rowHeight, setRowHeight] = useState(defaultHeight);
    const rowRef = useRef(null);

    useEffect(() => {
        if (rowRef.current) {
            const height = rowRef.current.getBoundingClientRect().height;
            if (height > 0 && height !== rowHeight) {
                setRowHeight(height);
            }
        }
    }, [rowRef.current]);

    return { rowHeight, rowRef };
};

// Helper hook to calculate list dimensions based on container
export const useListDimensions = (tableHeaderHeight = 48) => {
    const [dimensions, setDimensions] = useState({
        width: '100%',
        height: 400 // Default height
    });
    const containerRef = useRef(null);

    useEffect(() => {
        const calculateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: width,
                    height: Math.max(height - tableHeaderHeight, 100) // Ensure minimum height
                });
            }
        };

        calculateDimensions();

        // Add resize listener
        window.addEventListener('resize', calculateDimensions);

        return () => {
            window.removeEventListener('resize', calculateDimensions);
        };
    }, [tableHeaderHeight]);

    return { dimensions, containerRef };
};

// Helper to create custom CSS for virtual rows to match table styling
export const createVirtualRowStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
    .virtual-table-body {
      overflow: auto !important;
    }
    
    .virtualized-row {
      display: table-row;
      border-bottom: 1px solid #333;
      transition: background-color 0.2s ease;
    }
    
    .virtualized-row:hover {
      background-color: #2a2a50 !important;
    }
    
    .virtualized-row.even-row {
      background-color: #1e1e30;
    }
    
    .virtualized-row > td {
      padding: 12px 15px;
      color: #e0e0e0;
    }
  `;
    return style;
};

// Inject virtual row styles into document head
export const injectVirtualRowStyles = () => {
    const style = createVirtualRowStyles();
    document.head.appendChild(style);
    return () => {
        document.head.removeChild(style);
    };
};