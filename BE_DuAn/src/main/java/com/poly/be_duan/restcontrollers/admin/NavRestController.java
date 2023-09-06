package com.poly.be_duan.restcontrollers.admin;

import com.poly.be_duan.i18n.ExposedResourceBundleMessageSource;
import com.poly.be_duan.utils.Constant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("rest/language/nav/admin")
public class NavRestController {
    @Autowired
    private ExposedResourceBundleMessageSource bundleMessageSource;

    @GetMapping
    public Map<String, String> getLanguageNavAdmin(Locale locale) {
        Map<String, String> map = bundleMessageSource.getValueContaisKey(Constant.PATH_PROPERTIES_I18N, locale,
                Constant.ADMIN_NAV);
        return map;
    }
}
