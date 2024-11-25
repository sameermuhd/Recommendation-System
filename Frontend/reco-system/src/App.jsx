
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProductPage from './Pages/ProductPage';
import NotFoundPage from './Pages/NotFoundPage';
import ProductsCollectionPage from './Pages/ProductsCollectionPage'
import HomePage from './Pages/HomePage';
import RegistrationForm from './Pages/RegistrationForm';
import LoginPage from './Pages/LoginPage';
import { getSession } from './utils/SessionUtils';

<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet"></link>

function App() {
  const isLoggedIn = !!getSession(); // Check if session exists

  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />}></Route>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/getUserInfo"
          element={<RegistrationForm />}
        />
        <Route path="/productsCollection" element={<ProductsCollectionPage />}></Route>
        <Route path="/product" element={<ProductPage />}></Route>
        <Route element={<NotFoundPage />}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
