import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddressItem = ({ address, index, customerId }) => {
  const navigate = useNavigate();
  const addrFields = [
    { label: "Address", value: address.address_details },
    { label: "City", value: address.city },
    { label: "State", value: address.state },
    { label: "Pin Code", value: address.pin_code },
  ];
  return (
    <div className="border border-gray-200 rounded-2xl max-w-3xl mt-4 shadow-sm">
      <div className="w-full px-6 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Address {index + 1}</h2>
        <button
          className="p-3 bg-gray-100 rounded-full"
          onClick={() =>
            navigate(`/customers/${customerId}/addresses/${address.id}`)
          }
        >
          <Pencil size={14} />
        </button>
      </div>
      {addrFields.map((field, idx) => (
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

export default AddressItem;
