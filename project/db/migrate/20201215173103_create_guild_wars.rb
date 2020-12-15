class CreateGuildWars < ActiveRecord::Migration[6.0]
  def change
    create_table :guild_wars do |t|

      t.timestamps
    end
  end
end
