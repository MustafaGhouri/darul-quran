import React, { useEffect, useState } from "react";
import AddUserForm from "../../../../components/dashboard-components/forms/add-user-form";

const EditUser = () => {
  const id = window.location.pathname.split("/")[4];
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
    console.log("ID:", id);
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/admin/userByID/${id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        setUserData(data.user); // ya data.users (API structure par depend karta hai)
        console.log("Fetched user:", data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, [id]);

  return (
    <div>
      <AddUserForm
        id={id}
        title="Edit User"
        desc="Update the user information by modifying the fields below."
        isEdit={true}
        userData={userData}
        // userData={userData}   {/* 👈 API response yahan bheja */}
      />
    </div>
  );
};

export default EditUser;
