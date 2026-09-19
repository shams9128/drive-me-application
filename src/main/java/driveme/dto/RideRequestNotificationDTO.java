package driveme.dto;

/**
 * One incoming ride request for a ride a driver offered — used to notify the
 * driver (shown as a bell/badge in the navbar once they log in). status is
 * the driver's decision: null/empty (or "pending") until they accept or
 * reject it (see rideDaoImpl#respondToRideRequest), then "accepted" or
 * "rejected". seenByDriver is a separate flag for whether the driver has
 * opened the notification dropdown yet (see
 * rideDaoImpl#markIncomingRideRequestsSeen) — it no longer reuses status the
 * way an earlier version of this feature did.
 */
public class RideRequestNotificationDTO {

	private Long reqId;
	private String riderFirstName;
	private String riderLastName;
	private String riderContact;
	private String rideStartPoint;
	private String rideEndPoint;
	private String rideStartDate;
	private String rideStartTime;
	private String status;
	private boolean seenByDriver;

	public Long getReqId() {
		return reqId;
	}

	public void setReqId(Long reqId) {
		this.reqId = reqId;
	}

	public String getRiderFirstName() {
		return riderFirstName;
	}

	public void setRiderFirstName(String riderFirstName) {
		this.riderFirstName = riderFirstName;
	}

	public String getRiderLastName() {
		return riderLastName;
	}

	public void setRiderLastName(String riderLastName) {
		this.riderLastName = riderLastName;
	}

	public String getRiderContact() {
		return riderContact;
	}

	public void setRiderContact(String riderContact) {
		this.riderContact = riderContact;
	}

	public String getRideStartPoint() {
		return rideStartPoint;
	}

	public void setRideStartPoint(String rideStartPoint) {
		this.rideStartPoint = rideStartPoint;
	}

	public String getRideEndPoint() {
		return rideEndPoint;
	}

	public void setRideEndPoint(String rideEndPoint) {
		this.rideEndPoint = rideEndPoint;
	}

	public String getRideStartDate() {
		return rideStartDate;
	}

	public void setRideStartDate(String rideStartDate) {
		this.rideStartDate = rideStartDate;
	}

	public String getRideStartTime() {
		return rideStartTime;
	}

	public void setRideStartTime(String rideStartTime) {
		this.rideStartTime = rideStartTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public boolean isSeenByDriver() {
		return seenByDriver;
	}

	public void setSeenByDriver(boolean seenByDriver) {
		this.seenByDriver = seenByDriver;
	}
}
