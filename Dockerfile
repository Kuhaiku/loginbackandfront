# Dockerfile para o backend
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos para o container
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta do backend
EXPOSE 3000

# Comando para iniciar o backend
CMD ["npm", "start"]
