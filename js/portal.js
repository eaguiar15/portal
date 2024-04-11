var jProdutos;
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
        .then(registration => console.log('Service Worker registrado com sucesso:', registration))
        .catch(error => console.log('Erro ao registrar o Service Worker:', error));
    });
}

function checkConnection() {
    var statusOnline = document.getElementById('status-online');
    var statusOffline = document.getElementById('status-offline');
    
    if (navigator.onLine) {
        statusOnline.style.display = 'block';
        statusOffline.style.display = 'none';
    } else {
        statusOnline.style.display = 'none';
        statusOffline.style.display = 'block';
    }
}

window.onload = checkConnection;
window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);



function toggleMenu(pMenu,pElem){
    var rightbar = document.getElementById("rightbar");
    var sidebar = document.getElementById("sidebar");
    
    if( typeof pMenu == "undefined" ){
        if(rightbar.className.indexOf("menu-active") == -1){
            rightbar.classList.toggle("menu-active");
        }else{
            rightbar.classList.remove("menu-active");
        }
    }

    if( typeof pMenu !== "undefined" ){

        document.getElementById("painel-produtos").classList.remove("show");
        document.getElementById("painel-sync").classList.remove("show");

        var buttons = rightbar.getElementsByTagName('button');

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
            if(buttons[i].textContent.trim() == pElem.textContent.trim()){
                buttons[i].classList.toggle("active");
            }
        }

        var buttons = sidebar.getElementsByTagName('button');

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
            if(buttons[i].textContent.trim() == pElem.textContent.trim()){
                buttons[i].classList.toggle("active");
            }
        }

        document.getElementById(pMenu).classList.toggle("show");
        rightbar.classList.remove("menu-active");

        if(pMenu == "painel-produtos"){
            getProdutos();
        }
    }

}

var ws;
var url = "https://portal.xalingo.com.br/xalingo/xalingo_ws.";

function initWS(pURL,pMethod){
    ws = new XMLHttpRequest();
    ws.open(pMethod,url + pURL,true);
    //ws.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
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
    }

} 

function printTableProdutos(){
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

function showGrid(pElem){
    
    if(pElem.className.indexOf("table") == -1){
        pElem.className = "fas fa-table";
        document.getElementById("grid-produtos").classList.remove("hide");
        document.getElementById("table-produtos").classList.toggle("hide");
        printGridProdutos();
    }else{
        pElem.className = "fas fa-th";
        document.getElementById("grid-produtos").classList.toggle("hide");
        document.getElementById("table-produtos").classList.remove("hide");
        
    }
}

function openModal() {
    document.getElementById('myModal').style.display = 'flex';
 }

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}