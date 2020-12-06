Rails.application.routes.draw do
  get '/auth/42', to: 'authentication#login42', format: false

  get '/auth/guest', to: 'authentication#loginGuest', format: false

  resource :user, only: [:show, :update]

  resources :guilds do
	member do
		put :quit
		put :promote
		put :demote
		put :fire
		put :transfer
		put :join
		put :accept
		put :reject
		put :withdraw
	  end
  end
  resources :notifications do
	member do
		put :mark_as_read
	end
  end
  resources :room_messages
  resources :rooms
  get '/join-room', to: 'rooms#join'
  delete "/quit-room", to: 'rooms#quit'

  root to: "application#index"
  match '*path', via: [:get, :post], to: "application#index", constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
