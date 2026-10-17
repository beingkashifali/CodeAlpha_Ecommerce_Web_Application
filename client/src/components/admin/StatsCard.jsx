const StatsCard = ({ label, value, icon: Icon, tone = "brand" }) => {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-700",
    sale: "bg-orange-50 text-sale",
    maroon: "bg-rose-50 text-maroon-600",
  };
  return (
    <div className="card flex items-center gap-4 p-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}
      >
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <div>
        <p className="text-xs text-brand-500">{label}</p>
        <p className="font-heading text-xl font-semibold text-brand-900">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
