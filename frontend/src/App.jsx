import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { PlacementProvider } from "./context/PlacementContext";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <PlacementProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PlacementProvider>
    </AuthProvider>
  );
}

export default App;
