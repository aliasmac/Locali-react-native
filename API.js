class API {

    static getBroadcast (code) {
        return fetch(`http://b8ba227a.ngrok.io/api/v1/broadcastbypin`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            code: code
          })
        }).then(resp => resp.json())
    }

    static signIn (username, password) {
      // console.log("HELLO FROM LOGIN IN API.js", obj)
        return fetch('http://b8ba227a.ngrok.io/api/v1/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            username,
            password
          })
        }).then(resp => resp.json())
    }

    static signUp (username, password) {
      return fetch('http://b8ba227a.ngrok.io/api/v1/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username,
          password
        })
      }).then(resp => resp.json())
  }



}

export default API




// `http://localhost:3000/api/v1/broadcastbypin