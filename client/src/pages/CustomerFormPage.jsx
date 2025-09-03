import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomerForm from "../components/CustomerForm";
import api from "../api";
import ErrorMessage from "../components/ErrorMessage";

function CustomerFormPage() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ hasError: false, message: "" });

  // Fetch customer data if editing
  useEffect(() => {
    const fetchExistingCustomer = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/customers/${id}`);
        const customer = response.data.data.customer;
        if (!customer) {
          setError({ hasError: true, message: "Customer not found." });
        } else {
          setError({ hasError: false, message: "" });
        }
        setFormData({
          first_name: customer.first_name || "",
          last_name: customer.last_name || "",
          email: customer.email || "",
          phone_number: customer.phone_number || "",
        });
      } catch (error) {
        console.log(error);
        setError({
          hasError: true,
          message: "Failed to load customer details.",
        });
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExistingCustomer();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error.hasError) return <ErrorMessage message={error.message} />;

  return (
    <div className="page">
      <div className="relative border border-gray-200 rounded-2xl max-w-3xl mt-12 shadow-sm">
        <div className="w-full px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {id ? "Edit" : "Add"} Customer
          </h2>
        </div>

        <CustomerForm
          id={id}
          formData={formData}
          setFormData={setFormData}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}

export default CustomerFormPage;
