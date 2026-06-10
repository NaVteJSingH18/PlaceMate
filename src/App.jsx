import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { PlacementProvider } from "./context/PlacementContext";

function App() {
  return (
    <PlacementProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PlacementProvider>
  );
}

export default App;
