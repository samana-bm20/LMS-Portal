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
import { EditRounded, SimCardDownloadRounded, DeleteRounded } from "@mui/icons-material";

import { Config } from "../../Config";
import { useDetails } from "../../providers/DetailsProvider";
import AddNewMLRecord from "../ML_Software_Info/addMLSoftwares";
import UpdateMLRecord from "../ML_Software_Info/updateMLSofwares";


const MLSoftwareTable = () => {
    const theme = useTheme();
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [vendor, setVendor] = useState("All");
    const [tableSNO, setTableSNO] = useState();
    const [showAddNewRecord, setShowAddNewRecord] = useState(false);
    const { mLSoftwareProducts } = useDetails();
    const [CopyMlSoftwareProducts, setCopyMlSoftwareProducts] = useState([]);
    const token = sessionStorage.getItem('token');
    const [openUpdateRecord, setOpenUpdateRecord] = useState(false);
    const [selectedValues, setSelectedValues] = useState({});


    //#region Fetch Data
    useEffect(() => {
        setCopyMlSoftwareProducts(mLSoftwareProducts);
    }, [mLSoftwareProducts]);


    const handleVendorChange = (event) => {
        let selectedVender = event.target.value;
        setVendor(selectedVender);
        if (selectedVender !== "All") {
            const filteredProducts = mLSoftwareProducts.filter(
                (pro) => pro.VendorName && pro.VendorName.trim() === selectedVender.trim()
            );
            setCopyMlSoftwareProducts(filteredProducts);
        } else {
            setCopyMlSoftwareProducts(mLSoftwareProducts);
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
        const csv = generateCsv(csvConfig)(CopyMlSoftwareProducts);
        download(csvConfig)(csv);
      };
    

    //#region Table Column
    // const subscriptionChoices = [
    //     { value: 'AntivirusUpdate', label: 'Antivirus Update' },
    //     { value: 'SSL', label: 'SSL' },
    //     { value: 'Office365', label: 'Office 365' },
    //     { value: 'TallySubscription', label: 'Tally Subscription' },
    //     { value: 'SMSPack', label: 'SMS Pack' },
    //     { value: 'GoogleSuite', label: 'Google Suite' },
    //     { value: 'GooglePlay', label: 'Google Play' },
    //     { value: 'AppleStore', label: 'Apple Store' },
    //     { value: 'ISOCertificate1', label: 'ISO Certificate 1' },
    //     { value: 'ISOCertificate2', label: 'ISO Certificate 2' },
    //     { value: 'ISOCertificate3', label: 'ISO Certificate 3' },
    //     { value: 'CMMICertificate', label: 'CMMI Certificate' },
    //     { value: 'NSICCertificate', label: 'NSIC Certificate' },
    //     { value: 'DoTCertificate', label: 'DoT Certificate' },
    //     { value: 'STPICertificate', label: 'STPI Certificate' },
    //     { value: 'AirtelFirewall', label: 'Airtel Firewall' },
    //     { value: 'UPS', label: 'UPS' },
    //     { value: 'BatteryBank', label: 'Battery Bank' },
    //     { value: 'Inverter', label: 'Inverter' },
    //     { value: 'WaterPurifier', label: 'Water Purifier' },
    //     { value: 'Intercom', label: 'Intercom' },
    //     { value: 'FireExtinguisher', label: 'Fire Extinguisher' },
    // ];

    const handleselectedValue = (rowId) => (event) => {
        const newVal = event.target.value;
        setSelectedValues((prev) => ({
            ...prev,
            [rowId]: newVal,
        }));
    };

    const handleDelete = (s_no) => {
        // You could show a confirmation dialog before proceeding
        const confirmDelete = window.confirm(`Are you sure you want to delete record with SNO: ${s_no}?`);
        if (confirmDelete) {
            // Assuming you are managing your data in a state called `data`
            const updatedData = CopyMlSoftwareProducts.filter(item => item.SNO !== s_no);
            setData(updatedData); // Update state with the new filtered data (without the deleted record)

            // Optionally, trigger an API call to delete the record from the backend
            // deleteRecord(s_no).then(response => {
            //   console.log("Record deleted:", response);
            // });
        }
    };


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
                accessorKey: "VendorName",
                enableClickToCopy: true,
                filterVariant: "autocomplete",
                header: "Vendor Name",
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
                accessorKey: "SubscriptionDescription",
                enableClickToCopy: true,
                filterVariant: "autocomplete",
                header: "Subscription Description",
                size: 100,
            },
            {
                accessorKey: "VendorAddress",
                enableClickToCopy: true,
                filterVariant: "autocomplete",
                header: "Vendor Address",
                size: 100,
            },
            {
                accessorKey: "City",
                enableClickToCopy: true,
                filterVariant: "autocomplete",
                header: "City",
                size: 100,
            },
            {
                accessorKey: "State",
                enableClickToCopy: true,
                filterVariant: "autocomplete",
                header: "State",
                size: 100,
            },
            {
                accessorKey: "SubscriptionFor",
                enableClickToCopy: true,
                filterVariant: "autocomplete",
                header: "Subscription For",
                size: 100,
                // Cell: ({ row }) => {
                //     const rowId = row.original.SNO; // Assuming SNO is unique for each row
                //     let currentValue = selectedValues[rowId] || 'Select Vendor';
                //     return (
                //         <FormControl fullWidth>
                //          <InputLabel id="select-label">Select Vendor</InputLabel>
                //           <Select
                //             value={currentValue}
                //             onChange={handleselectedValue(rowId)}
                //             fullWidth
                //             variant="outlined"
                //             sx={{minWidth: 120,  height: '45px'}}
                //             label="Select Vendor"
                //         >                           
                //             {subscriptionChoices.map((option) => (
                //                 <MenuItem key={option.value} value={option.value}>
                //                     {option.label}
                //                 </MenuItem>
                //             ))}
                //         </Select>
                //         </FormControl>
                //     );
                // }
            },

            {
                accessorKey: "SubscriptionAmount",
                enableClickToCopy: true,
                filterVariant: "autocomplete",
                header: "Subscription Amount",
                size: 100,
            },
            {
                accessorKey: "SubscriptionDate",
                enableClickToCopy: true,
                filterVariant: "autocomplete",
                header: "Subscription Date",
                size: 100,
            },
            {
                accessorKey: "SubscriptionTenure",
                enableClickToCopy: true,
                filterVariant: "autocomplete",
                header: "Subscription Tenure",
                size: 100,
            },

        ],
        [selectedValues]
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
                            Vendor Name
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={vendor}
                            label="Vendor Name"
                            onChange={handleVendorChange}
                            size="small"
                        >
                            <MenuItem value="All">All</MenuItem>
                            {[
                                ...new Set(
                                    mLSoftwareProducts
                                        .filter(
                                            (product) => product.VendorName && product.VendorName.trim()
                                        ) // Remove null, undefined, or empty strings
                                        .map((product) => product.VendorName.trim()) // Normalize case and trim whitespace
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
        data: CopyMlSoftwareProducts,
        enableColumnFilterModes: true,
        enableGrouping: true,
        enableColumnOrdering: true,
        enableColumnActions: true,
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Box>
                <IconButton
                    onClick={() => {
                        const s_no = row.original.SNO;
                        setTableSNO(s_no);
                        setOpenUpdateRecord(true);
                        // closeMenu();
                    }}
                >
                    <EditRounded color="primary" />
                </IconButton>
                <IconButton
                    onClick={() => {
                        const s_no = row.original.SNO;
                        handleDownload(s_no);
                    }}
                >
                    <SimCardDownloadRounded color="primary" />
                </IconButton>
                <IconButton
                    onClick={() => {
                        const s_no = row.original.SNO;
                        handleDelete(s_no); // This will call the function to handle deletion
                    }}
                >
                    <DeleteRounded color="primary" />  {/* Red color to indicate a delete action */}
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
        renderTopToolbar: renderTopToolbar,
    });

    return (
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
            <UpdateMLRecord
                openUpdateRecord={openUpdateRecord}
                setOpenUpdateRecord={setOpenUpdateRecord}
                tableSNO={tableSNO}
            />
            {showAddNewRecord && (
                <AddNewMLRecord
                    setShowAddNewRecord={setShowAddNewRecord}
                    showAddNewRecord={showAddNewRecord}
                />
            )}
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

export default MLSoftwareTable;
