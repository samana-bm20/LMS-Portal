import React, { useEffect, useState } from "react";
import { Paper, Select, Button, MenuItem, FormControl, InputLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { Config } from "../../Config";
import { useDetails } from "../../providers/DetailsProvider";


const AddNewMLRecord = ({ setShowAddNewRecord, showAddNewRecord }) => {
  const token = sessionStorage.getItem('token');
  const { fetchMLSoftwareProducts } = useDetails();
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [formDataDocFile, setFormDataDocFile] = useState({});
  const [selectedValues, setSelectedValues] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedValues(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  useEffect(() => {

    const getLastRecordindexMLProducts = async () => {
      const response = await axios.post(`${Config.apiUrl}/getLastIndexMLProduct`, {}, {
        headers: {
          'Authorization': token
        }
      });
      const SNO = parseInt(response.data) + 1;
      setFormData((prevState) => ({
        ...prevState,
        SNO: SNO,
      }));
    };
    getLastRecordindexMLProducts();
  }, [formData.SNO]);

  const handleAddNewRecord = async () => {
    if (!formData.VendorName) {
      setErrorMessage("Required fields cannot be empty.");
      setError(true);
      return;
    }
    try {
      const res = await axios.post(`${Config.apiUrl}/insertMLProduct`, formData, {
        headers: {
          'Authorization': token
        }
      });
      setShowAddNewRecord(false);
      setSuccess(true);
      setErrorMessage("");
      //uploadDocFile(formDataDocFile.InstallationCertificate, formData.SNO);
      fetchMLSoftwareProducts();
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
    setFormData({});
    setShowAddNewRecord(false);
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

  // const handleselectedValue =(event) => {
  //   const newVal = event.target.value;
  //   setSelectedValues(newVal);    
  // };

  return (
    <>
      <Dialog open={showAddNewRecord} onClose={closeUpdatePanel}>
        <DialogTitle>Add New Record</DialogTitle>
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
                value={formData?.VendorName || ""}
                onChange={handleInputChange}
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
                  value={formData?.VendorAddress || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="City"
                  id="outlined"
                  label="City"
                  size="small"
                  value={formData?.City || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="State"
                  id="outlined"
                  label="State"
                  size="small"
                  value={formData?.State || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <FormControl fullWidth>
                  <InputLabel id="select-label">Subscription For</InputLabel>
                  <Select
                    id="outlined-required"
                    name="SubscriptionFor"
                    value={formData?.SubscriptionFor || ''}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{ minWidth: 120, height: '45px' }}
                    label="Select Vendor"
                  >
                    {subscriptionChoices.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="SubscriptionDescription"
                  id="outlined-required"
                  label="Subscription Description"
                  size="small"
                  fullWidth
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="SubscriptionAmount"
                  id="outlined-required"
                  label="Subscription Amount"
                  size="small"
                  value={formData?.SubscriptionAmount || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="SubscriptionDate"
                  id="inlined-required"
                  label="Subscription Date"
                  type="date"
                  size="small"
                  fullWidth
                  value={formData?.SubscriptionDate || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="SubscriptionTenure"
                  id="otlined-required"
                  label="Subscription Tenure"
                  size="small"
                  value={formData?.SubscriptionTenure || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="RenewalDueDate"
                  id="outlined-required"
                  label="Renewal Due Date"
                  type="date"
                  size="small"
                  fullWidth
                  value={formData?.RenewalDueDate || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* <div className="mb-2 mt-2">
              <TextField
                name="InstallationCertificate"
                id="outlined"
                label="Upload File"
                type="file"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                // value={formDataDocFile?.InstallationCertificate}
                onChange={handleFileUpload}
              />
            </div> */}
          </Paper>
        </DialogContent>
        <DialogActions>
          <div className="m-4">
            <Button onClick={closeUpdatePanel}>Cancel</Button>
            <Button variant="contained" onClick={handleAddNewRecord}>
              Add
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
          Record added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddNewMLRecord;
