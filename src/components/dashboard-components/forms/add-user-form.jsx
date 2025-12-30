import React, { useEffect, useState, useMemo } from "react";
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
import { DashHeading } from "../DashHeading";
import { EyeIcon, EyeOffIcon, SearchCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddUserForm = ({ id, title, desc, userData, isEdit }) => {
  const [selectedRole, setSelectedRole] = useState(new Set());
  const [selectedCountry, setSelectedCountry] = useState(new Set());
  const [selectedCity, setSelectedCity] = useState(new Set());
  const [isSelected, setIsSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  
  console.log("User Data in Form:", userData);

  const role = [
    { key: "Admin", label: "Admin" },
    { key: "Teacher", label: "Teacher" },
    { key: "Student", label: "Student" },
  ];

  const courses = [
    {
      key: "Advance_JavaScript",
      label: "Advance JavaScript",
      value: "advance_javaScript",
    },
    { key: "Advance_React", label: "Advance React", value: "advance_react" },
    { key: "Advance_Python", label: "Advance Python", value: "advance_python" },
  ];

  const countries = [
    { key: "Pakistan", label: "Pakistan" },
    { key: "USA", label: "USA" },
    { key: "UK", label: "United Kingdom" },
  ];

  const citiesByCountry = {
    Pakistan: [
      { key: "Karachi", label: "Karachi" },
      { key: "Lahore", label: "Lahore" },
    ],
    USA: [
      { key: "New_York", label: "New York" },
      { key: "Chicago", label: "Chicago" },
    ],
    UK: [
      { key: "London", label: "London" },
      { key: "Manchester", label: "Manchester" },
    ],
  };

  // Convert Set to string for form submission
  const selectedRoleValue = useMemo(() => {
    return Array.from(selectedRole)[0] || "";
  }, [selectedRole]);

  const selectedCountryValue = useMemo(() => {
    return Array.from(selectedCountry)[0] || "";
  }, [selectedCountry]);

  const selectedCityValue = useMemo(() => {
    return Array.from(selectedCity)[0] || "";
  }, [selectedCity]);

  // Validation functions
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email address (must contain @)";
    return true;
  };

  const validatePassword = (value) => {
    // For new users, password is required
    if (!userData?.id && !value) return "Password is required";
    
    // If password is provided (for new user or change), validate it
    if (value && value.length < 6) {
      return "Password must be at least 6 characters";
    }
    
    return true;
  };

  const validatePhoneNumber = (value) => {
    if (!value) return "Phone number is required";
    
    // Remove any non-digit characters
    const cleanPhone = value.replace(/\D/g, '');
    
    if (selectedCountryValue === "Pakistan") {
      // Check for valid Pakistani mobile numbers (starting with 03 and length 11)
      const pakistaniRegex = /^03[0-9]{9}$/;
      if (!pakistaniRegex.test(cleanPhone)) {
        return "Please enter a valid Pakistani mobile number (e.g., 03163137189)";
      }
    } else {
      // For other countries, just check if it's all digits and reasonable length
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        return "Please enter a valid phone number";
      }
    }
    
    return true;
  };

  useEffect(() => {
    if (userData) {
      // Set role
      if (userData.role) {
        const roleKey = userData.role;
        setSelectedRole(new Set([roleKey]));
      }

      // Set country
      if (userData.country) {
        setSelectedCountry(new Set([userData.country]));
      }

      // Set city
      if (userData.city) {
        setSelectedCity(new Set([userData.city]));
      }

      // Set status
      setIsSelected(userData.is_active ?? true);

      // Set courses if permissions exist
      if (userData.permissions && userData.permissions.length > 0) {
        const courseKeys = courses
          .filter(course => userData.permissions.includes(course.value))
          .map(course => course.key);
        setSelectedCourses(new Set(courseKeys));
      }
    }
  }, [userData]);

  const handleRoleChange = (keys) => {
    setSelectedRole(new Set(keys));
  };

  const handleCountryChange = (keys) => {
    const country = Array.from(keys)[0];
    setSelectedCountry(new Set([country]));
    setSelectedCity(new Set()); // Reset city when country changes
  };

  const handleCityChange = (keys) => {
    setSelectedCity(new Set(keys));
  };

  const handleCourseChange = (keys) => {
    setSelectedCourses(new Set(keys));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      // Get selected courses values
      const selectedCourseValues = Array.from(selectedCourses).map(key => {
        const course = courses.find(c => c.key === key);
        return course ? course.value : key;
      });

      // Build payload
      const payload = {
        id: userData?.id || undefined,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        email: e.target.email.value,
        phone_number: e.target.phone_number.value,
        country: selectedCountryValue,
        city: selectedCityValue,
        role: selectedRoleValue,
        is_active: isSelected,
        permissions: selectedCourseValues,
      };

      // Add password only if provided and valid
      const passwordValue = e.target.password?.value || "";
      if (passwordValue.trim() !== "") {
        payload.password = passwordValue;
      }

      console.log("Submitting payload:", payload);

      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/auth/create-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      if (userData?.id) {
        toast.success("User updated successfully!");
      } else {
        toast.success("User created successfully!");
      }

      navigate("/admin/user-management");
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-3">
      <DashHeading
        title={title || "Add New User"}
        desc={desc || "Create a new user by filling out the form below."}
      />
      <Form 
        onSubmit={handleUserSubmit} 
        className="w-full"
        validationBehavior="native"
      >
        <div className="p-6 bg-white rounded-lg mb-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Left Column */}
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
                type="email"
                name="email"
                defaultValue={userData?.email}
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Email Address"
                placeholder="Enter your email address"
                isRequired
                errorMessage="Please enter a valid email address (must contain @)"
                validate={validateEmail}
              />
            </div>

            {/* Right Column */}
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
                placeholder="e.g., 03163137189"
                isRequired
                errorMessage="Please enter a valid phone number"
                validate={validatePhoneNumber}
                description={selectedCountryValue === "Pakistan" ? "Format: 03XXXXXXXXX (11 digits)" : "Enter valid phone number"}
              />
            </div>
          </div>

          {/* ================= COUNTRY + CITY ROW ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Select
                name="country"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Country"
                placeholder="Select Country"
                selectedKeys={selectedCountry}
                onSelectionChange={handleCountryChange}
                isRequired
                errorMessage="Please select a country"
              >
                {countries.map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <Select
                name="city"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="City"
                placeholder="Select City"
                selectedKeys={selectedCity}
                onSelectionChange={handleCityChange}
                isDisabled={selectedCountry.size === 0}
                isRequired
                errorMessage="Please select a city"
              >
                {(citiesByCountry[selectedCountryValue] || []).map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* ================= ROLE ROW (FULL WIDTH) ================= */}
          <div className="mt-4">
            <Select
              name="role"
              labelPlacement="outside"
              variant="bordered"
              size="lg"
              label="Role"
              placeholder="Select a role"
              selectedKeys={selectedRole}
              onSelectionChange={handleRoleChange}
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

          {!userData?.id && (
            <div className="py-3">
              <Input
                name="password"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Password"
                placeholder="Enter your password"
                isRequired
                errorMessage="Password must be at least 6 characters"
                validate={validatePassword}
                description="Minimum 6 characters"
                type={showPassword ? "text" : "password"}
                endContent={
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOffIcon className="cursor-pointer" size={20} />
                    ) : (
                      <EyeIcon className="cursor-pointer" size={20} />
                    )}
                  </span>
                }
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="w-full p-3 bg-[#95C4BE33] rounded-lg mt-3 flex items-center justify-between">
            <span className="text-[#06574C] text-sm">Status</span>
            <div className="flex items-center gap-3">
              <p className="text-md text-[#06574C]">
                {isSelected ? "Active" : "Inactive"}
              </p>
              <Switch
                name="is_active"
                color="success"
                aria-label="Automatic updates"
                isSelected={isSelected}
                onValueChange={setIsSelected}
              />
            </div>
          </div>
        </div>

        {selectedRoleValue === "Teacher" && (
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
              {courses.map((item) => (
                <Checkbox
                  key={item.key}
                  name="permissions"
                  color="success"
                  value={item.value}
                  isSelected={selectedCourses.has(item.key)}
                  onValueChange={(isChecked) => {
                    const newSet = new Set(selectedCourses);
                    if (isChecked) {
                      newSet.add(item.key);
                    } else {
                      newSet.delete(item.key);
                    }
                    setSelectedCourses(newSet);
                  }}
                >
                  {item.label}
                </Checkbox>
              ))}
            </div>
          </div>
        )}

        {/* Hidden inputs for form data */}
        <input type="hidden" name="role" value={selectedRoleValue} />
        <input type="hidden" name="country" value={selectedCountryValue} />
        <input type="hidden" name="city" value={selectedCityValue} />

        <div className="flex items-center justify-end mt-4 gap-4 w-full">
          <Button
            radius="sm"
            className="w-40 border-[#06574C] text-[#06574C]"
            variant="bordered"
            as={Link}
            to="/admin/user-management"
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
            {isEdit
              ? loading
                ? "Updating User..."
                : "Update User"
              : loading
              ? "Creating User..."
              : "Create User"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddUserForm;