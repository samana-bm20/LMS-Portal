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
import { useFetchLeads } from "../../providers/FetchLeadsProvider";
import axios from "axios";
import Config from "../../Config";
import { useDetails } from "../../providers/DetailsProvider";

const UpdateRecord = ({ openUpdateRecord, setOpenUpdateRecord, tableSNO }) => {
  const {
    productValues,
    userValues,
    loggedUser,
    esriProducts,
    setEsriProducts,
    fetchESRIProducts
  } = useDetails();
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  let currentESRIProduct;
  const [editRecordsData, setEditRecordsData] = useState({
    ClientName: "",
    ClientAddress: "",
    City: "",
    State: "",
    Pincode: '',
    Contact: "",
    Phone: "",
    Email: "",
    PONumber: "",
    PODate: "",
    POValue: "",
    Product: "",
    ProductVersion: '',
    Description: "",
    NumberOfLicenses: '',
    LicenseDate: "",
    Tenure: "",
    RenewalDueDate: "",
  });

  const getEditTableRowData = async () => {
    debugger;
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRecordsData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateClick = async () => {
    if (
      !editRecordsData.ClientName
      //   !editRecordsData.PONumber ||
      //   !editRecordsData.PODate ||
      //   !editRecordsData.POValue ||
      //   !editRecordsData.Product ||
      //   !editRecordsData.ProductVersion ||
      //   !editRecordsData.NumberOfLicenses ||
      //   !editRecordsData.LicenseDate ||
      //   !editRecordsData.RenewalDueDate ||
      //   !editRecordsData.Tenure ||
      //   !editRecordsData.City ||
      //   !editRecordsData.State
    ) {
      setErrorMessage("Required fields cannot be empty.");
      setError(true);
      return;
    }

    try {
        const params = {
            data: Config.encryptData(editRecordsData),
            SNO: tableSNO
        }
      await axios.post(`${Config.apiUrl}/updateESRIProduct`, params);
      setOpenUpdateRecord(false);
      setEditRecordsData({});
      fetchESRIProducts();
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
      ClientName: "",
      ClientAddress: "",
      City: "",
      State: "",
      Pincode: '',
      Contact: "",
      Phone: "",
      Email: "",
      PONumber: "",
      PODate: "",
      POValue: "",
      Product: "",
      ProductVersion: '',
      Description: "",
      NumberOfLicenses: '',
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
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="PODate"
                  id="outlined-required"
                  label="PO Date"
                  type="text"
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
                  onChange={handleEditChange}
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
                />
              </div>
              <div className="mb-2">
                <TextField
                  required
                  name="LicenseDate"
                  id="outlined-required"
                  label="License Date"
                  size="small"
                  type="text"
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
                  type="text"
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
                onChange={handleEditChange}
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
                value={editRecordsData?.ClientAddress || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="mb-2">
                <TextField
                  name="Pincode"
                  id="outlined"
                  label="Pincode"
                  size="small"
                  value={editRecordsData?.Pincode || ""}
                  onChange={handleEditChange}
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
