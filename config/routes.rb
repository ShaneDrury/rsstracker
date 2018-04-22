Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'operations#index'

  resources :episodes do
    member do
      post 'download'
    end
  end

  resources :feeds do
    member do
      resources :episodes
    end
  end

  resources :rss_feeds do
    member do
      get 'feed', format: :rss
    end
  end

  resources :jobs
end
