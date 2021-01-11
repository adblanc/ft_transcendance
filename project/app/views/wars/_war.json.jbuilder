json.extract! war, :id, :start, :end, :prize, :status, :time_to_answer, :max_unanswered_calls, :created_at, :updated_at
json.atWarTime war.atWarTime?
if war.activeWarTime
	json.activeWarTime do
		json.id activeWar.activeWarTime.id
		json.end activeWar.activeWarTime.end
		json.time_to_answer activeWar.activeWarTime.time_to_answer
		json.max_unanswered_calls activeWar.activeWarTime.max_unanswered_calls
	end
end
