import { Button } from '@heroui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const router = useNavigate();
    return (
        <div>
            <Button onPress={()=>router('/login')}>
                Login
            </Button>
              <Button onPress={()=>router('/admin/dashboard')}>
                Admin Dashboard
            </Button>
        </div>
    )
}

export default Home
