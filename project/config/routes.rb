Rails.application.routes.draw do
  get '/auth/42', to: 'authentication#login42', format: false
  get '/auth/guest', to: 'authentication#loginGuest', format: false
  get '/profile/:id', to: 'users#show_other_user'
  resource :user, only: [:show, :update]
  get "user/notifications", to: "users#show"
  resources :games
 post '/game', to: 'games#create', format: false
 put '/games', to: 'games#create', format: false
 put '/games/:id/join', to: 'games#join', format:false
 put '/games/:id/finish', to: 'games#finish', format: false

 resources :game_mouv

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
  put "/:room_id/:user_id/update_role", to: "users#update_room_role"

  root to: "application#index"
  match '*path', via: [:get, :post], to: "application#index", constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
