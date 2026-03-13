import {
  Button,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { setUser } from "../../redux/reducers/user";
import { useDispatch } from "react-redux";
import { api } from "../../services/api";
import { successMessage } from "../../lib/toast.config";
import { analyticsEvents } from "../../lib/analytics";
const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState("success");

  const rolesWithEmail = [
    { label: "Admin", key: "admin@admin.com" },
    { label: "Teacher", key: "teacher@teacher.com" },
    { label: "Student", key: "student@student.com" }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const data = await api.post("/auth/login", { email, password });

      // If successful (api.post throws on error)
      dispatch(setUser(data.user));
      successMessage("Login successful");
      const role = data.user.role?.toLowerCase();
      analyticsEvents.login(role);

      let route = '/';
      if (role === "admin") {
        route = "/admin/dashboard"
      } else if (role === "teacher") {
        route = "/teacher/dashboard"
      } else if (role === "student") {
        route = "/student/dashboard"
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      } else if (data.user?.token) {
        localStorage.setItem("token", data.user.token);
      }

      // window.history.replaceState({}, document.title, window.location.pathname);
      navigate(route, { replace: true });
      location.replace(route)
    } catch (error) {
      setModalType("error");
      // onOpen();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* <img src="/icons/login-line.png" alt="Darul Quran" className='  absolute top-1/7 left-1/8 -translate-x-1/2 -translate-y-1/2' /> */}
      <div className="lg:h-screen w-full lg:max-w-[400px] xl:max-w-[400px] p-6 lg:p-8 flex flex-col items-center justify-between bg-[#06574C]  relative ovexrflow-hidden max-lg:hidden lg:rounded-r-lg">
        <img
          src="/icons/logo.png"
          alt="Darul Quran"
          className=" w-56 h-56 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
          />
      </div>
      <div className="flex-1 flex flex-col max-sm:items-center items-start md:justify-center bg-[#E9E0D6] ml-0! px-6 sm:px-12 md:px-16 lg:px-24 py-8 lg:py-0 m-0 lg:m-6 lg:rounded-r-lg ">
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
                Choose Account Role
              </p>
              <Select
                defaultSelectedKeys={new Set([rolesWithEmail[0].key])}
                placeholder="Select role to login"
                onSelectionChange={(k) => {
                  const keys = [...k];
                  setEmail(keys[0]);
                }}
                items={rolesWithEmail}
              >
                {(item) => (
                  <SelectItem key={item.key} value={item.key} textValue={item.label}>{item.label}</SelectItem>
                )}
              </Select>
            </div>
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
