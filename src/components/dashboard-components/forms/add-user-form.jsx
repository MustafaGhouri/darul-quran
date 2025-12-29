import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  form,
  Form,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { DashHeading } from "../DashHeading";
import { SearchCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const AddUserForm = ({ id, title, desc, userData ,isEdit }) => {
  const [selectedRole, setSelectedRole] = useState("");
  console.log("User Data in Form:", userData);
  const role = [
    { key: "Admin", label: "Admin" },
    { key: "Teacher", label: "Teacher" },
    { key: "Student", label: "Student" },
  ];

  const courses = [
    {
      key: "Advance_JavaScript", label: "Advance JavaScript", value: "advance_javaScript", },
    { key: "Advance_React", label: "Advance React", value: "advance_react" },
    { key: "Advance_Python", label: "Advance Python", value: "advance_python" },
    // { key: "Advance_JavaScript", label: "Advance JavaScript" , value: "advance_javaScript"},
    // { key: "Advance_React", label: "Advance React" , value: "advance_react"},
    // { key: "Advance_Python", label: "Advance Python" , value: "advance_python"},
    // { key: "Advance_JavaScript", label: "Advance JavaScript" , value: "advance_javaScript"},
    // { key: "Advance_React", label: "Advance React" , value: "advance_react"},
    // { key: "Advance_Python", label: "Advance Python" , value: "advance_python"},
    // { key: "Advance_JavaScript", label: "Advance JavaScript" , value: "advance_javaScript"},
    // { key: "Advance_React", label: "Advance React" , value: "advance_react"},
    // { key: "Advance_Python", label: "Advance Python" , value: "advance_python"},
  ];

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  useEffect(() => {
  if (userData) {
    // normalize role value to match keys
    const roleKey = role.find(r => r.key.toLowerCase() === (userData.role || "").toLowerCase())?.key || "";
    setSelectedRole(roleKey);
    setIsSelected(userData.is_active ?? true);
  }
}, [userData]);
  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // double click protection
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const permissions = formData.getAll("permissions");

      const payload = {
        id: userData?.id || undefined,
        first_name: formData.get("first_name") || "",
        last_name: formData.get("last_name") || "",
        email: formData.get("email") || "",
        phone_number: formData.get("phone_number") || "",
        city: formData.get("city") || "",
        role: formData.get("role") || "",
        is_active: isSelected,
        password: formData.get("password") || "",
        permissions,
      };

      const res = await fetch(
        import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/auth/create-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create user");
      }

      // ✅ success pe redirect
      navigate("/admin/user-management");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [isSelected, setIsSelected] = useState(true);

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-3">
      <DashHeading
        title={title || "Add New User"}
        desc={desc || "Create a new user by filling out the form below."}
      />
      <Form onSubmit={handleUserSubmit} className="w-full">
        <div className="p-6 bg-white rounded-lg mb-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-5">
              <Input
                key={userData?.first_name}
                defaultValue={userData?.first_name}
                type="text"
                name="first_name"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="First Name"
                placeholder="Enter your first name"
                isRequired
                errorMessage="Please enter first name"
              />
              <Input
                key={userData?.email}
                type="text"
                name="email"
                defaultValue={userData?.email}
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Email Address"
                placeholder="Enter your email address"
                isRequired
                errorMessage="Please enter email address"
              />
              <Input
                defaultValue={userData?.city}
                key={userData?.city}
                type="text"
                name="city"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Country/City"
                placeholder="Enter your country/city"
                isRequired
                errorMessage="Please enter country/city"
              />
            </div>
            <div className="flex flex-col gap-5">
              <Input
                key={userData?.last_name}
                defaultValue={userData?.last_name}
                type="text"
                name="last_name"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Last Name"
                placeholder="Enter your Last name"
                isRequired
                errorMessage="Please enter last name"
              />
              <Input
                key={userData?.phone_number}
                defaultValue={userData?.phone_number}
                type="number"
                name="phone_number"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Phone Number"
                placeholder="Enter your phone number"
                isRequired
                errorMessage="Please enter phone number without spaceing"
              />
              <Select
                name="role"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Role"
                placeholder="Select a role"
                value={selectedRole}
                onChange={handleRoleChange}
                isRequired
                errorMessage="Please select a role"
              >
                {role.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="py-3">
            <Input
              key={userData?.password}
              defaultValue={userData?.password}
              type="text"
              name="password"
              labelPlacement="outside"
              variant="bordered"
              size="lg"
              label="Password"
              placeholder="Enter your password"
              isRequired
              errorMessage="Please enter password"
            />
          </div>
          <div className="w-full p-3 bg-[#95C4BE33] rounded-lg mt-3 flex items-center justify-between">
            <span className="text-[#06574C] text-sm">Status</span>
            <div className="flex items-center gap-3">
              <p className="text-md text-[#06574C]">
                {isSelected ? "Active" : "Inactive"}
              </p>
              <Switch
                name="is_active"
                color="success"
                defaultSelected
                aria-label="Automatic updates"
                isSelected={isSelected}
                onValueChange={setIsSelected}
              />
            </div>
          </div>
        </div>

        {selectedRole === "Teacher" && (
          <div className="p-3 bg-white rounded-lg w-full">
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
              {courses.map((item, index) => (
                <Checkbox
                  key={index}
                  name="permissions"
                  color="success"
                  value={item.value}
                  defaultSelected={userData?.permissions?.includes(item.value)}
                >
                  {item.label}
                </Checkbox>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end mt-4 gap-4 w-full">
          <Button
            radius="sm"
            className="w-40 border-[#06574C] text-[#06574C]"
            variant="bordered"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            radius="sm"
            className="w-50 bg-[#06574C]"
            variant="solid"
            color="primary"
            isDisabled={loading}
            isLoading={loading}
          >
           {isEdit === true ? (loading ? "Updating User..." : "Update User") : (loading ? "Creating User..." : "Create User")}
           
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddUserForm;
