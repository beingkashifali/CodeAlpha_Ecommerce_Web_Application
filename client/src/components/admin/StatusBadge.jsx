const orderStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-rose-50 text-rose-700 border-rose-200",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
      orderStyles[status] || "bg-brand-50 text-brand-700 border-brand-200"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;
