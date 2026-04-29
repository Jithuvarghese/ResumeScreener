import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { ResultsPage } from './pages/ResultsPage.jsx';
import { UploadPage } from './pages/UploadPage.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-ink">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl gap-0 lg:px-4">
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </div>
  );
}