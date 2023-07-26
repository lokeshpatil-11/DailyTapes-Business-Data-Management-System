import { useState } from 'react'
import * as authApi from '../api/auth'
export const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const handleSubmitLogin = async e => {
        e.preventDefault();
        await authApi.login(user)
            .then(res => {
                console.log(res)
                if (res.data.status === 'failed') {
                    alert('Something went Wrong. Please check the fields entered..!')
                    //toggleLoader('stop')
                } else {
                    if (res.data.msg === 'email or phone invalid') {
                        alert('Please check the entered email or phone.!')
                        //toggleLoader('stop')
                    }  else if (res.data.msg === 'password wrong') {
                        alert('The password you entered is wrong.!')
                        //toggleLoader('stop')
                    } else {
                        localStorage.setItem('rclt', res.data.data.token)
                        window.location = '/'
                        alert("login successful")
                    }
                }
            })
            .catch((err) => {
                alert('Something went Wrong. Please check the fields entered..!')
                //toggleLoader('stop')
            })

    }
    return (
        <div className="bg-img">
            <div className="content">
                <form onSubmit={handleSubmitLogin}>
                    <h1>Login</h1>
                    <input type="text" name="userid" required placeholder="Email" 
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    value={user.email}
                    />
                    <input type="password" name="password" required placeholder="Password" 
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    />
                    <span className="show">SHOW</span>
                    {/* <p>
                        <input type="checkbox" /><span> Keep me Signed In</span>
                        <span className="forgot"><a href="forgot.html"> Forget Password?</a></span>
                    </p> */}

                    <input herf="home.html" type="submit" value="LogIn" />
                </form>
            </div>
        </div>
    )
}  