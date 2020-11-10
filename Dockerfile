FROM ruby:2.7.0-alpine

#dependencies that will help us install rails gems that require native extensions such as postgresql gems
ENV DEV_PACKAGES="build-base ruby-dev zlib-dev libxml2-dev libxslt-dev tzdata yaml-dev postgresql-dev yarn" \
    RAILS_PACKAGES="nodejs"

RUN apk --update --upgrade add $RAILS_PACKAGES $DEV_PACKAGES

#create working directories and copy in our Gemfile so we can install our project's dependencies

#this will hold rails project
RUN mkdir -p /app

#sets up the working directory for any instructions that follow
WORKDIR /app

#copy our Gemfiles from our host's current directory to the working directory of the container
COPY Gemfile Gemfile.lock ./

#install bundler and all our gems
RUN gem install bundler && bundle install --jobs 20 --retry 5
#compiler for Rails 6 - needs yarn to work.
#RUN rails webpacker:install

#needed by yarn to create lockfile with dependencies
COPY package.json ./
RUN yarn

#copy over our entire current directory and place the files in the docker image's work dictory
COPY . ./

EXPOSE 3000

CMD ["sh", "docker-entrypoint.sh"]
