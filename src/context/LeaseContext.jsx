import { createContext, useContext, useState, useCallback } from 'react';
import {
  getStoredLease,
  setStoredLease,
  deleteStoredData,
  buildChecklists,
  getStoredGoals,
  setStoredGoals,
  getStoredLeaseB,
  setStoredLeaseB,
  getStoredGoalEval,
  setStoredGoalEval,
  getStoredCompare,
  setStoredCompare,
} from '../lib/storage';

const LeaseContext = createContext(null);

export function LeaseProvider({ children }) {
  const [lease, setLease] = useState(() => getStoredLease());
  const [leaseB, setLeaseB] = useState(() => getStoredLeaseB());
  const [priorityGoals, setPriorityGoalsState] = useState(() => getStoredGoals());
  const [goalEvaluation, setGoalEvaluation] = useState(() => getStoredGoalEval());
  const [compareResult, setCompareResult] = useState(() => getStoredCompare());
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const saveLease = useCallback((fileName, analysis) => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `lease-${Date.now()}`;
    const data = {
      id,
      fileName,
      analyzedAt: Date.now(),
      analysis,
      checklists: buildChecklists(analysis),
    };
    setStoredLease(data);
    setLease(data);
    setStoredGoalEval(null);
    setStoredCompare(null);
    setGoalEvaluation(null);
    setCompareResult(null);
    setError(null);
    return data;
  }, []);

  const saveLeaseB = useCallback((fileName, analysis) => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `lease-b-${Date.now()}`;
    const data = {
      id,
      fileName,
      analyzedAt: Date.now(),
      analysis,
    };
    setStoredLeaseB(data);
    setLeaseB(data);
    setStoredCompare(null);
    setCompareResult(null);
    return data;
  }, []);

  const setPriorityGoals = useCallback((goals) => {
    setStoredGoals(goals);
    setPriorityGoalsState(goals);
    setStoredGoalEval(null);
    setStoredCompare(null);
    setGoalEvaluation(null);
    setCompareResult(null);
  }, []);

  const saveGoalEvaluation = useCallback((evaluation) => {
    setStoredGoalEval(evaluation);
    setGoalEvaluation(evaluation);
  }, []);

  const saveCompareResult = useCallback((result) => {
    setStoredCompare(result);
    setCompareResult(result);
  }, []);

  const updateChecklist = useCallback((section, itemId, updates) => {
    setLease((prev) => {
      if (!prev) return prev;
      const checklists = { ...prev.checklists };
      checklists[section] = checklists[section].map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      const next = { ...prev, checklists };
      setStoredLease(next);
      return next;
    });
  }, []);

  const clearData = useCallback(() => {
    deleteStoredData();
    setLease(null);
    setLeaseB(null);
    setPriorityGoalsState([]);
    setGoalEvaluation(null);
    setCompareResult(null);
    setError(null);
  }, []);

  return (
    <LeaseContext.Provider
      value={{
        lease,
        leaseB,
        priorityGoals,
        goalEvaluation,
        compareResult,
        processing,
        setProcessing,
        error,
        setError,
        saveLease,
        saveLeaseB,
        setPriorityGoals,
        saveGoalEvaluation,
        saveCompareResult,
        updateChecklist,
        clearData,
      }}
    >
      {children}
    </LeaseContext.Provider>
  );
}

export function useLease() {
  const ctx = useContext(LeaseContext);
  if (!ctx) throw new Error('useLease must be used within LeaseProvider');
  return ctx;
}
