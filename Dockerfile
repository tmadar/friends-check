FROM alpine:3.18

WORKDIR app

COPY package.json /
    package-lock.json /
    ./

RUN npm install

COPY src ./app

EXPOSE 80

CMD ['node', 'index.js']