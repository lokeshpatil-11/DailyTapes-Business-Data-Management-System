import logo from './logo.svg';
import './App.css';
import { AppRouter } from './router/app-router';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
function App() {
  return (
    <div >
      <AppRouter />
      <Navbar bg="dark" variant="dark" className="site-nav home-nav" fixed="top">
                <Container>
                    <Navbar.Brand href="#home">DeilyTapes</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                        </Nav>
                        <Nav>
                            <Link className='mx-4' to="/login">Login</Link>
                            <Link to="/register">Signup</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    </div>
  );
}

export default App;
