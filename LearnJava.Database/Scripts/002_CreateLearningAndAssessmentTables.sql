-- 002_CreateLearningAndAssessmentTables.sql
-- Creates schema for curriculum, adaptive variants, misconceptions, assessments, and telemetry.

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Lessons')
BEGIN
    CREATE TABLE dbo.Lessons (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Summary NVARCHAR(1000) NOT NULL,
        Difficulty INT NOT NULL CONSTRAINT DF_Lessons_Difficulty DEFAULT 0,
        OrderIndex INT NOT NULL CONSTRAINT DF_Lessons_OrderIndex DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Lessons_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_Lessons_UpdatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_Lessons_OrderIndex ON dbo.Lessons(OrderIndex);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LessonContentVariants')
BEGIN
    CREATE TABLE dbo.LessonContentVariants (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        LessonId UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_LessonContentVariants_Lesson REFERENCES dbo.Lessons(Id) ON DELETE CASCADE,
        Style INT NOT NULL CONSTRAINT DF_LessonContentVariants_Style DEFAULT 0,
        MarkdownBody NVARCHAR(MAX) NOT NULL,
        ImageUrl NVARCHAR(500) NULL,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_LessonContentVariants_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_LessonContentVariants_UpdatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE UNIQUE NONCLUSTERED INDEX IX_LessonContentVariants_LessonId_Style ON dbo.LessonContentVariants(LessonId, Style);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Misconceptions')
BEGIN
    CREATE TABLE dbo.Misconceptions (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Explanation NVARCHAR(2000) NOT NULL,
        CorrectiveAdvice NVARCHAR(2000) NOT NULL,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Misconceptions_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_Misconceptions_UpdatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE UNIQUE NONCLUSTERED INDEX IX_Misconceptions_Code ON dbo.Misconceptions(Code);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Questions')
BEGIN
    CREATE TABLE dbo.Questions (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        LessonId UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_Questions_Lesson REFERENCES dbo.Lessons(Id) ON DELETE CASCADE,
        Prompt NVARCHAR(1000) NOT NULL,
        CodeSnippet NVARCHAR(MAX) NULL,
        HintText NVARCHAR(1000) NULL,
        OrderIndex INT NOT NULL CONSTRAINT DF_Questions_OrderIndex DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Questions_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_Questions_UpdatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_Questions_LessonId ON dbo.Questions(LessonId);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'QuestionOptions')
BEGIN
    CREATE TABLE dbo.QuestionOptions (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        QuestionId UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_QuestionOptions_Question REFERENCES dbo.Questions(Id) ON DELETE CASCADE,
        Text NVARCHAR(1000) NOT NULL,
        IsCorrect BIT NOT NULL CONSTRAINT DF_QuestionOptions_IsCorrect DEFAULT 0,
        Explanation NVARCHAR(2000) NOT NULL CONSTRAINT DF_QuestionOptions_Explanation DEFAULT '',
        AssociatedMisconceptionId UNIQUEIDENTIFIER NULL CONSTRAINT FK_QuestionOptions_Misconception REFERENCES dbo.Misconceptions(Id),
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_QuestionOptions_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_QuestionOptions_UpdatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_QuestionOptions_QuestionId ON dbo.QuestionOptions(QuestionId);
    CREATE NONCLUSTERED INDEX IX_QuestionOptions_AssociatedMisconceptionId ON dbo.QuestionOptions(AssociatedMisconceptionId);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StudentMisconceptions')
BEGIN
    CREATE TABLE dbo.StudentMisconceptions (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        StudentId UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_StudentMisconceptions_Student REFERENCES dbo.Students(Id) ON DELETE CASCADE,
        MisconceptionId UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_StudentMisconceptions_Misconception REFERENCES dbo.Misconceptions(Id) ON DELETE CASCADE,
        OccurrenceCount INT NOT NULL CONSTRAINT DF_StudentMisconceptions_OccurrenceCount DEFAULT 1,
        IsResolved BIT NOT NULL CONSTRAINT DF_StudentMisconceptions_IsResolved DEFAULT 0,
        LastOccurredAt DATETIME2 NOT NULL CONSTRAINT DF_StudentMisconceptions_LastOccurredAt DEFAULT SYSUTCDATETIME(),
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_StudentMisconceptions_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_StudentMisconceptions_UpdatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE UNIQUE NONCLUSTERED INDEX IX_StudentMisconceptions_Student_Misconception ON dbo.StudentMisconceptions(StudentId, MisconceptionId);
    CREATE NONCLUSTERED INDEX IX_StudentMisconceptions_StudentId ON dbo.StudentMisconceptions(StudentId);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Recommendations')
BEGIN
    CREATE TABLE dbo.Recommendations (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        StudentId UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_Recommendations_Student REFERENCES dbo.Students(Id) ON DELETE CASCADE,
        TargetLessonId UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_Recommendations_Lesson REFERENCES dbo.Lessons(Id) ON DELETE CASCADE,
        Reason NVARCHAR(1000) NOT NULL,
        IsCompleted BIT NOT NULL CONSTRAINT DF_Recommendations_IsCompleted DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Recommendations_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_Recommendations_UpdatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_Recommendations_StudentId ON dbo.Recommendations(StudentId);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StudentInteractions')
BEGIN
    CREATE TABLE dbo.StudentInteractions (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        StudentId UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_StudentInteractions_Student REFERENCES dbo.Students(Id) ON DELETE CASCADE,
        LessonId UNIQUEIDENTIFIER NULL CONSTRAINT FK_StudentInteractions_Lesson REFERENCES dbo.Lessons(Id),
        QuestionId UNIQUEIDENTIFIER NULL CONSTRAINT FK_StudentInteractions_Question REFERENCES dbo.Questions(Id),
        Type INT NOT NULL,
        DurationSeconds INT NOT NULL CONSTRAINT DF_StudentInteractions_Duration DEFAULT 0,
        AdditionalData NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_StudentInteractions_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_StudentInteractions_UpdatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_StudentInteractions_StudentId ON dbo.StudentInteractions(StudentId);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StudentFeedbacks')
BEGIN
    CREATE TABLE dbo.StudentFeedbacks (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        StudentId UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_StudentFeedbacks_Student REFERENCES dbo.Students(Id) ON DELETE CASCADE,
        LessonId UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_StudentFeedbacks_Lesson REFERENCES dbo.Lessons(Id) ON DELETE CASCADE,
        Rating INT NOT NULL,
        Comment NVARCHAR(1000) NULL,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_StudentFeedbacks_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_StudentFeedbacks_UpdatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_StudentFeedbacks_StudentId ON dbo.StudentFeedbacks(StudentId);
END;
