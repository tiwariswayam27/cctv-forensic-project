import { Case, CCTVDevice, Evidence, AnalysisEvent, ChainOfCustodyRecord } from "../types";

// Fallback arrays are initialized empty - real state is persistently managed by FastAPI & PostgreSQL
export const INITIAL_CASES: Case[] = [];
export const INITIAL_DEVICES: CCTVDevice[] = [];
export const INITIAL_EVIDENCE: Evidence[] = [];
export const INITIAL_EVENTS: AnalysisEvent[] = [];
export const INITIAL_COC_RECORDS: ChainOfCustodyRecord[] = [];
