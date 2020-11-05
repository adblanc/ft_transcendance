Rails.application.routes.draw do
  get '/auth/42', to: 'authentication#login42', format: false

  resource :user, only: [:show]
end
