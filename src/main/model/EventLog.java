package model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
/**
 Represents a log of events in the Trader Simulator Application.
    Uses the Singleton Design Pattern to ensure that there is only
    one EventLog in the application, providing global access to its instance.
 */

public class EventLog  implements Iterable<Event> {

    private static EventLog log;
    private Collection<Event> events;

    // EFFECTS: creates a new Event Log
    private EventLog() {
        events = new ArrayList<Event>();
    }

    // EFFECTS: gets singleton instance of the Event Log for application
    public static EventLog getInstance() {
        if (log == null) {
            log = new EventLog();
        }
        return log;
    }

    // EFFECTS: logs new Event into the Event Log
    public void logEvent(Event e) {
        events.add(e);
    }

    // EFFECTS: clears the current Event Log
    public void clear() {
        events.clear();
        logEvent(new Event("Cleared events log"));
    }

    @Override
    public Iterator<Event> iterator() {
        return events.iterator();
    }

}
