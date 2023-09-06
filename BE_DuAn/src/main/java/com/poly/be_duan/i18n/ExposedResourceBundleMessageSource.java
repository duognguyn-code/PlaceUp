package com.poly.be_duan.i18n;

import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Configuration;

import java.util.Enumeration;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

@Configuration
public class ExposedResourceBundleMessageSource {
    @Autowired
    private MessageSource messageSource;

    public Map<String, String> getValueContaisKey(String basename, Locale locale, String containKey) {
        Map<String, String> mapValues = new HashedMap();
        // create a new ResourceBundle with specified locale
        ResourceBundle bundle = ResourceBundle.getBundle(basename, locale);
        // get the keys
        Enumeration<?> enumeration = bundle.getKeys();

        while (enumeration.hasMoreElements()) {
            String key = (String) enumeration.nextElement();
            if (key.contains(containKey)) {
                mapValues.put(key, messageSource.getMessage(key, null, locale));
            }
        }
        return mapValues;
    }
}
