FROM python:2.7-alpine
# Create base directory
RUN mkdir /Tweeter_backend
COPY . /Tweeter_backend
# Install depended Files
RUN pip install -U pip
RUN pip install -r /Tweeter_backend/requirements.txt
# Set Working directory for Docker
WORKDIR /Tweeter_backend/tweeter_backend
RUN python ./manage.py test
RUN python ./manage.py migrate
