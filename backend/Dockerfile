# Etapa 1: build da aplicação
FROM node:18 AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependências para otimizar cache
COPY package*.json ./
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Compila o TypeScript para a pasta dist/
RUN npm run build

# Etapa 2: imagem para produção
FROM node:18-slim

# Diretório de trabalho no container final
WORKDIR /app

# Copia apenas o necessário do build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Configura variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Expõe a porta 3000 para o Render
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/index.js"]
