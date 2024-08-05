import { useMemo } from 'react';

//MRT Imports
import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
} from 'material-react-table';

//Material UI Imports
import {
    Box,
    Button,
    ListItemIcon,
    MenuItem,
    lighten,
} from '@mui/material';

//Icons Imports
import { AccountCircleRounded, AddCommentRounded, ChangeCircleRounded } from '@mui/icons-material';

//Mock Data
const data = [
    {
        // id: 'LD01',
        name: 'Mohit',
        contact: '9987654321',
        email: 'mohit@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'ceo - India business',
        product: 'business analyst',
        status: 'spoke'
    },
    {
        // id: 'LD02',
        name: 'Ramya',
        contact: '9987654321',
        email: 'ramya@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'ceo - India business',
        product: 'eigap',
        status: 'spoke'
    },
    {
        // id: 'LD03',
        name: 'Arif',
        contact: '9987654321',
        email: 'arif@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'ceo - India business',
        product: 'business analyst',
        status: 'proposal sent'
    },
    {
        // id: 'LD04',
        name: 'Lauren',
        contact: '9987654321',
        email: 'lauren@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'ceo - India business',
        product: 'map data',
        status: 'active'
    },
    {
        // id: 'LD05',
        name: 'Madhav',
        contact: '9987654321',
        email: 'madhav@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'ceo - India business',
        product: 'eigap',
        status: 'spoke'
    },
    {
        // id: 'LD06',
        name: 'Karen',
        contact: '9987654321',
        email: 'karen@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'ceo - India business',
        product: 'business analyst',
        status: 'active'
    },
    {
        // id: 'LD03',
        name: 'Arif',
        contact: '9987654321',
        email: 'arif@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'ceo - India business',
        product: 'business analyst',
        status: 'proposal sent'
    },
    {
        // id: 'LD04',
        name: 'Lauren',
        contact: '9987654321',
        email: 'lauren@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'ceo - India business',
        product: 'map data',
        status: 'active'
    },
    {
        // id: 'LD05',
        name: 'Madhav',
        contact: '9987654321',
        email: 'madhav@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'ceo - India business',
        product: 'eigap',
        status: 'spoke'
    },
    {
        // id: 'LD06',
        name: 'Karen',
        contact: '9987654321',
        email: 'karen@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'ceo - India business',
        product: 'business analyst',
        status: 'active'
    },
    {
        // id: 'LD01',
        name: 'Mohit',
        contact: '9987654321',
        email: 'mohit@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'department',
        product: 'business analyst',
        status: 'spoke'
    },
    {
        // id: 'LD02',
        name: 'Ramya',
        contact: '9987654321',
        email: 'ramya@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'department',
        product: 'eigap',
        status: 'spoke'
    },
    {
        // id: 'LD03',
        name: 'Arif',
        contact: '9987654321',
        email: 'arif@example.com',
        organisation: 'Pvt. Ltd.',
        department: 'department',
        product: 'business analyst',
        status: 'proposal sent'
    },

];
const LeadsTable = () => {
    const columns = useMemo(
        () => [
            // {
            //     accessorKey: 'id', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            //     enableClickToCopy: true,
            //     filterVariant: 'autocomplete',
            //     header: 'ID',
            //     size: 150,
            //     grow: false,
            // },
            {
                accessorKey: 'name', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Lead Name',
                size: 150,
            },
            {
                accessorKey: 'contact', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Contact',
                size: 150,
            },
            {
                accessorKey: 'email', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Email',
                size: 150,
            },
            {
                accessorKey: 'status',
                // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
                filterFn: 'between',
                header: 'Status',
                size: 150,
                //custom conditional format and styling
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue() == 'spoke'
                                    ? theme.palette.error.dark
                                    : cell.getValue() == 'proposal sent'
                                        ? theme.palette.warning.dark
                                        : theme.palette.success.dark,
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        {cell.getValue()}
                    </Box>
                ),
            },
            {
                accessorKey: 'organisation',
                header: 'Organisation',
                size: 150,
            },
            {
                accessorKey: 'department',
                header: 'Department/Designation',
                size: 150,
            },
            {
                accessorKey: 'product',
                header: 'Product',
                size: 150,
            },


        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableColumnFilterModes: true,
        enableGrouping: true,
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
        renderTopToolbar: ({ table }) => {
            const handleDeactivate = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('deactivating ' + row.getValue('name'));
                });
            };

            const handleActivate = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('activating ' + row.getValue('name'));
                });
            };

            const handleContact = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('contact ' + row.getValue('name'));
                });
            };

            return (
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
                        {/* import MRT sub-components */}
                        <MRT_GlobalFilterTextField table={table} />
                        <MRT_ToggleFiltersButton table={table} />
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                            <Button
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
                            </Button>
                        </Box>
                    </Box>
                </Box>
            );
        },
    });

    return <MaterialReactTable table={table} />;
};

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ExampleWithLocalizationProvider = () => (
    //App.tsx or AppProviders file
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <LeadsTable />
    </LocalizationProvider>
);

export default ExampleWithLocalizationProvider;
