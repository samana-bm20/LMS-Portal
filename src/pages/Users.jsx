import React, { useState } from 'react'
import { Button } from '@mui/material'
import { PersonAddRounded } from '@mui/icons-material'

import AddUser from '../components/users/AddUser'
import UserList from '../components/users/UserList'

const Users = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [openAddUser, setOpenAddUser] = useState(false)

  return (
    <>
      {user.userType == 1 && (
        <div className="flex flex-col md:flex-row justify-end space-x-reverse p-2 ">
          <Button
            sx={{ m: '5px' }}
            variant="contained"
            startIcon={<PersonAddRounded />}
            onClick={() => setOpenAddUser(true)}
          >
            Add User
          </Button>
        </div>
      )}
      <AddUser
        openAddUser={openAddUser}
        setOpenAddUser={setOpenAddUser}
      />
      <div className="container mx-auto p-2 m-2">
        <UserList />
      </div>

    </>
  )
}

export default Users