var jProdutos;
var token = localStorage.getItem('token');
var url = "https://portal.xalingo.com.br/xalingo/xalingo_ws.";

function init(){
    page = window.location.pathname.split('/').pop();

    if(page == "index.html"){
        if(token !== null ){
            login();
            return;
        }
    }

    if(page == "home.html"){
        if(token === null ){
            window.location = "index.html";
            return;
        }
        document.getElementById("email-login-mob").innerText = localStorage.getItem('email');
    }
}

function login(){
    ws = new XMLHttpRequest();
    ws.open("POST", url + "login",true);
    ws.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
            console.log(ws.responseText);
            let response = JSON.parse(ws.responseText);
            if(response.status == 1){
                localStorage.setItem('token', response.token);
                localStorage.setItem('email', response.email);
                window.location = "home.html";
                return;
            }else{
                document.getElementById("login-message").innerText = response.message;
            }
           
        }
    }
    ws.send("P_JSON=" + encodeURIComponent(JSON.stringify({
        p_email : document.forms[0].P_EMAIL.value,
        p_password : document.forms[0].P_PASSWORD.value,
        token  : token
    })));
}

function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('email');

    setTimeout(function() {
        window.location = "index.html";
    }, 500);
}


function getProdutos(){
    checkConnection();
    let filter = document.getElementById("filter-produtos");
    let iName = document.getElementById("input-filter-produtos");
    if(iName.value.trim() != ""){
        filter.P_NM_PRODUTO.value = iName.value ;
        iName.value = "";
    }

    if(navigator.onLine){
        ws = new XMLHttpRequest();
        ws.open("GET",url + "produtos?" + 
        "P_ROWS=" + filter.P_NR_REGISTRO.value + "&" + 
        "P_CD_PRODUTO=" + filter.P_CD_PRODUTO.value + "&" + 
        "P_NM_PRODUTO=" + filter.P_NM_PRODUTO.value + "&" + 
        "P_CD_GRUPO_PRODUTO=" + filter.P_CD_GRUPO_PRODUTO.value ,true);
    
        ws.onreadystatechange = function(){
            if ( ws.readyState == 4 && ws.status == 200 ) {
                jProdutos = JSON.parse(ws.responseText);
                printTableProdutos();
            }
        }
        ws.send();
    }else{
        jProdutos = JSON.parse(JSON.stringify(database.produtos));
        printTableProdutos();
        checkConnection();
    }
} 


function printTableProdutos(){
    if(document.getElementById("show-grid-produtos").className == "fas fa-table"){
        printGridProdutos();
        return;
    }
    let filter = document.getElementById("filter-produtos");
    table = document.getElementById("table-produtos").children[1];
    table.innerHTML = "";
    grid = document.getElementById("grid-produtos");
    grid.innerHTML = "";
    
    let rows = 0;
    for(let a in jProdutos){

        if((filter.P_CD_PRODUTO.value == jProdutos[a].cd_produto || filter.P_CD_PRODUTO.value == "" ) &&
            (filter.P_CD_GRUPO_PRODUTO.value == jProdutos[a].cd_grupo_produto || filter.P_CD_GRUPO_PRODUTO.value == 0 ) &&
            (jProdutos[a].nm_produto.indexOf(filter.P_NM_PRODUTO.value.toUpperCase()) != -1 || filter.P_NM_PRODUTO.value == jProdutos[a].cd_produto ||filter.P_NM_PRODUTO.value == "" )){
            
            table.innerHTML+="<tr>" + 
            "<td> " + (++rows) + "</td>" + 
            "<td> " + jProdutos[a].cd_produto + "</td>" + 
            "<td> " + jProdutos[a].nm_produto + "</td>" + 
            "<td> " + jProdutos[a].nm_grupo_produto + "</td>" + 
            "<td> " + jProdutos[a].vl_preco_produto.toFixed(2) + "</td>" + 
            "</tr>" ;
        }

        if(rows >= filter.P_NR_REGISTRO.value){
            break;
        }

    }

    filter.P_NM_PRODUTO.value = "";
}

