IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Students')
BEGIN
    CREATE TABLE dbo.Students (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        Email NVARCHAR(256) NOT NULL,
        PasswordHash NVARCHAR(512) NOT NULL,
        FirstName NVARCHAR(100) NOT NULL CONSTRAINT DF_Students_FirstName DEFAULT '',
        LastName NVARCHAR(100) NOT NULL CONSTRAINT DF_Students_LastName DEFAULT '',
        PreferredLearningStyle INT NOT NULL CONSTRAINT DF_Students_PreferredLearningStyle DEFAULT 0,
        CurrentStereotype INT NOT NULL CONSTRAINT DF_Students_CurrentStereotype DEFAULT 0,
        TotalLessonsCompleted INT NOT NULL CONSTRAINT DF_Students_TotalLessonsCompleted DEFAULT 0,
        TotalLessonsAttempted INT NOT NULL CONSTRAINT DF_Students_TotalLessonsAttempted DEFAULT 0,
        TotalQuestionsAnswered INT NOT NULL CONSTRAINT DF_Students_TotalQuestionsAnswered DEFAULT 0,
        TotalQuestionsCorrect INT NOT NULL CONSTRAINT DF_Students_TotalQuestionsCorrect DEFAULT 0,
        CurrentStreak INT NOT NULL CONSTRAINT DF_Students_CurrentStreak DEFAULT 0,
        HighestStreak INT NOT NULL CONSTRAINT DF_Students_HighestStreak DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Students_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_Students_UpdatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE UNIQUE NONCLUSTERED INDEX IX_Students_Email ON dbo.Students(Email);
END
