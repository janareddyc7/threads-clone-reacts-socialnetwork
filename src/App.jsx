import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Feed from "./pages/feed";

function App() {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path="/" element={<Feed />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
