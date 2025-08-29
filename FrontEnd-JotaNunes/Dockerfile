# Etapa 1: Build (usando imagem Ubuntu em vez de Alpine)
FROM node:18 AS build
WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm install

# Copia todo o código
COPY . .

# Build do Vite
RUN npm run build

# Etapa 2: Servir com Nginx (pode usar Alpine aqui)
FROM nginx:stable-alpine

# Remove configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia nova configuração
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia arquivos buildados
COPY --from=build /app/dist /usr/share/nginx/html

# Ajusta permissões
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]