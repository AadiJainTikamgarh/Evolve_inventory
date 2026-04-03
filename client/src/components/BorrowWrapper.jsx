import { useAuth } from "../context/AuthContext";
import BorrowDashboard from "./BorrowDashboard";
import UserBorrowDashboard from "./UserBorrowDashboard"; 

export default function BorrowWrapper() {
  const { user } = useAuth();

  if (user?.role?.toLowerCase() === "manager") {
    return <BorrowDashboard />;
  }

  return <UserBorrowDashboard />;
}
