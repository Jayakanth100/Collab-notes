import { useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom";
import styles from "./SignIn.module.css"
import { useNavigate } from "react-router-dom";

function SignIn(){
    const [usernameReg, setUsernameReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const registerContainerRef = useRef(null);
    const promptRef = useRef(null);
    const navigateTo = useNavigate();

    function handleRegister() {
        console.log("HandleRegister");
        fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameReg,
                email: emailReg,
                password: passwordReg,
            })
        })
            .then(res => { return res.json() })
            .then((res) => {
                console.log("The respose is: ",res);
                console.log(res.exists);
                if(res.exists === "true"){
                    console.log("Hi");
                    promptRef.current.style.display = "inline";
                }
                else{
                    console.log("New email registered");
                    navigateTo("/login");
                }
            })
            .catch(err => console.log("Error while fetching clientId: ", err));
    }
    return(
        <div className={styles.loginContainer}>
            <div className={styles.overlay}>
                <div className={styles.inputContainers}>
                    <div ref={promptRef} className={styles.prompt}>
                        <h6>This email is already registered</h6>
                    </div>

                    <div ref={registerContainerRef} className={styles.registerContainer}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="username">Enter username: </label>
                            <input id="username" type="text" onInput={(e) => setUsernameReg(e.target.value)} />
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="email">Enter email: </label>
                            <input id="email" type="text" onInput={(e) => setEmailReg(e.target.value)} />
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="password">Enter password: </label>
                            <input id="password" type="password" onInput={(e) => setPasswordReg(e.target.value)} />
                        </div>
                        <div className={styles.inputContainer}>
                            <button onClick={() => handleRegister()}>Register</button>
                        </div>
                        <div>
                            <h6>Already have an account ?</h6>
                            <Link to={`/login`}>
                                <h6>Log in</h6>
                            </Link>
                        </div>

                    </div>

                </div>
            </div>
        </div>

    )

}
export default SignIn;
