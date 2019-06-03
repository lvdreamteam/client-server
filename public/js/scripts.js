const logout = function (e) {
    e.preventDefault();
    let request = new XMLHttpRequest();
    request.open("POST", "/admin/logout", true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        let response = JSON.parse(request.response);
        window.location.href = response.redirectUrl;
     });
    request.send(JSON.stringify({reques:"lol"}));
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

const changePassword = function (e, oldPassword, newPassword) {
    e.preventDefault();
    let request = new XMLHttpRequest();
    request.open("POST", "/admin/changePassword", true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.withCredentials = false;
    request.addEventListener("load", function () {
        console.log(request.response);
        const response = JSON.parse(request.response);
        if (response.error) {
            alert(response.error);
        }
        if(response.success){
            alert(response.success);
        }
    });
    console.log(oldPassword);
    console.log(newPassword);
    request.send(JSON.stringify({oldPassword: oldPassword, newPassword:newPassword}));
}

const createNewAdmin = function (e, username, password) {
    e.preventDefault();
    let request = new XMLHttpRequest();
    request.open("POST", "/admin/addNewAdmin", true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.withCredentials = false;
    request.addEventListener("load", function () {
        console.log(request.response);
        const response = JSON.parse(request.response);
        if (response.error) {
            alert(response.error);
        }
        if(response.success){
            alert(response.success);
        }
    });
    console.log(username);
    console.log(password);
    request.send(JSON.stringify({username: username, password:password}));
}

const addSympthoms= function (e, sympthom) {
    e.preventDefault();
    let request = new XMLHttpRequest();
    request.open("POST", "/admin/addSympthoms", true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.withCredentials = false;
    request.addEventListener("load", function () {
        console.log(request.response);
        const response = JSON.parse(request.response);
        if (response.error) {
            alert(response.error);
        }
        if(response.success){
            alert(response.success);
        }
    });
    request.send(JSON.stringify({sympthom: sympthom}));
}

const addPreparat = function (e, name, description,  sympthoms, protypokazania) {
    e.preventDefault();
    let request = new XMLHttpRequest();
    request.open("POST", "/admin/addPreparat", true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.withCredentials = false;
    request.addEventListener("load", function () {
        console.log(request.response);
        const response = JSON.parse(request.response);
        if (response.error) {
            alert(response.error);
        }
        if(response.success){
            alert(response.success);
        }
    });
    request.send(JSON.stringify({
        name: name,
        description: description,
        sympthoms: sympthoms,
        protypokazania: protypokazania
    }));
}