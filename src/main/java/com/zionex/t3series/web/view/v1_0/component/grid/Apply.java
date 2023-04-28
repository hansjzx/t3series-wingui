package com.zionex.t3series.web.view.v1_0.component.grid;

import com.zionex.t3series.web.view.util.Configurable;
import com.zionex.t3series.web.view.util.Properties;

import org.jdom2.Element;

public class Apply extends Properties implements Configurable {

    private final String id;

    public Apply(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    @Override
    public Element toElement() {
        Element applyElement = new Element("apply");

        applyElement.setAttribute("id", id);

        Object column = getProp("column");
        Object editable = getProp("attrs", "editable");
        Object background = getProp("attrs", "background");
        Object foreground = getProp("attrs", "foreground");
        Object fontSize = getProp("attrs", "fontSize");
        Object fontBold = getProp("attrs", "fontBold");
        Object textAlignment = getProp("attrs", "textAlignment");

        if (column != null) {
            applyElement.addContent(new Element("column").setText(column.toString()));
        }

        Element attrsElement = new Element("attrs");

        if (editable != null) {
            attrsElement.addContent(new Element("editable").setText(editable.toString()));
        }

        if (background != null) {
            attrsElement.addContent(new Element("background").setText(background.toString()));
        }

        if (foreground != null) {
            attrsElement.addContent(new Element("foreground").setText(foreground.toString()));
        }

        if (fontSize != null) {
            attrsElement.addContent(new Element("fontSize").setText(fontSize.toString()));
        }

        if (fontBold != null) {
            attrsElement.addContent(new Element("fontBold").setText(fontBold.toString()));
        }

        if (textAlignment != null) {
            attrsElement.addContent(new Element("textAlignment").setText(textAlignment.toString()));
        }

        if (attrsElement.getContentSize() > 0) {
            applyElement.addContent(attrsElement);
        }

        return applyElement;
    }

    @Override
    public String toJson() {
        return "";
    }

}
