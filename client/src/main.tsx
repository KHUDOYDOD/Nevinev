import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n/config"; // Initialize i18next

// Add font awesome CSS (required by design)
const fontAwesomeCSS = document.createElement("link");
fontAwesomeCSS.rel = "stylesheet";
fontAwesomeCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
document.head.appendChild(fontAwesomeCSS);

createRoot(document.getElementById("root")!).render(<App />);
