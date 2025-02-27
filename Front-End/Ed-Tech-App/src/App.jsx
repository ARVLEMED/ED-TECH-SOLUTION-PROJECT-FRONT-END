import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                {/* Redirect from "/" to "/admin" */}
                <Route path="/" element={<Navigate to="/admin" />} />
                <Route path="/admin/*" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
