class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :level
      t.integer :points
      t.string :url

      t.timestamps
    end
  end
end
