import React, { useRef, useState } from 'react';
import { register } from '../../api/apiAuth';
import Layout from '../Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated, userInfo } from '../../utils/auth';
import { Navigate } from 'react-router-dom';

const Register = () => {
    const submitBtn = useRef(null);
    const [value, setValue] = useState({
        name: '',
        email: '',
        password: ''
    });
    const {name, email,password} = value;
    const [error, setError] = useState(false);
    const [disabled, setDisabled] = useState(false);

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

        register({name, email, password})
            .then(response => {
                setValue({
                    name: '',
                    email: '',
                    password: ''
                });
                setDisabled(false);
                setError(false);
                submitBtn.current.textContent = 'Register';
                submitBtn.current.classList.remove('loading');

                toast.success(`${response.data.message}`, {
                    autoClose: 3000
                });
            })
            .catch(err =>  {
                if (err.response) {
                    setDisabled(false);
                    submitBtn.current.textContent = 'Register';
                    submitBtn.current.classList.remove('loading');
                    setError(err.response.data);

                    if (err.response.data.message) {
                        toast.error(`${err.response.data.message}`, {
                            autoClose: 3000
                        });
                    }
                } else {
                    if (navigator.onLine) {
                        setDisabled(false);
                        submitBtn.current.textContent = 'Register';
                        submitBtn.current.classList.remove('loading');
                        setError(false);

                        toast.error(`Registration failed! Please try again.`, {
                            autoClose: 3000
                        });
                    } else {
                        setDisabled(false);
                        submitBtn.current.textContent = 'Register';
                        submitBtn.current.classList.remove('loading');
                        setError(false);

                        toast.error(`Internet connection failed!`, {
                            autoClose: 3000
                        });
                    }
                }
            });
    }

    return (
        <Layout title='Register' classname='container'>
            <ToastContainer />
            {isAuthenticated() ? <Navigate to={`/${userInfo().role}/dashboard`} /> : ''}
            <div className="row">
                <div className="col-lg-7 col-md-10 mx-auto">
                <form className='authForm' onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Your Name:</label>
                        <input type="text" className="form-control" name='name' value={name} onChange={handleChange} />
                        <div className="text-danger">{error.name ? error.name : ''}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email Addess:</label>
                        <input type="text" className="form-control" name='email' value={email} onChange={handleChange} />
                        <div className="text-danger">{error.email ? error.email : ''}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input type="password" className="form-control" name='password' value={password} onChange={handleChange} />
                        <div className="text-danger">{error.password ? error.password : ''}</div>
                    </div>
                    <button type="submit" className="submitBtn" disabled={disabled} ref={submitBtn}>Submit</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Register;