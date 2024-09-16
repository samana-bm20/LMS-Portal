import { useMemo, useEffect, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, useTheme } from '@mui/material';
import { useDetails } from '../../providers/DetailsProvider';

const TodayReminders = () => {
    const theme = useTheme();
    const { leadValues, productValues, statusValues, userValues, followUpValues, loggedUser } = useDetails();
    const user = userValues.filter((user) => user.username === loggedUser)
    const [data, setData] = useState([]);

    const fetchReminderData = () => {
        try {
            const todayReminders = followUpValues
                .filter(followUp => new Date(followUp.nextDate).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))
                .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));

            setData(todayReminders)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchReminderData();
    }, [followUpValues]);

    const filteredData = user[0]?.userType === 2
        ? data.filter((reminder) => reminder.UID === user[0]?.UID)
        : data;

    const leadMap = leadValues.reduce((map, lead) => {
        map[lead.LID] = lead.name;
        return map;
    }, {});

    const leadOrg = leadValues.reduce((map, lead) => {
        map[lead.LID] = lead.organizationName;
        return map;
    }, {});

    const productMap = productValues.reduce((map, product) => {
        map[product.PID] = product.pName;
        return map;
    }, {});

    const statusMap = statusValues.reduce((map, status) => {
        map[status.SID] = status.sName;
        return map;
    }, {});

    const userMap = userValues.reduce((map, user) => {
        map[user.UID] = user.uName;
        return map;
    }, {});

    const columns = useMemo(
        () => [
            {
                accessorKey: 'LID',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Lead',
                size: 100,
                Cell: ({ row }) => row.original.LID ? leadMap[row.original.LID] || 'Unknown' : '--',
            },
            {
                accessorKey: 'organizationLID',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Organization',
                size: 100,
                Cell: ({ row }) => row.original.LID ? leadOrg[row.original.LID] || 'Unknown' : '--',
            },
            {
                accessorKey: 'PID',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Product',
                size: 100,
                Cell: ({ row }) => row.original.PID ? productMap[row.original.PID] || 'Unknown' : '--',
            },
            {
                accessorKey: 'SID',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Last Status',
                size: 100,
                Cell: ({ cell }) => {
                    const theme = useTheme();
                    const sid = cell.getValue();
                    const status = statusMap[sid];

                    const sidToColor = {
                        S1: theme.palette.disabled,
                        S2: theme.palette.secondary.main,
                        S3: theme.palette.warning.main,
                        S4: theme.palette.success.main,
                        S5: theme.palette.error.main,
                    };

                    const backgroundColor = sidToColor[sid] || theme.palette.grey[500];

                    return (
                        <Box
                            component="span"
                            sx={{
                                backgroundColor: backgroundColor,
                                borderRadius: '1rem',
                                color: theme.palette.primary.contrastText,
                                px: '0.2rem',
                                py: '0.1rem',
                            }}
                        >
                            {status}
                        </Box>
                    );
                },
            },
            {
                accessorKey: 'UID',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Assigned To',
                size: 100,
                Cell: ({ row }) => row.original.UID ? userMap[row.original.UID] || 'Unknown' : '--',
            },
            {
                accessorKey: 'nextDate',
                header: 'Time',
                size: 100,
                Cell: ({ cell }) => {
                    const nextDate = new Date(cell.getValue());
                    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
                    return nextDate.toLocaleTimeString([], timeOptions);
                },
            },
            {
                accessorKey: 'nextType',
                filterVariant: 'autocomplete',
                header: 'Type',
                size: 100,
                Cell: ({ cell }) => {
                    const theme = useTheme();
                    const type = cell.getValue();
                    const bgColor = theme.palette.info.main;

                    return (
                        <Box
                            component="span"
                            sx={{
                                backgroundColor: bgColor,
                                borderRadius: '1rem',
                                color: theme.palette.primary.contrastText,
                                maxWidth: '9ch',
                                p: '0.4rem',
                            }}
                        >
                            {type}
                        </Box>
                    );
                },
            },
        ],
        [leadMap, leadOrg, productMap, statusMap, userMap],
    );

    const table = useMaterialReactTable({
        columns,
        data: filteredData,
        enableGlobalFilter: true,
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        enableHiding: true,
        enableColumnFilters: true,
        enablePagination: false,
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
        },
        muiTableHeadCellProps: {
            sx: {
                backgroundColor: 'background.header',
                fontWeight: 'bold',
            },
        },
        muiTableBodyRowProps: {
            sx: {
                '&:hover': {
                    backgroundColor: 'background.header',
                },
            },
        },
    });

    return (
        <>
            {data.length == 0 ? (
                <div className='m-4 p-4 text-md font semibold text-center italic'
                    style={{ color: theme.palette.text.secondary }}>No reminders for today</div>
            ) : (
                <MaterialReactTable table={table} />
            )}

        </>
    )
}

export default TodayReminders