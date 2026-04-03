import { useState } from "react";
import { X, AlertTriangle, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function BorrowModal({ isOpen, onClose, component, onSuccess }) {
  const [formData, setFormData] = useState({
    type: "BORROW",
    quantity: 1,
    remark: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !component) return null;


  const maxAvailable =
    formData.type === "BORROW"
      ? component.component_working
      : component.component_in_use;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.quantity > maxAvailable) {
      setError(`Quantity exceeds maximum allowed (${maxAvailable}).`);
      setLoading(false);
      return;
    }

    const backendType = formData.type === "BORROW" ? "request" : "submit";

    try {
      const res = await fetch("/api/v1/request/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentId: component._id,
          type: backendType, 
          quantity: Number(formData.quantity),
          remark: formData.remark,
        }),
      });

      const json = await res.json();

      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Failed to submit request");
      }

      onSuccess?.();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ type: "BORROW", quantity: 1, remark: "" });
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center bg-[#121212]/50">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Component Request
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[250px]">
              {component.name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-5 flex flex-col gap-5 overflow-y-auto custom-scrollbar"
        >
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector Toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Request Type
            </label>
            <div className="flex bg-[#121212] p-1 rounded-lg border border-gray-800">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, type: "BORROW", quantity: 1 })
                }
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  formData.type === "BORROW"
                    ? "bg-[#00C951]/10 text-[#00C951] border border-[#00C951]/20 shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                Borrow
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, type: "SUBMIT", quantity: 1 })
                }
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  formData.type === "SUBMIT"
                    ? "bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                Return
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-xs text-gray-400">Quantity</label>
              <span
                className={`text-[10px] ${maxAvailable === 0 ? "text-red-500 font-medium" : "text-gray-500"}`}
              >
                Max available: {maxAvailable}
              </span>
            </div>
            <input
              type="number"
              min="1"
              max={maxAvailable || 1}
              required
              disabled={maxAvailable === 0}
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 text-white focus:border-[#00C951] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            />
          </div>

          {/* Remark Input */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Project / Reason
            </label>
            <textarea
              rows="3"
              required
              value={formData.remark}
              onChange={(e) =>
                setFormData({ ...formData, remark: e.target.value })
              }
              className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 text-white focus:border-[#00C951] outline-none transition-all resize-none text-sm placeholder-gray-600"
              placeholder={
                formData.type === "BORROW"
                  ? "What project is this for?"
                  : "Condition of returned items?"
              }
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || maxAvailable === 0}
              className="w-full py-2.5 text-sm bg-[#00C951] text-black font-semibold rounded-lg hover:bg-[#00b348] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading
                ? "Submitting..."
                : `Submit ${formData.type.toLowerCase()} request`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
