import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";

import { api } from "../../services/api";
import { errorMessage, successMessage } from "../../lib/toast.config";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // api.post handles JSON encoding, headers, response.ok check, and error toast
      await api.post("/auth/forgot-password", { email });

      // Success message
      successMessage(
        "If the email exists, a password reset link has been sent. Please check your inbox."
      );

      // Do NOT redirect automatically — user must use emailed link
    } catch (err) {
      console.error(err);
      errorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* LEFT PANEL */}
      <div className="lg:h-screen w-full lg:max-w-[400px] xl:max-w-[400px] p-6 lg:p-8 flex flex-col items-center justify-between bg-[#06574C] relative max-lg:hidden lg:rounded-r-lg">
        <img
          src="/icons/logo.png"
          alt="Darul Quran"
          className="w-56 h-56 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-start md:justify-center bg-[#E9E0D6] px-6 sm:px-12 md:px-16 lg:px-24 py-8 lg:py-0 m-0 lg:m-6 lg:rounded-r-lg lg:ml-0!">
        <img
          src="/icons/darul-quran-logo.png"
          alt="Darul Quran"
          className="w-45 h-45 self-center! md:hidden"
        />

        <div className="w-full max-w-xl mx-auto lg:mx-16">
          <h1 className="text-xl sm:text-3xl lg:text-4xl text-[#3F3F44] mb-6 font-medium">
            <strong>Send Email</strong>
          </h1>

          <Form onSubmit={handleSubmit} className="w-full">
            <div className="w-full space-y-2">
              <Input
                radius="sm"
                size="lg"
                placeholder="youremail@guru.com"
                type="email"
                label="Enter your registered email"
                labelPlacement="outside"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {/* {message && (
                <p className="text-sm text-center text-green-600">{message}</p>
              )}
              {error && (
                <p className="text-sm text-center text-red-600">{error}</p>
              )} */}
            </div>

            <Button
              radius="md"
              type="submit"
              className="w-full mt-4 text-white py-3 bg-[#06574C]"
              isLoading={loading}
              disabled={loading}
            >
              Send
            </Button>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default ForgetPassword;
