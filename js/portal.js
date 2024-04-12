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

init();


