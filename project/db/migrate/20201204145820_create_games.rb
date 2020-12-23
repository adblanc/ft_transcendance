class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.references :user
      t.string :level
      t.integer :points
      t.string :status
      t.integer :first
      t.timestamps
    end
  end
end
