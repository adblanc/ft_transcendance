json.extract! war
json.war_include do 
	json.inc_ladder war.includes.inc_ladder
	json.inc_tour war.includes.inc_tour
	json.inc_friendly war.includes.inc_friendly
	json.level war.includes.level
	json.goal war.includes.goal
end