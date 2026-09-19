package driveme.controllers;

import javax.servlet.http.HttpSession;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import driveme.dto.UserDTO;
import driveme.model.User;
import driveme.service.rideServiceImpl;

/**
 * JSON login API for the React frontend (DriveMe-react).
 *
 * userOperations.java's /loginPage and /authenticateUserLogin endpoints
 * return server-rendered JSP view names and keep working exactly as before
 * for the legacy JSP pages. These /api/** endpoints do the same
 * authentication (rideService.checkUser + HttpSession) but return JSON, so
 * the React app can log in via axios instead of an HTML form POST.
 *
 * CORS (allowedOrigins + allowCredentials) is configured centrally in
 * CorsConfig.java, driven by app.cors.allowed-origins / CORS_ALLOWED_ORIGINS
 * — see that class for why. The frontend axios client must set
 * withCredentials: true to match (see src/api/client.js), since this relies
 * on a session cookie.
 */
@RestController
public class AuthApiController {

	@Autowired
	private rideServiceImpl rideService;

	@PostMapping("/api/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
		if (request == null || request.getUsr_name() == null || request.getUsr_password() == null) {
			return ResponseEntity.badRequest().body(new ErrorResponse("User name and password are required"));
		}

		User loginUsr = rideService.checkUser(request.getUsr_name(), request.getUsr_password());

		if (loginUsr == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new ErrorResponse("Invalid user name / password"));
		}

		session.setAttribute("User", loginUsr);
		return ResponseEntity.ok(toDto(loginUsr));
	}

	@PostMapping("/api/signup")
	public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
		if (request == null || isBlank(request.getUsr_name()) || isBlank(request.getUsr_password())) {
			return ResponseEntity.badRequest().body(new ErrorResponse("User name and password are required"));
		}

		User usr = new User();
		usr.setFirstName(request.getFirstName());
		usr.setLastName(request.getLastName());
		usr.setEmail(request.getEmail());
		usr.setContatcNumber(request.getContatcNumber());
		usr.setDriving_license_number(request.getDriving_license_number());
		usr.setUsr_name(request.getUsr_name());
		usr.setUsr_password(BCrypt.hashpw(request.getUsr_password(), BCrypt.gensalt()));
		// car_model is read with .equals("") further down the save path (rideDaoImpl),
		// so it must never be left null.
		usr.setCar_mnfr(request.getCar_mnfr() == null ? "" : request.getCar_mnfr());
		usr.setCar_model(request.getCar_model() == null ? "" : request.getCar_model());
		usr.setReg_no(request.getReg_no() == null ? "" : request.getReg_no());

		try {
			// saveUserStrict (unlike saveUser) lets the real exception surface instead
			// of just returning false, so this response tells you the actual cause
			// (duplicate user name, DB unreachable, etc.) instead of guessing.
			rideService.saveUserStrict(usr);
			return ResponseEntity.ok().build();
		} catch (DuplicateKeyException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(new ErrorResponse("That user name is already taken. Please choose another."));
		} catch (org.springframework.dao.DataAccessException e) {
			e.printStackTrace();
			Throwable cause = e.getMostSpecificCause();
			String detail = cause != null ? cause.getMessage() : e.getMessage();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse("Could not create the account: " + detail));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse("Could not create the account: " + e.getMessage()));
		}
	}

	private boolean isBlank(String value) {
		return value == null || value.trim().isEmpty();
	}

	@GetMapping("/api/me")
	public ResponseEntity<?> me(HttpSession session) {
		User loginUsr = (User) session.getAttribute("User");
		if (loginUsr == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Not logged in"));
		}
		return ResponseEntity.ok(toDto(loginUsr));
	}

	@PostMapping("/api/logout")
	public ResponseEntity<?> logout(HttpSession session) {
		session.removeAttribute("User");
		return ResponseEntity.ok().build();
	}

	private UserDTO toDto(User user) {
		return new UserDTO(user.getUserId(), user.getFirstName(), user.getLastName(), user.getEmail(),
				user.getUsr_name());
	}

	public static class LoginRequest {
		private String usr_name;
		private String usr_password;

		public String getUsr_name() {
			return usr_name;
		}

		public void setUsr_name(String usr_name) {
			this.usr_name = usr_name;
		}

		public String getUsr_password() {
			return usr_password;
		}

		public void setUsr_password(String usr_password) {
			this.usr_password = usr_password;
		}
	}

	public static class SignupRequest {
		private String firstName;
		private String lastName;
		private String email;
		private String contatcNumber;
		private String driving_license_number;
		private String usr_name;
		private String usr_password;
		private String car_mnfr;
		private String car_model;
		private String reg_no;

		public String getFirstName() {
			return firstName;
		}

		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}

		public String getLastName() {
			return lastName;
		}

		public void setLastName(String lastName) {
			this.lastName = lastName;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getContatcNumber() {
			return contatcNumber;
		}

		public void setContatcNumber(String contatcNumber) {
			this.contatcNumber = contatcNumber;
		}

		public String getDriving_license_number() {
			return driving_license_number;
		}

		public void setDriving_license_number(String driving_license_number) {
			this.driving_license_number = driving_license_number;
		}

		public String getUsr_name() {
			return usr_name;
		}

		public void setUsr_name(String usr_name) {
			this.usr_name = usr_name;
		}

		public String getUsr_password() {
			return usr_password;
		}

		public void setUsr_password(String usr_password) {
			this.usr_password = usr_password;
		}

		public String getCar_mnfr() {
			return car_mnfr;
		}

		public void setCar_mnfr(String car_mnfr) {
			this.car_mnfr = car_mnfr;
		}

		public String getCar_model() {
			return car_model;
		}

		public void setCar_model(String car_model) {
			this.car_model = car_model;
		}

		public String getReg_no() {
			return reg_no;
		}

		public void setReg_no(String reg_no) {
			this.reg_no = reg_no;
		}
	}

	public static class ErrorResponse {
		private String error;

		public ErrorResponse(String error) {
			this.error = error;
		}

		public String getError() {
			return error;
		}
	}
}
