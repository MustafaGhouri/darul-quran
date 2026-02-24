import React from 'react'
import { PlusIcon } from 'lucide-react'
const SupportTicketsTeacher = () => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Support Tickets</h2>
                <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5" />
                    New Ticket
                </button>
            </div>

        </div>
    )
}

export default SupportTicketsTeacher