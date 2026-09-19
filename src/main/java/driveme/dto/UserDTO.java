package driveme.dto;

/**
 * JSON-safe view of driveme.model.User for the REST API — intentionally
 * omits usr_password so the login response never leaks the hash.
 */
public class UserDTO {

	private Long userId;
	private String firstName;
	private String lastName;
	private String email;
	private String usr_name;

	public UserDTO() {
	}

	public UserDTO(Long userId, String firstName, String lastName, String email, String usr_name) {
		this.userId = userId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.usr_name = usr_name;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

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

	public String getUsr_name() {
		return usr_name;
	}

	public void setUsr_name(String usr_name) {
		this.usr_name = usr_name;
	}
}
