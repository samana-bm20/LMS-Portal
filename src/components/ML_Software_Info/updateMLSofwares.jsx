import React, { useEffect, useState } from "react";
import {
  MenuItem, Select,
  Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from "@mui/material";
import axios from "axios";
import { Config } from "../../Config";

import { useDetails } from "../../providers/DetailsProvider";

const UpdateMLRecord = ({ openUpdateRecord, setOpenUpdateRecord, tableSNO }) => {
  const { mLSoftwareProducts, fetchMLSoftwareProducts } = useDetails();

  const token = sessionStorage.getItem('token');
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formDataDocFile, setFormDataDocFile] = useState({});
  let currentMLProduct;
  const [editRecordsData, setEditRecordsData] = useState({

    VendorName: "",
    VendorAddress: "",
    City: "",
    State: "",
    SubscriptionFor: "",
    SubscriptionDescription: "",
    SubscriptionAmount: "",
    SubscriptionDate: "",
    SubscriptionTenure: "",
    RenewalDueDate: "",
  });

  const subscriptionChoices = [
    { value: 'AntivirusUpdate', label: 'Antivirus Update' },
    { value: 'SSL', label: 'SSL' },
    { value: 'Office365', label: 'Office 365' },
    { value: 'TallySubscription', label: 'Tally Subscription' },
    { value: 'SMSPack', label: 'SMS Pack' },
    { value: 'GoogleSuite', label: 'Google Suite' },
    { value: 'GooglePlay', label: 'Google Play' },
    { value: 'AppleStore', label: 'Apple Store' },
    { value: 'ISOCertificate1', label: 'ISO Certificate 1' },
    { value: 'ISOCertificate2', label: 'ISO Certificate 2' },
    { value: 'ISOCertificate3', label: 'ISO Certificate 3' },
    { value: 'CMMICertificate', label: 'CMMI Certificate' },
    { value: 'NSICCertificate', label: 'NSIC Certificate' },
    { value: 'DoTCertificate', label: 'DoT Certificate' },
    { value: 'STPICertificate', label: 'STPI Certificate' },
    { value: 'AirtelFirewall', label: 'Airtel Firewall' },
    { value: 'UPS', label: 'UPS' },
    { value: 'BatteryBank', label: 'Battery Bank' },
    { value: 'Inverter', label: 'Inverter' },
    { value: 'WaterPurifier', label: 'Water Purifier' },
    { value: 'Intercom', label: 'Intercom' },
    { value: 'Internet', label: 'Internet' },
    { value: 'FireExtinguisher', label: 'Fire Extinguisher' },
    { value: 'Other', label: 'Other' },
  ];

  const getEditTableRowData = async () => {
    try {
      currentMLProduct = mLSoftwareProducts.filter((pro) => pro.SNO === tableSNO);

      setEditRecordsData((prev) => ({
        ...prev,
        VendorName: currentMLProduct[0]?.VendorName || null,
        VendorAddress: currentMLProduct[0]?.VendorAddress || null,
        City: currentMLProduct[0]?.City || null,
        State: currentMLProduct[0]?.State || null,
        SubscriptionFor: currentMLProduct[0]?.SubscriptionFor || null,
        SubscriptionDescription: currentMLProduct[0]?.SubscriptionDescription || null,
        Subscriptionamount: currentMLProduct[0]?.SubscriptionAmount || null,
        SubscriptionDate: currentMLProduct[0]?.SubscriptionDate || null,
        SubscriptionTenure: currentMLProduct[0]?.SubscriptionTenure || null,
        RenewalDueDate: currentMLProduct[0]?.RenewalDueDate || null,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (openUpdateRecord) {
      getEditTableRowData();
    }
  }, [tableSNO, openUpdateRecord]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRecordsData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const uploadDocFile = async (selectedFile, SNO) => {
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("SNO", SNO);
    try {
      const response = await axios.post(`${Config.apiUrl}/uploadDoc`, formData, {
        headers: {
          'Authorization': token,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const selectedFile = files[0];
      setFormDataDocFile((prevState) => ({
        ...prevState,
        [name]: selectedFile,
      }));
    } else {
      setFormDataDocFile((prevState) => ({
        ...prevState,
        [name]: null,
      }));
    }
  };

  const handleUpdateClick = async () => {
    if (
      !editRecordsData.VendorName
    ) {
      setErrorMessage("Required fields cannot be empty.");
      setError(true);
      return;
    }

    try {
      const params = {
        data: editRecordsData,
        SNO: tableSNO,
      };
      await axios.post(`${Config.apiUrl}/updateMLSoftwareProduct`, params, {
        headers: {
          'Authorization': token
        }
      });
      setOpenUpdateRecord(false);
      setEditRecordsData({});
      fetchMLSoftwareProducts();
      //uploadDocFile(formDataDocFile.InstallationCertificate, tableSNO);
      setSuccess(true);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(true);
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const closeUpdatePanel = () => {
    setEditRecordsData({
      VendorName: "",
      VendorAddress: "",
      City: "",
      State: "",
      SubscriptionFor: "",
      SubscriptionDescription: "",
      SubscriptionAmount: "",
      SubscriptionDate: "",
      SubscriptionTenure: "",
      RenewalDueDate: "",
    });
    setOpenUpdateRecord(false);
  };

  //#region Snackbar
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

  return (
    <>
      <Dialog open={openUpdateRecord} onClose={closeUpdatePanel}>
        <DialogTitle>Update Record</DialogTitle>
        <DialogContent>
          <Paper
            elevation={3}
            className="p-4 rounded-lg shadow-md"
            component="form"
          >
            <div className="mb-2">
              <TextField
                required
                name="VendorName"
                id="outlined-required"
                label="Vendor Name"
                size="small"
                value={editRecordsData?.VendorName || ""}
                onChange={handleEditChange}
                fullWidth
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="mb-2">
                <TextField
                  name="VendorAddress"
                  id="outlined"
                  label="Vendor Address"
                  size="small"
                  value={editRecordsData?.VendorAddress || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="City"
                  id="outlined"
                  label="City"
                  size="small"
                  value={editRecordsData?.City || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="State"
                  id="outlined"
                  label="State"
                  size="small"
                  value={editRecordsData?.State || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={editRecordsData?.SubscriptionFor || ""}
                  label="Product Name"
                  onChange={handleEditChange}
                  size='small'
                  fullWidth
                >
                  {subscriptionChoices.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="SubscriptionAmount"
                  id="outlined-required"
                  label="Subscription Amount"
                  size="small"
                  value={editRecordsData?.SubscriptionAmount || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="SubscriptionDate"
                  id="outlined-required"
                  label="Subscription Date"
                  size="small"
                  value={editRecordsData?.SubscriptionDate || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="SubscriptionTenure"
                  id="outlined-required"
                  label="Subscription Tenure"
                  size="small"
                  value={editRecordsData?.SubscriptionTenure || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="RenewalDueDate"
                  id="outlined-required"
                  label="Renewal Due Date"
                  size="small"
                  value={editRecordsData?.RenewalDueDate || ""}
                  onChange={handleEditChange}
                />
              </div>
            </div>
          </Paper>
        </DialogContent>
        <DialogActions>
          <div className="m-4">
            <Button onClick={closeUpdatePanel}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateClick}>
              Update
            </Button>
          </div>
        </DialogActions>
      </Dialog>
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
          Record update successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateMLRecord;
