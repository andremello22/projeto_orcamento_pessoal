class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor ){
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }
    validarDados(){
        for(let i in this){
            console.log(i, this[i]);
            if(this[i]==undefined || this[i]== '' || this == null){
                return false;
            }
        }
        return true; 
    }
}
class Bd{
    constructor(){
       let id = localStorage.getItem('id');
       if(id === null){
        localStorage.setItem('id', 0);
       }
       
    }


    getProximoId(){
        let proxId = localStorage.getItem('id');
        return Number(proxId)+1;
    }


    gravar(despesa){
    
       let id = this.getProximoId();
       localStorage.setItem(id, JSON.stringify(despesa));
       localStorage.setItem('id', id);
    }
    recuperarTodosRegistros(){
        //array de despesas
        let despesas = Array();

        let id = localStorage.getItem('id');
       //recuperar todas as despesas
        for(let i = 1; i<=id; i++){
            //recuperar as despesas
            
            let despesa = JSON.parse(localStorage.getItem(i));
            
            //testar se existe a possibilidade de haver indices que foram pulados ou removidos
            if(despesa === null){
               continue;
            }
             despesa.id = i;
             despesas.push(despesa); 
             
       }
       return despesas;
    }
    pesquisar(despesa){
        let despesasFiltradas = Array();
         despesasFiltradas = this.recuperarTodosRegistros();
         console.log(despesasFiltradas);
         //ano
         if(despesa.ano != ''){
            console.log('filtro de ano');
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }
         //mes
         if(despesa.mes != ''){
            console.log('filtro de mes');
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
         }
        //dia
        if(despesa.dia != ''){
            console.log('filtro de dia');
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
         }
         //tipo
         if(despesa.tipo != ''){
            console.log('filtro de tipo');
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
         }
         //descrição
         if(despesa.descricao != ''){
            console.log('filtro de descricao');
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
         }

         //valor
         if(despesa.valor != ''){
            console.log('filtro de valor');
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
         }
        
            return despesasFiltradas;
    }

    remover(id){
        localStorage.removeItem(id);
    }
}

let bd = new Bd();


function cadastrarDespesa(){
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');
   

    let despesa = new Despesa(ano.value,
         mes.value, 
         dia.value,
         tipo.value, 
         descricao.value, 
         valor.value);
        
         if(despesa.validarDados()){
            bd.gravar(despesa);
            document.getElementById('DivTituloModal').className = 'modal-header text-success';
            document.getElementById('btnModal').className = 'btn btn-success';
            document.getElementById('btnModal').innerHTML = 'voltar';
            document.getElementById('msgModal').innerHTML = 'Despesa foi cadstrada com sucesso!!';
            document.getElementById('tituloModal').innerHTML='Registro inserido com sucesso!!';
            $('#modalRegistraDespesa').modal('show');
            ano.value = '';
            mes.value = '';
            dia.value = '';
            tipo.value = '';
            descricao.value = '';
            valor.value = '';
          
           
         }else {
            
            document.getElementById('DivTituloModal').className = 'modal-header text-danger';
            document.getElementById('btnModal').className = 'btn btn-danger';
            document.getElementById('btnModal').innerHTML = 'Voltar e corrigir';
            document.getElementById('msgModal').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!!';
            document.getElementById('tituloModal').innerHTML='Erro na inclusão do registro!!';
            $('#modalRegistraDespesa').modal('show');
            }
            
         }
        function carregaListaDespesas(despesas = Array(), filtro = false){
           let valorTotal = 0;
         if(despesas.length == 0 && filtro == false){
            despesas = bd.recuperarTodosRegistros();
        }
            //selecionando o elemento tbody da tabela
            let listaDespesas = document.getElementById('listaDespesas');
            listaDespesas.innerHTML = '';

            //percorrer o array despesas, listando cada despesa de forma dinâmica
            despesas.forEach(function(d){
                valorTotal += Number(d.valor);

                //criar a linha da tabela
               let linha =listaDespesas.insertRow();
               //crinado colunas
               linha.insertCell(0).innerHTML = `${d.dia }/${d.mes}/${d.ano}`;
               switch(d.tipo){
                    case '1': d.tipo = 'Alimentação';
                    break;
                    case '2': d.tipo = 'Educação';
                    break;
                    case '3': d.tipo = 'Lazer';
                    break;
                    case '4': d.tipo = 'Saúde';
                    break;
                    case '5': d.tipo = 'Transporte';
                    break;
                    
               }
               linha.insertCell(1).innerHTML = d.tipo;
               linha.insertCell(2).innerHTML = d.descricao;
               linha.insertCell(3).innerHTML = d.valor;
                
               
               //criar o botão excluir
               let btn = document.createElement("button");
               btn.className = 'btn btn-danger'
               btn.innerHTML = '<i class = "fas fa-times"></i>';
               btn.id = `id_despesa_${d.id}`;
               btn.onclick = function (){
                  
                   let id = this.id.replace('id_despesa_', '');
                   let recarregarPagina = () => window.location.reload(); 
                   bd.remover(id);
                  
                   document.getElementById('DivTituloModal').className = 'modal-header text-danger';
                   document.getElementById('btnModal').className = 'btn btn-danger';
                   document.getElementById('btnModal').innerHTML = 'Voltar';
                   document.getElementById('tituloModal').innerHTML='Exclusão realizada com sucesso!';
                   document.getElementById('btnModal').onclick = recarregarPagina;
                   $('#modalRegistraDespesa').modal('show');
                 
                    
               
                   
               }
              
               linha.insertCell(4).append(btn);
               
              
            })
            
            let total= document.getElementById('listaDespesas');
            let linha2 = total.insertRow();
            let coluna = linha2.insertCell(0);
            coluna.innerHTML = 'Total de despesas';
            coluna = linha2.insertCell(1);
            coluna.innerHTML = Number(valorTotal);
            
        }
        
        
function pesquisarDespesa(){
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia =  document.getElementById('dia').value;
    let tipo =  document.getElementById('tipo').value;
    let descricao =  document.getElementById('descricao').value;
    let valor =  document.getElementById('valor').value;
    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
   
    let despesas = bd.pesquisar(despesa);
    this.carregaListaDespesas(despesas, true);
    

}

