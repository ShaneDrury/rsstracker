namespace :yarn do
  desc 'Install yarn dependencies'
  task :install do
    on roles(:app) do
      within release_path do
        execute :yarn, :install
      end
    end
  end

  desc 'yarn dependencies'
  task :build do
    on roles(:app) do
      within release_path do
        with node_env: :production do
          execute :yarn, :build
        end
      end
    end
  end
end
