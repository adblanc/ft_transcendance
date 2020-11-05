class ApplicationController < ActionController::API
	def current_user
		logger = Logger.new(STDOUT)
		token = bearer_token
		return nil unless token
		logger.debug(token)
		payload = TokiToki.decode(token)
		@current_user ||= User.find_by_login(payload[0]['sub'])
	  end

	  def logged_in?
		current_user != nil
	  end

	  def authenticate_user!
		head :unauthorized unless logged_in?
	  end


	  private

	  def bearer_token
		pattern = /^Bearer /
		header  = request.headers['Authorization']
		header.gsub(pattern, '') if header && header.match(pattern)
	  end
end
