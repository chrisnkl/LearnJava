-- Seed a default student account for testing and demonstration:
-- Email: user@gmail.com
-- Password: user12345

IF NOT EXISTS (SELECT 1 FROM dbo.Students WHERE Email = 'user@gmail.com')
BEGIN
    INSERT INTO dbo.Students (
        Id,
        Email,
        PasswordHash,
        FirstName,
        LastName,
        PreferredLearningStyle,
        CurrentStereotype,
        TotalLessonsCompleted,
        TotalLessonsAttempted,
        TotalQuestionsAnswered,
        TotalQuestionsCorrect,
        CurrentStreak,
        HighestStreak,
        CreatedAt,
        UpdatedAt
    )
    VALUES (
        '01a1f026-69f7-7e58-8b73-17d51c62d613',
        'user@gmail.com',
        '$2a$12$SIxzoZcbIFl2SmZL4.pufuaLnp7PZKAKwmeH.7yyyP5HaSNOjpH96',
        'Demo',
        'Student',
        0, -- Visual
        0, -- Beginner
        0,
        0,
        0,
        0,
        0,
        0,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    );
END
ELSE
BEGIN
    -- Ensure the password hash is synced to 'user12345'
    UPDATE dbo.Students
    SET PasswordHash = '$2a$12$SIxzoZcbIFl2SmZL4.pufuaLnp7PZKAKwmeH.7yyyP5HaSNOjpH96',
        UpdatedAt = SYSUTCDATETIME()
    WHERE Email = 'user@gmail.com'
      AND PasswordHash != '$2a$12$SIxzoZcbIFl2SmZL4.pufuaLnp7PZKAKwmeH.7yyyP5HaSNOjpH96';
END;
