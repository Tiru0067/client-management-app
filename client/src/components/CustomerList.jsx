import axios from "axios";
import { useEffect, useState } from "react";
import CustomerTableRow from "./CustomerTableRow";
import LoadingSpinner from "../components/LoadingSpinner";

const CustomerList = (props) => {
  const [loading, setLoading] = useState(false);
  const { customers, setCustomers, pagination, setPagination, searchQuery } =
    props;

  useEffect(() => {
    let isMounted = true;

    const fetchCustomersData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://192.168.1.8:3000/api/customers?page=${pagination.page}&limit=${pagination.limit}&search=${searchQuery}`
        );
        const { customers, page, limit, totalPages, totalItems } =
          response.data.data;
        setCustomers(customers);
        setPagination({ page, limit, totalItems, totalPages });
      } catch (err) {
        console.log(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCustomersData();

    return () => {
      isMounted = false;
    };
  }, [
    pagination.page,
    pagination.limit,
    searchQuery,
    setCustomers,
    setPagination,
  ]);

  const ths = document.querySelectorAll("thead th");
  ths.forEach((th) =>
    th.classList.remove(
      "rounded-tl-md",
      "rounded-tr-md",
      "rounded-bl-md",
      "rounded-br-md"
    )
  );

  const visibleThs = Array.from(ths).filter((th) => th.offsetParent !== null); // only visible
  if (visibleThs.length > 0) {
    visibleThs[0].classList.add("rounded-tl-md", "rounded-bl-md", "pl-5"); // first visible
    visibleThs[visibleThs.length - 1].classList.add(
      "rounded-tr-md",
      "rounded-br-md"
    ); // last visible
  }

  return (
    <div className="mt-15 md:mt-5">
      {/* Customers list table */}
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 sticky top-0">
            <th>Name</th>
            <th className="max-md:hidden">Phone</th>
            <th>Updated</th>
            <th>Created</th>
            <th className="max-md:hidden">Single Addr</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            customers.map((customer) => (
              <CustomerTableRow key={customer.id} customer={customer} />
            ))}
        </tbody>
      </table>
      {loading && <LoadingSpinner loading={loading} />}
    </div>
  );
};

export default CustomerList;
