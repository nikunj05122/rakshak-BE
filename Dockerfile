FROM ubuntu

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - 
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

COPY . .

RUN npm install

EXPOSE 5000

CMD ["npm", "start"]