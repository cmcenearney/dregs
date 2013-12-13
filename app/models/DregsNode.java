package models;

public class DregsNode {

    private String value;
    private boolean match;

    //constructors
    public DregsNode(String value, boolean match) {
        this.value = value;
        this.match = match;
    }

    //getters + setters
    public boolean isMatch() {
        return match;
    }

    public void setMatch(boolean match) {
        this.match = match;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

}
