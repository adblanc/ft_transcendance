class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :Type
      t.integer :Points
      t.string :url

      t.timestamps
    end
  end
end
