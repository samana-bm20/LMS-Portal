import { useMemo, useEffect, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, useTheme } from '@mui/material';
import { useDetails } from '../../providers/DetailsProvider';

const TodayTasks = () => {
  const theme = useTheme();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const { leadValues, productValues, userValues, taskData } = useDetails();
  const [data, setData] = useState([]);

  const fetchTaskData = () => {
    try {
      const todayTasks = taskData
        .filter(task => new Date(task.taskDate).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))
        .sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate));

      setData(todayTasks)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, [taskData]);

  const filteredData = user.userType === 2
    ? data.filter((task) => task.UID === user.UID)
    : data;

  const leadMap = leadValues.reduce((map, lead) => {
    map[lead.LID] = lead.name;
    return map;
  }, {});

  const productMap = productValues.reduce((map, product) => {
    map[product.PID] = product.pName;
    return map;
  }, {});

  const userMap = (userValues || []).reduce((map, user) => {
    if (user && user.UID) {
      map[user.UID] = user?.uName || 'User';
    }
    return map;
  }, {});

  const columns = useMemo(
    () => [
      {
        accessorKey: 'TID',
        enableClickToCopy: true,
        filterVariant: 'autocomplete',
        header: 'TID',
        size: 100,
      },
      {
        accessorKey: 'title',
        enableClickToCopy: true,
        filterVariant: 'autocomplete',
        header: 'Task Name',
        size: 100,
      },
      {
        accessorKey: 'LID',
        enableClickToCopy: true,
        filterVariant: 'autocomplete',
        header: 'Lead',
        size: 100,
        Cell: ({ row }) => row.original.LID ? leadMap[row.original.LID] || 'Unknown' : '--',
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
        accessorKey: 'UID',
        enableClickToCopy: true,
        filterVariant: 'autocomplete',
        header: 'Assigned To',
        size: 100,
        Cell: ({ row }) => row.original.UID ? userMap[row.original.UID] || 'Unknown' : '--',
      },
      {
        accessorKey: 'taskDate',
        header: 'Time',
        size: 100,
        Cell: ({ cell }) => {
          const taskDate = new Date(cell.getValue());
          const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
          return taskDate.toLocaleTimeString([], timeOptions);
        },
      },
      {
        accessorKey: 'taskStatus',
        filterVariant: 'autocomplete',
        header: 'Status',
        size: 100,
        Cell: ({ cell }) => {
          const theme = useTheme();
          const status = cell.getValue();
          let bgColor;

          switch (status) {
            case 'To Do':
              bgColor = theme.palette.error.main
              break;
            case 'In Progress':
              bgColor = theme.palette.info.main
              break;
            case 'Done':
              bgColor = theme.palette.success.main
              break;
            default:
              bgColor = theme.palette.background.card
              break;
          }

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
              {status}
            </Box>
          );
        },
      },
    ],
    [leadMap, productMap, userMap],
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
          style={{ color: theme.palette.text.secondary }}>No tasks for today</div>
      ) : (
        <MaterialReactTable table={table} />
      )}

    </>
  );
};

export default TodayTasks;
