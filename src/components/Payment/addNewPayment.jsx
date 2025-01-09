import React, { useEffect, useState } from "react";
import { Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { Config } from "../../Config";
import { useDetails } from "../../providers/DetailsProvider";

const AddNewPayment = ({ setShowAddNewRecord, showAddNewRecord }) => {
  const token = sessionStorage.getItem('token');
  const { fetchMLPaymentsDetails } = useDetails();
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

  useEffect(() => {
    const getLastRecordindexPayment = async () => {
      const response = await axios.post(`${Config.apiUrl}/getLastIndexPayment`, {}, {
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
    getLastRecordindexPayment();
  }, [formData.SNO]);


  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };
  

  const handleAddNewRecord = async () => {
    if (!formData.Project) {
      setErrorMessage("Required fields cannot be empty.");
      setError(true);
      return;
    }
    
      // Convert date fields before submitting
  const formattedFormData = { ...formData };

  if (formattedFormData.RedingtonInvoiceDate) {
    formattedFormData.RedingtonInvoiceDate = formatDateToDDMMYYYY(formattedFormData.RedingtonInvoiceDate);
  }

  if (formattedFormData.AdvanceChequeDate) {
    formattedFormData.AdvanceChequeDate = formatDateToDDMMYYYY(formattedFormData.AdvanceChequeDate);
  }

    setSuccess(true);
    try {
      const res = await axios.post(`${Config.apiUrl}/insertPaymentDetails`, formData, {
        headers: {
          'Authorization': token
        }
      });
      setShowAddNewRecord(false);
      //   setSuccess(true);
      setErrorMessage("");
      uploadDocFile(formDataDocFile.InstallationCertificate, formData.SNO);
      fetchMLPaymentsDetails();
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
        <DialogTitle>Add New Payment Details</DialogTitle>
        <DialogContent>
          <Paper
            elevation={3}
            className="p-4 rounded-lg shadow-md"
            component="form"
          >
            <div className="mb-2">
              <TextField
                required
                name="Project"
                id="outlined-required"
                label="Project"
                size="small"
                value={formData?.Project || ""}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="mb-2">
                <TextField
                  name="RedingtonInvoice"
                  id="outlined"
                  label="Redington Invoice"
                  size="small"
                  value={formData?.RedingtonInvoice || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="RedingtonInvoiceDate"
                  id="outlined"
                   type="date"
                  label="Redington Invoice Date"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData?.RedingtonInvoiceDate || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="CreditDays"
                  id="outlined"
                  label="Credit Days"
                  size="small"
                  value={formData?.CreditDays || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="AdvanceChequeDate"
                  id="inlined-required"
                   type="date"
                  label="Advance Cheque Date"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData?.AdvanceChequeDate || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="ChequeAmount"
                  id="outlined-required"
                  label="Cheque Amount"                 
                  size="small"
                  fullWidth
                  value={formData?.ChequeAmount || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="ChequeNumber"
                  id="outlined-required"
                  label="Cheque Number"
                  size="small"
                  value={formData?.ChequeNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="Drawnon"
                  id="outlined-required"
                  label="Drawnon"
                  size="small"
                  value={formData?.Drawnon || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="Paymentfrom"
                  id="outlined-required"
                  label="Payment From"
                  size="small"
                  value={formData?.Paymentfrom || ""}
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

export default AddNewPayment;
