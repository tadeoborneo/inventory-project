import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm p-4 flex gap-6 border-b">
          <Link to="/" className="font-bold text-blue-600 hover:text-blue-800">Dashboard</Link>
          <Link to="/inventory" className="font-bold text-blue-600 hover:text-blue-800">Inventory</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    </Router>
  
  )
}

export default App