json.extract! war, :id, :start, :end, :prize, :status, :time_to_answer, :max_unanswered_calls, :inc_tour, :created_at, :updated_at
json.atWarTime war.atWarTime?
if war.activeWarTime
	json.activeWarTime do
		json.id war.activeWarTime.id
		json.end war.activeWarTime.end
		json.time_to_answer war.activeWarTime.time_to_answer
		json.max_unanswered_calls war.activeWarTime.max_unanswered_calls
		json.unanswered_calls war.activeWarTime.unanswered_calls
	end
end
