import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'
import Homescreen from './screens/Homescreen';
import Expensescreen from './screens/Expensescreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';
import Goalscreen from './screens/Goalscreen';
import Profilescreen from './screens/Profilescreen';
import Adminscreen from './screens/Adminscreen';
import Landingscreen from './screens/Landingscreen';

function App() {
  return (
    <div className="App">
      <Navbar />

      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/income" element={<Homescreen />} />
            <Route path="/expense" element={<Expensescreen />} />
            <Route path="/register" element={<Registerscreen />} />
            <Route path="/login" element={<Loginscreen />} />
            <Route path="/goals" element={<Goalscreen />} />
            <Route path="/profile" element={<Profilescreen />} />
            <Route path="/admin" element={<Adminscreen />} />
            <Route path="/" element={<Landingscreen />} />
          </Routes>

        </BrowserRouter>
      </main>

      <Footer />
    </div>
  );
}


export default App;
