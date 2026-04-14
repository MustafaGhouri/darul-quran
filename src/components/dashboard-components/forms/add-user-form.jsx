import { useEffect, useState, useMemo } from "react";
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
  Textarea,
} from "@heroui/react";
import { DashHeading } from "../DashHeading";
import { EyeIcon, EyeOffIcon, SearchCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import Countries from "../../../../public/countries.json";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import { useCreateOrUpdateUserMutation } from "../../../redux/api/user";


const AddUserForm = ({ id, title, desc, userData, isEdit }) => {
  const [selectedRole, setSelectedRole] = useState(new Set());

  // Use null for single value selection with Autocomplete
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [countryInputValue, setCountryInputValue] = useState("");
  const [cityInputValue, setCityInputValue] = useState("");
  const [availableCities, setAvailableCities] = useState([]);
  const [Countries, setCountries] = useState([]);

  const [isSelected, setIsSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [createOrUpdateUser] = useCreateOrUpdateUserMutation();

  useEffect(() => {
    if (userData?.permissions) {
      setSelectedPermissions(userData.permissions);
    }
  }, [userData]);

  useEffect(() => {
    async function fetchCountries() {
      const res = await fetch('/countries.json', {
        method: "GET",
      })
      if (!res.ok) {
        errorMessage(res.statusText)
      }
      const data = await res.json()
      setCountries(data || []);
    }
    fetchCountries()
  }, []);

  const navigate = useNavigate();

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
  const allCountries = useMemo(() => Countries, [Countries]);
  // Get cities based on selected country
  // const availableCities = useMemo(() => {
  //   if (!selectedCountry?.isoCode) return [];
  //   return City.getCitiesOfCountry(selectedCountry.isoCode);
  // }, [selectedCountry]);
  useEffect(() => {
    if (selectedCountry?.name) {
      const asa = selectedCountry.cities?.map((i) => {
        return {
          city: i,
          country: selectedCountry?.name
        }
      })
      setAvailableCities(asa);
    }
  }, [selectedCountry]);
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
          const cities = country?.cities;
          const city = cities.find(c => c === userData.city);
          if (city) {
            setSelectedCity(city);
            setCityInputValue(city);
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
    const city = availableCities?.find(c => c.city === key);
    if (city?.city) {
      setSelectedCity(city?.city);
      setCityInputValue(city?.city);
    }
  };


  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    try {
      // Get selected courses values
      // const selectedCourseValues = Array.from(selectedCourses).map(key => {
      //   const course = courses.find(c => c.key === key);
      //   return course ? course.value : key;
      // });

      // Build payload
      const payload = {
        id: userData?.id || undefined,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        country: selectedCountry?.name,
        city: selectedCity,
        role: selectedRoleValue,
        is_active: isSelected,
        permissions: selectedPermissions,
        oldRole: userData?.role,
        bio: data?.bio,
        tagline: data?.tagline,
        experience_years: data?.experience_years || null,
      };

      // Add password only if provided and valid
      const passwordValue = e.target.password?.value || "";
      if (passwordValue.trim() !== "") {
        payload.password = passwordValue;
      }

      const res = await createOrUpdateUser(payload);

      if (res.error) {
        throw new Error(res?.error?.data?.message);
      }

      successMessage(res.data.message || "User created successfully");
      navigate("/admin/user-management?role=" + payload.role);
    } catch (error) {
      errorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ALL_PERMISSIONS = [
    { label: "Dashboard", value: "/admin/dashboard" },
    { label: "Courses Management", value: "/admin/courses-management" },
    { label: "Course Builder", value: "/admin/courses-management/builder" },
    { label: "Attendance & Progress", value: "/admin/courses-management/attendance" },
    { label: "Student Attendence", value: "/admin/attendance-list" },
    { label: "User Management", value: "/admin/user-management" },
    { label: "Add User Management", value: "/admin/user-management/add-user" },
    { label: "User Detailed View", value: "/admin/user-management/users-details" },
    { label: "Edit User", value: "/admin/user-management/edit-user" },
    { label: "Class Scheduling", value: "/admin/class-scheduling" },
    { label: "Reschedule Requests", value: "/admin/reschedule-requests" },
    { label: "Announcements", value: "/admin/announcements" },
    { label: "Payments & Refunds", value: "/admin/payments" },
    { label: "Support", value: "/admin/tickets" },
    { label: "Analytics", value: "/admin/analytics" },
    { label: "Notifications", value: "/admin/notifications" },
    // { label: "Help and Support", value: "/admin/help/messages" },
    { label: "Message Center Or Chat", value: "/admin/help/messages" },
    { label: "Teacher & Student Chat", value: "/admin/help/chat" },
    { label: "Reviews", value: "/admin/help/reviews" },
    { label: "FAQs", value: "/admin/help/faqs" },
  ];
  const handleToggle = (permission = '', checked = false) => {
    setSelectedPermissions((prev) =>
      checked
        ? [...prev, permission]
        : prev.filter((p) => p !== permission)
    );
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
                key={userData?.firstName}
                defaultValue={userData?.firstName}
                type="text"
                name="firstName"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="First Name"
                placeholder="Enter first name"
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
                key={userData?.lastName}
                defaultValue={userData?.lastName}
                type="text"
                name="lastName"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Last Name"
                placeholder="Enter Last name"
                isRequired
                errorMessage="Please enter last name"
              />
              <Input
                key={userData?.phoneNumber}
                defaultValue={userData?.phoneNumber}
                type="number"
                name="phoneNumber"
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
                defaultItems={allCountries}
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
                isDisabled={!selectedCountry}
                defaultItems={availableCities || []}
                selectedKey={selectedCity || null} // Use name for city key as we search by name
                inputValue={cityInputValue}
                onInputChange={setCityInputValue}
                onSelectionChange={handleCitySelect}
                isRequired
                errorMessage="Please select a city"
              >
                {(city) => (
                  <AutocompleteItem
                    key={city.city}
                    textValue={city.city}
                  >
                    {city.city}
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
                placeholder={userData?.id ? "Enter user password" : "Edit user password"}
                isRequired={!userData?.id}
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
        {selectedRoleValue === 'teacher' && <div className="p-4 mt-4 w-full rounded-md bg-[#FFFFFF]">

          <h1 className="text-lg py-3 border-[#D9D9D9] font-semibold">
            Teacher Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-5">
              <Input
                key={userData?.experience_years}
                defaultValue={userData?.experience_years}
                type="number"
                name="experience_years"
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Teacher's Expericence (Years)"
                placeholder="Enter Teacher's Expericence"
              />

              <Textarea
                key={userData?.bio}
                defaultValue={userData?.bio}
                name="bio"
                rows={3}
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Teacher's Bio"
                placeholder="Enter Teacher's Bio"
              />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-5">
              <Input
                key={userData?.tagline}
                type="text"
                name="tagline"
                defaultValue={userData?.tagline}
                labelPlacement="outside"
                variant="bordered"
                size="lg"
                label="Teacher's Tagline"
                placeholder="Enter Teacher's Tagline"
              />
            </div>
          </div>
        </div>}
        {selectedRoleValue === 'admin' &&
          <div className="p-4 mt-4 w-full rounded-md bg-[#FFFFFF]">
            <h1 className="text-[#406C65] text-md w-full border-b-2 py-3 border-[#D9D9D9] font-semibold">
              Permissions
            </h1>

            <div className="flex flex-wrap gap-6 p-6">
              {ALL_PERMISSIONS.map((permission) => (
                <Checkbox
                  key={permission.value}
                  size="md"
                  isSelected={selectedPermissions.includes(permission.value)}
                  onValueChange={(checked) =>
                    handleToggle(permission.value, checked)
                  }
                  value={permission.value}
                  color="success"
                  radius="full"
                >
                  {permission.label}
                </Checkbox>
              ))}
            </div>
          </div>}
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
                  <SearchCheck className="text-default-400 pointer-events-none shrink-0" />
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