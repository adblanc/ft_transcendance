Rails.application.routes.draw do
  scope "/api" do
    get '/auth/42', to: 'authentication#login42', format: false
    get '/auth/guest', to: 'authentication#loginGuest', format: false
    get '/auth/tfa', to: 'authentication#loginTfa', format: false

    resource :user, only: [:show, :update]
	get "user/notifications", to: "users#show"
	get "users", to: "users#index"

	get '/profile/:id', to: 'users#show_other_user'
	put '/profile/:id/ban', to: 'users#ban_other_user'
	put '/profile/:id/unban', to: 'users#unban_other_user'
	put "/profile/:id/add_friend", to: "friendships#add";
	put "/profile/:id/accept_friend", to: "friendships#accept";
	put "/profile/:id/refuse_friend", to: "friendships#refuse";
    put "/profile/:id/remove_friend", to: "friendships#remove";

    resources :games do
	member do
		put :acceptChallengeWT
		put :acceptPlayChat  
		put :acceptLadderChallenge
		end
	end
	post "games/createFriendly", to: "games#createFriendly";
	post "games/challengeWT", to: "games#challengeWT";
	post "games/playChat", to: "games#playChat";
	post "games/ladderChallenge", to: "games#ladderChallenge";

    put "/block/:id", to: "blocks#block";
    put "/unblock/:id", to: "blocks#unblock";

    put "/mute/:room_id", to: "mutes#mute";
    put "/unmute/:room_id", to: "mutes#unmute";
    put "/ban/:room_id", to: "bans#ban";
    put "/unban/:room_id", to: "bans#unban";

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
    resources :rooms, only: [:show, :index, :create, :update, :destroy]
    get 'my-rooms', to: 'rooms#my_rooms'
    get '/join-room', to: 'rooms#join'
    delete "/quit-room", to: 'rooms#quit'
    put "/direct_messages/:user_id", to: "rooms#init_direct_messages"
    post "/direct_messages/:user_id", to: "rooms#init_direct_messages"
    put "/:room_id/:user_id/update_role", to: "users#update_room_role"


    resources :wars do
      member do
      put :accept
      put :reject
	  put :activateWarTime
      end
    end
  end

  root to: "application#index"
  match '*path', via: [:get, :post], to: "application#index", constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
