Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount ActionCable.server => '/cable'

  root 'operations#index'

  resources :episodes do
    collection do
      get 'search'
      get 'duplicates'
    end
    member do
      post 'download'
      post 'redownload'
    end
    resources :fetch_statuses
  end

  resources :feeds do
    resources :episodes do
      collection do
        get 'search'
      end
    end
    collection do
      post 'update_feeds'
    end
    member do
      post 'update_feed'
    end
    resources :sources
  end

  resources :sources do
    resources :feed_guesses
  end

  resources :feed_guesses

  resources :jobs do
    member do
      post :retry
    end
  end

  resources :fetch_statuses

  get '*path', to: 'operations#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
