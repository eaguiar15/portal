function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

if ('serviceWorker' in navigator &&  isMobileDevice()) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
        .then(registration => 
            console.log('Service Worker registrado com sucesso:', registration)
        )
        .catch(error => console.log('Erro ao registrar o Service Worker:', error));
    });
}

function checkConnection() {
    var statusOnline = document.getElementById('status-online');
    var statusOffline = document.getElementById('status-offline');
    
    if (navigator.onLine) {
        statusOnline.style.display = 'block';
        statusOffline.style.display = 'none';
        document.getElementById("table-produtos").rows[0].cells[0].style.color = "black";
    } else {
        statusOnline.style.display = 'none';
        statusOffline.style.display = 'block';
        document.getElementById("table-produtos").rows[0].cells[0].style.color = "rgb(247, 81, 108)";
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

        document.getElementById("painel-pedidos").classList.remove("show");
        document.getElementById("painel-clientes").classList.remove("show");
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
            produtosList();
        }
        if(pMenu == "painel-clientes"){
            clientesList();
            showPainel("painel-clientes-pesquisar");
        }
        if(pMenu == "painel-pedidos"){
            pedidosList();
            showPainel("painel-pedidos-pesquisar");
        }

    }

}

function showPainel(pElem){
    document.getElementById("painel-clientes-pesquisar").style.display = "none";
    document.getElementById("painel-clientes-incluir").style.display = "none";
    document.getElementById("painel-clientes-atualizar").style.display = "none";
    document.getElementById("painel-pedidos-pesquisar").style.display = "none";
    document.getElementById("painel-pedidos-incluir").style.display = "none";

    document.getElementById(pElem).style.display = "";
}

var ws;
var url = "https://portal.xalingo.com.br/xalingo/xalingo_ws.";

function initWS(pURL,pMethod){
    ws = new XMLHttpRequest();
    ws.open(pMethod,url + pURL,true);
}

function openModal(name) {
    document.getElementById(name).style.display = 'flex';

    var inputs =  document.getElementById(name).getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'text' || inputs[i].type === 'number') {
             inputs[i].focus();
             break;
        }
    }
 }

function closeModal(name) {
    document.getElementById(name).style.display = 'none';
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


function formatarCNPJ(cnpj) {
   
    value = cnpj;
    var formattedValue = '';

    // Aplica a máscara de CNPJ
    if (value.length <= 2) {
        formattedValue = value;
    } else if (value.length <= 5) {
        formattedValue = value.substring(0, 2) + '.' + value.substring(2);
    } else if (value.length <= 8) {
        formattedValue = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5);
    } else if (value.length <= 12) {
        formattedValue = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8) + '/' + value.substring(8);
    } else {
        formattedValue = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8) + '/' + value.substring(8, 12) + '-' + value.substring(12, 14);
    }

    if(cnpj.value){
         cnpj.value = formattedValue;
    }else{
        return formattedValue;
    }
}

function showMessage(pMessage,pStatus){
    elem = document.getElementById("alert-message");
    elem.style.display = "flex";
    if(pStatus == 0){
        elem.className = "alert alert-error";
        elem.innerHTML="<span>Erro - </span>" + pMessage;
    }
    if(pStatus == 1){
        elem.className = "alert alert-success";
        elem.innerHTML="<span>Confirmação - </span>" + pMessage;
    }
    if(pStatus == 2){
        elem.className = "alert alert-warning";
        elem.innerHTML="<span>Alerta - </span>" + pMessage;
    }

    setTimeout(function() {
        elem.style.display = "none";
    }, 10000);
}
  