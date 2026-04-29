import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar.jsx';
import { ResultsPage } from './pages/ResultsPage.jsx';
import { UploadPage } from './pages/UploadPage.jsx';
import { ChatPage } from './pages/ChatPage.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-ink">
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-73px)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadPage />} />
            <Route path="/chat" element={<ChatPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/upload" replace />} />
        </Routes>
      </main>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </div>
  );
}