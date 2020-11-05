
class AuthenticationController < ApplicationController
	def login42
	  authenticator = Authenticator.new
	  user_info = authenticator.auth42(params[:code])

	  login = user_info[:login]
	  name = user_info[:name]
	  avatar_url = user_info[:avatar_url]

	  # Generate token...
	  token = TokiToki.encode(login)
	  # ... create user if it doesn't exist...
	  User.where(login: login).first_or_create!(
		name: name,
		avatar_url: avatar_url
	  )

	  render json: token
	rescue StandardError => error
	  render json: error, :status => :unauthorized
	end

	private

	def issuer
	  ENV['CLIENT_URL']
	end
  end
