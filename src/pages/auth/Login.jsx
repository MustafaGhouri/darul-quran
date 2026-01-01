import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Login = () => {
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };

  const navigate = useNavigate();

  const [email, setEmail] = useState("syedmazzh@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState("success"); // success | error
  const [modalMessage, setModalMessage] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setModalType("error");
        toast.error(data.message || "Login failed");
        onOpen();
        return;
      }
      if (res.ok) {
        // ✅ success
        toast.success("Login successful");
      }
      setTimeout(() => {
        if (data.user.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "Teacher") {
          navigate("/teacher/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }, 1200);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen">
      <div className="lg:h-screen w-full lg:max-w-[400px] xl:max-w-[400px] p-6 lg:p-8 flex flex-col items-center justify-between bg-[#06574C]  relative ovexrflow-hidden max-lg:hidden lg:rounded-r-lg">
        {/* <img src="/icons/login-line.png" alt="Darul Quran" className='  absolute top-1/7 left-1/8 -translate-x-1/2 -translate-y-1/2' /> */}
        <img
          src="/icons/logo.png"
          alt="Darul Quran"
          className=" w-56 h-56 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
        />
        {/* <img src="/icons/side-shadow.png" alt="Darul Quran" className=' h-full  left-0 bottom-0 absolute' />
                <img src="/icons/bottom-shadow.png" alt="Darul Quran" className=' h-100  left-0 bottom-0 absolute' /> */}

        {/* <div className='space-y-4 lg:space-y-6 text-white text-center lg:text-left'>
                    <p className='text-sm lg:text-base'>Join 10,000+ other teachers & Students Here</p>
                    <img src="/icons/teachers.png" alt="teachers" className='h-12' />
                    <h1 className='text-2xl lg:text-3xl font-semibold'>Don't Forget to Check Your Statistics</h1>
                    <p className='text-sm lg:text-base leading-relaxed'>Keep an eye on your teaching insights to improve student learning experiences.</p>
                </div> */}
      </div>
      <div className="flex-1 flex flex-col max-sm:items-center items-start md:justify-center bg-[#E9E0D6] !ml-0 px-6 sm:px-12 md:px-16 lg:px-24 py-8 lg:py-0 m-0 lg:m-6 lg:rounded-r-lg ">
        <img
          src="/icons/darul-quran-logo.png"
          alt="Darul Quran"
          className=" w-45 h-45 md:hidden"
        />
        <div className="w-full max-w-xl mx-auto lg:mx-16">
          <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-[35px] text-[#3F3F44] leading-tight mb-6 lg:mb-8 font-medium">
            {/* Assalamu 'alaykum, <br /> */}
            <strong>Welcome</strong>
            {""} to{" "}
            <span className="text-[#95C4BE]">Darul Qur'an Leicester </span>
            {/* - a space to grow, reflect and connect */}
          </h1>

          <Form
            onSubmit={handleLogin}
            className="w-full space-y-5 lg:space-y-6 items-center justify-center"
          >
            <div className="w-full space-y-2">
              <p className="text-sm lg:text-base text-[#3F3F44]">
                Your email or phone number
              </p>
              <Input
                className="rounded-md"
                placeholder="youremail@guru.com"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between items-center text-sm lg:text-base">
                <p className="text-[#3F3F44]">Password</p>
                <Link
                  to="/auth/forget-password"
                  className=" cursor-pointer hover:underline"
                >
                  Forget Password?
                </Link>
              </div>
              <Input
                className="rounded-md"
                placeholder="Enter your password"
                value={password}
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
            {/* <Link to=""> */}
            <div className="flex max-sm:flex-wrap gap-3 w-full  ">
              {/* <Button
                type="submit"
                as={Link}
                to="/admin/dashboard"
                className="w-full text-center text-white rounded-md py-3 bg-[#06574C]"
              >
                Login as admin
              </Button>

              <Button
                type="submit"
                as={Link}
                to="/teacher/dashboard"
                className="w-full text-center text-white rounded-md py-3 bg-[#06574C]"
              >
                Login as teacher
              </Button>
              <Button
                type="submit"
                as={Link}
                to="/student/dashboard"
                className="w-full text-center text-white rounded-md py-3 bg-[#06574C]"
              >
                Login as student
              </Button> */}
              <Button
                type="submit"
                className="w-full text-center text-white rounded-md py-3 bg-[#06574C]"
                isLoading={loading}
                isDisabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
            {/* </Link> */}
            {/* <div className="text-center text-sm lg:text-base mb-4 text-[#3F3F44]">
              Or
            </div> */}
          </Form>
          {/* <Button className="w-full text-center bg-white rounded-md py-3 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2">
            <img src="/icons/google.png" className="w-6 h-6" alt="" />
            <span className="text-sm lg:text-base">Sign in with Google</span>
          </Button> */}
        </div>
      </div>
    </main>
  );
};

export default Login;
