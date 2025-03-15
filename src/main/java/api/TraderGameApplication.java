package api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import model.StockPortfolio;

@SpringBootApplication
public class TraderGameApplication {

    public static void main(String[] args) {
        SpringApplication.run(TraderGameApplication.class, args);
    }
    
    @Bean
    public StockPortfolio stockPortfolio() {
        return new StockPortfolio("My Stock Portfolio");
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
} 