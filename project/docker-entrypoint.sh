rm -f tmp/pids/server.pid
rails db:drop db:create db:migrate db:seed
cp ./base.rb /usr/local/bundle/gems/actionpack-6.0.3.4/lib/action_controller/base.rb
#whenever --update-crontab
#crond
./bin/webpack-dev-server & bin/rails s -b 0.0.0.0
