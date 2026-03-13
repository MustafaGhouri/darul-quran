import { FaUser, FaBell, FaDollarSign } from "react-icons/fa";
import { FaBook, FaHouse } from "react-icons/fa6";
import { RiAlertFill, RiRefund2Fill } from "react-icons/ri";

const NotificationType = ({ type }) => {
    const typeConfig = {
        property: { icon: <FaHouse color="white" size={28} />, bg: "bg-[#ADC8B9]" },
        booking: { icon: <FaBook color="white" size={28} />, bg: "bg-[#F7E2C0]" },
        message: { icon: <RiAlertFill color="white" size={28} />, bg: "bg-[#ED5B75]" },
        payment: { icon: <FaDollarSign color="white" size={28} />, bg: "bg-[#406c65]" },
        refund_request: { icon: <RiRefund2Fill  color="white" size={28} />, bg: "bg-[#EB8B3E]" },
        refund_processed: { icon: <RiRefund2Fill  color="white" size={28} />, bg: "bg-[#4872a1]" },
        refund_rejected: { icon: <RiRefund2Fill  color="white" size={28} />, bg: "bg-[#ED5B75]" },
        refund_approved: { icon: <RiRefund2Fill  color="white" size={28} />, bg: "bg-[#54A66E]" },
        host: { icon: <FaUser color="white" size={28} />, bg: "bg-[#F7E2C0]" }
    };

    // Default fallback if type doesn't exist
    const defaultConfig = { icon: <FaBell color="white" size={28} />, bg: "bg-gray-400" };
    return (
        <span
            className={`p-5  rounded-md ${typeConfig[type]?.bg ?? defaultConfig.bg
                }`}
        >
            {typeConfig[type]?.icon ?? defaultConfig.icon}
        </span>
    )
}

export default NotificationType

