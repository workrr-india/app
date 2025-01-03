FROM node:18-alpine as build
#uusjql
WORKDIR /app
#hhkss
COPY package*.json ./
#gggsh
RUN npm install
#hhdlp
COPY . .
#hhwl
RUN npm install
#yesh
USER nextjs
#jjj
EXPOSE 3000
#jsj
CMD ["npm", "start"]

