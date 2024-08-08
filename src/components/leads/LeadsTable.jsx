import { useEffect, useMemo, useState } from 'react';
import Config from '../../Config';
import axios from 'axios';
import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
} from 'material-react-table';

import {
    Box, Button, ListItemIcon, MenuItem, lighten, FormControl, InputLabel, Select
} from '@mui/material';

//Icons Imports
import { AccountCircleRounded, AddCommentRounded, ChangeCircleRounded } from '@mui/icons-material';

const LeadsTable = () => {
    const [data, setData] = useState([]);
    const [product, setProduct] = useState('All');

    const handleProductChange = (event) => {
        setProduct(event.target.value);
    };

    useEffect(() => {
        const fetchLeadsData = async () => {
            try {
                const response = await axios.get(`${Config.apiUrl}/leadData/${product}`);
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLeadsData();
    }, [product]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'LID',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'LID',
                size: 100,
            },
            {
                accessorKey: 'name',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Lead Name',
                size: 100,
            },
            {
                accessorKey: 'contact.mobileNo',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Contact',
                size: 100,
                Cell: ({ row }) => row.original.contact?.mobileNo || '--',
            },
            {
                accessorKey: 'contact.emailID',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Email',
                size: 100,
                Cell: ({ row }) => row.original.contact?.emailID || '--',
            },
            {
                accessorKey: 'productDetails.status',
                filterFn: 'between',
                header: 'Status',
                size: 100,
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue() === 'spoke'
                                    ? theme.palette.secondary.main
                                    : (cell.getValue() === 'proposal sent'
                                        ? theme.palette.warning.main
                                        : (cell.getValue() === 'inactive'
                                            ? theme.palette.error.main
                                            : theme.palette.success.main)),
                            borderRadius: '1rem',
                            color: 'primary.contrastText',
                            maxWidth: '9ch',
                            p: '0.4rem',
                        })}
                    >
                        {cell.getValue()}
                    </Box>
                ),
            },
            {
                accessorKey: 'productDetails.pName',
                header: 'Product',
                size: 100,
            },
            {
                accessorKey: 'organizationName',
                header: 'Organisation',
                size: 100,
            },
            {
                accessorKey: 'designationDept',
                header: 'Department/Designation',
                size: 100,
                Cell: ({ row }) => row.original.designationDept || '--',
            },

        ],
        [],
    );

    // const handleDeactivate = () => {
    //     table.getSelectedRowModel().flatRows.map((row) => {
    //         alert('deactivating ' + row.getValue('name'));
    //     });
    // };

    // const handleActivate = () => {
    //     table.getSelectedRowModel().flatRows.map((row) => {
    //         alert('activating ' + row.getValue('name'));
    //     });
    // };

    // const handleContact = () => {
    //     table.getSelectedRowModel().flatRows.map((row) => {
    //         alert('contact ' + row.getValue('name'));
    //     });
    // };

    const renderTopToolbar = ({ table }) => (
        <Box
            sx={(theme) => ({
                backgroundColor: lighten(theme.palette.background.default, 0.05),
                display: 'flex',
                gap: '0.5rem',
                p: '8px',
                justifyContent: 'space-between',
            })}
        >
            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <MRT_GlobalFilterTextField table={table} />
                <MRT_ToggleFiltersButton table={table} />
            </Box>
            <Box>
                <Box sx={{ display: 'flex', gap: '0.5rem', minWidth: 200 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Product Name</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={product}
                            label="Product Name"
                            onChange={handleProductChange}
                            size='small'
                        >
                            <MenuItem value='All'>All</MenuItem>
                            <MenuItem value='P1'>Business Analyst</MenuItem>
                            <MenuItem value='P2'>EIGAP</MenuItem>
                            <MenuItem value='P3'>MapData</MenuItem>
                            <MenuItem value='P4'>LRS</MenuItem>
                        </Select>
                    </FormControl>
                    {/* <Button
                        color="error"
                        disabled={!table.getIsSomeRowsSelected()}
                        onClick={handleDeactivate}
                        variant="contained"
                    >
                        Deactivate
                    </Button>
                    <Button
                        color="success"
                        disabled={!table.getIsSomeRowsSelected()}
                        onClick={handleActivate}
                        variant="contained"
                    >
                        Activate
                    </Button>
                    <Button
                        color="info"
                        disabled={!table.getIsSomeRowsSelected()}
                        onClick={handleContact}
                        variant="contained"
                    >
                        Contact
                    </Button> */}
                </Box>
            </Box>
        </Box>
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableColumnFilterModes: true,
        enableGrouping: true,
        enableColumnOrdering: true,
        enableColumnActions: true,
        enableRowActions: true,
        enableRowSelection: true,
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            columnPinning: {
                right: ['mrt-row-actions'],
            },
        },
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },
        muiTableHeadCellProps: {
            sx: {
                backgroundColor: 'background.header',
                fontWeight: 'bold',
            },
        },
        muiPaginationProps: {
            color: 'primary',
            rowsPerPageOptions: [10, 20, 30],
            shape: 'rounded',
            variant: 'outlined',
        },
        renderRowActionMenuItems: ({ closeMenu }) => [
            <MenuItem
                key={0}
                onClick={() => {
                    // View profile logic...
                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <AccountCircleRounded color='primary' />
                </ListItemIcon>
                View Profile
            </MenuItem>,
            <MenuItem
                key={1}
                onClick={() => {
                    // Send email logic...
                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <AddCommentRounded color='primary' />
                </ListItemIcon>
                Add Follow-up
            </MenuItem>,
            <MenuItem
                key={2}
                onClick={() => {
                    // Send email logic...
                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <ChangeCircleRounded color='primary' />
                </ListItemIcon>
                Change Status
            </MenuItem>,
        ],
        renderTopToolbar,
    });

    return <MaterialReactTable table={table} />;
};

export default LeadsTable;

// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// const ExampleWithLocalizationProvider = () => (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <LeadsTable />
//     </LocalizationProvider>
// );

//export default ExampleWithLocalizationProvider;
