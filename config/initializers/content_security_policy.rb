Rails.application.config.content_security_policy do |p|
  p.connect_src :self, :https, "http://localhost:3031", "ws://localhost:3031" if Rails.env.development?
end
