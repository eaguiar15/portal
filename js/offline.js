function printTablePedidos(jPedidos){
    let filter = document.getElementById("filter-pedidos");
    table = document.getElementById("table-pedidos").children[1];
    table.innerHTML = "";
       
    let rows = 0;
    console.log(filter.P_NR_REGISTRO.value);
    for(let a in jPedidos){

        // if((filter.P_CD_PESSOA.value == jClientes[a].cd_pessoa || filter.P_CD_PESSOA.value == "" ) &&
        //   (filter.P_DM_CNPJ_CPF.value.replace(/\D/g, '') == jClientes[a].dm_cnpj_cpf.replace(/\D/g, '') || filter.P_DM_CNPJ_CPF.value == 0 ) &&
        //   (filter.P_CD_SEGMENTO_PESSOA.value == jClientes[a].cd_segmento_pessoa || filter.P_CD_SEGMENTO_PESSOA.value == "" ) &&
        //   (jClientes[a].nm_razao_social.indexOf(filter.P_NM_RAZAO_SOCIAL.value.toUpperCase()) != -1 || filter.P_NM_RAZAO_SOCIAL.value == jClientes[a].cd_pessoa ||filter.P_NM_RAZAO_SOCIAL.value == "" )
        // ){
            
            table.innerHTML+="<tr>" + 
            "<td> " + (++rows) + "</td>" + 
            "<td> " + jPedidos[a].nr_pedido + "</td>" + 
            "<td> " + jPedidos[a].cd_pessoa + "</td>" + 
            "<td> " + jPedidos[a].nm_razao_social + "</td>" + 
            "<td> " + jPedidos[a].dt_emissao + "</td>" + 
            "<td> 0.00 R$</td>" + 
            "<td>Aberto</td>" + 

            //"<td onclick=\"getCliente(" + jClientes[a].cd_pessoa + ")\"><i class='fas fa-edit'></i></td>" + 
            "</tr>" ;
        //}

        if(rows >= filter.P_NR_REGISTRO.value){
            break;
        }

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
            "                <div>" + jProdutos[a].medidas + "</div> " +
            "         </div> " +
            "       <div class='card-grid-body-item'> " +
            "                <div>Preço</div> " +
            "                <div>" + jProdutos[a].vl_preco_produto.toFixed(2) + " R$</div> " +
            "       </div> " +
            "     </div> " + 
            "</div>" +
            "<br>";
        }
 
        if(rows++ >= filter.P_NR_REGISTRO.value){
            break;
        }

    }
}
