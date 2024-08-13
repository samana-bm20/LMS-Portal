import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

//nested data is ok, see accessorKeys in ColumnDef below
const data = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Charleston',
    state: 'South Carolina',
  },
];

const TodayTasks = () => {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'Task Description',
        size: 150,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Lead Name',
        size: 150,
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Type',
        size: 200,
      },
      {
        accessorKey: 'city',
        header: 'Time',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'Priority',
        size: 150,
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
        size: 150,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data, 
    enableGlobalFilter: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: true,
    enableColumnFilters:true,
    enablePagination: false,
    initialState :{
        showGlobalFilter: true,
    },
    muiTableHeadCellProps: {
      sx: {
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

  return <MaterialReactTable table={table} />;
};

export default TodayTasks;
