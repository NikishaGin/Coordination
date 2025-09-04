import React from 'react';
import { useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearColor() {
    const isLoading = useSelector((state) => state.main.isLoading);

    if (!isLoading) return null;

    return (
        <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
            <LinearProgress color="secondary" />
        </Stack>
    );
}
