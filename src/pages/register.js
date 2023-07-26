import { useState } from "react"
import * as authApi from '../api/auth'
export const Register = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confpass: "",
    })

    const handleSubmitReg = async e => {
        e.preventDefault();

        if (user.password !== user.confpass) {
            alert('Entered passwords are not matching!')
        } else {

            await authApi.register(user)
                .then(res => {
                    console.log(res)
                    if (res.data.status === 'failed') {
                        alert('Something went Wrong. Please check the fields entered..!')
                    } else {
                        if (res.data.msg === 'invalid input fields') {
                            alert('Please check the the fields entered. Passwords must be atleast 4 characters..!')
                        } else if (res.data.msg === 'email already exists') {
                            alert('Entered email is already exists, you can log in instead!')
                        } else {
                            setTimeout(() => {
                                window.location = "./login"
                            }, 7000)
                        }
                    }
                })
                .catch((err) => {
                    alert('Something went Wrong. Please check the fields entered..!')
                })
        }

    }

    return (
        <div className="bg-img">
        <div className="content">
            <form onSubmit={handleSubmitReg}>
            <h2>SignUp Now</h2>
                    <input type="text" name=" full name" required placeholder="Enter Full Name"
                    onChange={(e) => {setUser({...user, name: e.target.value})}}
                    value={user.name}
                    />
                    <input type="email" name="email" required placeholder="Email Address"
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    value={user.email}
                    />
                    <input type="password" name="password"  required placeholder="Password"
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    value={user.password}
                    />
                    
                    <input type="password"name="conformpassword"  required placeholder="Confrom Password"
                    onChange={(e) => setUser({...user, confpass: e.target.value})}
                    value={user.confpass}
                    />
                    <input type="submit" value="SignUp"/>
            </form>
        </div>
    </div>
    )
}
    
 