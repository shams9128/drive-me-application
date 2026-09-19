package driveme.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import driveme.dto.RideRequestNotificationDTO;
import driveme.dto.RideRequestStatusDTO;
import driveme.model.OfferRide;
import driveme.model.User;
import driveme.service.rideServiceImpl;

/**
 * JSON ride-search / offer-ride / accept-ride API for the React frontend.
 *
 * Mirrors findride.java / offerride.java, which render JSP views ("findride",
 * "offerride", "ridedetails") for the legacy pages. These endpoints call the
 * same rideService methods but return JSON, and require an active login
 * session — matching the original page-level "if session User is null ->
 * login" gate that guarded /findride and /offerride.
 *
 * CORS (allowedOrigins + allowCredentials) is configured centrally in
 * CorsConfig.java, driven by app.cors.allowed-origins / CORS_ALLOWED_ORIGINS
 * — see that class for why this has no @CrossOrigin annotation of its own.
 */
@RestController
public class RideApiController {

	@Autowired
	private rideServiceImpl rideService;

	@PostMapping("/api/rides/search")
	public ResponseEntity<?> search(@RequestBody SearchRequest request, HttpSession session) {
		if (requireLogin(session) == null) {
			return unauthorized();
		}

		List<OfferRide> rides = rideService.searchRide(request.getRide_start_point(), request.getRide_end_point(),
				request.getRide_start_date());
		return ResponseEntity.ok(rides);
	}

	@PostMapping("/api/rides/offer")
	public ResponseEntity<?> offer(@RequestBody OfferRide ride, HttpSession session) {
		User user = requireLogin(session);
		if (user == null) {
			return unauthorized();
		}

		ride.setOr_user_id(user.getUserId());
		boolean saved = rideService.saveOfferRide(ride);
		if (!saved) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse("Could not save the offered ride"));
		}

		// Echo back the offerer's details, the same fields searchRide() attaches
		// for other users so the confirmation screen can render immediately.
		ride.setOfferFirstName(user.getFirstName());
		ride.setOfferLastName(user.getLastName());
		ride.setOfferContatcNumber(user.getContatcNumber());
		return ResponseEntity.ok(ride);
	}

	@PostMapping("/api/rides/{orId}/accept")
	public ResponseEntity<?> accept(@PathVariable("orId") Long orId, HttpSession session) {
		User user = requireLogin(session);
		if (user == null) {
			return unauthorized();
		}

		boolean success = rideService.saveRideRequest(orId, user.getUserId());
		if (!success) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse("Could not accept this ride"));
		}
		return ResponseEntity.ok().build();
	}

	/**
	 * Notification feed for a driver: every ride request made against a ride
	 * they offered, plus how many of those the driver hasn't seen yet. The
	 * frontend calls this right after login (and on page load if already
	 * logged in) so a driver actually finds out a customer booked their ride,
	 * instead of it silently sitting in the database with no notification
	 * anywhere — which was the original problem.
	 */
	@GetMapping("/api/rides/incoming-requests")
	public ResponseEntity<?> incomingRequests(HttpSession session) {
		User user = requireLogin(session);
		if (user == null) {
			return unauthorized();
		}

		List<RideRequestNotificationDTO> requests = rideService.getIncomingRideRequests(user.getUserId());
		long unseenCount = requests.stream()
				.filter(r -> !r.isSeenByDriver())
				.count();

		Map<String, Object> body = new HashMap<>();
		body.put("unseenCount", unseenCount);
		body.put("requests", requests);
		return ResponseEntity.ok(body);
	}

	/**
	 * Called once the driver opens the notification dropdown, so the unseen
	 * badge count clears instead of showing the same requests as "new" every
	 * time they log in.
	 */
	@PostMapping("/api/rides/incoming-requests/mark-seen")
	public ResponseEntity<?> markIncomingRequestsSeen(HttpSession session) {
		User user = requireLogin(session);
		if (user == null) {
			return unauthorized();
		}

		rideService.markIncomingRideRequestsSeen(user.getUserId());
		return ResponseEntity.ok().build();
	}

	/**
	 * The driver accepting an incoming ride request. Only succeeds if this
	 * request is against a ride this driver actually offered and hasn't
	 * already been responded to.
	 */
	@PostMapping("/api/rides/requests/{reqId}/accept")
	public ResponseEntity<?> acceptRequest(@PathVariable("reqId") Long reqId, HttpSession session) {
		User user = requireLogin(session);
		if (user == null) {
			return unauthorized();
		}

		boolean success = rideService.respondToRideRequest(reqId, user.getUserId(), "accepted");
		if (!success) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(
					"Could not accept this request — it may not belong to you, or has already been responded to."));
		}
		return ResponseEntity.ok().build();
	}

	/**
	 * The driver rejecting an incoming ride request. Restores the seat to the
	 * ride so someone else can book it.
	 */
	@PostMapping("/api/rides/requests/{reqId}/reject")
	public ResponseEntity<?> rejectRequest(@PathVariable("reqId") Long reqId, HttpSession session) {
		User user = requireLogin(session);
		if (user == null) {
			return unauthorized();
		}

		boolean success = rideService.respondToRideRequest(reqId, user.getUserId(), "rejected");
		if (!success) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(
					"Could not reject this request — it may not belong to you, or has already been responded to."));
		}
		return ResponseEntity.ok().build();
	}

	/**
	 * Notification feed for a RIDER: the current status of every ride request
	 * they've made, so they find out once the driver accepts or rejects it —
	 * the rider-facing mirror of incomingRequests() above. The frontend calls
	 * this the same way (right after login, and on page load if already
	 * logged in) so a customer actually finds out the driver responded,
	 * instead of never being told.
	 */
	@GetMapping("/api/rides/my-requests")
	public ResponseEntity<?> myRequests(HttpSession session) {
		User user = requireLogin(session);
		if (user == null) {
			return unauthorized();
		}

		List<RideRequestStatusDTO> requests = rideService.getMyRideRequests(user.getUserId());
		long unseenCount = requests.stream()
				.filter(r -> !r.isSeenByRider() && r.getStatus() != null
						&& (r.getStatus().equals("accepted") || r.getStatus().equals("rejected")))
				.count();

		Map<String, Object> body = new HashMap<>();
		body.put("unseenCount", unseenCount);
		body.put("requests", requests);
		return ResponseEntity.ok(body);
	}

	/**
	 * Called once the rider opens the notification dropdown, so the unseen
	 * badge count clears for any of their bookings the driver has already
	 * responded to.
	 */
	@PostMapping("/api/rides/my-requests/mark-seen")
	public ResponseEntity<?> markMyRequestsSeen(HttpSession session) {
		User user = requireLogin(session);
		if (user == null) {
			return unauthorized();
		}

		rideService.markMyRideRequestsSeen(user.getUserId());
		return ResponseEntity.ok().build();
	}

	private User requireLogin(HttpSession session) {
		return (User) session.getAttribute("User");
	}

	private ResponseEntity<?> unauthorized() {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Please log in to continue"));
	}

	public static class SearchRequest {
		private String ride_start_point;
		private String ride_end_point;
		private String ride_start_date;

		public String getRide_start_point() {
			return ride_start_point;
		}

		public void setRide_start_point(String ride_start_point) {
			this.ride_start_point = ride_start_point;
		}

		public String getRide_end_point() {
			return ride_end_point;
		}

		public void setRide_end_point(String ride_end_point) {
			this.ride_end_point = ride_end_point;
		}

		public String getRide_start_date() {
			return ride_start_date;
		}

		public void setRide_start_date(String ride_start_date) {
			this.ride_start_date = ride_start_date;
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
