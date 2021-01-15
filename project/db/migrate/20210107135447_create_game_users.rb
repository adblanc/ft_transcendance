class CreateGameUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :game_users do |t|
		t.belongs_to :war, index: true, foreign_key: true
		t.belongs_to :guild, index: true, foreign_key: true
		t.integer :points, default: 0
      t.timestamps
    end
  end
end
