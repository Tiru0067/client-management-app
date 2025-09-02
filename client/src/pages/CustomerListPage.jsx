import { Search, ListFilter, Plus } from "lucide-react";
import { useState } from "react";
import CustomerList from "../components/CustomerList";

const CustomerListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
  });

  return (
    <div className="page">
      {/* Heading */}
      <div>
        <h2 className="text-black text-xl font-semibold">
          Customer management
        </h2>
        <p className="text-gray-900 text-xs ">
          Manage your customers here and add new customers
        </p>
      </div>

      {/* Navbar */}
      <div className="relative mt-5 flex items-center justify-between">
        <h4 className="font-sans text-md text-black font-semibold">
          All <span className="max-sm:hidden">customers</span>{" "}
          <span className="text-gray-500 ml-2">{pagination.totalItems}</span>
        </h4>

        <div className="flex items-center gap-4">
          <form className="max-md:absolute left-0 top-full max-md:mt-2 border-2 border-gray-300 focus-within:border-black flex items-center rounded-md w-full">
            <Search size={18} className="ml-1 text-neutral-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="p-1.5 text-sm flex-1"
            />
          </form>

          {/* Filter button */}
          <button className="flex gap-1 items-center btn btn-outline group">
            <ListFilter
              size={18}
              className="text-neutral-500 group-hover:text-white transition-colors duration-500"
            />
            <span>Filter</span>
          </button>

          {/* Add Customer Button */}
          <button className="flex gap-1 items-center btn btn-solid">
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Customers list */}
      <CustomerList
        customers={customers}
        setCustomers={setCustomers}
        pagination={pagination}
        setPagination={setPagination}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default CustomerListPage;
