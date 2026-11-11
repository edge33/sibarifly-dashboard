import { useState } from 'react';
import { Link, NavLink, NavLinkProps, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../authContext/AuthContext';

//outsurce this component to a separate file
const CustomNavLink = ({ to, children, ...props }: NavLinkProps) => {
  const activeClass =
    'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500';

  return (
    <NavLink
      {...props}
      to={to}
      className={({ isActive }) =>
        `block py-2 px-3 text-gray-900 rounded-sm ${!isActive && 'hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'} md:border-0 md:p-0 dark:text-white  ${isActive && activeClass}`
      }
      aria-current="page"
    >
      {children}
    </NavLink>
  );
};

const Navbar = () => {
  const { authenticated, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );

  const toggleTheme = () => {
    const nextDarkMode = !darkMode;
    setDarkMode(nextDarkMode);
    document.documentElement.classList.toggle('dark', nextDarkMode);
    localStorage.setItem('color-theme', nextDarkMode ? 'dark' : 'light');
  };

  return (
    <nav className="print:hidden">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/SibaryFlyLogo.png" className="h-8" alt="club-logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Sibari Fly Landing report
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuVisible}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${!isMenuVisible && 'hidden'} w-full flex flex-col md:w-auto md:flex md:flex-row md:items-center`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <CustomNavLink to="/">Home</CustomNavLink>
            </li>

            {!authenticated && (
              <li>
                <CustomNavLink to="/auth">Login</CustomNavLink>
              </li>
            )}
            {authenticated && (
              <li>
                <CustomNavLink to="/manage">Admin</CustomNavLink>
              </li>
            )}
            {authenticated && (
              <li>
                <CustomNavLink
                  to="/logout"
                  onClick={event => {
                    event.preventDefault();
                    logout();
                    navigate('/');
                  }}
                >
                  Logout
                </CustomNavLink>
              </li>
            )}
          </ul>
          <button
            aria-label="Toggle color theme"
            id="theme-toggle"
            type="button"
            className="self-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-hidden focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 md:ml-4 mt-4 md:mt-0"
            onClick={toggleTheme}
          >
            <svg
              id="theme-toggle-dark-icon"
              className={`${darkMode && 'hidden'} w-5 h-5`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
            <svg
              id="theme-toggle-light-icon"
              className={`${!darkMode && 'hidden'} w-5 h-5`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
