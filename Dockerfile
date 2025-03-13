# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json primeiro (se existir)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todos os arquivos do projeto para dentro do container
COPY . . 

# Expõe a porta do servidor
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
