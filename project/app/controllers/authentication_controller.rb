require 'open-uri'

class AuthenticationController < ApplicationController

	def loginGuest

		if (User.exists?(login: params[:login]))

			token = TokiToki.encode(params[:login])
			render json: token

		else
			render :status => :unauthorized
		end


	end

	def login42
	  authenticator = Authenticator.new
	  user_info = authenticator.auth42(params[:code])

	  login = user_info[:login]
	  name = user_info[:name]
	  avatar_url = user_info[:avatar_url]
	  email = user_info[:email]

	  # Generate token...
	  token = TokiToki.encode(login)
	  # ... create user if it doesn't exist...
	  user = User.where(login: login).first_or_create!(
		name: name,
		email: email
	  )

	  user.avatar.attach(
		io: URI.open(avatar_url),
		filename: "#{login}.png",
		"content_type": "image/png",
	) if !user.avatar.attached?


	  render json: token
	rescue StandardError => error
	  render json: error, :status => :unauthorized
	end

	private

	def issuer
	  ENV['CLIENT_URL']
	end
  end
