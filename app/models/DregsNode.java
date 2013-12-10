package models;

public class DregsNode {

    private String value;
    private boolean highlighted;

    //constructors
    public DregsNode(String value, boolean highlighted) {
        this.value = value;
        this.highlighted = highlighted;
    }

    //getters + setters
    public boolean isHighlighted() {
        return highlighted;
    }

    public void setHighlighted(boolean highlighted) {
        this.highlighted = highlighted;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

}
