package model;

import java.util.Calendar;
import java.util.Date;

/**
 * Represents a Trading Simulator event
 */

public class Event {
    private static final int HASH_CONSTANT = 13;
    private Date logDate;
    private String logDesc;

    // EFFECTS: creates a new Event with log date and a description
    public Event(String description) {
        this.logDate = Calendar.getInstance().getTime();
        this.logDesc = description;
    }

    // EFFECTS: returns Event's logging date
    public Date getLogDate() {
        return this.logDate;
    }


    // EFFECTS: returns Event's description
    public String getLogDescription() {
        return this.logDesc;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (obj.getClass() != this.getClass()) {
            return false;
        }
        Event event = (Event) obj;

        return (this.logDate.equals(event.logDate))
                && (this.logDesc.equals(event.logDesc));
    }

    @Override
    public int hashCode() {
        return (HASH_CONSTANT * logDate.hashCode() + logDesc.hashCode());
    }

    // EFFECTS: returns the Event's logging date and description as a string
    @Override
    public String toString() {
        return logDate.toString() + " - " + logDesc;
    }


}
