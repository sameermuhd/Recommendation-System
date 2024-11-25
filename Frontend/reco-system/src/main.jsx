import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import CustomAlertProvider from './Components/CustomAlert.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CustomAlertProvider>
      <App />
  </CustomAlertProvider>
)
