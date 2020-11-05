Rails.application.routes.draw do
  get '/auth/42', to: 'authentication#login42', format: false

  get '/auth/guest', to: 'authentication#loginGuest', format: false

  resource :user, only: [:show]
end
