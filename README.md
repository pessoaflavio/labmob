# Labmob

Arquivo do projeto online para o Labmob, laboratório de mobilidade do Rio de Janeiro.

Design por Estúdio Nono



### Estrutura

**Prod** 

Nessa pasta estão os arquivos do site: HTML e arquivos de suporte (imagens, CSS, JS para interatividades, dados em JSON). O site é estático: pode ser carregado/uploadeado em um servidor simples. Para carregar localmente, eu uso Python + http-server.



**Data** 

Aqui está o arquivo Jupyter Notebook que transforma o dado bruto da tabela produzida pelo laboratório. Existem também 2 arquivos CSV com referências de latitude e longitude dos munícipios. 

O arquivo Jupyter no fim exporta um arquivo JSON que é usado no site.