function printGridProdutos(){
    let filter = document.getElementById("filter-produtos");
    grid = document.getElementById("grid-produtos");
    grid.innerHTML = "";
    
    let rows = 0;
    for(let a in jProdutos){
        if((filter.P_CD_PRODUTO.value == jProdutos[a].cd_produto || filter.P_CD_PRODUTO.value == "" ) &&
           (filter.P_CD_GRUPO_PRODUTO.value == jProdutos[a].cd_grupo_produto || filter.P_CD_GRUPO_PRODUTO.value == 0 ) &&
           (jProdutos[a].nm_produto.indexOf(filter.P_NM_PRODUTO.value.toUpperCase()) != -1 || filter.P_NM_PRODUTO.value == jProdutos[a].cd_produto ||filter.P_NM_PRODUTO.value == "" )){

            grid.innerHTML+=
            " <div class='card show' style='height: 200px;' >" +
            "   <div class='card-grid-header'><span>" + jProdutos[a].cd_produto + " - " + jProdutos[a].nm_produto + "</span></div>" +
            "       <div class='card-grid-body'>" + 
            "            <div class='card-grid-body-img'> " +
            "            <img src='"+ jProdutos[a].url_imagem + "'> " +
            "       </div> " +
            "       <div class='card-grid-body-item'> " +
            "               <div style='width:calc(100% - 10px);text-align:center'>" + jProdutos[a].nm_grupo_produto + "</div> " +
            "       </div> " +
            "        <div class='card-grid-body-item'> " +
            "                <div>Medidas</div> " +
            "                <div>0 x 0 x 0</div> " +
            "         </div> " +
            "       <div class='card-grid-body-item'> " +
            "                <div>Preço</div> " +
            "                <div>" + jProdutos[a].vl_preco_produto.toFixed(2) + " R$</div> " +
            "       </div> " +
            "     </div> " + 
            "</div>" +
            "<br>";
        }

        if(rows >= filter.P_NR_REGISTRO.value){
            break;
        }

    }
}

function syncProdutos(pElem){
    pElem.style.background = "#fbf7ea";
    ws = new XMLHttpRequest();
    ws.open("GET",url + "produtos?P_ROWS=99999",true);
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
            database.produtos = JSON.parse(ws.responseText);
            update(database);
            pElem.style.background = "#ffd862";
            pElem.innerText = "Sincronizado";
        }
    }
    ws.send();

}

function getClientes(){
    checkConnection();
    
    let filter = document.getElementById("filter-clientes");
    let iName = document.getElementById("input-filter-clientes");
    if(iName.value.trim() != ""){
        filter.P_NM_RAZAO_SOCIAL.value = iName.value ;
        iName.value = "";
    }

    let request = {
        token : token,
        cd_pessoa : filter.P_CD_PESSOA.value,
        nm_razao_social : filter.P_NM_RAZAO_SOCIAL.value,
        dm_cnpj_cpf : filter.P_DM_CNPJ_CPF.value,
        cd_segmento_pessoa : filter.P_CD_SEGMENTO_PESSOA.value,
        rows : parseInt(filter.P_NR_REGISTRO.value)
    }

    if(navigator.onLine){
        ws = new XMLHttpRequest();
        ws.open("POST",url + "clientes",true);
    
        ws.onreadystatechange = function(){
            if ( ws.readyState == 4 && ws.status == 200 ) {
                printTableClientes(JSON.parse(ws.responseText));
            }
        }
        ws.send("P_JSON=" + JSON.stringify(request));
    }else{
        
    }
}

