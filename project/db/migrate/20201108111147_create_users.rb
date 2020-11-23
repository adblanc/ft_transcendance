class CreateUsers < ActiveRecord::Migration[6.0]
  def change
	create_table :users do |t|
	  t.belongs_to :guild
      t.string :login
	  t.string :name
	  t.string :guild_role, default: 'none'

      t.timestamps
    end
  end
end
