import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/navigation.css";
import "./styles/dashboard.css";
import "./styles/cards.css";
import "./styles/forms.css";
import "./styles/components.css";

createRoot(document.getElementById("root")!).render(<App />);
