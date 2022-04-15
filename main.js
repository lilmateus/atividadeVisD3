divMae = d3.select("body")
.append("div")
.attr("style",'display: grid; grid-template-columns: 1fr 1fr; grid-auto-rows: 400px')

divFilha1 = divMae
.append("div")
//attr("height"," 300%")

divFilha2 = divMae
.append("div")
//.attr("style","flex: 1")

svg = 
      divFilha1
      .append("svg")
      .attr("width",600)
      .attr("height", 350);

figura = 
      divFilha2
      .append("figure")

imagem = 
      figura.append("img")

nome = 
      figura.append("figcaption")

partido = 
      figura.append("figcaption")

var escalaCor = d3.scaleOrdinal()
.domain(['PDT', 'PSDB', 'PSD', 'PODEMOS', 'PL', 'MDB', 'DEM', 'PP', 'CIDADANIA', 'PT', 'PROS', 'PSL', 'REPUBLICANOS', 'REDE'])
.range(["0c0a3e", "b33f62", "f9564f", "f3c677", "FF6F00", "f5b700", "0041a2", "89fc00", "9097c0", "a4b494", "a23e48", "ff3c38", "7DADF5", "5F0E0E"])

var id = 0;

const raioCirculo = 12;
const e = 0;
const r1 = 60; // 11
const r2 = r1 + 2*raioCirculo + e; // 14
const r3 = r2 + 2*raioCirculo + e; // 16
const r4 = r3 + 2*raioCirculo + e; // 19
const r5 = r4 + 2*raioCirculo + e; // 21

var escalaX = d3.scaleLinear()
.domain([-r5, r5])
.range([50, 550]);

var escalaY = d3.scaleLinear()
.domain([0, r5])
.range([300,50]);

function calculaAngulo(id, r) {
    if(r == r1) { 
        dominio = [1, 11] 
    }else if(r == r2) {
        dominio = [12, 25]
    }else if(r == r3) {
        dominio = [26, 41]
    }else if(r == r4) {
        dominio = [42, 60]
    }else if(r == r5) {
        dominio = [61, 81]
    }

    var escala = d3.scaleLinear()
        .domain(dominio)
        .range([Math.PI,0]);
    return escala(id)
}

function calculaX(angulo, r) {
    x = Math.cos(angulo)*r
    return x
}

function calculaY(angulo, r) {
    y = Math.sin(angulo)*r
    return y
}

const parlamentar = "ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar."

var senadores = []

d3.dsv(";", "https://raw.githubusercontent.com/nivan/testPython/main/ListaParlamentarEmExercicio.csv"
,
function(data) {
    var nome = data[parlamentar+'NomeCompletoParlamentar']
    if (nome != '') {
        if (senadores.find(nomeCompleto => nomeCompleto == nome) === undefined) {
            senadores.push(nome)
            
            id += 1;
            var raio = 0;
            if(id <= 11) {
                raio = r1;
            }else if(id <= 25) {
                raio = r2;
            }else if(id <= 41) {
                raio = r3;
            }else if(id <= 60) {
                raio = r4;
            }else if(id <= 81) {
                raio = r5;
            }
            cor = "#"+escalaCor(data[parlamentar+"SiglaPartidoParlamentar"])
            var angulo = calculaAngulo(id, raio)
            var x = calculaX(angulo, raio)
            var y = calculaY(angulo, raio)
            svg.append("circle")
            .attr("r", raioCirculo)
            .attr("cx", d => escalaX(x))
            .attr("cy", d => escalaY(y))
            .attr("fill", cor)
            .on("mouseover",function(d){
                d3.select(this).attr("stroke","black")
            })
            .on("mouseout",function(){
                d3.select(this).attr("stroke","none")
            })
            .on("click", function(){
                imagem
                .attr("src", data[parlamentar + "UrlFotoParlamentar"])
                .attr("alt","Trulli")
                .attr("style","width:50%")
                console.log(nome)
                var ApresentaNome = "Nome: " + nome
                var ApresentaPartido = "Partido: " + data[parlamentar + 'SiglaPartidoParlamentar']
                d3.selectAll("figcaption")
                .data([ApresentaNome, ApresentaPartido])
                .text(d => d)
            });
        }
    }
});
    







