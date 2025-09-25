import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx'
import React from 'react'
import ReactDom from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App> 
      <AppRoutes />
    </App>
  </BrowserRouter>
  
)
