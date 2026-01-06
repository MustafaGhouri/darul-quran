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
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { DashHeading } from "../DashHeading";
import { EyeIcon, EyeOffIcon, SearchCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Country, City } from "country-state-city";

const AddUserForm = ({ id, title, desc, userData, isEdit }) => {
  const [selectedRole, setSelectedRole] = useState(new Set());
  
  // Use null for single value selection with Autocomplete
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [countryInputValue, setCountryInputValue] = useState("");
  const [cityInputValue, setCityInputValue] = useState("");
  
  const [isSelected, setIsSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  
  console.log("User Data in Form:", userData);

  const role = [
    { key: "admin", label: "Admin" },
    { key: "teacher", label: "Teacher" },
    { key: "student", label: "Student" },
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

  // Get all countries from country-state-city
  const allCountries = useMemo(() => Country.getAllCountries(), []);

  // Filtered countries based on search input
  const filteredCountries = useMemo(() => {
    if (!countryInputValue) return allCountries;
    return allCountries.filter((country) =>
      country.name.toLowerCase().includes(countryInputValue.toLowerCase())
    );
  }, [countryInputValue, allCountries]);

  // Get cities based on selected country
  const availableCities = useMemo(() => {
    if (!selectedCountry?.isoCode) return [];
    return City.getCitiesOfCountry(selectedCountry.isoCode);
  }, [selectedCountry]);

  // Filtered cities based on search input
  const filteredCities = useMemo(() => {
    if (!cityInputValue) return availableCities;
    return availableCities.filter((city) =>
      city.name.toLowerCase().includes(cityInputValue.toLowerCase())
    );
  }, [cityInputValue, availableCities]);

  // Convert Set to string for form submission
  const selectedRoleValue = useMemo(() => {
    return Array.from(selectedRole)[0] || "";
  }, [selectedRole]);

  // Use direct values for country/city
  const selectedCountryValue = useMemo(() => {
    return selectedCountry?.name || "";
  }, [selectedCountry]);

  const selectedCityValue = useMemo(() => {
    return selectedCity?.name || "";
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

  // const validatePhoneNumber = (value) => {
  //   if (!value) return "Phone number is required";
    
  //   // Remove any non-digit characters
  //   const cleanPhone = value.replace(/\D/g, '');
    
  //   if (selectedCountryValue === "Pakistan") {
  //     // Check for valid Pakistani mobile numbers (starting with 03 and length 11)
  //     const pakistaniRegex = /^03[0-9]{9}$/;
  //     if (!pakistaniRegex.test(cleanPhone)) {
  //       return "Please enter a valid Pakistani mobile number (e.g., 03163137189)";
  //     }
  //   } else {
  //     // For other countries, just check if it's all digits and reasonable length
  //     if (cleanPhone.length < 7 || cleanPhone.length > 15) {
  //       return "Please enter a valid phone number";
  //     }
  //   }
    
  //   return true;
  // };

  useEffect(() => {
    if (userData) {
      // Set role
      if (userData.role) {
        const roleKey = userData.role;
        setSelectedRole(new Set([roleKey]));
      }

      // Set country
      if (userData.country) {
        // Find country object by name
        const country = allCountries.find(c => c.name === userData.country);
        if (country) {
          setSelectedCountry(country);
          setCountryInputValue(country.name);
        }
      }

      // Set city
      if (userData.city && userData.country) {
        // We need to wait for country to be set, but we can do it here if we have country isoCode
        const country = allCountries.find(c => c.name === userData.country);
        if (country) {
          const cities = City.getCitiesOfCountry(country.isoCode);
          const city = cities.find(c => c.name === userData.city);
          if (city) {
            setSelectedCity(city);
            setCityInputValue(city.name);
          }
        }
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
  }, [userData, allCountries]);

  const handleRoleChange = (keys) => {
    setSelectedRole(new Set(keys));
  };

  const handleCountrySelect = (key) => {
    const country = allCountries.find(c => c.isoCode === key);
    if (country) {
        setSelectedCountry(country);
        setCountryInputValue(country.name);
        setSelectedCity(null); // Reset city
        setCityInputValue("");
    }
  };

  const handleCitySelect = (key) => {
    // Since city names might not be unique globally, but are within country, we search in availableCities
    const city = availableCities.find(c => c.name === key);
    if (city) {
        setSelectedCity(city);
        setCityInputValue(city.name);
    }
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
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/user/create-user`,
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
      toast.error(error.message || "User already exists");
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
                inputmode="numeric"
                pattern='^\+?[0-9]+$'
                size="lg"
                label="Phone Number"
                placeholder="e.g., 07XXX XXXXXX"
                isRequired
                errorMessage="Please enter a valid phone number"
                // validate={validatePhoneNumber}
                description={selectedCountryValue === "Pakistan" ? "Format: 07XXX XXXXXX (11 digits)" : "Enter valid phone number"}
              />
            </div>
          </div>

          {/* ================= COUNTRY + CITY ROW ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Autocomplete
                size="lg"
                variant="bordered"
                label="Country"
                labelPlacement="outside"
                placeholder="Select Country"
                allowsCustomValue={false}
                menuTrigger="input"
                items={filteredCountries}
                selectedKey={selectedCountry?.isoCode || null}
                inputValue={countryInputValue}
                onInputChange={setCountryInputValue}
                onSelectionChange={handleCountrySelect}
                isRequired
                errorMessage="Please select a country"
              >
                {(country) => (
                  <AutocompleteItem
                    key={country.isoCode}
                    textValue={country.name}
                  >
                    {country.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div>
              <Autocomplete
                size="lg"
                variant="bordered"
                label="City"
                labelPlacement="outside"
                placeholder="Select City"
                allowsCustomValue={false}
                menuTrigger="input"
                isDisabled={!selectedCountry}
                items={filteredCities}
                selectedKey={selectedCity?.name || null} // Use name for city key as we search by name
                inputValue={cityInputValue}
                onInputChange={setCityInputValue}
                onSelectionChange={handleCitySelect}
                isRequired
                errorMessage="Please select a city"
              >
                {(city) => (
                  <AutocompleteItem
                    key={city.name}
                    textValue={city.name}
                  >
                    {city.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
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