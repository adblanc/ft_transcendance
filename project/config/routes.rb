Rails.application.routes.draw do
  get '/auth/42', to: 'authentication#login42', format: false

  get '/auth/guest', to: 'authentication#loginGuest', format: false

  resource :user, only: [:show, :update]
  resources :guilds do
	member do
		put :quit
	  end
  end

  root to: "application#index"
  match '*path', via: [:get, :post], to: "application#index", constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage' 
  }
end
