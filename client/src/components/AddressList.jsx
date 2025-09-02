import AddressItem from "./AddressItem";

const AddressList = ({ addresses }) => {
  return (
    <div>
      {addresses.length > 1 && (
        <h2 className="text-lg font-semibold mt-12">Addresses</h2>
      )}

      {addresses.length !== 0 ? (
        addresses.map((address, index) => (
          <AddressItem key={address.id} address={address} index={index} />
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
