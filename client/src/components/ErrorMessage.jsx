const ErrorMessage = ({ title = "Something went wrong", message }) => {
  return (
    <div className="p-5 text-center border border-red-300 bg-red-50 rounded-md">
      <h2 className="text-lg font-bold text-red-600">{title}</h2>
      <p className="text-sm text-gray-700 mt-2">{message}</p>
    </div>
  );
};

export default ErrorMessage;
