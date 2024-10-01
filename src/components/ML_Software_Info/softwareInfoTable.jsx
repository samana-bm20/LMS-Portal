import { useEffect, useMemo, useState } from "react";
import * as React from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { AddCircleRounded, FileUploadRounded } from '@mui/icons-material'

import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  lighten,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";

//Icons Imports
import {
  AccountCircleRounded,
  AddCommentRounded,
  AddShoppingCartRounded,
  EditRounded,
} from "@mui/icons-material";

import { useFetchLeads } from "../../providers/FetchLeadsProvider";
import { useDetails } from "../../providers/DetailsProvider";
// import ViewProfile from './ViewProfile';
// import AddFollowUp from './AddFollowUp';
// import AddProduct from './AddProduct';
import UpdateRecord from "./updateInfo";
import AddNewRecord from "./addNewRecord"

const SoftwaresInfoTable = () => {
  const [product, setProduct] = useState("All");
  const [tableSNO, setTableSNO] = useState();
  const [copyEsriProducts, setCopyEsriProducts] = useState("All");
  const [showAddNewRecord, setShowAddNewRecord] = useState(false);
  const {
    productValues,
    userValues,
    loggedUser,
    esriProducts,
    setEsriProducts,
  } = useDetails();
  const user = userValues.filter((user) => user.username === loggedUser);
  const [openUpdateRecord, setOpenUpdateRecord] = useState(false);

  const [value, setValue] = React.useState("one");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //#region Fetch Data
  useEffect(() => {
    setCopyEsriProducts(esriProducts);
  }, [esriProducts]);

  const handleProductChange = (event) => {
    debugger;
    let selectedPro = event.target.value;
    setProduct(selectedPro);
    if (selectedPro !== "All") {
      const filteredProducts = esriProducts.filter(
        (pro) => pro.Product && pro.Product.trim() === selectedPro.trim()
      );
      setCopyEsriProducts(filteredProducts);
    } else {
      setCopyEsriProducts(esriProducts);
    }
  };

  const onClickAddRecord = () => {
    setShowAddNewRecord(true)
  }

  //#region Table Column
  const columns = useMemo(
    () => [
      {
        accessorKey: "SNO",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "S.No.",
        size: 100,
      },
      {
        accessorKey: "ClientName",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Client Name",
        size: 100,
      },
      {
        accessorKey: "Contact",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Contact Person",
        size: 100,
      },
      {
        accessorKey: "Phone",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Phone",
        size: 100,
      },
      {
        accessorKey: "Email",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Email",
        size: 100,
      },
      {
        accessorKey: "PONumber",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "PO Number",
        size: 100,
      },
      {
        accessorKey: "PODate",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "PO Date",
        size: 100,
      },
      {
        accessorKey: "POValue",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "PO Value",
        size: 100,
      },
      {
        accessorKey: "Product",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Product",
        size: 100,
      },
      {
        accessorKey: "ProductVersion",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Product Version",
        size: 100,
      },
      {
        accessorKey: "Description",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Description",
        size: 100,
      },
      {
        accessorKey: "NumberOfLicenses",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Number of Licenses",
        size: 100,
      },
      {
        accessorKey: "LicenseDate",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "License Date",
        size: 100,
      },
      {
        accessorKey: "Tenure",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Tenure",
        size: 100,
      },
      // {
      //     accessorKey: 'productDetails.sName',
      //     filterVariant: 'autocomplete',
      //     header: 'Status',
      //     size: 100,
      //     Cell: ({ cell }) => {
      //         const theme = useTheme();
      //         const sid = cell.row.original.productDetails.SID;
      //         const sName = cell.getValue();

      //         const sidToColor = {
      //             S1: theme.palette.disabled,
      //             S2: theme.palette.secondary.main,
      //             S3: theme.palette.warning.main,
      //             S4: theme.palette.success.main,
      //             S5: theme.palette.error.main,
      //         };

      //         const backgroundColor = sidToColor[sid] || theme.palette.grey[500];

      //         return (
      //             <Box
      //                 component="span"
      //                 sx={{
      //                     backgroundColor: backgroundColor,
      //                     borderRadius: '1rem',
      //                     color: theme.palette.primary.contrastText,
      //                     maxWidth: '9ch',
      //                     p: '0.4rem',
      //                 }}
      //             >
      //                 {sName}
      //             </Box>
      //         );
      //     },
      // },
      {
        accessorKey: "City",
        header: "City",
        size: 100,
      },
      {
        accessorKey: "State",
        header: "State",
        size: 100,
      },
      {
        accessorKey: "Pincode",
        header: "Pincode",
        size: 100,
      },
      {
        accessorKey: "ClientAddress",
        header: "Complete Address",
        size: 100,
      },
    ],
    []
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
        display: "flex",
        gap: "0.5rem",
        p: "8px",
        justifyContent: "space-between",
      })}
    >
      <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <MRT_GlobalFilterTextField table={table} />
        <MRT_ToggleFiltersButton table={table} />
      </Box>
      <Box>
        <Box sx={{ display: "flex", gap: "0.5rem", minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label" className="pb-2">
              Product Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={product}
              label="Product Name"
              onChange={handleProductChange}
              size="small"
            >
              <MenuItem value="All">All</MenuItem>
              {[
                ...new Set(
                  esriProducts
                    .filter(
                      (product) => product.Product && product.Product.trim()
                    ) // Remove null, undefined, or empty strings
                    .map((product) => product.Product.trim()) // Normalize case and trim whitespace
                ),
              ].map((uniqueProduct, index) => (
                <MenuItem key={index} value={uniqueProduct}>
                  {uniqueProduct}
                </MenuItem>
              ))}
              {/* <MenuItem value="New">New</MenuItem> */}
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
    data: copyEsriProducts,
    enableColumnFilterModes: true,
    enableGrouping: true,
    enableColumnOrdering: true,
    enableColumnActions: true,
    enableRowActions: true,
    enableRowSelection: true,
    initialState: {
      showGlobalFilter: true,
      density: "compact",
      columnPinning: {
        right: ["mrt-row-actions"],
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "background.header",
        fontWeight: "bold",
      },
    },
    muiPaginationProps: {
      color: "primary",
      rowsPerPageOptions: [10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },
    renderRowActionMenuItems: ({ row, closeMenu }) => {
      const s_no = parseInt(row.original.SNO);
      // const pidValue = row.original.productDetails.PID;
      // const sidValue = row.original.productDetails.SID;

      const menuItems = [
        // <MenuItem
        //     key={0}
        //     onClick={() => {
        //         // setLeadID(lidValue);
        //         // setProductID(pidValue);
        //         // setOpenViewProfile(true);
        //         closeMenu();
        //     }}
        //     sx={{ m: 0 }}
        // >
        //     <ListItemIcon>
        //         <AccountCircleRounded color='primary' />
        //     </ListItemIcon>
        //     View Profile
        // </MenuItem>,
        // <MenuItem
        //     key={1}
        //     onClick={() => {
        //         // setLeadID(lidValue);
        //         // setProductID(pidValue);
        //         // setStatusID(sidValue);
        //         // setOpenAddFollowUp(true);
        //         closeMenu();
        //     }}
        //     sx={{ m: 0 }}
        // >
        //     <ListItemIcon>
        //         <AddCommentRounded color='primary' />
        //     </ListItemIcon>
        //     Add Follow-up
        // </MenuItem>,
        // <MenuItem
        //     key={2}
        //     onClick={() => {
        //         // setLeadID(lidValue);
        //         // setOpenAddProduct(true);
        //         closeMenu();
        //     }}
        //     sx={{ m: 0 }}
        // >
        //     <ListItemIcon>
        //         <AddShoppingCartRounded color='primary' />
        //     </ListItemIcon>
        //     Add Product
        // </MenuItem>,
        <MenuItem
          key={3}
          onClick={() => {
            setTableSNO(s_no);
            setOpenUpdateRecord(true);
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <EditRounded color="primary" />
          </ListItemIcon>
          Edit
        </MenuItem>,
      ];

      return menuItems;
    },

    renderTopToolbar,
  });

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        // textColor="secondary"
        indicatorColor="secondary"
        aria-label="customized tabs"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "green",
            textColor: "green",
          },
        }}
      >
        <Tab
          value="one"
          label="ESRI Products"
          sx={{ "&:hover": { backgroundColor: "#e2e2e2", color: "#006A62" } }}
        />
        <Tab
          value="two"
          label="ML Softwares"
          sx={{ "&:hover": { backgroundColor: "#e2e2e2", color: "#006A62" } }}
        />
        <Tab
          value="three"
          label="Server Domain/IP"
          sx={{ "&:hover": { backgroundColor: "#e2e2e2", color: "#006A62" } }}
        />
      </Tabs>
      <Box sx={{ marginTop: 2 }}>
        {value === "one" && (
          <>
            <MaterialReactTable table={table} />
            <Button
              sx={{ m: "5px",top: '8px', right: '6px' }}
              variant="contained"
              startIcon={<AddCircleRounded />}
              onClick={onClickAddRecord}
            >
              Add New Record
            </Button>
            <UpdateRecord
              openUpdateRecord={openUpdateRecord}
              setOpenUpdateRecord={setOpenUpdateRecord}
              tableSNO={tableSNO}
            />
            { showAddNewRecord && <AddNewRecord 
             setShowAddNewRecord={setShowAddNewRecord}
             showAddNewRecord = {showAddNewRecord}
              />}
          </>
        )}
        {value === "two" && <h5>Table Two</h5>}
        {value === "three" && <h5>Table Three</h5>}
      </Box>
    </>
  );
};

export default SoftwaresInfoTable;
