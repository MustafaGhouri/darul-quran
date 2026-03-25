import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, Form, Skeleton, Avatar } from "@heroui/react";
import { useUpdateProfileMutation } from "../../redux/api/user";
import { setUser } from "../../redux/reducers/user";
import { api } from "../../services/api";
import { successMessage, errorMessage } from "../../lib/toast.config";
import FileDropzone from "../../components/dashboard-components/dropzone";
import { uploadFiles } from "../../lib/uploadthing";
import { Camera, Edit3 } from "lucide-react";
import NotificationPermission from "../../components/NotificationPermission";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [avatarFiles, setAvatarFiles] = useState([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhoneNumber(user.phoneNumber || "");
      setCity(user.city || "");
      setCountry(user.country || "");
      if (user.avatar) {
        setAvatarFiles([user.avatar]);
      }
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let avatarUrl = user?.avatar;
      
      // If there's a file to upload
      if (avatarFiles.length > 0 && typeof avatarFiles[0] !== "string" && avatarFiles[0].file) {
        const file = avatarFiles[0].file;
        const res = await uploadFiles("imageUploader", { files: [file] });
        if (res && res.length > 0) {
          avatarUrl = res[0].url;
        }
      }

      const res = await updateProfile({
        firstName,
        lastName,
        phoneNumber,
        city,
        country,
        avatar: avatarUrl,
      }).unwrap();

      // update Redux user context
      dispatch(setUser({ ...user, ...res.user }));
      successMessage("Profile updated successfully!");
    } catch (error) {
       console.error(error);
       errorMessage(error?.data?.message || "Failed to update profile");
    } finally {
       setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return errorMessage("Please fill all password fields");
    }
    if (newPassword !== confirmPassword) {
      return errorMessage("New passwords do not match");
    }
    
    setIsChangingPassword(true);
    try {
      await api.patch("/auth/update-password", {
        currentPassword,
        newPassword
      });
      successMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      errorMessage(error?.response?.data?.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
      return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
           <Skeleton className="h-64 w-full rounded-md" />
        </div>
      );
  }

  const previewUrl =
    avatarFiles.length > 0
      ? typeof avatarFiles[0] === "string"
        ? avatarFiles[0]
        : URL.createObjectURL(avatarFiles[0].file)
      : user?.avatar ||  "";

  const flatInputClassNames = {
    inputWrapper: "bg-[#F3F7F6] hover:bg-[#EBF1EF] shadow-none border-none",
    label: "text-gray-600 font-medium text-sm"
  };

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2A5C54]">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal details</p>
        </div>
        <NotificationPermission />
      </div>
      <hr className="border-gray-200 mb-8" />
      <Form id="profile-form" onSubmit={handleUpdateProfile} className="w-full">
        <div className="flex flex-col md:flex-row gap-12 w-full mb-12">
          
          {/* Avatar Area */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="relative w-50 h-50 rounded-full bg-gray-100 flex items-center justify-center shadow-sm border-4 border-white">
              <Avatar 
                src={previewUrl} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full pointer-events-none" 
              />
              
              <div className="absolute inset-0 z-10 opacity-0 overflow-hidden rounded-full">
                 <FileDropzone 
                   files={avatarFiles}
                   setFiles={setAvatarFiles}
                   isMultiple={false}
                   fileType="image"
                   height="100%"
                   width="100%"
                   className="w-full h-full cursor-pointer"
                   showFilesThere={false}
                   showFilesNamesThere={false}
                 />
              </div>

              <div className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md text-gray-700 z-0 border border-gray-100">
                <Camera size={18} />
              </div>
            </div>
            
            <p className="text-[#2A5C54] font-medium text-sm mt-4">Upload new photo</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max 5MB.</p>
          </div>
          
          {/* Inputs */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <Input
                label="First Name"
                labelPlacement="outside"
                placeholder="Moss"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                variant="flat"
                classNames={flatInputClassNames}
              />
              <Input
                label="Last Name"
                labelPlacement="outside"
                placeholder="admin"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                variant="flat"
                classNames={flatInputClassNames}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <Input
                label="Country"
                labelPlacement="outside"
                placeholder="Country Name"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                variant="flat"
                classNames={flatInputClassNames}
              />
              <Input
                label="City"
                labelPlacement="outside"
                placeholder="City Name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                variant="flat"
                classNames={flatInputClassNames}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
               <Input
                 label="Phone Number"
                 labelPlacement="outside"
                 placeholder="000-000-000"
                 value={phoneNumber}
                 onChange={(e) => setPhoneNumber(e.target.value)}
                 variant="flat"
                 classNames={flatInputClassNames}
               />
               <Input
                 label="Email"
                 labelPlacement="outside"
                 value={user?.email || ""}
                 isDisabled
                 variant="flat"
                 classNames={flatInputClassNames}
               />
            </div>

            <div className="flex justify-end mt-4 w-full">
              <Button
                type="submit"
                className="bg-[#3D655F] text-white px-8 py-2 rounded-md font-medium shadow-md"
                isLoading={isSaving || isUpdatingProfile} 
              >
                Update Profile
              </Button>
            </div>
          </div>
        </div>
      </Form>

      {/* Reset Password Section */}
      <h2 className="text-lg font-semibold text-[#2A5C54] mb-2">Reset Password</h2>
      <hr className="border-gray-200 mb-8" />
      
      <Form onSubmit={handleChangePassword} className="w-full flex flex-col gap-6">
         <Input
            label="Current Password"
            labelPlacement="outside"
            type="password"
            placeholder="*************"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            variant="flat"
            classNames={flatInputClassNames}
         />
         <Input
            label="New Password"
            labelPlacement="outside"
            type="password"
            placeholder="*************"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            variant="flat"
            classNames={flatInputClassNames}
         />
         <Input
            label="Confirm Password"
            labelPlacement="outside"
            type="password"
            placeholder="*************"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="flat"
            classNames={flatInputClassNames}
         />
         
         <div className="flex justify-end mt-4 w-full">
           <Button
              type="submit"
              className="bg-[#3D655F] text-white px-8 py-2 rounded-md font-medium shadow-md"
              isLoading={isChangingPassword}
           >
              Reset Password
           </Button>
         </div>
      </Form>
      
    </div>
  );
};

export default ProfilePage;
