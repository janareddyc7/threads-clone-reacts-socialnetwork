import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Feed from "./pages/feed";
import Login from './pages/Login'
import Header from "./components/Header";


function App() {
  return (
    
      <Router>
        <AuthProvider>
          <Header />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login/>}/>
        </Routes>
        </AuthProvider>
      </Router>
    
  );
}

export default App;
