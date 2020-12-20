class WarDateValidator < ActiveModel::Validator
	def validate(record)
	  if record.end < record.start
		record.errors.add :dates, ": end date cannot be before start date"
	  end
	  if record.end == record.start
		record.errors.add :dates, ": start time and end time must be different"
	  end
	end
  end