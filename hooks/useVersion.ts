import { useState, useEffect } from 'react';
import { GitHubService } from '../services/githubService';

export function useVersion() {
  const [version, setVersion] = useState<string>('v2.0.26_STABLE');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setLoading(true);
        setError(null);
        const latestVersion = await GitHubService.getLatestVersion();
        setVersion(latestVersion);
      } catch (err) {
        console.warn('Failed to fetch version:', err);
        setError('Failed to load version');
        // Keep the default version on error
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, []);

  return {
    version,
    loading,
    error,
    isFromGitHub: !loading && !error && version !== 'v2.0.26_STABLE'
  };
}