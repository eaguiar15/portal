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
    openModal();
    return;
    initWS("produtos","POST"); 
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
            json = JSON.parse(ws.responseText);
            table = document.getElementById("table-produtos").children[1];
            table.innerHTML = "";
            grid = document.getElementById("grid-produtos");
            grid.innerHTML = "";

            for(let a in json){
                table.innerHTML+="<tr>" + 
                "<td> " + json[a].cd_produto + "</td>" + 
                "<td> " + json[a].nm_produto + "</td>" + 
                "<td> " + json[a].nm_grupo_produto + "</td>" + 
                "<td> " + json[a].vl_preco_produto.toFixed(2) + "</td>" + 
                "</tr>" ;

                grid.innerHTML+=
                " <div class='card show' style='height: 200px;' >" +
                "   <div class='card-grid-header'><span>" + json[a].cd_produto + " -  " + json[a].nm_produto + "</span></div>" +
                "       <div class='card-grid-body'>" + 
                "            <div class='card-grid-body-img'> " +
                "            <img src='"+ json[a].url_imagem + "'> " +
                "       </div> " +
                "       <div class='card-grid-body-item'> " +
                "               <div style='width:calc(100% - 10px);text-align:center'>" + json[a].nm_grupo_produto + "</div> " +
                "       </div> " +
                "        <div class='card-grid-body-item'> " +
                "                <div>Medidas</div> " +
                "                <div>0 x 0 x 0</div> " +
                "         </div> " +
                "       <div class='card-grid-body-item'> " +
                "                <div>Preço</div> " +
                "                <div>" + json[a].vl_preco_produto.toFixed(2) + " R$</div> " +
                "       </div> " +
                "     </div> " + 
                "</div>" +
                "<br>";
            }

            
        }
    }
    ws.send();
}

function showGrid(pElem){
    
    if(pElem.className.indexOf("table") == -1){
        pElem.className = "fas fa-table";
        document.getElementById("grid-produtos").classList.remove("hide");
        document.getElementById("table-produtos").classList.toggle("hide");
    }else{
        pElem.className = "fas fa-th";
        document.getElementById("grid-produtos").classList.toggle("hide");
        document.getElementById("table-produtos").classList.remove("hide");
        
    }
}

function openModal() {
    document.getElementById('myModal').style.display = 'flex';
  }

  // Função para fechar o modal
  function closeModal() {
    document.getElementById('myModal').style.display = 'none';
  }