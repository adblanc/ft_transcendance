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
		t.string :includes
      t.timestamps
    end
  end
end
