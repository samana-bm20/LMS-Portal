import React, { useEffect, useState } from "react";
import {
  Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from "@mui/material";
import axios from "axios";
import { Config } from "../../Config";
import { useDetails } from "../../providers/DetailsProvider";

const UpdatePayment = ({ openUpdateRecord, setOpenUpdateRecord, tableSNO }) => {
  const { esriProducts, fetchESRIProducts } = useDetails();

  const { mlPaymentdetails ,fetchMLPaymentsDetails} = useDetails();
  const token = sessionStorage.getItem('token');
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formDataDocFile, setFormDataDocFile] = useState({});
  let currentPaymentDetail;
  const [editRecordsData, setEditRecordsData] = useState({});
  
  const getEditTableRowData = async () => {
    try {
      currentPaymentDetail = mlPaymentdetails.filter((pro) => pro.SNO === tableSNO);
      setEditRecordsData((prev) => ({
        ...prev,
        Project: currentPaymentDetail[0]?.Project || null,
        RedingtonInvoice: currentPaymentDetail[0]?.RedingtonInvoice || null,
        RedingtonInvoiceDate: currentPaymentDetail[0]?.RedingtonInvoiceDate || null,
        CreditDays: currentPaymentDetail[0]?.CreditDays || null,
        AdvanceChequeDate: currentPaymentDetail[0]?.AdvanceChequeDate || null,
        ChequeAmount: currentPaymentDetail[0]?.ChequeAmount || null,
        ChequeNumber: currentPaymentDetail[0]?.ChequeNumber || null,
        Drawnon: currentPaymentDetail[0]?.Drawnon || null,
        Paymentfrom: currentPaymentDetail[0]?.Paymentfrom || null,

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
      console.log("File uploaded successfully:", response.data);
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
      !editRecordsData.Project
     
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
      await axios.post(`${Config.apiUrl}/updateMLPaymentDetails`, params, {
        headers: {
          'Authorization': token
        }
      });
      setOpenUpdateRecord(false);
      setEditRecordsData({});
      fetchMLPaymentsDetails();
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
      Project: "",
      RedingtonInvoice: "",
      RedingtonInvoiceDate: "",
      CreditDays: "",
      AdvanceChequeDate: "",
      ChequeAmount: "",
      ChequeNumber: "",
      Drawnon: "",
      Paymentfrom: ""      
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
                name="Project"
                id="outlined-required"
                label="Project"
                size="small"
                value={editRecordsData?.Project || ""}
                onChange={handleEditChange}
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
                  value={editRecordsData?.RedingtonInvoice || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="RedingtonInvoiceDate"
                  id="outlined"
                  label="Redington Invoice Date"
                  size="small"
                  value={editRecordsData?.RedingtonInvoiceDate || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="CreditDays"
                  id="outlined"
                  label="Credit Days"
                  size="small"
                  value={editRecordsData?.CreditDays || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="AdvanceChequeDate"
                  id="outlined-required"
                  label="Advance Cheque Date"
                  size="small"
                  value={editRecordsData?.AdvanceChequeDate || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="ChequeAmount"
                  id="outlined-required"
                  label="Cheque Amount"
                  type="text"
                  size="small"
                  fullWidth
                  value={editRecordsData?.ChequeAmount || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="ChequeNumber"
                  id="outlined-required"
                  label="Cheque Number"
                  size="small"
                  value={editRecordsData?.ChequeNumber || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="Drawnon"
                  id="outlined-required"
                  label="Drawn on"
                  size="small"
                  value={editRecordsData?.Drawnon || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="Paymentfrom"
                  id="outlined-required"
                  label="Payment from"
                  size="small"
                  value={editRecordsData?.Paymentfrom || ""}
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

export default UpdatePayment;
