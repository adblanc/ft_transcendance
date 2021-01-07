class CreateGameUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :game_users do |t|
      t.bigint "game_id"
      t.bigint "user_id"
      t.integer "points", default: 0
      t.index ["game_id"], name: "index_game_user_on_game_id"
      t.index ["user_id"], name: "index_game_user_on_user_id"

      t.timestamps
    end
  end
end
