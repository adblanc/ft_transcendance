rm -f tmp/pids/server.pid
./bin/webpack-dev-server & bin/rails s -b 0.0.0.0
rails db:drop db:create db:migrate db:seed
