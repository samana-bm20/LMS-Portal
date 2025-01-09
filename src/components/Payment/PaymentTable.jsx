/* eslint-disable no-unused-vars */

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { LibraryAddRounded } from "@mui/icons-material";
import {
  Box, Button, Snackbar, Alert, MenuItem, lighten, FormControl, InputLabel,
  Select, Tabs, Tab, IconButton, useTheme, alpha
} from "@mui/material";
import { useDetails } from "../../providers/DetailsProvider";
//Icons Imports
import { EditRounded, SimCardDownloadRounded, FileDownloadRounded } from "@mui/icons-material";
import UpdatePayment from "./updatePyment";
import AddNewPayment from "./addNewPayment";
import { mkConfig, generateCsv, download } from 'export-to-csv';

const PaymentTable = () => {
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copyPaymentDetails, setCopyPaymentDetails] = useState("All");
  const [showAddNewRecord, setShowAddNewRecord] = useState(false);
  const [openUpdateRecord, setOpenUpdateRecord] = useState(false);
  const [product, setProduct] = useState("All");
  const { mlPaymentdetails } = useDetails();
  const [tableSNO, setTableSNO] = useState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setCopyPaymentDetails(mlPaymentdetails);
  }, [mlPaymentdetails]);

  const handlePaymentChange = (event) => {
    let selectedPro = event.target.value;
    setProduct(selectedPro);
    if (selectedPro !== "All") {

      const filteredDetails = mlPaymentdetails.filter(
        (pro) => pro.Project && pro.Project.trim() === selectedPro.trim()
      );
      setCopyPaymentDetails(filteredDetails);
    } else {
      setCopyPaymentDetails(mlPaymentdetails);
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

  const formatDate = (date) => {

    const isDDMMYYYY = /^\d{2}-\d{2}-\d{4}$/.test(date);
    if (isDDMMYYYY) {
      // If it's already in dd-mm-yyyy format, return the date as is
      return date;
    }

    else {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0'); // months are zero-indexed
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
  };

  //#region Excel Import
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(copyPaymentDetails);
    download(csvConfig)(csv);
  };

  //#region Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "SNO",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "SNO",
        size: 100,
      },
      {
        accessorKey: "Project",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Project",
        size: 100,
      },
      {
        accessorKey: "RedingtonInvoice",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Redington Invoice",
        size: 100,
      },
      {
        accessorKey: "RedingtonInvoiceDate",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Redington Invoice Date",
        size: 100,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: "CreditDays",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Credit Days",
        size: 100,
      },
      {
        accessorKey: "AdvanceChequeDate",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Advance Cheque Date",
        size: 100,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: "ChequeAmount",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Cheque Amount",
        size: 100,
      },
      {
        accessorKey: "ChequeNumber",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Cheque Number",
        size: 100,
      },
      {
        accessorKey: "Drawnon",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Drawn on",
        size: 100,
      },
      {
        accessorKey: "Paymentfrom",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Payment From",
        size: 100,
      },
    ],
    []
  );

  //#region Top Toolbar
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
              Project Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={product}
              label="Project Name"
              onChange={handlePaymentChange}
              size="small"
            >
              <MenuItem value="All">All</MenuItem>
              {[
                ...new Set(
                  mlPaymentdetails
                    .filter(
                      (product) => product.Project && product.Project.trim()
                    ) // Remove null, undefined, or empty strings
                    .map((product) => product.Project.trim()) // Normalize case and trim whitespace
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
    data: copyPaymentDetails,
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
    renderTopToolbar,
  });

  return (
    <div>
      <Box sx={{ marginTop: 2 }}>
        <MaterialReactTable table={table} />
        <Button
          sx={{ m: "5px", top: "8px", right: "6px" }}
          variant="contained"
          startIcon={<LibraryAddRounded />}
          onClick={onClickAddRecord}
        >
          Add New Record
        </Button>
        <UpdatePayment
          openUpdateRecord={openUpdateRecord}
          setOpenUpdateRecord={setOpenUpdateRecord}
          tableSNO={tableSNO}
        />
        {showAddNewRecord && (
          <AddNewPayment
            setShowAddNewRecord={setShowAddNewRecord}
            showAddNewRecord={showAddNewRecord}
          />
        )}
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
    </div>
  );


};

export default PaymentTable;
