import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'
import Homescreen from './screens/Homescreen';
import Expensescreen from './screens/Expensescreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';

function App() {
  return (
    <div className="App">
        <Navbar/>

        <BrowserRouter>
        <Routes>

        <Route path="/home" element={<Homescreen />} />
        <Route path="/expense" element={<Expensescreen />} />
        <Route path="/register" element={<Registerscreen />} />
        <Route path="/login" element={<Loginscreen />} />

        </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
