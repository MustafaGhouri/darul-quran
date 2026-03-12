import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='h-screen w-screen bg-[#f6fbff] notfound '>
            <div className="h-full w-full flex flex-col px-4 justify-center items-center relative notfound-404">
                <h6 className='text-lg md:text-2xl font-medium text-fontColor font-poppins'>
                    Oops! Page not found
                </h6>
                <h1 className='text-xl tracking-[-18px]	text-center flex justify-start md:justify-center w-full md:text-9xl font-bold mt-1 text-fontColor poppins-bold'>
                    <span className=''>
                        4
                    </span>
                    <span>
                        0
                    </span>
                    <span>
                        4
                    </span>

                </h1>
                <p className='text-lg md:text-xl  text-center  font-normal text-fontColor font-poppins'>
                    we are sorry, but the page you requested was not found
                </p>
                <Link to={'/'} className='underline text-blue-700'>
                    click here to visit <strong>Home</strong>
                </Link>
            </div>
        </div>
    )
}

export default NotFound;