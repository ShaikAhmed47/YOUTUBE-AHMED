const sql = require('mssql/msnodesqlv8');

async function main() {
  // Use connection string for msnodesqlv8
  const config = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=master;Trusted_Connection=yes;'
  };

  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT @@VERSION as version');
    console.log(result.recordset[0].version);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
