using System.Reflection;
using DbUp;

var connectionString = args.Length > 0 ? args[0] : Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING") ?? 
                                                   "Server=localhost,1433;Database=master;User Id=sa;Password=LearnJava@Password@2026;TrustServerCertificate=True;";

Console.WriteLine("Starting Database Migration Engine...");

// Create the database catalog automatically if it doesn't exist already
EnsureDatabase.For.SqlDatabase(connectionString);

// Create the upgrader to deploy the changes to the SQL Server via connectionString, with the scripts embedded.
// Saves history to dbo.SchemaVersions, and executes each script transactionally.
var upgrader = DeployChanges.To
    .SqlDatabase(connectionString)
    .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
    .JournalToSqlTable("dbo", "SchemaVersions")
    .WithTransactionPerScript()
    .WithVariablesDisabled()
    .LogToConsole()
    .Build();

// Performing the migrations if found any
var result = upgrader.PerformUpgrade();

if (!result.Successful)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine($"ERROR: Database Migration Failed! {result.Error}");
    Console.ResetColor();
    return -1;
}

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("SUCCESS: All database migrations have been applied successfully.");
Console.ResetColor();
return 0;
