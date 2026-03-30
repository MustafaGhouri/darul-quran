import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
  Form
} from "@heroui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useCreateOrUpdateUserMutation } from "../../redux/api/user";
import { errorMessage, successMessage } from "../../lib/toast.config";

const AddStudentModal = ({ isOpen, onClose }) => {
    const [createOrUpdateUser] = useCreateOrUpdateUserMutation();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [Countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [countryInputValue, setCountryInputValue] = useState("");
    const [cityInputValue, setCityInputValue] = useState("");
    const [availableCities, setAvailableCities] = useState([]);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const res = await fetch('/countries.json');
                if (res.ok) {
                    const data = await res.json();
                    setCountries(data || []);
                }
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        }
        fetchCountries();
    }, []);

    useEffect(() => {
        if (selectedCountry?.cities) {
            setAvailableCities(selectedCountry.cities.map(c => ({ city: c })));
        } else {
            setAvailableCities([]);
        }
    }, [selectedCountry]);

    const handleCountrySelect = (key) => {
        const country = Countries.find(c => c.isoCode === key);
        if (country) {
            setSelectedCountry(country);
            setCountryInputValue(country.name);
            setSelectedCity(null);
            setCityInputValue("");
        }
    };

    const handleCitySelect = (key) => {
        setSelectedCity(key);
        setCityInputValue(key);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const payload = {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone_number: data.phoneNumber,
                country: selectedCountry?.name,
                city: selectedCity,
                password: data.password,
                role: 'student',
                is_active: true
            };

            const res = await createOrUpdateUser(payload);
            if (res.error) throw new Error(res.error.data?.message || res.error.data?.error || "Failed to create student");

            successMessage("Student created successfully");
            onClose();
        } catch (error) {
            errorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
            <ModalContent>
                {(onClose) => (
                    <Form onSubmit={handleSubmit} validationBehavior="native" className="w-full">
                        <ModalHeader className="flex flex-col gap-1">Add New Student</ModalHeader>
                        <ModalBody className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <Input 
                                    name="firstName" 
                                    label="First Name" 
                                    placeholder="Enter first name"
                                    isRequired 
                                    variant="bordered" 
                                    labelPlacement="outside"
                                />
                                <Input 
                                    name="lastName" 
                                    label="Last Name" 
                                    placeholder="Enter last name"
                                    isRequired 
                                    variant="bordered" 
                                    labelPlacement="outside"
                                />
                                <Input 
                                    name="email" 
                                    label="Email" 
                                    type="email" 
                                    placeholder="Enter email"
                                    isRequired 
                                    variant="bordered" 
                                    labelPlacement="outside"
                                />
                                <Input 
                                    name="phoneNumber" 
                                    label="Phone Number" 
                                    placeholder="Enter phone number"
                                    isRequired 
                                    variant="bordered" 
                                    labelPlacement="outside"
                                />
                                <Autocomplete
                                    label="Country"
                                    placeholder="Select Country"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    defaultItems={Countries}
                                    onSelectionChange={handleCountrySelect}
                                    onInputChange={setCountryInputValue}
                                    inputValue={countryInputValue}
                                    isRequired
                                >
                                    {(item) => (
                                        <AutocompleteItem key={item.isoCode} textValue={item.name}>
                                            {item.name}
                                        </AutocompleteItem>
                                    )}
                                </Autocomplete>
                                <Autocomplete
                                    label="City"
                                    placeholder="Select City"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    defaultItems={availableCities}
                                    isDisabled={!selectedCountry}
                                    onSelectionChange={handleCitySelect}
                                    onInputChange={setCityInputValue}
                                    inputValue={cityInputValue}
                                    isRequired
                                >
                                    {(item) => (
                                        <AutocompleteItem key={item.city} textValue={item.city}>
                                            {item.city}
                                        </AutocompleteItem>
                                    )}
                                </Autocomplete>
                                <div className="md:col-span-2">
                                    <Input
                                        name="password"
                                        label="Password"
                                        placeholder="Enter password"
                                        labelPlacement="outside"
                                        type={showPassword ? "text" : "password"}
                                        isRequired
                                        variant="bordered"
                                        endContent={
                                            <button 
                                                className="focus:outline-none" 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                                                ) : (
                                                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                                                )}
                                            </button>
                                        }
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" type="submit" isLoading={loading}>
                                Create Student
                            </Button>
                        </ModalFooter>
                    </Form>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AddStudentModal;
