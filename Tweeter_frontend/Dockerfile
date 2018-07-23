FROM node:6-alpine
RUN mkdir /Tweeter_frontend
COPY . /Tweeter_frontend
EXPOSE 3000
RUN cd /Tweeter_frontend/tweeter_frontend && npm install
RUN cd /Tweeter_frontend/tweeter_frontend && npm test
WORKDIR /Tweeter_frontend/tweeter_frontend
