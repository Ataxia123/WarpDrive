// EventEmitterProvider.tsx
import React, { createContext, useContext } from "react";
import { EventEmitter } from "events";

const EventEmitterContext = createContext<EventEmitter | null>(null);
export const eventEmitter = new EventEmitter();

export const useEventEmitter = () => {
  const context = useContext(EventEmitterContext);
  if (!context) {
    throw new Error("useEventEmitter must be used within EventEmitterProvider");
  }
  return context;
};

interface EventEmitterProviderProps {
  children: React.ReactNode;
}

// Update the EventEmitterProvider
export const EventEmitterProvider: React.FC<EventEmitterProviderProps> = ({ children }) => {
  return <EventEmitterContext.Provider value={eventEmitter}>{children}</EventEmitterContext.Provider>;
};
