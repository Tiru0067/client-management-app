import { Search, ListFilter, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerList from "../components/CustomerList";
import FiltersControlUi from "../components/FiltersControlUi";

const CustomerListPage = () => {
  const initialFilters = {
    limit: 20,
    sortBy: "id",
    sortOrder: "ASC",
    onlyOneAddress: "all",
  };

  // Load saved filters from localStorage if available
  const savedFilters =
    JSON.parse(localStorage.getItem("customerFilters")) || initialFilters;

  const [filters, setFilters] = useState(savedFilters);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalItems: 0,
    totalPages: 0,
  });

  const goToPage = (p) => {
    if (p < 1 || p > pagination.totalPages) return; // prevent invalid page
    setPagination((prev) => ({ ...prev, page: p }));
  };

  const pages = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    pages.push(i);
  }

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
          <div className="relative">
            <button
              className="flex gap-1 items-center btn btn-outline group"
              onClick={() => setShowFilters(!showFilters)}
            >
              <ListFilter
                size={18}
                className="text-neutral-500 group-hover:text-white transition-colors duration-500"
              />
              <span>Filter</span>
            </button>
            {/* Filters */}
            {showFilters && (
              <FiltersControlUi
                filters={filters}
                setFilters={setFilters}
                initialFilters={initialFilters}
                onClose={() => setShowFilters(false)}
              />
            )}
          </div>

          {/* Add Customer Button */}
          <button
            className="flex gap-1 items-center btn btn-solid"
            onClick={() => navigate(`/customers/new`)}
          >
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
        filters={filters}
        setFilters={setFilters}
        setPagination={setPagination}
        searchQuery={searchQuery}
      />

      {/* Pagination */}
      <div className="my-10 w-full flex-center">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`text-gray-800 text-sm px-3.5 py-2 rounded-md ${
              pagination.page === p ? "bg-gray-100" : ""
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerListPage;
