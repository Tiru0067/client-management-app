import React from "react";

const AddressItem = ({ address, index }) => {
  const addrFields = [
    { label: "Address", value: address.address_details },
    { label: "City", value: address.city },
    { label: "State", value: address.state },
    { label: "Pin Code", value: address.pin_code },
  ];
  return (
    <div className="border border-gray-200 rounded-2xl max-w-3xl mt-4 shadow-sm">
      <div className="w-full px-6 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Address {index + 1}</h2>
      </div>
      {addrFields.map((field, idx) => (
        <div
          key={idx}
          className="flex px-6 py-3 border-b border-b-gray-200 text-sm md:text-base"
        >
          <span className="w-27 md:w-60 text-gray-500 font-medium">
            {field.label}:
          </span>
          c<span className="font-medium break-words">{field.value || "-"}</span>
        </div>
      ))}
    </div>
  );
};

export default AddressItem;
