set :output, '/app/log/cron.log'
set :environment, "development"

every '* * * * *' do
	runner "TournamentCreator.cron_create"
end
