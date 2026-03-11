import { RoleSelectPage } from "./pages/RoleSelectPage";
import { ChecklistPage } from "./pages/ChecklistPage";
import { useAppStore } from "./stores/useAppStore";

function App() {
  const { currentPage } = useAppStore();

  return (
    <div className="min-h-screen bg-page">
      {currentPage === "role-select" ? (
        <RoleSelectPage />
      ) : (
        <ChecklistPage />
      )}
    </div>
  );
}

export default App;
