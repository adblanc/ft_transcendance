set :output, "/app/log/cron.log"

every '* * * * *' do
    command "echo 'test ok'"
end
