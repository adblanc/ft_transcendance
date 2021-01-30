class CreateWars < ActiveRecord::Migration[6.0]
  def change
	create_table :wars do |t|
		t.datetime :start
      	t.datetime :end
		t.integer :prize
		t.integer :status, default: 0
		t.integer :time_to_answer
		t.integer :max_unanswered_calls
		t.integer :nb_games, default: 0
		t.integer :nb_wartimes, default: 0
		t.boolean :inc_ladder, default: false
		t.boolean :inc_tour, default: false
		t.boolean :inc_friendly, default: false
		t.string :level
		t.string :goal
      t.timestamps
    end
  end
end
