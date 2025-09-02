import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomerPersonalDetails = ({ customer }) => {
  const navigate = useNavigate();
  const customerFields = [
    {
      label: "Full name",
      value: `${customer.first_name} ${customer.last_name}`,
    },
    { label: "Email", value: customer.email },
    { label: "Phone", value: customer.phone_number },
    {
      label: "Created at",
      value: customer.created_at
        ? format(new Date(customer.created_at), "MMM dd, yyyy, hh:mm a")
        : "-",
    },
    {
      label: "Updated at",
      value: customer.updated_at
        ? format(new Date(customer.updated_at), "MMM dd, yyyy, hh:mm a")
        : "-",
    },
    {
      label: "Single Address",
      value: customer.only_one_address ? "Yes" : "No",
    },
  ];

  return (
    <div className="border border-gray-200 rounded-2xl max-w-3xl mt-12 shadow-sm">
      <div className="w-full px-6 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Personal details</h2>
        <button
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full"
          onClick={() => navigate(`/customers/${customer.id}/edit`)}
        >
          <Pencil size={14} />
        </button>
      </div>

      {customerFields.map((field, idx) => (
        <div
          key={idx}
          className="flex px-6 py-3 border-b last:border-b-0 border-b-gray-200 text-sm md:text-base"
        >
          <span className="w-27 md:w-60 text-gray-500 font-medium">
            {field.label}:
          </span>
          <span className="font-medium break-words">{field.value || "-"}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomerPersonalDetails;
