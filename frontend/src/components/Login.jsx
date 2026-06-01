import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate = useNavigate();

    async function login(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      const response = await fetch( 'http://localhost:5050/api/auth/login',
        {
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              username: username,
              password: password
          })
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        alert('Login Failed');
      }
    }
  
    return (
      <div className = "login_page">
        <div className = "login_box">
            <h1>Welcome Back!</h1>
            <form onSubmit={login}>
                <input id="username" placeholder="Username" />
                <input id="password" type="password" placeholder="Password"/>
                <button> Login </button>
          </form>
          <br />
    
          <a href="/signup">   Signup </a>
        </div>
      </div>
    );
  }
  