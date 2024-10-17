import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './router/index';
import { RouterProvider } from "react-router-dom";

import '@/assets/scss/index.scss';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <RouterProvider router={Router} />
  // </StrictMode>,
)
