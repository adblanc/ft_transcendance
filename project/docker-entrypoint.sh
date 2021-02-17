yarn install
rm -f tmp/pids/server.pid
RAILS_ENV=production DISABLE_DATABASE_ENVIRONMENT_CHECK=1 rails db:reset
rails runner 'Sidekiq.redis { |conn| conn.flushdb }'
cp ./base.rb /usr/local/bundle/gems/actionpack-6.0.3.4/lib/action_controller/base.rb
whenever --update-crontab
crond
bundle exec rails webpacker:compile
./bin/rails s -b 0.0.0.0 -e production