function getCliente(P_CD_PESSOA){
    let request = {
        token : token,
        cd_pessoa : P_CD_PESSOA
    }

    if(navigator.onLine){
        
        ws = new XMLHttpRequest();
        ws.open("POST",url + "cliente",true);
        ws.onreadystatechange = function(){
            if ( ws.readyState == 4 && ws.status == 200 ) {
                form = document.getElementById("form-clientes-update");
                jCliente = JSON.parse(ws.responseText);
                form.P_CD_PESSOA.value = jCliente.cd_pessoa;
                form.P_NM_RAZAO_SOCIAL.value = jCliente.nm_razao_social;
                form.P_DM_CNPJ_CPF.value = formatarCNPJ(jCliente.dm_cnpj_cpf);
                form.P_NR_INSCRICAO.value = jCliente.nr_inscricao;
                let options = form.P_CD_SEGMENTO_PESSOA.options;
                
                for (var i = 0; i < options.length; i++) {
                    if (options[i].value.toString().trim() === jCliente.cd_segmento_pessoa.toString().trim()) {
                        options[i].selected = true;
                        break; 
                    }
                }
                form.P_TX_SEGMENTO_PESSOA.value = jCliente.tx_segmento_pessoa;
                form.P_DM_CEP.value = jCliente.dm_cep;
                form.P_DT_CADASTRO.value = jCliente.dt_cadastro;
                form.P_NM_CIDADE.value = jCliente.nm_cidade;
                form.P_NM_ENDERECO.value = jCliente.nm_endereco;
                form.P_TX_OBSERVACOES.value = jCliente.tx_observacoes;
                console.log(ws.responseText);

                painelClientes('painel-clientes-atualizar');
            }
        }
        ws.send("P_JSON=" + JSON.stringify(request));
    }else{
        alert("Sem conexão com Internet");
    }

}

function printTableClientes(jClientes){
    let filter = document.getElementById("filter-clientes");
    table = document.getElementById("table-clientes").children[1];
    table.innerHTML = "";
       
    let rows = 0;
    for(let a in jClientes){

        if((filter.P_CD_PESSOA.value == jClientes[a].cd_pessoa || filter.P_CD_PESSOA.value == "" ) &&
          (filter.P_DM_CNPJ_CPF.value.replace(/\D/g, '') == jClientes[a].dm_cnpj_cpf.replace(/\D/g, '') || filter.P_DM_CNPJ_CPF.value == 0 ) &&
          (filter.P_CD_SEGMENTO_PESSOA.value == jClientes[a].cd_segmento_pessoa || filter.P_CD_SEGMENTO_PESSOA.value == "" ) &&
          (jClientes[a].nm_razao_social.indexOf(filter.P_NM_RAZAO_SOCIAL.value.toUpperCase()) != -1 || filter.P_NM_RAZAO_SOCIAL.value == jClientes[a].cd_pessoa ||filter.P_NM_RAZAO_SOCIAL.value == "" )
        ){
            
            table.innerHTML+="<tr>" + 
            "<td> " + (++rows) + "</td>" + 
            "<td> " + jClientes[a].cd_pessoa + "</td>" + 
            "<td> " + jClientes[a].nm_razao_social + "</td>" + 
            "<td> " + formatarCNPJ(jClientes[a].dm_cnpj_cpf) + "</td>" + 
            "<td> " + jClientes[a].nm_segmento_pessoa + "</td>" + 
            "<td> " + jClientes[a].dt_cadastro + "</td>" + 
            "<td onclick=\"getCliente(" + jClientes[a].cd_pessoa + ")\"><i class='fas fa-edit'></i></td>" + 
            "</tr>" ;
        }

        if(rows >= filter.P_NR_REGISTRO.value){
            break;
        }

    }

    filter.P_NM_RAZAO_SOCIAL.value = "";
    filter.P_CD_PESSOA.value = "";
}




function getCidades(pUF){
    checkConnection();

    if(navigator.onLine){
        form = document.getElementById("form-clientes");
        ws = new XMLHttpRequest();
        ws.open("GET",url + "cidades?P_CD_UF=" + pUF.toUpperCase(),true);
    
        ws.onreadystatechange = function(){
            if ( ws.readyState == 4 && ws.status == 200 ) {
                jCidades = JSON.parse(ws.responseText);
                form.P_ID_CIDADE.innerHTML="";
                for(let a in jCidades){
                    form.P_ID_CIDADE.innerHTML+="<option value=" + jCidades[a].id_cidade + ">" + jCidades[a].nm_cidade + "</option>";
                }
            }
        }
        ws.send();
    }else{
        alert("Cadastro Clientes, necessário conexão com internet!");
    }
} 

init();


