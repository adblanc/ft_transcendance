require 'open-uri'
require 'mail'

class AuthenticationController < ApplicationController
	@@count = 0
	@@send_mut = Mutex.new
	@@mailer_addr = "ft.transcendance@@gmail.com"
	@@mailer_mdp = "ft_transcendance_mdp"
	@@send_opt = {	user_name: @@mailer_addr,
					password: @@mailer_mdp,
					address: "smtp.gmail.com",
					port: "587",
					authentication: "plain",
					enable_starttls_auto: true }

	def loginGuest
		if (User.exists?(login: params[:login]))
			token = TokiToki.encode(params[:login])
			render json: token

			user = User.find_by_login(params[:login])
			sendMail(user.email) if user.two_fact_auth
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

		sendMail(user.email) if user.two_fact_auth
		render json: token
	rescue StandardError => error
		render json: error, :status => :unauthorized
	end

	private

	def issuer
		ENV['CLIENT_URL']
	end

	def sendMail(target)
		Thread.new do
			@@send_mut.synchronize do
				begin
					Mail.defaults do
						delivery_method :smtp, @@send_opt
					end
					Mail.deliver do
						from @@mailer_addr
						to target
						subject "Authentification a deux facteurs"
						body @@count.to_s
					end
				rescue => error
					File.open("output", "w") do |file|
						file.puts error.message
					end
				end
				@@count += 1
			end
		end
	end
  end
