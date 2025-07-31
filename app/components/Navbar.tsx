import { Link } from 'react-router';

const Navbar = () => {
  return (
    <nav className='navbar'>
        <Link to="/">
        <p className='text-2xl text-gradient'>  Resumelyzer</p>
        </Link>   
        <Link to="/upload" className='btn primary-button w-fit'>
        Upload Resume
        </Link>

    </nav>
  )
}

export default Navbar