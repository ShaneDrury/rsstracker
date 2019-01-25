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
    end
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

  resources :jobs

  get '*path', to: 'operations#index'
end
