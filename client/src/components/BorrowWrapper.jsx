import { useAuth } from "../context/AuthContext";
import BorrowDashboard from "./BorrowDashboard";
import UserBorrowDashboard from "./UserBorrowDashboard"; 
import SEO from "./SEO";

export default function BorrowWrapper() {
  const { user } = useAuth();
  const isManager = user?.role?.toLowerCase() === "manager";

  return (
    <>
      <SEO
        title="Borrow Components"
        description="Submit component borrow requests, review pending approvals, and manage checkout logs for the robotics lab."
        keywords="component borrow, hardware requests, borrow inventory, requests dashboard, checkout logs"
      />
      {isManager ? <BorrowDashboard /> : <UserBorrowDashboard />}
    </>
  );
}
