set :output, "/app/log/cron.log"
set :environment, "development"

every '* * * * *' do
	command "Before crontab function call"
	runner "Scheduler.make_test"
	command "After crontab function call"
end
