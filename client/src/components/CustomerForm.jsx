import { useNavigate } from "react-router-dom";
import api from "../api";

const CustomerForm = (props) => {
  const { id, formData, setFormData, setLoading } = props;
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fields = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "First Name",
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      placeholder: "Last Name",
    },
    { name: "email", label: "Email", type: "email", placeholder: "Email" },
    {
      name: "phone_number",
      label: "Phone",
      type: "tel",
      placeholder: "Phone Number",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (id) {
      await api.put(`/customers/${id}`, formData); // Edit existing customer
    } else {
      await api.post(`/customers`, formData); // Add new customer
    }

    setLoading(false);
    if (id) return navigate(`/customers/${id}`);
    navigate(`/customers`); // Go back to customer list
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
        {id ? "Update" : "Add"} Customer
      </button>
    </form>
  );
};

export default CustomerForm;
