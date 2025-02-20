import React, { useEffect, useState } from "react";
import {
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { Config } from "../../Config";
import { useDetails } from "../../providers/DetailsProvider";

const UpdateRecord = ({ openUpdateRecord, setOpenUpdateRecord, tableSNO }) => {
  const { esriProducts, fetchESRIProducts } = useDetails();
  const token = sessionStorage.getItem("token");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formDataDocFile, setFormDataDocFile] = useState({});
  let currentESRIProduct;
  const [editRecordsData, setEditRecordsData] = useState({
    ClientName: "",
    ClientAddress: "",
    City: "",
    State: "",
    Pincode: "",
    Contact: "",
    Phone: "",
    Email: "",
    PONumber: "",
    PODate: "",
    POValue: "",
    Product: "",
    ProductVersion: "",
    Description: "",
    NumberOfLicenses: "",
    LicenseDate: "",
    Tenure: "",
    RenewalDueDate: "",
  });

  const getEditTableRowData = async () => {
    try {
      currentESRIProduct = esriProducts.filter((pro) => pro.SNO === tableSNO);
      setEditRecordsData((prev) => ({
        ...prev,
        ClientName: currentESRIProduct[0]?.ClientName || null,
        ClientAddress: currentESRIProduct[0]?.ClientAddress || null,
        City: currentESRIProduct[0]?.City || null,
        State: currentESRIProduct[0]?.State || null,
        Pincode: currentESRIProduct[0]?.Pincode || null,
        Contact: currentESRIProduct[0]?.Contact || null,
        Phone: currentESRIProduct[0]?.Phone || null,
        Email: currentESRIProduct[0]?.Email || null,
        PONumber: currentESRIProduct[0]?.PONumber || null,
        PODate: currentESRIProduct[0]?.PODate || null,
        POValue: currentESRIProduct[0]?.POValue || null,
        Product: currentESRIProduct[0]?.Product || null,
        ProductVersion: currentESRIProduct[0]?.ProductVersion || null,
        Description: currentESRIProduct[0]?.Description || null,
        NumberOfLicenses: currentESRIProduct[0]?.NumberOfLicenses || null,
        LicenseDate: currentESRIProduct[0]?.LicenseDate || null,
        Tenure: currentESRIProduct[0]?.Tenure || null,
        RenewalDueDate: currentESRIProduct[0]?.RenewalDueDate || null,
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

  //#region Edit Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRecordsData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editRecordsData.POValue) {
        let cleanInput = editRecordsData.POValue.replace(/,/g, "");
        const num = parseFloat(cleanInput).toFixed(2).toString();
        let [integer, decimal] = num.split(".");
        let lastThree = integer.slice(-3);
        let otherNumbers = integer.slice(0, -3);
        if (otherNumbers !== "") {
          lastThree = "," + lastThree;
        }
        let formattedNumber =
          otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        let formattedAmount = formattedNumber + "." + decimal;

        setEditRecordsData((prevState) => ({
          ...prevState,
          POValue: formattedAmount,
        }));
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [editRecordsData.POValue]);

  const handlePOValueChange = (e) => {
    setEditRecordsData((prevState) => ({
      ...prevState,
      POValue: e.target.value,
    }));
  };

  //#region File Upload
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

  const uploadDocFile = async (selectedFile, SNO, docType) => {
    if (!selectedFile) {
      console.log("No file selected for -", docType);
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("SNO", SNO);
    formData.append("docType", docType);
    try {
      const response = await axios.post(
        `${Config.apiUrl}/uploadDoc`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response ? error.response.data : error.message
      );
    }
  };

  //#region Handle Update
  const handleUpdateClick = async () => {
    if (
      !editRecordsData.ClientName ||
      !editRecordsData.PONumber ||
      !editRecordsData.PODate ||
      !editRecordsData.POValue
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
      await axios.post(`${Config.apiUrl}/updateESRIProduct`, params, {
        headers: {
          Authorization: token,
        },
      });
      setOpenUpdateRecord(false);
      setEditRecordsData({});
      uploadDocFile(formDataDocFile.PODocument, tableSNO, "PODocument");
      uploadDocFile(
        formDataDocFile.InstallationCertificate,
        tableSNO,
        "InstallationCertificate"
      );
      setSuccess(true);
      setErrorMessage("");
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
    setEditRecordsData({
      ClientName: "",
      ClientAddress: "",
      City: "",
      State: "",
      Pincode: "",
      Contact: "",
      Phone: "",
      Email: "",
      PONumber: "",
      PODate: "",
      POValue: "",
      Product: "",
      ProductVersion: "",
      Description: "",
      NumberOfLicenses: "",
      LicenseDate: "",
      Tenure: "",
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
                name="ClientName"
                id="outlined-required"
                label="Client Name"
                size="small"
                value={editRecordsData?.ClientName || ""}
                onChange={handleEditChange}
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
                  value={editRecordsData?.Contact || ""}
                  onChange={handleEditChange}
                  fullWidth
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="Phone"
                  id="outlined"
                  label="Phone"
                  size="small"
                  value={editRecordsData?.Phone || ""}
                  onChange={handleEditChange}
                  fullWidth
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="Email"
                  id="outlined"
                  label="Email"
                  size="small"
                  value={editRecordsData?.Email || ""}
                  onChange={handleEditChange}
                  fullWidth
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="PONumber"
                  id="outlined-required"
                  label="PO Number"
                  size="small"
                  value={editRecordsData?.PONumber || ""}
                  onChange={handleEditChange}
                  fullWidth
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
                  value={editRecordsData?.PODate || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="POValue"
                  id="outlined-required"
                  label="PO Value"
                  size="small"
                  value={editRecordsData?.POValue || ""}
                  onChange={handlePOValueChange}
                  fullWidth
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="Product"
                  id="outlined-required"
                  label="Product"
                  size="small"
                  value={editRecordsData?.Product || ""}
                  onChange={handleEditChange}
                  fullWidth
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="ProductVersion"
                  id="outlined-required"
                  label="Product Version"
                  size="small"
                  value={editRecordsData?.ProductVersion || ""}
                  onChange={handleEditChange}
                  fullWidth
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="NumberOfLicenses"
                  id="outlined-required"
                  label="Number of License"
                  size="small"
                  value={editRecordsData?.NumberOfLicenses || ""}
                  onChange={handleEditChange}
                  fullWidth
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="Tenure"
                  id="outlined-required"
                  label="Tenure"
                  size="small"
                  value={editRecordsData?.Tenure || ""}
                  onChange={handleEditChange}
                  fullWidth
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
                  value={editRecordsData?.LicenseDate || ""}
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
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={editRecordsData?.RenewalDueDate || ""}
                  onChange={handleEditChange}
                />
              </div>
            </div>
            <div className="mb-4 mt-2">
              <TextField
                name="Description"
                id="outlined-required"
                label="Product Description"
                size="small"
                value={editRecordsData?.Description || ""}
                onChange={handleEditChange}
                fullWidth
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="mb-2 mt-2">
                <TextField
                  name="PODocument"
                  id="outlined"
                  label="PO Document"
                  type="file"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // value={formDataDocFile?.PODocument}
                  onChange={handleFileUpload}
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
            </div>
            <div className="my-4">
              <span>Address</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <TextField
                  name="ClientAddress"
                  id="outlined"
                  label="Street/Locality/P.O"
                  size="small"
                  fullWidth
                  value={editRecordsData?.ClientAddress || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-2">
                <TextField
                  name="Pincode"
                  id="outlined"
                  label="Pincode"
                  size="small"
                  value={editRecordsData?.Pincode || ""}
                  onChange={handleEditChange}
                  fullWidth
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="City"
                  id="outlined"
                  label="City"
                  size="small"
                  value={editRecordsData?.City || ""}
                  onChange={handleEditChange}
                  fullWidth
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="State"
                  id="outlined"
                  label="State"
                  size="small"
                  value={editRecordsData?.State || ""}
                  onChange={handleEditChange}
                  fullWidth
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

export default UpdateRecord;
