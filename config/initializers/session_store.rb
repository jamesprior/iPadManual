# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_iPadManual_session',
  :secret      => '4d0bc240d0fe71dc450fb96871e942ff50ef0475354b8b9dd31cded6078605424f8b6e40e8c8bd3ccaaa30f38a1c8020922bf3995a2879a1ce89ec8858e7c603'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
