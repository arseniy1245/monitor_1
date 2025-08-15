FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY js.js ./
COPY tlp_names.json ./
COPY klwt_names.json ./
COPY ksms_names.json ./

CMD ["node", "js.js"]