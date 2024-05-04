
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from './Pages/ProductPage';
import NotFoundPage from './Pages/NotFoundPage';
import HomePage from './Pages/HomePage'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />}></Route>
        <Route path="/product" element={<ProductPage />}></Route>
        <Route element={<NotFoundPage />}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
