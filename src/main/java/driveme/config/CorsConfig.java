package driveme.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Single place for the React app's CORS allowance, replacing the
 * per-controller @CrossOrigin annotations that used to hardcode
 * localhost:5173/5174 in AuthApiController and RideApiController.
 *
 * Allowed origins come from app.cors.allowed-origins (application.properties),
 * which itself reads the CORS_ALLOWED_ORIGINS environment variable — so the
 * deployed frontend's URL can be added in Render's dashboard without a code
 * change or redeploy of source.
 *
 * The @Value default below (after the colon) is a deliberate safety net: an
 * earlier version of this file required app.cors.allowed-origins to be set
 * with no fallback, and when application.properties was reverted without
 * that property, the whole Spring context failed to start. Keeping a default
 * here means this class can never crash startup on its own, even if
 * application.properties and this file ever drift out of sync again.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

	@Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:5174}")
	private String allowedOrigins;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**")
				.allowedOrigins(allowedOrigins.split("\\s*,\\s*"))
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
				.allowedHeaders("*")
				.allowCredentials(true);
	}
}
