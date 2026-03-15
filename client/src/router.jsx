import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import AddComponent from "./pages/AddComponent";


const Dashboard = () => (
  <div className="p-6 bg-white rounded-lg border">Dashboard Metrics</div>
);
const Inventory = () => (
  <div className="p-6 bg-white rounded-lg border">Inventory Data Grid</div>
);
const Settings = () => (
  <div className="p-6 bg-white rounded-lg border">System Settings</div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "add-component",
        element: (
          <AddComponent isOpen={true} onClose={() => window.history.back()} />
        ),
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);
