import React from 'react'
import { Button } from '@mui/material'
import { AddCircleRounded, FileUploadRounded, FileDownloadRounded } from '@mui/icons-material'

const LeadButtons = () => {
    return (
        <div className="flex justify-end space-x-reverse p-2 m-2">
            <Button
                sx={{ mr: '10px' }}
                variant="contained"
                startIcon={<AddCircleRounded />}
            >
                Add Lead
            </Button>
            <Button
                sx={{ mr: '10px' }}
                variant="contained"
                startIcon={<FileUploadRounded />}
            >
                Import Lead
            </Button>
            <Button
                sx={{ mr: '10px' }}
                variant="contained"
                startIcon={<FileDownloadRounded />}
            >
                Export Lead
            </Button>
        </div>
    )
}

export default LeadButtons