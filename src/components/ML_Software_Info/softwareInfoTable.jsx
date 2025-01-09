/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import * as React from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { LibraryAddRounded, FileDownloadRounded } from "@mui/icons-material";
import {
  Box, Button, Snackbar, Alert, MenuItem, lighten, FormControl, InputLabel,
  Select, Tabs, Tab, IconButton, useTheme, alpha
} from "@mui/material";
import { mkConfig, generateCsv, download } from 'export-to-csv';

//Icons Imports
import { EditRounded, SimCardDownloadRounded } from "@mui/icons-material";

import { Config } from "../../Config";
import { useDetails } from "../../providers/DetailsProvider";
import UpdateRecord from "./updateInfo";
import AddNewRecord from "./addNewRecord";
import MLSoftwareTable from "./MLSoftwareTable";
import axios from "axios";

const SoftwaresInfoTable = () => {
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState("All");
  const [tableSNO, setTableSNO] = useState();
  const [copyEsriProducts, setCopyEsriProducts] = useState("All");
  const [showAddNewRecord, setShowAddNewRecord] = useState(false);
  const { esriProducts } = useDetails();
  const token = sessionStorage.getItem('token');
  const [openUpdateRecord, setOpenUpdateRecord] = useState(false);
  const [value, setValue] = React.useState("one");
  const [selectedValues, setSelectedValues] = useState({});


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //#region Fetch Data
  useEffect(() => {
    setCopyEsriProducts(esriProducts);
  }, [esriProducts]);

  const handleProductChange = (event) => {
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
    setShowAddNewRecord(true);
  };

  const errorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
  };

  const successClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
  };

  const handleDownload = (fid) => {
    const url = `${Config.apiUrl}/download`;
    fetch(url, {
      method: "POST",
      headers: {
        'Authorization': token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ viewmode: fid }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            setError(true);
            setErrorMessage("Document Not Found!");
            throw new Error("Network response was not ok");
          }
        } else {
          const disposition = response.headers.get("Content-Disposition");
          let fileName = "downloaded-file";
          if (disposition && disposition.indexOf("attachment") !== -1) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
              disposition
            );
            if (matches != null && matches[1]) {
              fileName = matches[1].replace(/['"]/g, ""); // Remove quotes if present
            }
          }
          return response.blob().then((blob) => ({ blob, fileName }));
        }
      })
      .then(({ blob, fileName }) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "downloaded-file"; // Use dynamic file name

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setSuccess(true);
      })
      .catch((error) => {
        console.error("Error fetching the file:", error);
      });
  };


  //#region Excel Import
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(copyEsriProducts);
    download(csvConfig)(csv);
  };


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
        accessorKey: "RenewalDueDate",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Renewal Due Date",
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
        <Box sx={{ display: "flex", gap: "0.5rem", minWidth: 350 }}>
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
            </Select>
          </FormControl>
          <Button variant="contained"
            onClick={handleExportData}
            startIcon={<FileDownloadRounded />}
          >
            Export
          </Button>
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
    renderRowActions: ({ row }) => (
      <Box>
        <IconButton
          onClick={() => {
            const s_no = parseInt(row.original.SNO);
            setTableSNO(s_no);
            setOpenUpdateRecord(true);
            // closeMenu();
          }}
        >
          <EditRounded color="primary" />
        </IconButton>
        <IconButton
          onClick={() => {
            const s_no = parseInt(row.original.SNO);
            handleDownload(s_no);
          }}
        >
          <SimCardDownloadRounded color="primary" />
        </IconButton>
      </Box>
    ),
    // enableRowSelection: true,
    initialState: {
      showGlobalFilter: true,
      density: "compact",
      columnPinning: {
        right: ["mrt-row-actions"],
      },
      pagination: { pageSize: 50 }
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
      rowsPerPageOptions: [25, 50, 75],
      shape: "rounded",
      variant: "outlined",
    },
    renderTopToolbar,
  });

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        // textColor="secondary"
        indicatorColor="primary"
        aria-label="customized tabs"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main,
            textColor: theme.palette.primary.main,
          },
        }}
      >
        <Tab
          value="one"
          label="ESRI Products"
          sx={{ "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.2), color: theme.palette.primary.main } }}
        />
        <Tab
          value="two"
          label="ML Vendors"
          sx={{ "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.2), color: theme.palette.primary.main } }}
        />
        {/* <Tab
          value="three"
          label="Server Domain/IP"
          sx={{ "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.2), color: theme.palette.primary.main } }}
        /> */}
      </Tabs>
      <Box sx={{ marginTop: 2 }}>
        {value === "one" && (
          <>
            <MaterialReactTable table={table} />
            <Button
              sx={{ m: "5px", top: "8px", right: "6px" }}
              variant="contained"
              startIcon={<LibraryAddRounded />}
              onClick={onClickAddRecord}
            >
              Add New Record
            </Button>
            <UpdateRecord
              openUpdateRecord={openUpdateRecord}
              setOpenUpdateRecord={setOpenUpdateRecord}
              tableSNO={tableSNO}
            />
            {showAddNewRecord && (
              <AddNewRecord
                setShowAddNewRecord={setShowAddNewRecord}
                showAddNewRecord={showAddNewRecord}
              />
            )}
          </>
        )}
        {value === "two" && (
          <>
            <MLSoftwareTable />
          </>
        )}
        {/* {value === "three" && <h5>Table Three</h5>} */}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={error}
        autoHideDuration={2000}
        onClose={errorClose}
      >
        <Alert onClose={errorClose} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={success}
        autoHideDuration={2000}
        onClose={successClose}
      >
        <Alert onClose={successClose} severity="success" variant="filled">
          Document download successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default SoftwaresInfoTable;
