require 'open-uri'
require 'mail'

class AuthenticationController < ApplicationController
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
			user = User.find_by_login(params[:login])
			tfaTreatment(user)
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

		# ... create user if it doesn't exist...
		user = User.where(login: login).first_or_create!(
			name: name,
			email: email,
			otp_secret_key: ROTP::Base32.random
		)

		user.avatar.attach(
			io: URI.open(avatar_url),
			filename: "#{login}.png",
			"content_type": "image/png",
		) if !user.avatar.attached?

		tfaTreatment(user)
	rescue StandardError => error
		render json: error, :status => :unauthorized
	end

	def loginTfa
		user = User.find_by_login(params[:user])
		hotp = ROTP::HOTP.new(user.otp_secret_key)

		raise "att" if user.tfa_error_nb >= 3
		raise "exp" if Time.now.to_i - user.tfa_time > 30
		if params[:tfa] == user.tfa_id && hotp.verify(params[:otp], user.otp_count)
			render json: TokiToki.encode(user.login)
		else
			user.update_attributes(:tfa_error_nb => user.tfa_error_nb + 1)
			raise "pass"
		end
	rescue => error
		msg = ""
		case error.to_s
		when "pass"
			msg = "Authentication failed"
		when "exp"
			msg = "Authentication session expired"
		when "att"
			msg = "To many attempts"
		else
			msg = "Error"
		end
		render :json => { msg: msg, typ: error.to_s }, :status => :unauthorized
	end

	private

	def issuer
		ENV['CLIENT_URL']
	end

	def sendMail(target, sub, bod)
		Thread.new do
			@@send_mut.synchronize do
				begin
					Mail.defaults do
						delivery_method :smtp, @@send_opt
					end
					Mail.deliver do
						from @@mailer_addr
						to target
						subject sub
						body bod
					end
				rescue => error
					File.open("mail.log", "w") do |file|
						file.puts error.message
					end
				end
			end
		end
	end

	def tfaTreatment(user)
		if user.two_fact_auth
			File.open("output", "w") do |file|
				file.puts Time.now.to_i
			end
			user.update_attributes(:otp_count => user.otp_count + 1,
				:tfa_id => ROTP::Base32.random.downcase,
				:tfa_error_nb => 0,
				:tfa_time => Time.now.to_i)
			sendMail(user.email, "Two Factor Authentication", "Your One Time Password : " +
				ROTP::HOTP.new(user.otp_secret_key).at(user.otp_count))
			render json: { token: nil, user: user.login, tfa: user.tfa_id }
		else
			render json: { token: TokiToki.encode(user.login) }
		end
	end
  end
