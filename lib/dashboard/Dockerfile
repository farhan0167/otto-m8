FROM node:16-alpine

WORKDIR /app

COPY . /app

# Install dependencies
RUN npm install

ARG CAN_DEPLOY_WORKFLOW
RUN echo Can deploy workflow: $CAN_DEPLOY_WORKFLOW
ENV REACT_APP_CAN_DEPLOY_WORKFLOW=$CAN_DEPLOY_WORKFLOW


# Expose env vars at runtime
CMD ["npm", "start"]