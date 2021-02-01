class CreateTournaments < ActiveRecord::Migration[6.0]
  def change
    create_table :tournaments do |t|
		t.integer :status, default: 0
      t.timestamps
    end
  end
end
