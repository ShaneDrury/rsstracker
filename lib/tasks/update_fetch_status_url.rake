namespace :update do
  task fetch_status_url: :environment do
    FetchStatus.where.not(url: nil).each do |fs|
      new_url = fs.url.gsub("192.168.1.173", "192.168.1.94")
      fs.url = new_url
      fs.save
    end
  end
end
