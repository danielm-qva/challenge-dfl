FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock*.json ./

RUN npm install

COPY . .

#COPY .env.template ./

COPY start.sh /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh
CMD ["./start.sh"]

EXPOSE 3000

#RUN npm run build microservices-main
#RUN npm run build microservices-currency
#RUN npm run build microservices-transactions

#
#FROM node:20-alpine3.19 AS microservices-main
#WORKDIR /usr/src/app
#
## Copiar dependencias instaladas y el build del microservicio principal desde el stage anterior
#COPY --from=build /usr/src/app/node_modules ./node_modules
#COPY --from=build /usr/src/app/dist/apps/microservices-main ./dist
#
## Exponer el puerto del microservicio
#EXPOSE 3000
#
## Comando para ejecutar el microservicio principal
#CMD ["node", "dist/main.js"]
#
#
## Microservicio de currency
#FROM node:20-alpine3.19 AS microservices-currency
#WORKDIR /usr/src/app
#
## Copiar dependencias y el build del microservicio currency
#COPY --from=build /usr/src/app/node_modules ./node_modules
#COPY --from=build /usr/src/app/dist/apps/microservices-currency ./dist
#
## Exponer el puerto del microservicio
#EXPOSE 3001
#
## Comando para ejecutar el microservicio de currency
#CMD ["node", "dist/main.js"]
#
#
## Microservicio de transactions
#FROM node:20-alpine3.19 AS microservices-transactions
#WORKDIR /usr/src/app
#
## Copiar dependencias y el build del microservicio transactions
#COPY --from=build /usr/src/app/node_modules ./node_modules
#COPY --from=build /usr/src/app/dist/apps/microservices-transactions ./dist
#
## Exponer el puerto del microservicio
#EXPOSE 3002
#
## Comando para ejecutar el microservicio de transactions
#CMD ["node", "dist/main.js"]
