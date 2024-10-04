import { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
} from 'material-react-table';

import {
    Box, Button, ListItemIcon, MenuItem, lighten, FormControl, InputLabel, Select, useTheme
} from '@mui/material';

//Icons Imports
import { AccountCircleRounded, AddCommentRounded, AddShoppingCartRounded, EditRounded } from '@mui/icons-material';

import { useFetchLeads } from '../../providers/FetchLeadsProvider';
import { useDetails } from '../../providers/DetailsProvider';
import ViewProfile from './ViewProfile';
import AddFollowUp from './AddFollowUp';
import AddProduct from './AddProduct';
import EditLead from './EditLead';

const LeadsTable = () => {
    const { fetchLeadsData, data, product, setProduct } = useFetchLeads();
    const { productValues } = useDetails();
    const [openViewProfile, setOpenViewProfile] = useState(false);
    const [openAddFollowUp, setOpenAddFollowUp] = useState(false);
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [openEditLead, setOpenEditLead] = useState(false);
    const [leadID, setLeadID] = useState(0);
    const [productID, setProductID] = useState('');
    const [statusID, setStatusID] = useState('');

    //#region Fetch Data
    const handleProductChange = (event) => {
        setProduct(event.target.value);
    };

    useEffect(() => {
        fetchLeadsData();
    }, [product]);

    //#region Table Column
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
                accessorFn: (row) => row.contact?.mobileNo ?? '--',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Contact',
                size: 100,
                Cell: ({ cell }) => cell.getValue(),
            },
            {
                accessorFn: (row) => row.contact?.emailID ?? '--',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Email',
                size: 100,
                Cell: ({ cell }) => cell.getValue(),
            },
            {
                accessorKey: 'productDetails.sName',
                filterVariant: 'autocomplete',
                header: 'Status',
                size: 100,
                Cell: ({ cell }) => {
                    const theme = useTheme();
                    const sid = cell.row.original.productDetails.SID;
                    const sName = cell.getValue();

                    const sidToColor = {
                        S1: theme.palette.disabled,
                        S2: theme.palette.secondary.main,
                        S3: theme.palette.warning.main,
                        S4: theme.palette.success.main,
                        S5: theme.palette.error.main,
                    };

                    const backgroundColor = sidToColor[sid] || theme.palette.grey[500];

                    return (
                        <Box
                            component="span"
                            sx={{
                                backgroundColor: backgroundColor,
                                borderRadius: '1rem',
                                color: theme.palette.primary.contrastText,
                                maxWidth: '9ch',
                                p: '0.4rem',
                            }}
                        >
                            {sName}
                        </Box>
                    );
                },
            },
            {
                accessorKey: 'productDetails.pName',
                header: 'Product',
                size: 100,
            },
            {
                accessorKey: 'productDetails.assignedTo',
                header: 'Assigned To',
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

    //#region Top Toolbar
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
                        <InputLabel id="demo-simple-select-label" className='pb-2'>Product Name</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={product}
                            label="Product Name"
                            onChange={handleProductChange}
                            size='small'
                        >
                            <MenuItem value='All'>All</MenuItem>
                            {productValues.map((product) => (
                                <MenuItem key={product.PID} value={product.PID}>{product.pName}</MenuItem>
                            ))}
                            <MenuItem value='New'>New</MenuItem>
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

    //#region Table
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
        renderRowActionMenuItems: ({ row, closeMenu }) => {
            const lidValue = parseInt(row.original.LID);
            const pidValue = row.original.productDetails.PID;
            const sidValue = row.original.productDetails.SID;

            const menuItems = [
                <MenuItem
                    key={0}
                    onClick={() => {
                        setLeadID(lidValue);
                        setProductID(pidValue);
                        setOpenViewProfile(true);
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
                        setLeadID(lidValue);
                        setProductID(pidValue);
                        setStatusID(sidValue);
                        setOpenAddFollowUp(true);
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
                        setLeadID(lidValue);
                        setOpenAddProduct(true);
                        closeMenu();
                    }}
                    sx={{ m: 0 }}
                >
                    <ListItemIcon>
                        <AddShoppingCartRounded color='primary' />
                    </ListItemIcon>
                    Add Product
                </MenuItem>,
                <MenuItem
                    key={3}
                    onClick={() => {
                        setLeadID(lidValue);
                        setOpenEditLead(true);
                        closeMenu();
                    }}
                    sx={{ m: 0 }}
                >
                    <ListItemIcon>
                        <EditRounded color='primary' />
                    </ListItemIcon>
                    Edit Lead
                </MenuItem>
            ];
            
            return menuItems;
        },

        renderTopToolbar,
    });


    return (
        <>
            <MaterialReactTable table={table} />
            <ViewProfile
                openViewProfile={openViewProfile}
                setOpenViewProfile={setOpenViewProfile}
                lid={leadID}
                pid={productID}
            />
            <AddFollowUp
                openAddFollowUp={openAddFollowUp}
                setOpenAddFollowUp={setOpenAddFollowUp}
                lid={leadID}
                pid={productID}
                sid={statusID}
            />
            <AddProduct
                openAddProduct={openAddProduct}
                setOpenAddProduct={setOpenAddProduct}
                lid={leadID}
            />
            <EditLead
                openEditLead={openEditLead}
                setOpenEditLead={setOpenEditLead}
                lid={leadID}
            />
        </>
    );
};

export default LeadsTable;

