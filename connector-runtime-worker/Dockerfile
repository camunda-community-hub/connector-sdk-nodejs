FROM node:21 as ts-compiler  
WORKDIR /usr/app
COPY package*.json ./   
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:21 as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/dist ./
RUN npm install

FROM node:21 
WORKDIR /usr/app
COPY --from=ts-remover /usr/app ./
ENV CONNECTOR_RUNTIME_AUTOSTART=TRUE
CMD ["index.js"]