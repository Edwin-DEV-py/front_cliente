document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    var data = {
        username: username,
        password: password
    };

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('http://127.0.0.1:8000/api/loguin/', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Hubo un problema con la solicitud.');
            }
            return response.json();
        })
        .then(data => {
            token = data['token'];
            
            if (token != null){
                console.log(token)
                document.cookie = `token=${token}; path=/`
                window.location.href = 'http://127.0.0.1:5500/menu/menu_page.html';
            }else{
                alert("token invalido")
            }
    })
    .catch(error => {
        console.error('Error:', error);
    });

});