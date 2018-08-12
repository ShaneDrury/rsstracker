#!/usr/bin/env bash
cd /Users/shane/repos/rsstracker/
DOWNLOAD_ROOT="/Volumes/Volume_1/Audio" STORAGE_ROOT="http://192.168.1.173:9000" YOUTUBE_DL_PATH=~/.virtualenvs/ytdl/bin/youtube-dl /Users/shane/.gem/ruby/2.5.0/bin/bundle exec bin/rails runner -e development 'UpdateAllFeedsJob.perform_now'
