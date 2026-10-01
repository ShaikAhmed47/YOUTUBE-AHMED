const sql = require('mssql/msnodesqlv8');

async function main() {
  const connStr = 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=master;Trusted_Connection=yes;';
  
  try {
    let pool = await sql.connect({ connectionString: connStr });
    
    // Create database if not exists
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'streamtube')
      BEGIN
        CREATE DATABASE streamtube;
      END
    `);
    
    await pool.close();
    
    // Connect to the new database
    pool = await sql.connect({ 
        connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=streamtube;Trusted_Connection=yes;' 
    });
    
    // Create tables
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
      CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        passwordHash NVARCHAR(255) NOT NULL,
        avatar NVARCHAR(500) DEFAULT '',
        createdAt DATETIME DEFAULT GETDATE()
      );

      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Channels' and xtype='U')
      CREATE TABLE Channels (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ownerId INT NOT NULL FOREIGN KEY REFERENCES Users(id),
        name NVARCHAR(100) NOT NULL,
        handle NVARCHAR(100) NOT NULL UNIQUE,
        description NVARCHAR(MAX) DEFAULT '',
        avatar NVARCHAR(500) DEFAULT '',
        banner NVARCHAR(500) DEFAULT '',
        createdAt DATETIME DEFAULT GETDATE()
      );

      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Subscriptions' and xtype='U')
      CREATE TABLE Subscriptions (
        userId INT NOT NULL FOREIGN KEY REFERENCES Users(id),
        channelId INT NOT NULL FOREIGN KEY REFERENCES Channels(id),
        createdAt DATETIME DEFAULT GETDATE(),
        PRIMARY KEY (userId, channelId)
      );

      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Videos' and xtype='U')
      CREATE TABLE Videos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ownerId INT NOT NULL FOREIGN KEY REFERENCES Users(id),
        channelId INT NOT NULL FOREIGN KEY REFERENCES Channels(id),
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) DEFAULT '',
        videoUrl NVARCHAR(500) NOT NULL,
        thumbnailUrl NVARCHAR(500) DEFAULT '',
        duration INT DEFAULT 0,
        views INT DEFAULT 0,
        tags NVARCHAR(MAX) DEFAULT '',
        createdAt DATETIME DEFAULT GETDATE()
      );

      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='VideoLikes' and xtype='U')
      CREATE TABLE VideoLikes (
        videoId INT NOT NULL FOREIGN KEY REFERENCES Videos(id),
        userId INT NOT NULL FOREIGN KEY REFERENCES Users(id),
        createdAt DATETIME DEFAULT GETDATE(),
        PRIMARY KEY (videoId, userId)
      );

      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Comments' and xtype='U')
      CREATE TABLE Comments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        videoId INT NOT NULL FOREIGN KEY REFERENCES Videos(id),
        authorId INT NOT NULL FOREIGN KEY REFERENCES Users(id),
        text NVARCHAR(MAX) NOT NULL,
        createdAt DATETIME DEFAULT GETDATE()
      );
    `);
    
    console.log("Database and tables created successfully.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
