Rails.application.routes.draw do
  get '/auth/42', to: 'authentication#login42', format: false
  get '/auth/guest', to: 'authentication#loginGuest', format: false
  get '/profile/:id', to: 'users#show_other_user'

  resource :user, only: [:show, :update]
  get "user/notifications", to: "users#show"
  resources :game
  get '/games', to: 'game#index', format:false
  put '/games', to: 'game#create', format: false

  put "/block/:id", to: "blocks#block";
  put "/unblock/:id", to: "blocks#unblock";

  put "/mute/:room_id", to: "mutes#mute";
  put "/unmute/:room_id", to: "mutes#unmute";
  put "/ban/:room_id", to: "bans#ban";

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
  get 'my-rooms', to: 'rooms#my_rooms'
  get '/join-room', to: 'rooms#join'
  delete "/quit-room", to: 'rooms#quit'
  put "/:room_id/:user_id/update_role", to: "users#update_room_role"

  root to: "application#index"
  match '*path', via: [:get, :post], to: "application#index", constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
