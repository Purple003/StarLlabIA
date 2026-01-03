import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { AnalysisService } from "./pages/AnalysisService";
import { DatasetService } from "./pages/DatasetService";
import { ReportService } from "./pages/ReportService";
import { MinIOManager } from "./pages/MinIOManager";
import { KafkaEvents } from "./pages/KafkaEvents";
import { Settings } from "./pages/Settings";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        // const data = await response.json(); // Use if token is needed
        setIsAuthenticated(true);
        setCurrentPage("dashboard");
      } else {
        alert("Identifiants incorrects");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert("Erreur de connexion au serveur");
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, role: "USER" }),
      });

      if (response.ok) {
        alert("Compte créé avec succès ! Connectez-vous.");
      } else {
        alert("Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      alert("Erreur de connexion au serveur");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Si non authentifié, afficher la page d'authentification
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
  }

  // Rendu de la page actuelle
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "analysis":
        return <AnalysisService />;
      case "dataset":
        return <DatasetService />;
      case "report":
        return <ReportService />;
      case "minio":
        return <MinIOManager />;
      case "kafka":
        return <KafkaEvents />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`w-64 fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userName="Admin User"
        />
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
