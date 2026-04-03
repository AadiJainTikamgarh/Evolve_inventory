import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Package } from "lucide-react";

export default function BorrowDashboard() {
  const [requests, setRequests] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING");

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/v1/request/all");
      const json = await res.json();
      if (json.success !== false) {
        setRequests(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/v1/logs/all");
      const json = await res.json();
      if (json.success !== false) {
        setLogs(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (activeTab === "PROCESSED") {
      fetchLogs();
    }
  }, [activeTab]);

  const handleProcessRequest = async (req, status) => {
    try {
      const isReturn = req.type === "submit"; // Check if this is a return request

      // Route to the correct endpoint based on the request type
      const endpoint = isReturn
        ? `/api/v1/request/component-submit/${req._id}`
        : `/api/v1/request/component-request/${req._id}`;

      // Build the payload
      const payload = {
        status: status,
        remark: `Manager ${status} the request.`,
      };

      // If it's a return, the backend STRICTLY requires these extra fields
      if (isReturn) {
        payload.type = "submit";
        payload.component_working = req.quantity; // Assuming all returned items are working
        payload.component_not_working = 0; // Assuming 0 are broken
      }

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchRequests();
      } else {
        const err = await res.json();
        alert(`Failed to process: ${err.message}`);
      }
    } catch (err) {
      console.error("Processing error:", err);
    }
  };

  // Safe filter for pending requests
  const filteredRequests = requests.filter((req) => {
    return req.status?.toUpperCase() === "PENDING";
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#00C951] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="text-gray-200 font-sans max-w-7xl mx-auto px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
          Request Dashboard
        </h1>
        <p className="text-sm text-gray-400">
          Review and process component borrow and return requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "PENDING"
              ? "text-[#00C951]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Action Required
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
          Process History
          {activeTab === "PROCESSED" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-t-full" />
          )}
        </button>
      </div>

      {/* Request Table */}
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl overflow-x-auto shadow-sm custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="border-b border-gray-800 text-xs font-semibold text-white uppercase tracking-wider">
              <th className="p-4 pl-6">User</th>
              <th className="p-4">Component</th>
              <th className="p-4 text-center">Type</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4">User Remark</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {activeTab === "PENDING" ? (
              filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No pending requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-[#121212]/50 transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <div className="font-medium text-gray-200">
                        {req.user?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {req.user?.email || "No email"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#121212] rounded flex items-center justify-center shrink-0">
                          {req.component?.image ? (
                            <img
                              src={req.component.image}
                              alt="Component"
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <span className="font-medium text-sm text-gray-300">
                          {req.component?.name || "Deleted Component"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                          req.type === "request" // Database uses "request" for borrowing
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
                    <td className="p-4 text-sm text-gray-400 max-w-50 truncate">
                      {req.remark || "--"}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleProcessRequest(req, "approved")}
                          className="p-1.5 text-gray-400 hover:text-[#00C951] hover:bg-[#00C951]/10 rounded transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleProcessRequest(req, "rejected")}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No history found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log._id}
                  className="hover:bg-[#121212]/50 transition-colors opacity-70"
                >
                  <td className="p-4 pl-6">
                    <div className="font-medium text-gray-200">
                      {log.user?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.user?.email || "No email"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm text-gray-300">
                        {log.component?.name || "Deleted Component"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider bg-gray-800 text-gray-400">
                      LOG
                    </span>
                  </td>
                  <td className="p-4 text-center font-semibold text-gray-200">
                    {log.quantity}
                  </td>
                  <td
                    className="p-4 text-sm text-gray-400 max-w-[250px] truncate"
                    title={log.remark}
                  >
                    {log.remark || "--"}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <span
                      className={`text-xs font-medium ${
                        log.remark?.toLowerCase().includes("approved") ||
                        log.remark?.toLowerCase().includes("accepted")
                          ? "text-[#00C951]"
                          : "text-red-500"
                      }`}
                    >
                      {log.remark?.toLowerCase().includes("approved") ||
                      log.remark?.toLowerCase().includes("accepted")
                        ? "APPROVED"
                        : "REJECTED"}
                    </span>
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
