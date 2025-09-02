import { format } from "date-fns";
import { CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TableRow = ({ customer }) => {
  const navigate = useNavigate();
  const {
    id,
    first_name: firstName,
    last_name: lastName,
    email,
    phone_number: phone,
    created_at: createdAt,
    updated_at: updatedAt,
    only_one_address: onlyOneAddress,
  } = customer;

  const hasOnlyOneAddress = onlyOneAddress === 0 ? "True" : "False";

  return (
    <tr>
      <td>
        <button
          onClick={() => navigate(`/customers/${id}`)}
          className="flex flex-row items-center gap-1.5 cursor-pointer"
        >
          <div className="p-2 bg-gray-200 rounded-full max-md:hidden">
            <CircleUser />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-black font-medium">{`${firstName}  ${lastName}`}</span>
            <span className="max-md:hidden">{email}</span>
          </div>
        </button>
      </td>
      <td className="max-md:hidden">{phone}</td>
      <td>{format(updatedAt, "MMM d, yyyy")}</td>
      <td>{format(createdAt, "MMM d, yyyy")}</td>
      <td className="max-md:hidden">{hasOnlyOneAddress}</td>
    </tr>
  );
};

export default TableRow;
