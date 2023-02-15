import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from '../signup/Signup';
import Login from '../login/Login';
import Crud from '../crud/crud';

function Main_Route() {
  return (
    <Router>
      <Routes>
        <Route path="/login"  element={<Login/>} exact/>
        <Route path="/signup" element={<Signup/>} exact/>
        {/* <Route path="/crud" element={<Crud/>} exact /> */}
      </Routes>
    </Router>
  );
}

export default Main_Route;