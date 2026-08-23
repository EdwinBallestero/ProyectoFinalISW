import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import { EditEventPage } from './pages/Events/EditEventPage';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/Events/EventsPage';
import { EventDetailPage } from './pages/Events/EventDetailPage';
import { CreateEventPage } from './pages/Events/CreateEventPage';
import { RegistrationPage } from './pages/Registration/RegistrationPage';
import NotFoundPage from './pages/NotFoundPage';
import { LoginPage } from './pages/Login/LoginPage';
import { UsersPage } from './pages/Login/Users/UsersPage';
import { isAuthenticated } from './services/loginService/loginService';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute() {
  const location = useLocation();
  return isAuthenticated() ? <App /> : <Navigate to="/login" replace state={{ from: location }} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<UsersPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/create" element={<CreateEventPage />} />
          <Route path="/events/:id/edit" element={<EditEventPage />} />
          <Route path="/registrations" element={<RegistrationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

