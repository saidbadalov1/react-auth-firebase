import { useContext, useRef, useState } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);

  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    let url;

    if (isLogin) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCmvlHbA0QG2qZho6V9T2HQ5eDqNP7UniA';
    } else {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCmvlHbA0QG2qZho6V9T2HQ5eDqNP7UniA';
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      const responseData = res.json();
      if (res.ok) {
        responseData.then((data) => {
          authCtx.login(data.idToken);
          history.push('/');
        });
      } else {
        responseData.then((data) => {
          if (data.error.message === 'INVALID_PASSWORD') {
            alert('Password is wrong');
          }
          if (data.error.message === 'EMAIL_NOT_FOUND') {
            alert('Email Not Found');
          }
          if (
            data.error.message ===
            'WEAK_PASSWORD : Password should be at least 6 characters'
          ) {
            alert('Password must be at least 6 characters long');
          } else {
            alert('Authentication failed');
          }
        });
      }
    });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
