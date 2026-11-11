import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../authContext/AuthContext';
import instance from '../../axios/axiosInstance';
import useHttp from '../../hooks/useHttp';

const loginHandler = (data: { username: string; password: string }) =>
  instance.post<{ token: string }>('/auth/login', data);

const Login = () => {
  const navigate = useNavigate();
  const { authenticate, authenticated } = useAuthContext();

  useEffect(() => {
    if (authenticated) {
      navigate('/', { replace: true });
    }
  }, [authenticated, navigate]);

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const { trigger, error, pending } = useHttp(loginHandler);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (pending) {
      return;
    }

    const usernameValue = usernameInputRef.current?.value as string;
    const passwordValue = passwordInputRef.current?.value as string;

    try {
      const data = await trigger({
        username: usernameValue,
        password: passwordValue,
      });
      authenticate(data.token);
      navigate('/manage', { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const errorMessage =
    error &&
    (error.statusCode === 401
      ? 'Invalid username or password'
      : 'An error occurred');

  return (
    <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
      <div className="mb-5">
        <label
          htmlFor="username"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Username
        </label>
        <input
          ref={usernameInputRef}
          type="username"
          id="username"
          name="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        {/* helps accessibility */}
        <input hidden autoComplete="username" />
        <input
          ref={passwordInputRef}
          type="password"
          autoComplete="current-password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
          <input
            id="remember"
            type="checkbox"
            value=""
            className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
          />
        </div>
        <label
          htmlFor="remember"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Remember me
        </label>
      </div>
      {errorMessage && (
        <div className="flex items-start mb-5">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
};

export default Login;
