class AddBanDurationToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :ban_duration, :integer, :null => -1, :default => -1
  end
end
