class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :level
      t.integer :goal, default: 3
      t.string :status, default: 0
      t.timestamps
    end
  end
end
