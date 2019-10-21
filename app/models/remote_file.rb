class RemoteFile
  BUFFER_SIZE = 8 * 1024

  def fetch(url)
    Dir.mktmpdir do |temp_dir|
      ext_name = File.extname(url)
      tmp_path = File.join(temp_dir, "audiofile#{ext_name}")
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
end
