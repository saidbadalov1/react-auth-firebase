import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const enteredNewPassword = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCmvlHbA0QG2qZho6V9T2HQ5eDqNP7UniA',
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword.current.value,
          returnSecureToken: false,
        }),
        headers: { 'Content-Type': 'application/json' },
      },
    ).then((res) => {
      if (res.ok) {
        history.replace('/');
      } else {
        res.json().then((data) => {
          let errorMessage = data.error.message;
          alert(errorMessage);
          throw new Error(errorMessage);
        });
      }
    });
  };

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={enteredNewPassword} type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
