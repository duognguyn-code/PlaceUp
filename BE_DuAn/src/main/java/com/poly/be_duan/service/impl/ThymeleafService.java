package com.poly.be_duan.service.impl;

import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

@Service
public class ThymeleafService {
    private static final String MAIL_TEMPLATE_BASE_NAME = "mail/MailMessages";
    private static final String MAIL_TEMPLATE_PREFIX = "/static/user/";
    private static final String MAIL_TEMPLATE_SUFFIX = ".html";
    private static final String UTF_8 = "UTF-8";

    private static final String TEMPLATE_NAME = "mail";

    private static TemplateEngine templateEngine;

    static {
        templateEngine = emailTemplateEngine();
    }

    private static TemplateEngine emailTemplateEngine() {
        final SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(htmlTemplateResolver());
        templateEngine.setTemplateEngineMessageSource(emailMessageSource());
        return templateEngine;
    }

    private static ResourceBundleMessageSource emailMessageSource() {
        final ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename(MAIL_TEMPLATE_BASE_NAME);
        return messageSource;
    }

    private static ITemplateResolver htmlTemplateResolver() {
        final ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
        templateResolver.setPrefix(MAIL_TEMPLATE_PREFIX);
        templateResolver.setSuffix(MAIL_TEMPLATE_SUFFIX);
        templateResolver.setTemplateMode(TemplateMode.HTML);
        templateResolver.setCharacterEncoding(UTF_8);
        templateResolver.setCacheable(false);
        return templateResolver;
    }

    public String getContent1(String fullName) {
        final Context context = new Context();

        context.setVariable("CHAO","Xin chào "+ fullName);
        context.setVariable("info","Đơn hàng của bạn đã được tiếp nhận, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất");

        return templateEngine.process(TEMPLATE_NAME, context);
    }
    public String getContent2(String fullName) {
        final Context context = new Context();

        context.setVariable("CHAO","Xin chào "+ fullName);
        context.setVariable("info","Đơn hàng của bạn đang được xử lý, vui lòng chờ");

        return templateEngine.process(TEMPLATE_NAME, context);
    }
    public String getContent3(String fullName) {
        final Context context = new Context();

        context.setVariable("CHAO","Xin chào "+ fullName);
        context.setVariable("info","Đơn hàng của bạn đang được giao, vui lòng kiểm tra lại thông tin");

        return templateEngine.process(TEMPLATE_NAME, context);
    }
    public String getContent4(String fullName) {
        final Context context = new Context();

        context.setVariable("CHAO","Xin chào "+ fullName);
        context.setVariable("info","Đơn hàng đã hoàn tất giao dịch, cảm ơn bạn đã sử dụng dịch vụ của chúng tôi");

        return templateEngine.process(TEMPLATE_NAME, context);
    }
    public String getContent5(String fullName) {
        final Context context = new Context();

        context.setVariable("CHAO","Xin chào "+ fullName);
        context.setVariable("info","Đơn hàng đã hủy thành công, cảm ơn bạn đã sử dụng dịch vụ của chúng tôi");

        return templateEngine.process(TEMPLATE_NAME, context);
    }
}
