import { useRef, useState } from "react";
import styles from "./Login.module.css"
export default function Login({onLogin, setClientId}){
    const [username, setUsername] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const loginContainerRef = useRef(null);
    const registerContainerRef = useRef(null);
    const loginSwitch = useRef(null);
    const registerSwitch = useRef(null);

    function handleLogin(){
        if(!username.trim()){return;}
        onLogin && onLogin(username);
        console.log("In login the username is: ",username);

        fetch('http://localhost:5000/api/clientId',{
            method: 'GET',
        })
            .then(res=>{
                // console.log("The data from server is: ",res.data);
                return res.text();
            })
            .then(data=>{
                console.log("Client id is: ", data);
                setClientId(data);
            })
            .catch(error=>console.log("Cant fetch client id: ", error));


    }
    function switchLogin(){
        setIsLogin(true);
        loginSwitch.current.style.background = "cyan";
        registerSwitch.current.style.background = "none";

        loginContainerRef.current.style.display = "inline";
        registerContainerRef.current.style.display = "none";
    }
    function switchRegister(){
        setIsLogin(false);
        registerSwitch.current.style.background = "cyan";
        loginSwitch.current.style.background = "none";

        registerContainerRef.current.style.display = "inline";
        loginContainerRef.current.style.display = "none";
    }
    
    return(
        <>
            <div className={styles.loginContainer}>
                <div className={styles.overlay}>
                    <div className={styles.inputContainers}>
                        <div className={styles.chooseLogReg}>
                            <button style={{background: "cyan"}} ref={loginSwitch} onClick={switchLogin}>Login</button>
                            <button ref={registerSwitch} onClick={switchRegister}>Register</button>
                        </div>
                        {isLogin?
                            <div ref={loginContainerRef} className={styles.loginContainer}>
                                <div className={styles.inputContainer}>
                                    <label htmlFor="username">Enter user name</label>
                                    <input id="username" onInput={(e)=>setUsername(e.target.value)} type="text"/>
                                </div>
                                <div className={styles.inputContainer}>
                                    <label htmlFor="password">Enter password</label>
                                    <input type="password"/>
                                </div>
                                <div className={styles.inputContainer}>
                                    <button onClick={()=>handleLogin(onLogin)}>Login</button>
                                </div>
                            </div>
                            :
                            <div ref={registerContainerRef} className={styles.registerContainer}>
                                <div className={styles.inputContainer}>
                                    <label htmlFor="username">Enter username: </label>
                                    <input id="username" type="text"/>
                                </div>
                                <div className={styles.inputContainer}>
                                    <label htmlFor="password">
                                        Enter password: 
                                    </label>
                                    <input id="password" type="password"/>
                                </div>
                                <div className={styles.inputContainer}>
                                    <button>Register</button>
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}
