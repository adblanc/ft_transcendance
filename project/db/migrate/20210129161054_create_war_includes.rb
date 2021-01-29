class CreateWarIncludes < ActiveRecord::Migration[6.0]
  def change
    create_table :war_includes do |t|
		t.belongs_to :war
		t.boolean :inc_ladder, default: false
		t.boolean :inc_tour, default: false
		t.boolean :inc_friendly, default: false
		t.boolean :level, array: true, default: [{ easy: false }, { normal: false }, { hard: false }]
		t.boolean :goal, array: true, default: [{ three: false }, { six: false }, { nine: false }]
      t.timestamps
    end
  end
end
