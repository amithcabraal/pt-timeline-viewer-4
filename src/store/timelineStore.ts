import { create } from 'zustand';
import { TestRun, Event, TimelineFilters } from '../types/timeline';
import { sampleData } from '../data/sampleData';

interface TimelineState {
  testRuns: TestRun[];
  events: Event[];
  filters: TimelineFilters;
  setTestRuns: (testRuns: TestRun[]) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  setEvents: (events: Event[]) => void;
  updateFilters: (filters: TimelineFilters) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  testRuns: sampleData,
  events: [],
  filters: {
    startDate: null,
    endDate: null,
    searchText: '',
    categories: []
  },
  setTestRuns: (testRuns) => set({ testRuns }),
  addEvent: (event) => set((state) => ({
    events: [...state.events, { ...event, id: `event-${Date.now()}` }]
  })),
  setEvents: (events) => set({ events }),
  updateFilters: (filters) => set({ filters })
}));