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

ActiveRecord::Schema.define(version: 2018_04_20_221332) do

  create_table "episodes", force: :cascade do |t|
    t.integer "feed_id"
    t.text "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "url"
    t.text "guid"
    t.text "description"
    t.index ["feed_id"], name: "index_episodes_on_feed_id"
  end

  create_table "feeds", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "url"
    t.text "name"
    t.text "image_url"
    t.text "description"
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

end
