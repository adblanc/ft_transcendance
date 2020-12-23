class CreateGameMouvs < ActiveRecord::Migration[6.0]
  def change
    create_table :game_mouvs do |t|
      t.references :user
      t.integer :scale
      t.integer :game_id
      t.timestamps
    end
  end
end
