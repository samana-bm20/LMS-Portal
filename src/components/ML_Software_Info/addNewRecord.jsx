import React, { useEffect, useState } from "react";
import { Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { Config } from "../../Config";
import { useDetails } from "../../providers/DetailsProvider";

const AddNewRecord = ({ setShowAddNewRecord, showAddNewRecord }) => {
  const token = sessionStorage.getItem('token');
  const { fetchESRIProducts } = useDetails();
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [formDataDocFile, setFormDataDocFile] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response ? error.response.data : error.message
      );
    }
  };


  const handleAddNewRecord = async () => {
    if (!formData.ClientName ) {
      setErrorMessage("Required fields cannot be empty.");
      setError(true);
      return;
    }
    try {
      const response = await axios.post(`${Config.apiUrl}/getLastIndexESRIProduct`, {}, {
        headers: {
          'Authorization': token
        }
      });
      const SNO = parseInt(Config.decryptData(response.data)) + 1;

      const esriData = {
        'formData': formData,
        'SNO': SNO,
      };

      const res = await axios.post(`${Config.apiUrl}/insertESRIProduct`, esriData, {
        headers: {
          'Authorization': token
        }
      });
      setShowAddNewRecord(false);
        setSuccess(true);
      setErrorMessage("");
      uploadDocFile(formDataDocFile.InstallationCertificate, formData.SNO);
      fetchESRIProducts();
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
                name="ClientName"
                id="outlined-required"
                label="Client Name"
                size="small"
                value={formData?.ClientName || ""}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="mb-2">
                <TextField
                  name="Contact"
                  id="outlined"
                  label="Contact Person"
                  size="small"
                  value={formData?.Contact || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="Phone"
                  id="outlined"
                  label="Phone"
                  size="small"
                  value={formData?.Phone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="Email"
                  id="outlined"
                  label="Email"
                  size="small"
                  value={formData?.Email || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="PONumber"
                  id="outlined-required"
                  label="PO Number"
                  size="small"
                  value={formData?.PONumber || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="PODate"
                  id="outlined-required"
                  label="PO Date"
                  type="date"
                  size="small"
                  fullWidth
                  value={formData?.PODate || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="POValue"
                  id="outlined-required"
                  label="PO Value"
                  size="small"
                  value={formData?.POValue || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="Product"
                  id="outlined-required"
                  label="Product"
                  size="small"
                  value={formData?.Product || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="ProductVersion"
                  id="outlined-required"
                  label="Product Version"
                  size="small"
                  value={formData?.ProductVersion || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="NumberOfLicense"
                  id="outlined-required"
                  label="Number of License"
                  size="small"
                  value={formData?.NumberOfLicense || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="Tenure"
                  id="outlined-required"
                  label="Tenure"
                  size="small"
                  value={formData?.Tenure || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="LicenseDate"
                  id="outlined-required"
                  label="License Date"
                  size="small"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData?.LicenseDate || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="RenewalDueDate"
                  id="outlined-required"
                  label="Renewal Due Date"
                  size="small"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData?.RenewalDueDate || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mb-4 mt-2">
              <TextField
                name="Description"
                id="outlined-required"
                label="Product Description"
                size="small"
                value={formData?.Description || ""}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div className="mb-2 mt-2">
              <TextField
                name="InstallationCertificate"
                id="outlined"
                label="Installation Certificate"
                type="file"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                // value={formDataDocFile?.InstallationCertificate}
                onChange={handleFileUpload}
              />
            </div>
            <div className="mt-2 mb-4">
              <span>Address</span>
              <TextField
                name="ClientAddress"
                id="outlined"
                label="Street/Locality/P.O"
                size="small"
                fullWidth
                value={formData?.ClientAddress || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="mb-2">
                <TextField
                  name="Pincode"
                  id="outlined"
                  label="Pincode"
                  size="small"
                  value={formData?.Pincode || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
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
                  required
                  name="State"
                  id="outlined"
                  label="State"
                  size="small"
                  value={formData?.State || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
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

export default AddNewRecord;
