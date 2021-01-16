class CreateGameUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :game_users do |t|
		t.belongs_to :game, index: true, foreign_key: true
		t.belongs_to :user, index: true, foreign_key: true
		t.integer :points, default: 0
      t.timestamps
    end
  end
end
