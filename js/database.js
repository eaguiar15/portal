
    var db;
    var request = indexedDB.open('portal', 1);
    var database = {  id : 1,
        produtos : [],
        clientes : [],
        pedidos  : [],
    };

    request.onerror = function(event) {
        alert("erro ao abrir base de dados" + event.target.errorCode);
        console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
    };

    request.onsuccess = function(event) {
      console.log('Banco de dados aberto com sucesso');
      db = event.target.result;
      select();
    };

    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore('base', { keyPath: 'id', autoIncrement: false });
      console.log('Banco de dados atualizado com sucesso');
    };

    function update(json) {
      var transaction = db.transaction(['base'], 'readwrite');
      var objectStore = transaction.objectStore('base');
      var request = objectStore.put(json);
      request.onsuccess = function(event) {
          alert("Atualizado base de dados offline");
          console.log('Atualizado base offline');
      };

      request.onerror = function(event) {
           console.error('Erro ao atualizar base offline:', event.target.errorCode);
      };
    
    }

    function select() {
        var transaction = db.transaction(['base'], 'readonly');
        var objectStore = transaction.objectStore('base');
        var request = objectStore.getAll();

        request.onsuccess = function(event) {
            console.log(event.target.result);

            if(event.target.result.length != 0){
                database = event.target.result[0];
            }
          
        };

        request.onerror = function(event) {
            alert("erro em select()" + event.target.result);
            console.error('Erro recuperar base:' , event.target.errorCode);
        };
    }

  