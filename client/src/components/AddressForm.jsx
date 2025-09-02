import { useNavigate } from "react-router-dom";
import api from "../api";

const AddressForm = (props) => {
  const { id, addressId, formData, setFormData, setLoading } = props;
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fields = [
    {
      name: "address_details",
      label: "Address",
      type: "text",
      placeholder: "Enter your address here",
    },
    { name: "city", label: "City", type: "text", placeholder: "City name" },
    { name: "state", label: "State", type: "text", placeholder: "State name" },
    {
      name: "pin_code",
      label: "Pincode",
      type: "text",
      placeholder: "Pincode",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (addressId) {
        await api.put(`/addresses/${addressId}`, formData); // Edit existing Address
      } else {
        await api.post(`/customers/${id}/addresses`, formData); // Add new Address
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    return navigate(`/customers/${id}`); // Go back to customer list
  };

  return (
    <form onSubmit={handleSubmit} className="">
      {fields.map((field) => (
        <div
          key={field.name}
          className="px-6 py-3 flex items-center border-b last:border-b-0 border-b-gray-200 text-sm md:text-base"
        >
          <label className="w-27 md:w-60 text-gray-500 font-medium">
            {field.label}:
          </label>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            className="font-medium bg-gray-100 w-full px-4 py-2 focus:ring-2 focus:border-black rounded-md"
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-black hover:bg-black/80 text-white font-medium py-2 px-4 rounded-lg transition absolute top-full mt-5 focus:ring-2 focus:border-black max-md:w-full"
      >
        {addressId ? "Update" : "Add"} Address
      </button>
    </form>
  );
};

export default AddressForm;
