import React, { useRef, useState } from 'react';
import { login } from '../../api/apiAuth';
import Layout from '../Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';
import { authenticate, isAuthenticated, userInfo } from '../../utils/auth';

const Login = () => {
    const submitBtn = useRef(null);
    const [value, setValue] = useState({
        email: '',
        password: ''
    });
    const {email,password} = value;
    const [error, setError] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handleChange = e => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = e => {
        e.preventDefault();

        setDisabled(true);
        submitBtn.current.textContent = '';
        submitBtn.current.classList.add('loading');

        login({email, password})
            .then(response => {
                authenticate(response.data.token, () => {
                    setValue({
                        email: '',
                        password: ''
                    });
                    setDisabled(false);
                    setError(false);
                    setRedirect(true);
                    submitBtn.current.textContent = 'Login';
                    submitBtn.current.classList.remove('loading');
                });
            })
            .catch(err =>  {
                if (err.response) {
                    setDisabled(false);
                    submitBtn.current.textContent = 'Login';
                    submitBtn.current.classList.remove('loading');
                    setError(err.response.data);

                    if (err.response.data.loginErr) {
                        toast.error(`${err.response.data.loginErr}`, {
                            autoClose: 3000
                        });
                    }
                } else {
                    if (navigator.onLine) {
                        setDisabled(false);
                        submitBtn.current.textContent = 'Login';
                        submitBtn.current.classList.remove('loading');
                        setError(false);

                        toast.error(`Login failed! Please try again.`, {
                            autoClose: 3000
                        });
                    } else {
                        setDisabled(false);
                        submitBtn.current.textContent = 'Login';
                        submitBtn.current.classList.remove('loading');
                        setError(false);

                        toast.error(`Internet connection failed!`, {
                            autoClose: 3000
                        });
                    }
                }
            });
    }

    const redirectUser = () => {
        if (redirect) {
            return <Navigate to={`/${userInfo().role}/dashboard`} />;
        }
        if (isAuthenticated()) {
            return <Navigate to={`/${userInfo().role}/dashboard`} />;
        }
    }

    return (
        <Layout title='Login' classname='container'>
            <ToastContainer />
            {redirectUser()}
            <div className="row">
                <div className="col-lg-7 col-md-10 mx-auto">
                <form className='authForm' onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email Addess:</label>
                        <input type="text" className="form-control" name='email' value={email} onChange={handleChange} />
                        <div className="text-danger">{error.message ? error.message : ''}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input type="password" className="form-control" name='password' value={password} onChange={handleChange} />
                    </div>
                    <button type="submit" className="submitBtn" disabled={disabled} ref={submitBtn}>Submit</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Login;