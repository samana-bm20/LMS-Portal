import React from 'react'
import { useTheme } from '@mui/material';
import { ErrorRounded } from '@mui/icons-material';

const ErrorPage = () => {
    const theme = useTheme();
    const user = JSON.parse(sessionStorage.getItem('user'));

    return (
        <>
            <div className='text-lg pl-3 mb-2 font-bold' style={{ color: theme.palette.primary.main }}>
                Hi, {user.uName || 'User'}
            </div>
            <div className='flex text-sm italic pl-3 mb-2 font-semibold' style={{ color: theme.palette.error.main }}>
                <ErrorRounded color='error' fontSize='small'/>
                You are not authorised to access this page.
            </div>
        </>
    )
}

export default ErrorPage