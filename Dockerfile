FROM node:12
WORKDIR /comeae
ADD . /comeae
RUN npm install
RUN npx sequelize db:migrate
RUN npm run start1
ENV PORT=3000
EXPOSE 3000