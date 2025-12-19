import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Todo from './components/Todo';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/todo" element={<Todo />} />
            </Routes>
        </Router>
    );
}

export default App;
