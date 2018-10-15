namespace :update do
  task fetch_status_url: :environment do
    FetchStatus.where.not(url: nil).each do |fs|
      new_url = fs.url.gsub("https://ubuntu.home:445", "http://ubuntu.home:9000")
      fs.url = new_url
      fs.save
    end
  end
end
