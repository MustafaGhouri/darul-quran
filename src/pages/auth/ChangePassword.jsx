import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // ✅ ADD THIS

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔐 Frontend validation
    if (!password || !confirmPassword) {
      return setError("Both password fields are required");
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
        throw new Error(data.message || "Failed to change password");
      }

      alert("Password changed successfully");

      setPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (err) {
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
      <div className="flex-1 flex flex-col items-start md:justify-center bg-[#E9E0D6] px-6 lg:px-24 py-8 lg:py-0 m-0 lg:m-6 lg:rounded-r-lg">
        <div className="w-full max-w-xl mx-auto">
          <h1 className="text-3xl font-medium mb-6">
            <strong>Change Password</strong>
          </h1>

          {/* 🔴 Global Error */}
          {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded mb-4">
              {error}
            </p>
          )}

          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <Input
              radius="sm"
              size="lg"
              type="password"
              label="New Password"
              labelPlacement="outside"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!error && !password}
              errorMessage={!password ? "Password is required" : ""}
              required
            />

            {/* Confirm Password */}
            <Input
              radius="sm"
              size="lg"
              type="password"
              label="Confirm Password"
              labelPlacement="outside"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={
                !!error &&
                (!confirmPassword || password !== confirmPassword)
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
              className="w-full text-white bg-[#06574C]"
            >
              Change Password
            </Button>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;
