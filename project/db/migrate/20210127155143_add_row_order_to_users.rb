class AddRowOrderToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :ladder, :integer
  end
end
