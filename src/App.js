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

function App() {
  return (
    <div className="App">
      <Navbar />

      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<Homescreen />} />
            <Route path="/expense" element={<Expensescreen />} />
            <Route path="/register" element={<Registerscreen />} />
            <Route path="/login" element={<Loginscreen />} />
            <Route path="/goals" element={<Goalscreen />} />
          </Routes>
        </BrowserRouter>
      </main>

      <Footer />
    </div>
  );
}


export default App;
