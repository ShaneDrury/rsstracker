namespace :deploy do
  task :fix_absent_manifest_bug do
    on roles(:web) do
      within release_path do execute :touch,
        release_path.join('public', fetch(:assets_prefix), 'manifest.tmp')
      end
    end
  end
  before :updated, 'deploy:fix_absent_manifest_bug'
end
