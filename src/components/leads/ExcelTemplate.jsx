import React from "react";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button, IconButton } from "@mui/material";
import { useDetails } from "../../providers/DetailsProvider";
import { DownloadRounded } from "@mui/icons-material";

const ExcelTemplate = () => {
    const { productValues, statusValues, userValues } = useDetails();

    const generateExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Import_Details");

        // Add column headers
        worksheet.columns = [
            { header: "Lead Name*", key: "leadName", width: 20 },
            { header: "Mobile No", key: "mobileNo", width: 10 },
            { header: "Email ID", key: "emailId", width: 20 },
            { header: "DesignationDept", key: "designation", width: 20 },
            { header: "Organization Name*", key: "organizationName", width: 20 },
            { header: "Address", key: "address", width: 20 },
            { header: "Product Name*", key: "productName", width: 15 },
            { header: "Status*", key: "status", width: 10 },
            { header: "Source*", key: "source", width: 10 },
            { header: "Assigned To*", key: "assignedTo", width: 15 }
        ];

        // Add dropdowns
        const productNames = productValues.map(product => product.pName);
        const statusNames = statusValues.map(status => status.sName);
        const userNames = userValues.filter((userItem) => userItem.uStatus == 'Active').map(user => user.uName);

        worksheet.dataValidations.add('G2:G99999', {
            type: 'list',
            allowBlank: false,
            formulae: [`"${productNames.join(',')}"`],
        });

        // @ts-ignore
        worksheet.dataValidations.add('H2:H99999', {
            type: 'list',
            allowBlank: false,
            formulae: [`"${statusNames.join(',')}"`],
        });

        // @ts-ignore
        worksheet.dataValidations.add('J2:J99999', {
            type: 'list',
            allowBlank: false,
            formulae: [`"${userNames.join(',')}"`],
        });

        // Save the workbook
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Import_Template.xlsx");
    };

    return (
        <div>
            <Button startIcon={<DownloadRounded />} variant="contained" color="primary" onClick={generateExcel}>
                Template
            </Button>
        </div>
    );
};

export default ExcelTemplate;