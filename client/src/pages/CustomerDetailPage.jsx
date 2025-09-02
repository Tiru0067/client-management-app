import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { CircleUser } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomerPersonalDetails from "../components/CustomerPersonalDetails";
import AddressList from "../components/AddressList";

const CustomerDetailPage = () => {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({});
  const { id } = useParams();
  const customerId = Number(id);
  const addresses = customer.addresses || [];

  useEffect(() => {
    let isMounted = true;

    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://192.168.1.8:3000/api/customers/${customerId}`
        );
        const data = response.data.data.customer;
        setCustomer(data);
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, 500);
      }
    };
    fetchCustomerDetails();

    return () => {
      isMounted = false;
    };
  }, [customerId]);

  return (
    <>
      {loading ? (
        <LoadingSpinner loading={loading} />
      ) : (
        <div className="page">
          {/* Head section */}
          <div>
            <div className="w-25 h-25 flex-center bg-gray-200 rounded-full">
              <CircleUser size={60} />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl text-black font-medium mt-3">{`${
                customer?.first_name ?? ""
              }  ${customer?.last_name ?? ""}`}</h3>
              <p className="text-sm text-gray-800">{customer?.email ?? ""}</p>
            </div>
          </div>

          {/* Personal Details  */}
          <CustomerPersonalDetails customer={customer} />

          {/* Addresses */}
          <AddressList addresses={addresses} customerId={customerId} />
        </div>
      )}
    </>
  );
};

export default CustomerDetailPage;
