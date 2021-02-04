set :output, "/app/log/cron.log"
set :environment, "development"

every '* * * * *' do
	command "echo Before crontab function call"
	runner "TournamentCreator.create_tournament"
	command "echo After crontab function call"
end
