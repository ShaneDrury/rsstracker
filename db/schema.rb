# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_05_03_130525) do

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.integer "record_id", null: false
    t.integer "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "audio_attachments", force: :cascade do |t|
    t.text "audio_data"
    t.integer "episode_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["episode_id"], name: "index_audio_attachments_on_episode_id"
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "episodes", force: :cascade do |t|
    t.integer "feed_id"
    t.text "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "url"
    t.text "guid"
    t.text "description"
    t.integer "file_size"
    t.string "duration"
    t.datetime "publication_date"
    t.text "source_thumbnail_url"
    t.text "thumbnail_url"
    t.boolean "seen", default: true
    t.integer "source_id"
    t.index ["feed_id"], name: "index_episodes_on_feed_id"
    t.index ["guid"], name: "index_episodes_on_guid", unique: true
    t.index ["source_id"], name: "index_episodes_on_source_id"
  end

  create_table "feed_guesses", force: :cascade do |t|
    t.integer "feed_id"
    t.integer "source_id"
    t.text "pattern"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feed_id"], name: "index_feed_guesses_on_feed_id"
    t.index ["source_id"], name: "index_feed_guesses_on_source_id"
  end

  create_table "feeds", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "name"
    t.text "image_url"
    t.text "description"
    t.boolean "autodownload", default: false
    t.integer "preferred_source_id"
    t.index ["preferred_source_id"], name: "index_feeds_on_preferred_source_id"
  end

  create_table "fetch_statuses", force: :cascade do |t|
    t.text "error_reason"
    t.text "status"
    t.string "fetchable_type"
    t.integer "fetchable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "url"
    t.float "bytes_transferred"
    t.float "bytes_total"
    t.index ["fetchable_type", "fetchable_id"], name: "index_fetch_statuses_on_fetchable_type_and_fetchable_id"
  end

  create_table "single_feed_sources", force: :cascade do |t|
    t.integer "feed_id"
    t.integer "source_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feed_id"], name: "index_single_feed_sources_on_feed_id"
    t.index ["source_id"], name: "index_single_feed_sources_on_source_id"
  end

  create_table "sources", force: :cascade do |t|
    t.text "url"
    t.boolean "disabled", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "source_type", default: ""
    t.text "name"
  end

end
