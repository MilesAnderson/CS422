import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Stocks</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/">Featured</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/profile">Profile</Nav.Link>
            {!JSON.parse(localStorage.getItem('user')) && <Nav.Link href="/authentication">Sign In</Nav.Link>}
            {JSON.parse(localStorage.getItem('user')) && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;