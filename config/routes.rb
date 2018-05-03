Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'operations#index'

  resources :episodes do
    collection do
      get 'search'
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
    member do
      post 'update_feed'
    end
  end

  resources :rss_feeds do
    member do
      get 'feed', format: :rss
    end
  end

  resources :jobs

  get '*path', to: 'operations#index'
end
