import React from 'react'
import AddUserForm from '../../../../components/dashboard-components/forms/add-user-form'

const AddUser = () => {
  return (
    <div>
      <AddUserForm
        title="Add New User"
        desc="Create a new user by filling out the form below."
      />
    </div>
  )
}

export default AddUser
