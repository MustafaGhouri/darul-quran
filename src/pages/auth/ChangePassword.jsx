import { Button, Form, Input } from "@heroui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!password || !confirmPassword) {
      return setError("Both password fields are required");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters long");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!token || !email) {
      return setError("Invalid password reset link");
    }

    try {
      setLoading(true);

      const res = await fetch(
        import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/admin/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Check for specific token errors
        if (data.message?.toLowerCase().includes('expired') || 
            data.message?.toLowerCase().includes('invalid') ||
            data.message?.toLowerCase().includes('token')) {
          toast.error("Password reset link has expired or is invalid. Please request a new one.");
          navigate("/forgot-password");
          return;
        }
        
        toast.error(data.message || "Failed to change password");
        return;
      }

      // Success case
      toast.success("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error(err.message || "An error occurred. Please try again.");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* LEFT SIDE */}
      <div className="lg:h-screen w-full lg:max-w-[400px] p-6 bg-[#06574C] relative max-lg:hidden lg:rounded-r-lg">
        <img
          src="/icons/logo.png"
          alt="Darul Quran"
          className="w-56 h-56 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col items-start md:justify-center bg-[#E9E0D6] px-6 sm:px-12 md:px-16 lg:px-24 py-8 lg:py-0 m-0 lg:m-6 lg:rounded-r-lg lg:!ml-0">
        <img
          src="/icons/darul-quran-logo.png"
          alt="Darul Quran"
          className="w-45 h-45 !self-center md:hidden"
        />
        
        <div className="w-full max-w-xl mx-auto">
          <h1 className="text-3xl font-medium mb-6">
            <strong>Change Password</strong>
          </h1>
          
          {/* Email display */}
          {email && (
            <div className="mb-4 p-3 bg-gray-100 rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                Reset password for: <strong className="text-[#06574C]">{email}</strong>
              </p>
            </div>
          )}
          
          {/* Token missing warning */}
          {(!token || !email) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">
                <strong>Invalid reset link:</strong> Token or email is missing. Please use the link from your email.
              </p>
              <button
                onClick={() => navigate("/forgot-password")}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Request a new password reset link
              </button>
            </div>
          )}
          
          {error && (
            <p className="text-red-600 bg-red-50 p-3 rounded mb-4 border border-red-200">
              {error}
            </p>
          )}
          
          <Form onSubmit={handleSubmit} className="space-y-6 w-full">
            {/* New Password */}
            <div className="space-y-2 w-full">
              <Input
                radius="sm"
                size="lg"
                type={showPassword ? "text" : "password"}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="cursor-pointer text-gray-500" size={20} />
                    ) : (
                      <EyeIcon className="cursor-pointer text-gray-500" size={20} />
                    )}
                  </button>
                }
                label="New Password"
                labelPlacement="outside"
                placeholder="Enter new password (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!error && (!password || password.length < 8)}
                errorMessage={
                  !password 
                    ? "Password is required" 
                    : password.length < 8 
                    ? "Password must be at least 8 characters"
                    : ""
                }
                required
              />
              <p className="text-xs text-gray-500 ml-1">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <Input
              radius="sm"
              size="lg"
              className="w-full"
              type={showPassword ? "text" : "password"}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOffIcon className="cursor-pointer text-gray-500" size={20} />
                  ) : (
                    <EyeIcon className="cursor-pointer text-gray-500" size={20} />
                  )}
                </button>
              }
              label="Confirm Password"
              labelPlacement="outside"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={
                !!error && (!confirmPassword || password !== confirmPassword)
              }
              errorMessage={
                !confirmPassword
                  ? "Confirm password is required"
                  : password !== confirmPassword
                  ? "Passwords do not match"
                  : ""
              }
              required
            />

            <Button
              type="submit"
              radius="md"
              isLoading={loading}
              disabled={loading || !token || !email}
              className={`w-full text-white bg-[#06574C] hover:bg-[#05463d] transition-colors ${
                (!token || !email) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </Button>
            
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-[#06574C] hover:text-[#05463d] text-sm underline"
              >
                Back to Login
              </button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;