document.addEventListener('DOMContentLoaded', function(){
    const headerLoginBtn = document.getElementById('headerLBtn');

    if(headerLoginBtn){
        headerLoginBtn.addEventListener('click', function(){
            if(!window.location.href.includes('login.html')){
                window.location.href = '../Login/login.html';
            }
        });
    }

    const formLoginBtn = document.getElementById('login');
    if(formLoginBtn){
        formLoginBtn.addEventListener('click', function(){
            window.location.href = '../Login/login.html';
        });
    }
});