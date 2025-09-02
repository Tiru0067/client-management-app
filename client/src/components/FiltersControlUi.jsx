const FiltersControlUi = ({ filters, setFilters, initialFilters }) => {
  const filterFileds = [
    {
      label: "Sort by",
      type: "sortBy",
      values: ["id", "first_name", "last_name", "phone_number"],
      displayValues: ["ID", "First Name", "Last Name", "Phone"],
    },
    {
      label: "Sort order",
      type: "sortOrder",
      values: ["ASC", "DESC"],
      displayValues: ["ASC", "DESC"],
    },
    {
      label: "Page limit",
      type: "limit",
      values: [10, 20, 30, 40, 50],
      displayValues: [10, 20, 30, 40, 50],
    },
    {
      label: "Only One Adresses",
      type: "onlyOneAddress",
      values: ["all", "yes", "no"],
      displayValues: ["All", "Yes", "No"],
    },
  ];
  return (
    <div className="absolute top-full right-0 mt-5 z-10 bg-white shadow-md p-5 rounded-md border border-gray-200">
      <h3 className="text-lg font-medium text-black mb-2">Filters</h3>
      <div className="flex flex-col">
        {filterFileds.map((filter) => (
          <div key={filter.type} className="flex flex-col my-2">
            <label className="text-sm font-base text-gray-600 mb-1 whitespace-nowrap">
              {filter.label}
            </label>
            <select
              value={filters[filter.type]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  [filter.type]:
                    filter.type === "limit" ? +e.target.value : e.target.value,
                }))
              }
              className="border px-2 py-1 rounded border-gray-300 text-sm text-black"
            >
              {filter.values.map((val, i) => (
                <option key={i} value={val}>
                  {filter.displayValues[i] || val}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button
        className="btn btn-solid py-4 hover:bg-black/80"
        onClick={() => setFilters(initialFilters)}
      >
        Clear
      </button>
    </div>
  );
};

export default FiltersControlUi;
