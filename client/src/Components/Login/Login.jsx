import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css"
import { UserContext } from "../GlobalProvider/UserProvider";
export default function Login() {
    const navigate = useNavigate();
    const [usernameLog, setUsernameLog] = useState('');
    const [passwordLog, setPasswordLog] = useState('');

    const {userName, setUserName,clientId, setClientId}  = useContext(UserContext);
    const loginContainerRef = useRef(null);
    
    function handleLogin() {
        fetch("http://localhost:3000/api/login",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: usernameLog,
                password: passwordLog
            })
        })
            .then(res=> res.json())
            .then(res=>{
                setUserName(res.username);
                console.log("From login: ",userName);
                setClientId(res.clientId)
                console.log("From login: ",clientId);
                navigate("/");
            })
            .catch(err=>console.log("The error is: ",err));
    }
    return (
        <>
            <div className={styles.loginContainer}>
                <div className={styles.overlay}>
                    <div className={styles.inputContainers}>
                        <div
                            ref={loginContainerRef}
                            className={styles.loginContainer}>
                            <div
                                className={styles.inputContainer}>
                                <label htmlFor="username">Enter email</label>
                                <input
                                    id="username"
                                    onChange={(e) => setUsernameLog(e.target.value)}
                                    type="text" />
                            </div>

                            <div className={styles.inputContainer}>
                                <label htmlFor="password">Enter password</label>
                                <input type="password" onChange={(e) => setPasswordLog(e.target.value)} />
                            </div>
                            <div className={styles.inputContainer}>
                                <button onClick={handleLogin}>
                                    Login
                                </button>
                            </div>
                            <div>
                                <h6>Don't have an account ?</h6>
                                <Link to={`/signin`} ><h6>Sign In</h6></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
