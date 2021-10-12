(function() {

    document.getElementById('botaoSalvar').onclick = function(e){
        fetch('http://localhost:3000/users')
        .then(res => res.json())
        .then(json => {
            console.log(json)
        });
    }
 })();


