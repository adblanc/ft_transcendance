class CreateWarTimes < ActiveRecord::Migration[6.0]
  def change
    create_table :war_times do |t|
		t.integer :war_id
		t.datetime :start
		t.datetime :end
      t.timestamps
    end
  end
end
