(function() {
fetch('http://localhost:3000/users', {
    method: 'GET',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(json => {
    // Popula a tabela com os dados vindos da API
    for (let i = 0; i < json.rows.length; i++) {
        let tdId = document.createElement("td");
        tdId.innerText = json.rows[i].id

        let tdNome = document.createElement("td");
        tdNome.innerText = json.rows[i].nome

        let tdEmail = document.createElement("td");
        tdEmail.innerText = json.rows[i].email

        let tdIdade = document.createElement("td");
        tdIdade.innerText = json.rows[i].idade

        let tdAcoes = document.createElement("td");
        tdAcoes.setAttribute("class", "acoes"); 

        // Seta o atributo "data-nome" no botão para possibilitar deletar/atualizar
        tdAcoes.dataset.nome = json.rows[i].nome

        let botaoEditar = document.createElement('a')
        botaoEditar.setAttribute("class", "botao botaoVerde botaoEditar")
        botaoEditar.setAttribute("href", "#")
        botaoEditar.innerText = 'Editar'
        
        let botaoDeletar = document.createElement('a')
        botaoDeletar.setAttribute("class", "botao botaoVermelho botaoDeletar")
        botaoDeletar.setAttribute("href", "#")
        botaoDeletar.innerText = 'Deletar'

        tdAcoes.appendChild(botaoEditar);
        tdAcoes.appendChild(botaoDeletar);

        let tr = document.createElement("tr");
        tr.appendChild(tdId)
        tr.appendChild(tdNome)
        tr.appendChild(tdEmail)
        tr.appendChild(tdIdade)
        tr.appendChild(tdAcoes)

        document.querySelector('#tabelaCrud tbody').appendChild(tr)
    }

    // Deleta o usuário com base no atributo "data-nome"
    let btnDeletarList = document.getElementsByClassName('botaoDeletar')
    for (let i = 0; i < btnDeletarList.length; i++) {
        btnDeletarList[i].onclick = function(e) {
            let nome = this.parentElement.dataset.nome

            let r = confirm('Deseja deletar o usuário "' + nome + '"?');
            
            if (r == true) {
                fetch('http://localhost:3000/user/' + nome, {
                    method: 'DELETE', 
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(json => {
                    alert('Usuário deletado!')
                    location.reload();
                });
            }
        }
    }
    
    let editMode;
    let nomeEditado;
    let btnModalUsuario = document.getElementById('btnModalUsuario');
    btnModalUsuario.onclick = function(e) {
        let isHuman = e.isTrusted;
        let tituloModal;

        if (isHuman) {
            editMode = false;
            document.getElementById('inputNome').value = '';
            document.getElementById('inputEmail').value = '';
            document.getElementById('inputIdade').value = '';

            tituloModal = "Criar usuário"
        } else {
            tituloModal = "Editar usuário"
        }

        document.querySelector('#formAdicionar > h2').innerText = tituloModal
    }

    let btnEditarList = document.getElementsByClassName('botaoEditar');
    for (let i = 0; i < btnEditarList.length; i++) {
        btnEditarList[i].onclick = function(e) {
            editMode = true;

            let nome = this.parentElement.dataset.nome;
            nomeEditado = nome;

            let tr = this.parentElement.parentElement;

            let email = tr.children[2].innerText;
            let idade = tr.children[3].innerText;

            document.getElementById('inputNome').value = nome;
            document.getElementById('inputEmail').value = email;
            document.getElementById('inputIdade').value = idade;

            // Abre o modal do formulário de usuário (criar/editar)
            let btnModalUsuario = document.getElementById('btnModalUsuario');
            btnModalUsuario.click();
        }
    }

    document.getElementById('botaoSalvar').onclick = function(e) {
        let url
        let method
        if (editMode) {
            url = 'http://localhost:3000/user/' + nomeEditado;
            method = 'PUT';
        } else {
            url = 'http://localhost:3000/user';
            method = 'POST';
        }

        let inputNome = document.getElementById('inputNome').value;
        let inputEmail = document.getElementById('inputEmail').value;
        let inputIdade = document.getElementById('inputIdade').value;

        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "nome": inputNome, 
                "email": inputEmail, 
                "idade": inputIdade
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.success == true) {
                let botaoFechar = document.getElementById('modalClose')
                botaoFechar.click()
            }

            alert(json.message);
            location.reload();
        });
    }
});
 })();
