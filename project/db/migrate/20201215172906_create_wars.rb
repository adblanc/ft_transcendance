class CreateWars < ActiveRecord::Migration[6.0]
  def change
	create_table :wars do |t|
		t.datetime :start
      	t.datetime :end
		t.integer :prize
		t.integer :status, default: 0
		t.integer :time_to_answer
		t.integer :max_unanswered_calls
		t.boolean :inc_tour, default: false

      t.timestamps
    end
  end
end
