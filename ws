<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <script>var ws; </script>
</head>
<body>
    <script>
        var path;
        async function con(form){
            x = document.getElementById("userName").value;
            console.log(x);
            ws = new WebSocket(`ws://${document.location.host}/${x}`);
            window.parent.ws = ws;
            ws.onopen = () => {
                console.log('Connected to the server');
            };
            ws.onclose = () => {
                console.log('Disconnected from the server');
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
            ws.onmessage = (event) => {
                let x = JSON.parse(event.data);
                if(x['success']){
                    if(x['success'] == 'Registered'){
                        alert("Registered");
                        what(1);
                    }
                    if(x['success'] == 'Login Successful'){
                        console.log("Logged in");
                    }
                }else{
                    console.error(x);
                }
            };
            if(form == "reg"){
                data = {
                    "username" : document.getElementById("userName").value,
                    "email" : document.getElementById("email").value,
                    "password" : document.getElementById("password").value
                }
                fetch("/register",{method : "POST",headers: {"Content-Type": "application/json"}, body : JSON.stringify(data)})
            }
            if(form == "log"){
                data = {
                    "username" : document.getElementById("userName").value,
                    "password" : document.getElementById("password").value
                }
                    let res = fetch("/login",{method : "POST",headers: {"Content-Type": "application/json"}, body : JSON.stringify(data)});
                    res.then((response) => {
                        let x = response.json();
                        x.then((data) => {
                            console.log(data);
                            if( data['success'] ){
                                //localStorage.setItem('xyz',"home");
                                window.parent.get('home');
                                alert("logged innnn");
                            };
                        });
                    });
            }
        }
    </script>
    <link rel="stylesheet" href="css/login.css">
    <script>
        let reg = "ICAgICAgICAgICAgPGZvcm0gaWQ9Im15Rm9ybSI+PGJyPgoJCQkJPGxhYmVsIGZvcj0idXNlck5hbWUiPiB1c2VyIG5hbWUqIDwvbGFiZWw+PGJyPgoJCQkJPGlucHV0IHR5cGU9InRleHQiIG5hbWU9InVzZXJOYW1lIiBpZD0idXNlck5hbWUiPjxicj4KICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9ImVtYWlsIj4gRW1haWwqIDwvbGFiZWw+PGJyPgogICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9ImVtYWlsIiBuYW1lPSJlbWFpbCIgaWQ9ImVtYWlsIj4KCQkJCTxicj4KICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9InBhc3MiPiBQYXNzd29yZCogPC9sYWJlbD4KCQkJCTxicj4KICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSJwYXNzd29yZCIgbmFtZT0icGFzc3dvcmQiIGlkPSJwYXNzd29yZCI+CgkJCQk8YnI+CiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9InN1Ym1pdCIgb25jbGljaz0iY29uKCdyZWcnKSI+UkVHSVNURVI8L2J1dHRvbj4KICAgICAgICAgICAgPC9mb3JtPg==";
        let log = "ICAgICAgICAgICAgPGZvcm0gaWQ9Im15Rm9ybSI+PGJyPgoJCQkJPGxhYmVsIGZvcj0idXNlck5hbWUiPiBlbWFpbCAvIHVzZXJuYW1lKiA8L2xhYmVsPjxicj4KCQkJCTxpbnB1dCB0eXBlPSJ0ZXh0IiBuYW1lPSJ1c2VyTmFtZSIgaWQ9InVzZXJOYW1lIj48YnI+CiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPSJwYXNzIj4gUGFzc3dvcmQqIDwvbGFiZWw+CgkJCQk8YnI+CiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0icGFzc3dvcmQiIG5hbWU9InBhc3N3b3JkIiBpZD0icGFzc3dvcmQiPgoJCQkJPGJyPgogICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJzdWJtaXQiIG9uY2xpY2s9ImNvbignbG9nJykiPkxPR0lOPC9idXR0b24+CiAgICAgICAgICAgIDwvZm9ybT4=";
        function what(x){
            let a = document.getElementById("magic");
            if(x == 0){
                a.innerHTML = atob(reg);
                const script = document.createElement('script');
                script.textContent = "document.getElementById('myForm').addEventListener('submit', function(event) {event.preventDefault();})";
                a.appendChild(script);
            }else{
                a.innerHTML = atob(log);
                const script = document.createElement('script');
                script.textContent = "document.getElementById('myForm').addEventListener('submit', function(event) {event.preventDefault();})";
                a.appendChild(script);
            }
        };
    </script>
    <h1>LOGIN</h1>
    <div>
        <div>
        <button onclick="what(0)">Register</button>
        <button onclick="what(1)">Login</button>
        </div>
        <div id="magic">
        </div>
    </div>
</body>
</html>