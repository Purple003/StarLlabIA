import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/screens/Dashboard';
import { Import } from './components/screens/Import';
import { CleaningReport } from './components/screens/CleaningReport';
import { Preprocessing } from './components/screens/Preprocessing';
import { AnalysisRecommendation } from './components/screens/AnalysisRecommendation';
import { Results } from './components/screens/Results';
import { Visualization } from './components/screens/Visualization';
import { Export } from './components/screens/Export';
import { Documentation } from './components/screens/Documentation';
import { Settings } from './components/screens/Settings';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [activeScreen, setActiveScreen] = useState('dashboard');

  useEffect(() => {
    // Check local storage for auth state on mount
    const storedAuth = localStorage.getItem('statlabai_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('statlabai_auth', 'true');
    setIsAuthenticated(true);
    setActiveScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('statlabai_auth');
    setIsAuthenticated(false);
    setAuthScreen('login');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveScreen} />;
      case 'import':
        return <Import />;
      case 'cleaning':
        return <CleaningReport />;
      case 'preprocessing':
        return <Preprocessing />;
      case 'recommendation':
        return <AnalysisRecommendation onNavigate={setActiveScreen} />;
      case 'results':
        return <Results onNavigate={setActiveScreen} />;
      case 'visualization':
        return <Visualization />;
      case 'export':
        return <Export />;
      case 'documentation':
        return <Documentation />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveScreen} />;
    }
  };

  if (!isAuthenticated) {
    if (authScreen === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onNavigateToRegister={() => setAuthScreen('register')}
        />
      );
    } else {
      return (
        <Register
          onRegister={handleLogin}
          onNavigateToLogin={() => setAuthScreen('login')}
        />
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-[color:var(--color-bg-secondary)]">
      <Sidebar
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}
