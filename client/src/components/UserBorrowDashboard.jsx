import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function UserBorrowDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [logs, setLogs] = useState([]);

  const fetchUserRequests = async () => {
    try {
      const res = await fetch("/api/v1/request/user");
      const json = await res.json();
      if (json.success !== false) {
        const sortedData = (json.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setRequests(sortedData);
      }
    } catch (err) {
      console.error("Failed to fetch user requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const status = req.status?.toUpperCase() || "";
    if (activeTab === "PENDING") return status === "PENDING";
    return status !== "PENDING";
  });

  const fetchUserLogs = async () => {
    try {
      const res = await fetch("/api/v1/logs/user");
      const json = await res.json();
      if (json.success !== false) setLogs(json.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  useEffect(() => {
    if (activeTab === "PROCESSED") fetchUserLogs();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#00C951] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="text-gray-200 font-sans max-w-7xl mx-auto px-2 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
          My Requests
        </h1>
        <p className="text-sm text-gray-400">
          Track the status of your borrow and return requests.
        </p>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "PENDING"
              ? "text-[#00C951]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Pending
          {activeTab === "PENDING" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00C951] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("PROCESSED")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "PROCESSED"
              ? "text-white"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          History
          {activeTab === "PROCESSED" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-t-full" />
          )}
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl overflow-x-auto shadow-sm custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-800 text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider">
              <th className="p-4 pl-6 whitespace-nowrap">Component</th>
              <th className="p-4 text-center whitespace-nowrap">Type</th>
              <th className="p-4 text-center whitespace-nowrap">Qty</th>
              <th className="p-4 whitespace-nowrap">My Remark</th>
              <th className="p-4 pr-6 text-right whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {activeTab === "PENDING" ? (
              filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-500 text-sm"
                  >
                    You have no pending requests.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-[#121212]/50 transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#121212] rounded flex items-center justify-center shrink-0 overflow-hidden">
                          {req.component?.image ? (
                            <img
                              src={req.component.image}
                              className="w-full h-full object-cover"
                              alt="Component"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <span className="font-medium text-sm text-gray-300">
                          {req.component?.name || "Unknown Component"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                          req.type === "request" // Assuming database uses 'request'
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                            : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                        }`}
                      >
                        {req.type === "request" ? "BORROW" : "RETURN"}
                      </span>
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-200">
                      {req.quantity}
                    </td>
                    <td className="p-4 text-xs sm:text-sm text-gray-400 max-w-[200px] truncate">
                      {req.remark || "--"}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {req.status?.toUpperCase() === "PENDING" && (
                        <span className="flex items-center justify-end gap-1.5 text-yellow-500 text-xs font-medium">
                          <Clock className="w-4 h-4" /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No history found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log._id}
                  className="hover:bg-[#121212]/50 transition-colors"
                >
                  <td className="p-4 pl-6">
                    <span className="font-medium text-sm text-gray-300">
                      {log.component?.name || "Unknown Component"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider bg-gray-800 text-gray-400">
                      PROCESSED
                    </span>
                  </td>
                  <td className="p-4 text-center font-semibold text-gray-200">
                    {log.quantity}
                  </td>
                  <td
                    className="p-4 text-xs sm:text-sm text-gray-400 max-w-[200px] truncate"
                    title={log.remark}
                  >
                    {log.remark || "--"}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {log.remark?.toLowerCase().includes("approved") ||
                    log.remark?.toLowerCase().includes("accepted") ? (
                      <span className="flex items-center justify-end gap-1.5 text-[#00C951] text-xs font-medium">
                        <CheckCircle className="w-4 h-4" /> Approved
                      </span>
                    ) : (
                      <span className="flex items-center justify-end gap-1.5 text-red-500 text-xs font-medium">
                        <XCircle className="w-4 h-4" /> Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
