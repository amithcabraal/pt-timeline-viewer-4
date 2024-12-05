import React, { useEffect, useRef } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data';
import { Plus } from 'lucide-react';
import { useTimelineStore } from '../../store/timelineStore';
import { useTimelineData } from '../../hooks/useTimelineData';
import { TimelineLegend } from './TimelineLegend';
import { FilterPanel } from '../filters/FilterPanel';
import { TIMELINE_OPTIONS } from '../../constants/timeline';
import { createTimelineItems } from '../../utils/timelineData';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

export const TimelineView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const { testRuns, events, filters, updateFilters } = useTimelineStore();
  const { filteredTestRuns, filteredEvents } = useTimelineData(testRuns, events, filters);

  useEffect(() => {
    if (!containerRef.current) return;

    const timelineItems = [
      ...createTimelineItems(filteredTestRuns),
      ...filteredEvents.map(event => ({
        id: event.id,
        content: `
          <div class="event-item">
            <div class="event-title">${event.title}</div>
            <div class="event-tags">
              ${event.tags.map(tag => 
                `<span class="event-tag ${tag.color}">${tag.label}</span>`
              ).join('')}
            </div>
          </div>
        `,
        start: event.startDate,
        end: event.endDate,
        type: 'range',
        className: 'custom-event-range'
      }))
    ];

    const items = new DataSet(timelineItems);

    if (!timelineRef.current) {
      timelineRef.current = new Timeline(containerRef.current, items, TIMELINE_OPTIONS);
    } else {
      timelineRef.current.setItems(items);
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
        timelineRef.current = null;
      }
    };
  }, [filteredTestRuns, filteredEvents]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <TimelineLegend />
      </div>
      <FilterPanel filters={filters} onFilterChange={updateFilters} />
      <div ref={containerRef} className="border rounded-lg shadow-sm min-h-[600px] mt-6"></div>
    </div>
  );
};