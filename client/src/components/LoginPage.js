export default function LoginPage({

  username,
  setUsername,

  password,
  setPassword,

  login,
  register

}) {

  return (

    <div className="login-page">

      <div className="login-box">

        <h1>RavensNest</h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={login}>
          Login
        </button>

        <button
          className="secondary"
          onClick={register}
        >
          Register
        </button>

      </div>

    </div>

  );

}