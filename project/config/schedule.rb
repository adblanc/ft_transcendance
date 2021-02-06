set :output, '/app/log/cron.log'
set :environment, "development"

every '0 12 * * 1' do
	runner "Tournament.cron_create"
end
