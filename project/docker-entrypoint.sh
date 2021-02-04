rm -f tmp/pids/server.pid
rails db:drop db:create db:migrate db:seed
whenever --update-crontab
crond
./bin/webpack-dev-server & bin/rails s -b 0.0.0.0
