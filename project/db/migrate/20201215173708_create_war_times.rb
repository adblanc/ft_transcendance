class CreateWarTimes < ActiveRecord::Migration[6.0]
  def change
    create_table :war_times do |t|
		t.belongs_to :war, index: true, foreign_key: true
		t.datetime :start
		t.datetime :end
		t.integer :status, default: 0
		t.integer :time_to_answer
		t.integer :max_unanswered_calls
      t.timestamps
    end
  end
end
