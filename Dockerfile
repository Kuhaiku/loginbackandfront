# Usa a imagem oficial do Node.js 18
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para instalar dependências primeiro
COPY backend/package*.json ./

# Instala as dependências do Node.js
RUN npm install

# Copia todo o backend para dentro do container
COPY backend . 

# Expondo a porta do backend
EXPOSE 3000

# Comando para rodar o servidor
CMD ["node", "server.js"]
