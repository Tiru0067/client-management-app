import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import AddressForm from "../components/AddressForm";
import api from "../api";

function AddressFormPage() {
  const { id, addressId } = useParams();

  const [formData, setFormData] = useState({
    address_details: "",
    city: "",
    state: "",
    pin_code: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch customer data if editing
  useEffect(() => {
    const fetchExistingCustomerAddress = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/customers/${id}/addresses`);
        const addresses = response.data.data.addresses;
        const address = addresses.filter(
          (obj) => obj.id === Number(addressId)
        )[0];

        setFormData({
          address_details: address.address_details || "",
          city: address.city || "",
          state: address.state || "",
          pin_code: address.pin_code || "",
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    if (addressId) fetchExistingCustomerAddress();
  }, [id, addressId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <div className="relative border border-gray-200 rounded-2xl max-w-3xl mt-12 shadow-sm">
        <div className="w-full px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {addressId ? "Edit" : "Add"} Address
          </h2>
        </div>

        <AddressForm
          id={id}
          addressId={addressId}
          formData={formData}
          setFormData={setFormData}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}

export default AddressFormPage;
