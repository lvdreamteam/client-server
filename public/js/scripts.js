const logout = function (e) {
    e.preventDefault();
    let request = new XMLHttpRequest();
    request.open("POST", "/admin/logout", true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        let response = JSON.parse(request.response);
        window.location.href = response.redirectUrl;
     });
    request.send();
}

const login = function (e, email, password) {
    e.preventDefault();
    let request = new XMLHttpRequest();
    request.open("POST", "/admin/login/check", true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.withCredentials = false;
    request.addEventListener("load", function () {
        console.log(request.response);
        const response = JSON.parse(request.response);
        if (response.error) {
            alert(response.error);
        }
        if(response.redirectUrl){
            console.log("|Redirecting|");
            window.location.href = response.redirectUrl;
        }
     });
    request.send(JSON.stringify({email: email, password:password}));
}