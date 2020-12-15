class CreateWars < ActiveRecord::Migration[6.0]
  def change
	create_table :wars do |t|
		t.datetime :start
      	t.datetime :end
		t.integer :prize
		t.integer :status, default: 0

      t.timestamps
    end
  end
end
