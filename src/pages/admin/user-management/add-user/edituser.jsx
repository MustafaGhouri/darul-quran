import { useEffect, useState } from "react";
import AddUserForm from "../../../../components/dashboard-components/forms/add-user-form";
import { useLocation, useParams } from "react-router-dom";
import { FormOverlayLoader } from "../../../../components/Loader";

const EditUser = () => {
  const { id } = useParams();
  const location = useLocation();
  const userDataFromState = location.state || {};
  const [userData, setUserData] = useState(userDataFromState);
  const [loading, setLoading] = useState(!userDataFromState?.id);

  useEffect(() => {
    if (id && userDataFromState?.id) {
      return;
    }
    if (!id) {
      return;
    }
    console.log(id);
    
    const fetchUserById = async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/user/userByID/${id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await res.json();
        setUserData(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, [id]);

  if (loading) return <FormOverlayLoader loading={loading} />;
  return (
    <>
      <div>
        <AddUserForm
          id={id}
          title="Edit User"
          desc="Update the user information by modifying the fields below."
          isEdit={true}
          userData={userData}
        />
      </div>
    </>
  );
};

export default EditUser;
