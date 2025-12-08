import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { SearchCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Adduser = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const role = [
    { key: "Admin", label: "Admin" },
    { key: "Teacher", label: "Teacher" },
    { key: "Student", label: "Student" },
  ];

  const courses = [
    { key: "Advance_JavaScript", label: "Advance JavaScript" },
    { key: "Advance_React", label: "Advance React" },
    { key: "Advance_Python", label: "Advance Python" },
    { key: "Advance_JavaScript", label: "Advance JavaScript" },
    { key: "Advance_React", label: "Advance React" },
    { key: "Advance_Python", label: "Advance Python" },
    { key: "Advance_JavaScript", label: "Advance JavaScript" },
    { key: "Advance_React", label: "Advance React" },
    { key: "Advance_Python", label: "Advance Python" },
    { key: "Advance_JavaScript", label: "Advance JavaScript" },
    { key: "Advance_React", label: "Advance React" },
    { key: "Advance_Python", label: "Advance Python" },
  ];

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  
  const [isSelected, setIsSelected] = useState(true);

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-3">
      <DashHeading
        title={"Add New User"}
        desc={"Add a new user to the platform"}
      />
      <div className="p-6 bg-white rounded-lg mb-6">
        <Form className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-5">
              <Input
                type="text"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="First Name"
                placeholder="Enter your first name"
              />
              <Input
                type="text"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Email Address"
                placeholder="Enter your email address"
              />
              <Input
                type="text"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Country/City"
                placeholder="Enter your country/city"
              />
            </div>
            <div className="flex flex-col gap-5">
              <Input
                type="text"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Last Name"
                placeholder="Enter your Last name"
              />
              <Input
                type="text"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Phone Number"
                placeholder="Enter your phone number"
              />
              <Select
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Role"
                placeholder="Select a role"
                onChange={handleRoleChange}
                value={selectedRole}
              >
                {role.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="w-full p-3 bg-[#95C4BE33] rounded-lg mt-3 flex items-center justify-between">
            <span className="text-[#06574C] text-sm">Status</span>
            <div className="flex items-center gap-3">
              <p className="text-md text-[#06574C]">{isSelected ? "Active" : "Inactive"}</p>
            <Switch color="success" defaultSelected aria-label="Automatic updates" isSelected={isSelected} onValueChange={setIsSelected} />
            </div>
          </div>
        </Form>
      </div>

      {selectedRole === "Teacher" && (
        <div className="p-3 bg-white rounded-lg">
          <div className="flex justify-between items-center py-2">
            <span className="text-lg text-[#06574C] font-bold">Courses</span>
            <Input
              size="md"
              radius="md"
              placeholder="Search course...."
              className="w-1/3"
              endContent={
                <SearchCheck className="text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
          </div>
          <Divider className="my-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map((item) => (
              <Checkbox key={item.key} color="success">
                {item.label}
              </Checkbox>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end mt-4 gap-4">
        <Button
        radius="sm"
          className="w-40 border-[#06574C] text-[#06574C]"
          variant="bordered"
        >
          Cancel
        </Button>
        <Link to="/admin/user-management/users-details">
        <Button  radius="sm" className="w-50 bg-[#06574C]" variant="solid" color="primary">
          Create User
        </Button>
        </Link>
      </div>
    </div>
  );
};

export default Adduser;