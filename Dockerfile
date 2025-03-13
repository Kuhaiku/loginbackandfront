# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos para dentro do container
COPY . .

# Expõe a porta que o servidor irá rodar
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
