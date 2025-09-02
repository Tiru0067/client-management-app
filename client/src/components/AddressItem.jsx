import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import api from "../api";

const AddressItem = ({ address, index, customerId, setCustomer }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const addrFields = [
    { label: "Address", value: address.address_details },
    { label: "City", value: address.city },
    { label: "State", value: address.state },
    { label: "Pin Code", value: address.pin_code },
  ];

  const onDelete = async () => {
    try {
      await api.delete(`/addresses/${address.id}`);
      setCustomer((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((a) => a.id !== address.id),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl max-w-3xl mt-4 shadow-sm">
      <div className="w-full px-6 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Address {index + 1}</h2>
        <div>
          <button
            className="p-3 mr-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            onClick={() =>
              navigate(`/customers/${customerId}/addresses/${address.id}`)
            }
          >
            <Pencil size={14} />
          </button>
          <button
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full"
            onClick={() => setModalOpen(true)}
          >
            <Trash2 size={14} color="red" />
          </button>
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={() => onDelete(customerId)}
            title="Delete Customer"
            message={`Are you sure you want to delete address`}
            confirmText="Delete"
            cancelText="Cancel"
          />
        </div>
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
