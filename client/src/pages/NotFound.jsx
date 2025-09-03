import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page w-screen h-[88vh] flex-center">
      <div className="text-center">
        <h1 className="text-lg text-black font-bold">
          This page couldn't be found
        </h1>
        <p className="text-sm text-gray-600 max-w-80">
          You may not have access, or it might have been deleted or moved. Check
          the link and try again.
        </p>
        <button className="mt-5 btn btn-solid" onClick={() => navigate("/")}>
          Back to Mage page
        </button>
      </div>
    </div>
  );
};

export default NotFound;
