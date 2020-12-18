Rails.application.routes.draw do
  get '/auth/42', to: 'authentication#login42', format: false
  get '/auth/guest', to: 'authentication#loginGuest', format: false
  get '/profile/:id', to: 'users#show_other_user'
  get '/games/:id', to: 'games#show'
  resource :user, only: [:show, :update]
  get "user/notifications", to: "users#show"
  resources :game
  get '/games', to: 'games#index', format:false
 post '/games', to: 'games#create', format: false
 put '/games', to: 'games#create', format: false

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
