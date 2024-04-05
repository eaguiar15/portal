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

function toggleMenu(){
    var sidebar = document.getElementById("rightbar");
    if(sidebar.className.indexOf("menu-active") == -1){
        sidebar.classList.toggle("menu-active");
    }else{
        sidebar.classList.remove("menu-active");

    }
}

var ws;
var url = "https://portal.xalingo.com.br/xalingo/xalingo_ws.";

function initWS(pURL,pMethod){
    ws = new XMLHttpRequest();
    ws.open(pMethod,url + pURL,true);
    //ws.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
}

function getProdutos(){
    checkConnection();
    initWS("produtos","POST"); 
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
            json = JSON.parse(ws.responseText);
            table = document.getElementById("tProdutos").children[1];
            table.innerHTML = "";
            for(let a in json){
                table.innerHTML+="<tr>" + 
                "<td> " + json[a].cd_produto + "</td>" + 
                "<td> " + json[a].nm_produto + "</td>" + 
                "<td> " + json[a].nm_grupo_produto + "</td>" + 
                "<td> " + json[a].vl_preco_produto + "</td>" + 
                "</tr>" ;
            }
            console.log(ws.responseText);
        }
    }
    ws.send();
}