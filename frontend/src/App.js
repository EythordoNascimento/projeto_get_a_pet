import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Components */
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import Message from "./components/layout/Message";

/* Pages */
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import Home from "./components/pages/Home";
import Profile from "./components/pages/User/Profile";
import MyPets from "./components/pages/Pet/MyPets";
import AddPets from "./components/pages/Pet/AddPets";

/* Context */
import { UserProvider } from "./context/UserContext"; // Removendo `UseProvider`, que não existe

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/profile" element={<Profile />} /> 
            <Route path="/pet/mypets" element={<MyPets/>} /> 
            <Route path="/pet/add" element={<AddPet/>} /> 
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;