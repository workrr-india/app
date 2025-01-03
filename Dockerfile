FROM node:18-alpine
WORKDIR /app
COPy . .
RUN npm install --omit=dev
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

