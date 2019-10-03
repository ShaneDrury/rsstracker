class RemoteFile
  BUFFER_SIZE = 8 * 1024

  def initialize(url)
    @url = url
  end

  def get
    Dir.mktmpdir do |temp_dir|
      tmp_path = File.join(temp_dir, "audiofile")
      FileDownloader.get(url) do |input|
        open(tmp_path, 'wb') do |output|
          while (buffer = input.read(BUFFER_SIZE))
            output.write(buffer)
          end
        end
      end
      audio_file = File.open(tmp_path, binmode: true)
      yield(audio_file)
    end
  end

  private

  attr_accessor :url
end