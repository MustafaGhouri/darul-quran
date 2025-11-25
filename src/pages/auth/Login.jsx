import { Button, Input } from "@heroui/react";


const Login = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <main className='flex flex-col lg:flex-row w-full min-h-screen'>
            <div className='lg:h-screen w-full lg:max-w-[400px] xl:max-w-[500px] p-6 lg:p-8 flex flex-col items-center justify-between bg-linear-to-bl from-[#06574C] via-[#06574C] to-[#D4C4B0] relative overflow-hidden max-lg:hidden'>


                <img src="/icons/logo.png" alt="Darul Quran" className=' w-56 h-56' />

                <div className='space-y-4 lg:space-y-6 text-white text-center lg:text-left'>
                    <p className='text-sm lg:text-base'>Join 10,000+ other teachers & Students Here</p>
                    <img src="/icons/teachers.png" alt="teachers" className='h-12' />
                    <h1 className='text-2xl lg:text-3xl font-semibold'>Don't Forget to Check Your Statistics</h1>
                    <p className='text-sm lg:text-base leading-relaxed'>Keep an eye on your teaching insights to improve student learning experiences.</p>
                </div>
            </div>

            <div className='flex-1 flex flex-col items-start justify-center bg-[#E9E0D6] px-6 sm:px-12 md:px-16 lg:px-24 py-8 lg:py-0 m-0 lg:m-4'>
                <div className='w-full max-w-2xl mx-auto lg:mx-0'>
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-[#3F3F44] leading-tight mb-6 lg:mb-8'>
                        Hi, <strong>Welcome</strong> <br />
                        Ready to begin your <span className='text-[#95C4BE]'>classes</span> for today
                    </h1>

                    <form className='w-full space-y-5 lg:space-y-6'>
                        <div className='w-full space-y-2'>
                            <p className='text-sm lg:text-base text-[#3F3F44]'>
                                Your email or phone number
                            </p>
                            <Input
                                className='rounded-md'
                                placeholder="youremail@guru.com"
                                type="email"
                            />
                        </div>

                        <div className='w-full space-y-2'>
                            <div className='flex justify-between items-center text-sm lg:text-base'>
                                <p className='text-[#3F3F44]'>Password</p>
                                <p className=' cursor-pointer hover:underline'>Forget Password?</p>
                            </div>
                            <Input
                                className='rounded-md'
                                placeholder="Enter your password"
                                type="password"
                            />
                        </div>

                        <Button
                            onPress={handleSubmit}
                            className='w-full text-center text-white rounded-md py-3 bg-[#06574C]'
                        >
                            Login
                        </Button>

                        <div className='text-center text-sm lg:text-base mb-4 text-[#3F3F44]'>Or</div>

                    </form>
                    <Button className='w-full text-center bg-white rounded-md py-3 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2'>
                        <img src="/icons/google.png" className='w-6 h-6' alt="" />
                        <span className='text-sm lg:text-base'>Sign in with Google</span>
                    </Button>
                </div>
            </div>
        </main>
    )
}

export default Login;