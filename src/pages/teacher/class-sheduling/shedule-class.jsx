import React from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";

const SheduleClass = () => {
  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      <DashHeading
        title={"Today, January 15"}
        desc={"You have 3 classes scheduled today"}
      />
    </div>
  );
};

export default SheduleClass;
