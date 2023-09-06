package com.poly.be_duan.config;

import com.poly.be_duan.jwt.JwtFilter;
import com.poly.be_duan.service.impl.UserDetailsServiceImpl;
import com.poly.be_duan.utils.Username;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    UserDetailsServiceImpl userService;

    @Bean
    public JwtFilter jwtFilter(){
        return new JwtFilter();
    }

    @Bean
    public AuthenticationManager authenticationManagerBean(HttpSecurity httpSecurity) throws Exception {
        // Get AuthenticationManager Bean
        return httpSecurity.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userService)
                .passwordEncoder(passwordEncoder())
                .and().build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();

        http.authorizeRequests().antMatchers( "/api/auth/**","/user/**","/rest/user/getAccount","/rest/guest/**","/api/product/**","/rest/user/address").permitAll();

        http.authorizeRequests().antMatchers( "/api/account/**","/api/category/**","/api/chart/**" )
                .hasAnyAuthority("ROLE_ADMIN");

        http.authorizeRequests().antMatchers("/rest/uácasser/**","/api/cart/**")

                .hasAnyAuthority("ROLE_ADMIN", "ROLE_USER");



        http.authorizeRequests().and().exceptionHandling().accessDeniedPage("/error");
        http.rememberMe()
                .tokenValiditySeconds(86400);
        http.logout()
                .logoutUrl("/security/logoff")// địa chỉ hệ thống xử lý
                .logoutSuccessUrl("/security/logoff/success");
        http.addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}

