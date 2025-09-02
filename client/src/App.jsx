import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import CustomerListPage from "./pages/CustomerListPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import CustomerFormPage from "./pages/CustomerFormPage";
import AddressFormPage from "./pages/AddressFormPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/customers" />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/new" element={<CustomerFormPage />} />
        <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
        <Route
          path="/customers/:id/addresses/:addressId"
          element={<AddressFormPage />}
        />
        <Route
          path="/customers/:id/addresses/new"
          element={<AddressFormPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
