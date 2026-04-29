import { useEffect, useState } from 'react';

const LATEST_KEY = 'smart-doc:latest-result';
const HISTORY_KEY = 'smart-doc:history';
const SELECTED_ROLE_KEY = 'smart-doc:selected-role';

function readStoredResult(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(key);
  if (!storedValue) {
    return fallback;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return fallback;
  }
}

export function useDocumentStore() {
  const [latestResult, setLatestResult] = useState(() => readStoredResult(LATEST_KEY, null));
  const [history, setHistory] = useState(() => readStoredResult(HISTORY_KEY, []));
  const [selectedRole, setSelectedRole] = useState(() => readStoredResult(SELECTED_ROLE_KEY, 'frontend-developer'));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (latestResult) {
      window.localStorage.setItem(LATEST_KEY, JSON.stringify(latestResult));
    } else {
      window.localStorage.removeItem(LATEST_KEY);
    }
  }, [latestResult]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(SELECTED_ROLE_KEY, selectedRole);
  }, [selectedRole]);

  const saveResult = (result) => {
    setLatestResult(result);
    setHistory((current) => [result, ...current.filter((entry) => entry.fileName !== result.fileName)].slice(0, 5));
  };

  const clearHistory = () => {
    setLatestResult(null);
    setHistory([]);
  };

  const setRole = (role) => {
    setSelectedRole(role);
  };

  return {
    latestResult,
    history,
    selectedRole,
    saveResult,
    clearHistory,
    setRole,
  };
}