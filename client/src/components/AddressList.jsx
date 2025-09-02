import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddressItem from "./AddressItem";

const AddressList = ({ addresses, customerId }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mt-12 px-2 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <button
          className="flex gap-1 items-center btn btn-solid"
          onClick={() => navigate(`/customers/${customerId}/addresses/new`)}
        >
          <Plus size={18} />
          <span>Add</span>
        </button>
      </div>

      {addresses.length !== 0 ? (
        addresses.map((address, index) => (
          <AddressItem
            key={address.id}
            address={address}
            index={index}
            customerId={customerId}
          />
        ))
      ) : (
        <div className="px-6 py-3 ">
          <h2 className="text-lg font-semibold mt-12">Address</h2>
          <p className="text-gray-500">No addresses available</p>
        </div>
      )}
    </div>
  );
};

export default AddressList;
