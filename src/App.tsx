import { RoleSelectPage } from "./pages/RoleSelectPage";
import { ChecklistPage } from "./pages/ChecklistPage";
import { useAppStore } from "./stores/useAppStore";

function App() {
  const { currentPage } = useAppStore();

  return (
    <div className="min-h-screen w-full bg-page">
      <main className="min-h-screen w-full">
        {currentPage === "role-select" ? (
          <RoleSelectPage />
        ) : (
          <ChecklistPage />
        )}
      </main>
    </div>
  );
}

export default App;
