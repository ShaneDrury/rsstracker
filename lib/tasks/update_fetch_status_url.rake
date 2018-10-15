namespace :update do
  task fetch_status_url: :environment do
    FetchStatus.where.not(url: nil).each do |fs|
      new_url = fs.url.gsub("http://192.168.1.94:9000", "https://ubuntu.home:445")
      fs.url = new_url
      fs.save
    end
  end
end
