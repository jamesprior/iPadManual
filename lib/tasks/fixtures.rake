desc 'Create YAML test fixtures from data in an existing database.'

task :extract_fixtures => :environment do
  sql  = "SELECT * FROM %s"
  skip_tables = ["__WebKitDatabaseInfoTable__"]
  ActiveRecord::Base.establish_connection(
      :adapter => "sqlite3",
      :database  => "lib/data/iPadManual.sqlite"
    )
  (ActiveRecord::Base.connection.tables - skip_tables).each do |table_name|
    i = "000"
    File.open("#{RAILS_ROOT}/test/fixtures/#{table_name}.yml", 'w') do |file|
      data = ActiveRecord::Base.connection.select_all(sql % table_name)
      file.write data.inject({}) { |hash, record|
        hash["#{table_name}_#{i.succ!}"] = record
        hash
      }.to_yaml
    end
  end
end
