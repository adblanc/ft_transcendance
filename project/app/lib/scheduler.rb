class Scheduler
	#testing function
	def self.make_test
		File.open("test.log", "w") do |file|
			file.puts "scheduled test"
		end
	end
end
