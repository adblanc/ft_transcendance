json.extract! war
json.war_include do 
	json.inc_ladder war.war_include.inc_ladder
	json.inc_tour war.war_include.inc_tour
	json.inc_friendly war.war_include.inc_friendly
	json.level war.war_include.level
	json.goal war.war_include.goal
end