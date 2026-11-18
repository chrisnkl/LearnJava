import { useCallback, useEffect, useState } from "react";
import type { LessonSummary } from "../domain";
import { LessonService } from "../services/LessonService";

export function useLessons() {
  
    const [lessons, setLessons] = useState<LessonSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLessons = useCallback(async () => {
        
        try {
            setIsLoading(true);
            setError(null);
            const data = await LessonService.getAllLessons();
            setLessons(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch lessons");
        } finally {
            setIsLoading(false);
        }

    }, []);

    useEffect(() => {
        fetchLessons();   
    }, [fetchLessons]);

    return {lessons, isLoading, error, fetchLessons};

}